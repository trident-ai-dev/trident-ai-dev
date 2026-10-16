#!/usr/bin/env node
'use strict';

const { parseArgs } = require('node:util');
const readline = require('node:readline/promises');
const { snapshot, validateCount, generate, commitSuggestion } = require('./core');

const HELP = `Trident Commit — staged diff to Conventional Commit suggestions
Usage: node /path/to/tools/ai-commit/cli.js [options]
  --provider <name>  ollama (default), openai or anthropic
  --model <name>     Override the provider's default model
  --count <1-5>      Number of suggestions (default: 3)
  --allow-cloud     Consent to sending your diff to OpenAI/Anthropic
  --dry-run         Print suggestions only (still calls selected provider)
  --yes             Commit the first suggestion without a prompt
  --help            Show help

Default: Ollama at 127.0.0.1:11434. Review staged content before use.
Without --yes, commits require interactive selection. Git hooks stay enabled.`;

async function main() {
  const { values } = parseArgs({ options: {
    provider: { type: 'string', default: 'ollama' }, model: { type: 'string' },
    count: { type: 'string', default: '3' }, 'allow-cloud': { type: 'boolean' },
    'dry-run': { type: 'boolean' }, yes: { type: 'boolean' }, help: { type: 'boolean' },
  }});
  if (values.help) return console.log(HELP);
  const count = validateCount(values.count);
  if (values.yes && values['dry-run']) throw new Error('--yes and --dry-run cannot be combined.');
  if (!values.yes && !values['dry-run'] && !process.stdin.isTTY) throw new Error('Non-interactive input: use --dry-run or explicitly --yes.');
  const data = snapshot();
  console.error(`Reading ${data.files.length} staged file(s). Provider: ${values.provider}.`);
  const suggestions = await generate({ provider: values.provider, model: values.model, data, count, allowCloud: values['allow-cloud'] });
  suggestions.forEach((s, i) => console.log(`\n${i + 1}. ${s.subject}${s.body ? '\n' + s.body : ''}`));
  if (values['dry-run']) return;
  let index = 0;
  if (!values.yes) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    let answer;
    try { answer = await rl.question('\nCommit suggestion number (Enter to cancel): '); }
    finally { rl.close(); }
    if (!/^[1-5]$/.test(answer) || Number(answer) > suggestions.length) return console.log('Cancelled.');
    index = Number(answer) - 1;
  }
  commitSuggestion(suggestions[index], data.tree);
  console.log('Committed. Git hooks were not bypassed.');
}
main().catch((error) => { console.error(`Error: ${error.message}`); process.exitCode = 1; });
