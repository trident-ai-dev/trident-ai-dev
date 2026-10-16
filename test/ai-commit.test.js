'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const path = require('node:path');
const { validateCount, sensitiveFiles, parseSuggestions, buildPrompt, generate, snapshot, commitSuggestion } = require('../tools/ai-commit/core');

const data = { files: ['src/example.js'], diff: '+const hello = true;' };
const resultText = JSON.stringify({ suggestions: [{ subject: 'feat: add example', body: 'Explain the change.' }] });

test('count accepts only integers from 1 to 5', () => {
  assert.equal(validateCount('3'), 3);
  for (const input of ['0', '6', '3x', '1.5', 'NaN', '-1', '', 'Infinity']) assert.throws(() => validateCount(input));
});
test('blocks common sensitive file names including nested ones', () => {
  assert.deepEqual(sensitiveFiles(['.env', 'config/.env.local', 'certs/tls.key', 'id_ed25519', 'credentials.json', 'src/index.js']),
    ['.env', 'config/.env.local', 'certs/tls.key', 'id_ed25519', 'credentials.json']);
});
test('parses JSON or fenced JSON without truncating messages', () => {
  assert.equal(parseSuggestions(resultText, 3)[0].subject, 'feat: add example');
  assert.equal(parseSuggestions('```json\n' + resultText + '\n```', 1).length, 1);
  assert.equal(parseSuggestions('{"suggestions":[{"subject":"feat(api)!: change response"}]}', 1)[0].body, '');
});
test('rejects malformed or unsafe provider messages', () => {
  for (const text of ['not json', '{}', '{"suggestions":[]}', '{"suggestions":[null]}',
    '{"suggestions":[{"subject":"made something"}]}', '{"suggestions":[{"subject":"feat: x\\nfix: y"}]}',
    '{"suggestions":[{"subject":"feat: x","body":5}]}',
    JSON.stringify({ suggestions: [{ subject: 'feat: ' + 'x'.repeat(80) }] }),
    JSON.stringify({ suggestions: [{ subject: 'feat: \x1b[2J' }] })]) {
    assert.throws(() => parseSuggestions(text, 3));
  }
});
test('prompt encodes untrusted diff and file names as data', () => {
  const prompt = buildPrompt(data, 2);
  assert.ok(prompt.includes(JSON.stringify(data)));
  assert.ok(prompt.includes('untrusted DATA'));
});
test('cloud requires opt-in before network use', async () => {
  await assert.rejects(generate({ provider: 'openai', data, fetchImpl: () => assert.fail('must not fetch') }), /allow-cloud/);
});
test('unknown provider and missing API keys fail before network use', async () => {
  await assert.rejects(generate({ provider: 'other', data }), /Unknown provider/);
  for (const provider of ['openai', 'anthropic']) {
    await assert.rejects(generate({ provider, data, allowCloud: true, env: {}, fetchImpl: () => assert.fail() }), /API_KEY/);
  }
});
for (const provider of ['ollama', 'openai', 'anthropic']) {
  test(`${provider} sends expected protocol and parses response (mocked)`, async () => {
    const actual = await generate({ provider, data, allowCloud: true, env: { OPENAI_API_KEY: 'fake', ANTHROPIC_API_KEY: 'fake' },
      fetchImpl: async (url, opts) => {
        const payload = JSON.parse(opts.body);
        assert.equal(opts.method, 'POST');
        assert.equal(opts.redirect, 'error');
        assert.ok(opts.signal);
        if (provider === 'ollama') {
          assert.equal(url, 'http://127.0.0.1:11434/api/generate');
          assert.equal(payload.stream, false);
        } else if (provider === 'openai') {
          assert.equal(url, 'https://api.openai.com/v1/chat/completions');
          assert.equal(opts.headers.Authorization, 'Bearer fake');
        } else {
          assert.equal(url, 'https://api.anthropic.com/v1/messages');
          assert.equal(opts.headers['x-api-key'], 'fake');
        }
        return { ok: true, json: async () => provider === 'ollama' ? { response: resultText }
          : provider === 'openai' ? { choices: [{ message: { content: resultText } }] }
          : { content: [{ type: 'text', text: resultText }] } };
      },
    });
    assert.equal(actual[0].subject, 'feat: add example');
  });
}
test('HTTP errors never expose provider response bodies', async () => {
  await assert.rejects(generate({ provider: 'ollama', data, fetchImpl: async () => ({ ok: false, status: 500, json: () => assert.fail() }) }), /HTTP 500/);
});
test('network failures and malformed HTTP JSON have readable errors', async () => {
  await assert.rejects(generate({ provider: 'ollama', data, fetchImpl: async () => { throw new Error('secret'); } }), /request failed/);
  await assert.rejects(generate({ provider: 'ollama', data, fetchImpl: async () => ({ ok: true, json: async () => { throw new Error(); } }) }), /invalid response JSON/);
});
test('help works and invalid options fail', () => {
  const cli = path.resolve(__dirname, '../tools/ai-commit/cli.js');
  assert.equal(spawnSync(process.execPath, [cli, '--help']).status, 0);
  assert.equal(spawnSync(process.execPath, [cli, '--count', '20', '--dry-run']).status, 1);
  assert.equal(spawnSync(process.execPath, [cli, '--unknown']).status, 1);
  assert.equal(spawnSync(process.execPath, [cli, '--yes', '--dry-run']).status, 1);
});
test('non-interactive CLI refuses implicit commits before reading Git', () => {
  const cli = path.resolve(__dirname, '../tools/ai-commit/cli.js');
  const run = spawnSync(process.execPath, [cli], { encoding: 'utf8' });
  assert.equal(run.status, 1);
  assert.match(run.stderr, /Non-interactive/);
});
test('staged index mismatch prevents committing to the real repository', () => {
  assert.throws(() => commitSuggestion({ subject: 'test: never commit' }, 'not-the-current-tree'), /changed/);
});

test('snapshot returns staged names, diff and a stable fingerprint (mocked Git)', () => {
  const calls = [];
  const result = snapshot('/project', (args, cwd) => {
    calls.push(args);
    assert.equal(cwd, '/project');
    if (args[0] === 'write-tree') return 'tree-id\n';
    return args.includes('--name-only') ? 'a file.js\0nested/file.js\0' : '+new code';
  });
  assert.deepEqual(result, { files: ['a file.js', 'nested/file.js'], diff: '+new code', tree: 'tree-id' });
  assert.equal(calls.length, 4);
  assert.ok(calls[2].includes('--no-ext-diff'));
  assert.ok(calls[2].includes('--no-textconv'));
});
test('snapshot refuses empty, sensitive or oversized staged changes (mocked Git)', () => {
  for (const [names, diff, message] of [
    ['', '', /No staged/], ['.env\0', '+secret', /secret files/], ['file.js\0', 'x'.repeat(24001), /24 KB/],
  ]) {
    assert.throws(() => snapshot('/project', (args) => args[0] === 'write-tree' ? 'tree' : args.includes('--name-only') ? names : diff), message);
  }
});
test('snapshot detects a concurrent index change (mocked Git)', () => {
  let trees = 0;
  assert.throws(() => snapshot('/project', (args) => args[0] === 'write-tree' ? String(trees++)
    : args.includes('--name-only') ? 'file.js\0' : '+diff'), /changed while reading/);
});
test('commit uses argument arrays and leaves Git hooks enabled (mocked Git)', () => {
  const calls = [];
  commitSuggestion({ subject: 'fix: handle input', body: 'Explain why.' }, 'tree', '/project', (args, cwd) => {
    assert.equal(cwd, '/project');
    calls.push(args);
    return args[0] === 'write-tree' ? 'tree\n' : '';
  });
  assert.deepEqual(calls[1], ['commit', '-m', 'fix: handle input\n\nExplain why.']);
  assert.ok(!calls.flat().includes('--no-verify'));
});
test('invalid provider response objects fail closed', async () => {
  for (const body of [null, 'bad', { content: {} }]) {
    await assert.rejects(generate({ provider: 'anthropic', allowCloud: true, env: { ANTHROPIC_API_KEY: 'fake' }, data,
      fetchImpl: async () => ({ ok: true, json: async () => body }) }));
  }
});
