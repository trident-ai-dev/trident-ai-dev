# Security policy

## Supported version

The code on the default branch is an early 0.1 release. There is no security certification, SLA or long-term support guarantee.

## Private reporting

Do not post secrets or exploit details publicly. Email the maintainer at **shivam5678tripathi@gmail.com** with subject `Trident tools security report`. Include affected tool, a minimal sanitized reproduction, and potential impact. Please allow time for investigation before public disclosure; no response-time guarantee or bug bounty is offered.

## AI commit privacy

- The default provider uses only Ollama's loopback address. The tool itself has no telemetry.
- OpenAI/Anthropic require explicit `--allow-cloud`. The staged diff and file names are sent to that provider; its terms, retention policies and API charges apply.
- Common secret file names are blocked, but **this is not a secret scanner**. Secrets embedded in ordinary source files are not detected. Review `git diff --cached` yourself before every request. Do not use on confidential code without authorization.
- Diff text may contain prompt injection. Output validation reduces malformed messages but does not prove factual accuracy. Review suggestions rather than relying on `--yes`.
- Never share API keys in chat, commit them, or paste provider responses containing confidential information into issues. Set keys using environment variables.
- Git hooks are not bypassed. Hooks in an untrusted repository can execute code; use these tools only in repositories you trust.

Repo Doctor reads a small, fixed set of local paths. It does not execute repository scripts, contact a server or follow symlinks below the selected root. It is a presentation checklist, not a vulnerability, dependency or license audit.
