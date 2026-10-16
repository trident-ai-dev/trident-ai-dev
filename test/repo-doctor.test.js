'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { inspectRepository } = require('../tools/repo-doctor/core');

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'trident-doctor-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  return root;
}
function put(root, name, value = '') {
  fs.mkdirSync(path.dirname(path.join(root, name)), { recursive: true });
  fs.writeFileSync(path.join(root, name), value);
}
const cli = path.resolve(__dirname, '../tools/repo-doctor/cli.js');

test('empty repository produces eight actionable missing checks', (t) => {
  const result = inspectRepository(fixture(t));
  assert.equal(result.schemaVersion, 1);
  assert.equal(result.passed, 0);
  assert.equal(result.total, 8);
  assert.ok(result.checks.every((c) => c.fix && !c.passed));
});
test('complete fixture passes; scanning does not execute scripts', (t) => {
  const root = fixture(t);
  put(root, 'README.md', 'Project documentation. '.repeat(20));
  for (const file of ['LICENSE', 'CONTRIBUTING.md', 'SECURITY.md', '.gitignore', '.github/workflows/test.yml', '.github/ISSUE_TEMPLATE/bug.md']) put(root, file, 'fixture');
  put(root, 'package.json', JSON.stringify({ scripts: { test: 'node --test' } }));
  const result = inspectRepository(root);
  assert.equal(result.passed, 8);
  assert.equal(spawnSync(process.execPath, [cli, root, '--strict']).status, 0);
});
test('short README, malformed package and placeholder test command do not pass', (t) => {
  const root = fixture(t);
  put(root, 'README.md', '# Hello');
  put(root, 'package.json', '{bad');
  assert.equal(inspectRepository(root).passed, 0);
  put(root, 'package.json', JSON.stringify({ scripts: { test: 'echo "Error: no test specified" && exit 1' } }));
  assert.equal(inspectRepository(root).passed, 0);
});
test('recognizes a test file without package.json', (t) => {
  const root = fixture(t);
  put(root, 'tests/test_demo.py', 'def test_demo(): pass');
  assert.ok(inspectRepository(root).checks.find((c) => c.id === 'tests').passed);
});
test('does not follow symlinks for files or nested directories', (t) => {
  const root = fixture(t), outside = fixture(t);
  put(outside, 'LICENSE', 'Private data');
  put(outside, 'workflows/leak.yml', 'Private workflow');
  try {
    fs.symlinkSync(path.join(outside, 'LICENSE'), path.join(root, 'LICENSE'));
    fs.symlinkSync(outside, path.join(root, '.github'), 'dir');
  } catch (error) {
    if (error.code === 'EPERM') return t.skip('Symlink privileges are unavailable on this runner.');
    throw error;
  }
  const result = inspectRepository(root);
  assert.equal(result.passed, 0);
});
test('oversize README is not read', (t) => {
  const root = fixture(t);
  put(root, 'README.md', 'x'.repeat(1024 * 1024 + 1));
  assert.equal(inspectRepository(root).passed, 0);
});
test('directories with file names do not count as files', (t) => {
  const root = fixture(t);
  fs.mkdirSync(path.join(root, 'LICENSE'));
  fs.mkdirSync(path.join(root, '.github/workflows/empty.yml'), { recursive: true });
  assert.equal(inspectRepository(root).passed, 0);
});
test('JSON output, strict exit 1, invalid path exit 2 and help exit 0', (t) => {
  const root = fixture(t);
  const run = spawnSync(process.execPath, [cli, root, '--json', '--strict'], { encoding: 'utf8' });
  assert.equal(run.status, 1);
  assert.equal(JSON.parse(run.stdout).total, 8);
  assert.equal(spawnSync(process.execPath, [cli, path.join(root, 'missing')]).status, 2);
  assert.equal(spawnSync(process.execPath, [cli, root, 'extra']).status, 2);
  assert.equal(spawnSync(process.execPath, [cli, '--typo']).status, 2);
  assert.equal(spawnSync(process.execPath, [cli, '--help']).status, 0);
});
