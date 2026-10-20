<div align="center">

# Trident
### Android tooling · Developer utilities · Practical automation

Small tools. Clear documentation. Useful workflows.

[Projects](#projects) · [Run the tools](#quick-start) · [Contact](#contact)

[![Tests](https://github.com/trident-ai-dev/trident-ai-dev/actions/workflows/ci.yml/badge.svg)](https://github.com/trident-ai-dev/trident-ai-dev/actions/workflows/ci.yml)
[![Node.js 22+](https://img.shields.io/badge/Node.js-22%2B-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

</div>

---

## About

I'm Trident, based in Greater Noida, India. I build Android tools, developer utilities and practical automation.

## Projects

| Project | What it does | Status |
| --- | --- | --- |
| **[Trident Commit](tools/ai-commit/)** | Generates Conventional Commit suggestions from staged changes; local Ollama by default, optional cloud providers | Early 0.1 CLI; provider protocols tested with mocks |
| **[Repo Doctor](tools/repo-doctor/)** | Checks eight repository presentation basics, with JSON output and a CI-friendly exit code | Working offline CLI with automated tests |
| **[Storyboard Editor](https://github.com/trident-ai-dev/StoryboardEditor)** | Android image-sequence video editor prototype using Kotlin and Jetpack Compose | Prototype; build and feature limitations are documented in its repository |

The developer tools require **Node.js 22+**. They run without third-party npm dependencies, sign-up or subscription when using the offline Repo Doctor or local Ollama provider. AI generation with OpenAI or Anthropic requires a separately billed provider account and explicit cloud consent. The npm package is prepared with two CLI entry points, but **has not been published yet**; the Git clone instructions below work today.

## Planned npm commands (after the first npm release)

```bash
npm install --global trident-dev-tools
trident-repo-doctor . --strict
trident-ai-commit --help
```

The package has not been published yet, so install from the Git repository using the current Quick Start until a release is announced.

## Quick start

```bash
git clone https://github.com/trident-ai-dev/trident-ai-dev.git
cd trident-ai-dev

# Offline repository checklist
node tools/repo-doctor/cli.js .

# Verify the tools — no API keys or npm install needed
npm run check
npm test
npm run doctor
```

To generate a commit suggestion, start Ollama, pull `llama3.2`, then run the commit CLI from a repository with staged changes. See the **[complete usage guide](tools/ai-commit/README.md)** first, including privacy and cloud consent requirements.

## Paid project inquiries

I am open to clearly scoped, paid work involving Android utility prototypes, Termux/CLI automation, repository setup, and CI/test improvements. Availability and fit are confirmed before work begins; no client history or delivery guarantee is implied.

To discuss a project, email **[shivam5678tripathi@gmail.com](mailto:shivam5678tripathi@gmail.com)** with the problem, target platform/device, expected deliverable, deadline, and budget range.

## Contact

For project inquiries, feedback or collaboration: **[shivam5678tripathi@gmail.com](mailto:shivam5678tripathi@gmail.com)**

## Project resources

[Roadmap](docs/ROADMAP.md) · [Contributing](CONTRIBUTING.md) · [Security and privacy](SECURITY.md) · [License](LICENSE)
