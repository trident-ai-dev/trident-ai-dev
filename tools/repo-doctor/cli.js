#!/usr/bin/env node
'use strict';

const { parseArgs } = require('node:util');
const { inspectRepository } = require('./core');

try {
  const { values, positionals } = parseArgs({ allowPositionals: true, options: {
    json: { type: 'boolean' }, strict: { type: 'boolean' }, help: { type: 'boolean' },
  }});
  if (values.help) {
    console.log(`Trident Repo Doctor — offline repository presentation checklist
Usage: node tools/repo-doctor/cli.js [directory] [--json] [--strict]
  --json    Emit machine-readable results
  --strict  Exit 1 if any checklist item is missing
Exit 2 means an invalid path, option or filesystem error.
Heuristics only: this does not run code, audit security or validate licenses.`);
  } else {
    if (positionals.length > 1) throw new Error('Provide at most one directory.');
    const result = inspectRepository(positionals[0] || '.');
    if (values.json) console.log(JSON.stringify(result, null, 2));
    else {
      console.log(`\nTrident Repo Doctor | ${result.passed}/${result.total} checks present\n`);
      result.checks.forEach((c) => console.log(`${c.passed ? '[PASS]' : '[TODO]'} ${c.title}${c.passed ? '' : '\n       ' + c.fix}`));
      console.log('\nPresence checks only; not proof of quality, security or passing CI.');
    }
    if (values.strict && result.passed < result.total) process.exitCode = 1;
  }
} catch (error) {
  console.error(`Error: ${error.message}`);
  process.exitCode = 2;
}
