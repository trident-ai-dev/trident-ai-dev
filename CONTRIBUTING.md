# Contributing

Small, well-tested improvements are welcome. Open an issue to discuss larger changes before implementing them.

## Local setup

1. Install Node.js 22 or newer and Git.
2. Clone this repository. No npm dependencies or installation step is needed.
3. Run `npm run check`, `npm test`, then `npm run doctor`.

The tools use Node's built-in modules. Keep them dependency-free unless there is a demonstrated need. Tests use the built-in test runner and mock all AI network requests; no credentials or paid API access are needed.

## Pull requests

Explain the user problem, provide tests for changed behavior, and update the relevant tool README. Do not include real API keys, confidential diffs, or generated output. Keep documentation honest about what was and was not tested. Use clear commit messages; an AI provider is never required to contribute.

For security problems, follow [SECURITY.md](SECURITY.md) rather than opening a public issue.
