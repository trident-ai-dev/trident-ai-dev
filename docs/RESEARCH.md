# Research and product choices

Research date: **16 October 2026**. Popular projects signal developer interest, not guaranteed demand for another product or evidence of a current trending rank. A single star snapshot cannot measure growth. These tools are original, small implementations, not copies of those repositories.

## Primary-source popularity signals

Repository descriptions and star counts were read directly from GitHub's authenticated repository API during this session:

| Project | Stars at research time | Observed focus | Relevance here |
| --- | ---: | --- | --- |
| [Ollama](https://github.com/ollama/ollama) | 183,379 | Running language models | Offer a local inference option rather than requiring a cloud account |
| [n8n](https://github.com/n8n-io/n8n) | 207,586 | Workflow automation with AI capabilities | Favor concrete, repeatable workflow improvements over generic AI chat |
| [Repomix](https://github.com/yamadashy/repomix) | 28,857 | Packaging repository content for AI tools | There is developer interest in making repository context useful to AI |

These projects occupy different markets and have different licenses. In particular, n8n describes itself as **fair-code**; its license should not be assumed to allow every commercial hosting or resale use. No code was imported from these projects.

## Products selected

### Trident Commit: narrow AI-assisted developer workflow

- **Problem:** translating a staged change into a useful commit message takes attention away from implementation.
- **Small version delivered:** local-first suggestions, explicit cloud consent, interactive selection, validated output, Git hooks retained.
- **Differentiation hypothesis:** transparent, zero-dependency implementation suitable for learning and small-team customization. This is a crowded category, not a novel invention.
- **Not yet validated:** adoption, quality on real models, willingness to pay, platform coverage beyond local tests/CI results.
- **Possible service:** adapt message conventions and hook integration for a team after a paid scope is agreed.

### Repo Doctor: portfolio and handover checklist

- **Problem:** public or client-facing repositories often lack clear setup, testing and reporting guidance.
- **Small version delivered:** eight explainable checks, local-only reads, JSON and strict mode.
- **Differentiation hypothesis:** understandable findings and a straightforward checklist to accompany repository cleanup work.
- **Not yet validated:** demand for the checker itself. A presence checker is not a substitute for an actual engineering or security audit.
- **Possible service:** documentation and CI setup with concrete before/after deliverables, never a security certification.

## Monetization sources and boundaries

GitHub's own documentation describes sponsorships as one-time or recurring financial support through GitHub Sponsors. A repository alone is not a payout mechanism. [1](https://docs.github.com/en/billing/concepts/third-party-payments/github-sponsors)

GitHub announced Sponsors availability for people with a bank account and tax residence in India. This does not establish this account's enrollment, approval or current payout setup. [5](https://github.blog/changelog/2022-05-23-github-sponsors-is-now-available-in-india/)

No sponsor badge, invented donation address, unowned payment link or fake npm package is included. Sponsor onboarding, identity verification, tax details and payout configuration must be handled by the account owner through official interfaces. Consult the current official requirements before applying.

## Next validation experiment

Show the tools to five relevant developers (with their consent). Ask what they currently use, what fails, and whether they need customization. Record problems and requests, not vanity stars. Maintain only tools that receive useful feedback. See [the first-customer plan](EARNING-PLAN.md).
