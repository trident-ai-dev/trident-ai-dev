<div align="center">

# Trident
### Android tooling · Developer utilities · Practical automation

Small tools. Clear documentation. Useful workflows.

[Projects](#projects) · [Run the tools](#quick-start) · [Work with me](#work-with-me)

[![Tests](https://github.com/trident-ai-dev/trident-ai-dev/actions/workflows/ci.yml/badge.svg)](https://github.com/trident-ai-dev/trident-ai-dev/actions/workflows/ci.yml)
[![Node.js 22+](https://img.shields.io/badge/Node.js-22%2B-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

</div>

---

## About

I'm Trident, a builder based in Greater Noida, India. My projects focus on Android editing workflows, practical automation and developer productivity. I'm building a portfolio of small, understandable tools rather than promising an all-in-one platform.

## Projects

| Project | What it does | Status |
| --- | --- | --- |
| **[Trident Commit](tools/ai-commit/)** | Generates Conventional Commit suggestions from staged changes; local Ollama by default, optional cloud providers | Early 0.1 CLI; provider protocols tested with mocks |
| **[Repo Doctor](tools/repo-doctor/)** | Checks eight repository presentation basics, with JSON output and a CI-friendly exit code | Working offline CLI with automated tests |
| **[Storyboard Editor](https://github.com/trident-ai-dev/StoryboardEditor)** | Android video timeline editor project using Kotlin and Jetpack Compose | Existing project; see its repository for implementation details |

The two developer tools live in this repository. They are not published npm packages and require **Node.js 22+**. No third-party npm dependencies, sign-up or subscription is required. AI generation requires a running local model or a separately billed provider account.

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

## Work with me

Have a repetitive developer workflow that could be a small CLI or script? Want help turning a repository into a clearer project with setup instructions, tests and CI?

**[Email me about a project](mailto:shivam5678tripathi@gmail.com?subject=Trident%20project%20inquiry)** with:
- The problem and who needs it solved
- An example of the desired input and output (no private data)
- Your budget, timeline and operating environment

We'll agree on scope and acceptance criteria before any paid work. The open-source tools stay MIT-licensed; custom implementation and support are separate discussions. No paid hosted product or sponsorship program is currently advertised here.

## Building in public

- [Research and product choices](docs/RESEARCH.md)
- [Roadmap](docs/ROADMAP.md)
- [A realistic first-customer plan](docs/EARNING-PLAN.md)
- [Contributing](CONTRIBUTING.md) · [Security and privacy](SECURITY.md) · [License](LICENSE)

Feedback, reproducible bug reports and thoughtful contributions are welcome.
