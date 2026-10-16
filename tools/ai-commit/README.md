# Trident Commit

A dependency-free Node.js CLI that turns your **staged diff** into Conventional Commit suggestions. Local Ollama is the default. OpenAI and Anthropic are opt-in alternatives.

**Early release:** protocol behavior is covered by mocked tests, not live AI-provider verification. Model quality, model availability and provider billing are outside this tool's control. It is not published on npm; do not run `npx ai-commit` expecting this project.

## Requirements and setup

- Node.js 22+, Git and a trusted Git repository
- A running Ollama service at `127.0.0.1:11434`, or a cloud provider API key

Clone the parent repository once. No `npm install` is needed:

```bash
git clone https://github.com/trident-ai-dev/trident-ai-dev.git
```

### Local model (default)

Install Ollama separately using its official instructions. Start its service and pull a model:

```bash
ollama pull llama3.2
```

In the repository you want to commit:

```bash
cd /path/to/your/project
git add src/example.js
# Review for secrets before requesting any AI generation
git diff --cached
node /path/to/trident-ai-dev/tools/ai-commit/cli.js --dry-run
```

`--dry-run` generates and prints suggestions without committing; **it still sends the diff to the selected provider**. Without `--dry-run`, select a numbered suggestion interactively, or press Enter to cancel. There is no automatic staging, pushing, hook bypass or telemetry in this tool.

### OpenAI / Anthropic (explicit cloud consent)

Set `OPENAI_API_KEY` or `ANTHROPIC_API_KEY` securely in your local shell environment; never commit a key. The CLI deliberately does not load `.env` or credentials from repository configuration.

```bash
node /path/to/trident-ai-dev/tools/ai-commit/cli.js --provider openai --allow-cloud --dry-run
node /path/to/trident-ai-dev/tools/ai-commit/cli.js --provider anthropic --allow-cloud --dry-run
```

Cloud consent applies to each invocation. File names and the staged diff are transmitted. Provider API charges and data policies apply, even if you cancel the eventual commit.

## Options

| Option | Behavior |
| --- | --- |
| `--provider ollama\|openai\|anthropic` | Default: `ollama` |
| `--model NAME` | Override model; defaults: `llama3.2`, `gpt-4o-mini`, `claude-haiku-4-5` respectively |
| `--count 1..5` | Number of suggestions requested; default 3; model may return fewer |
| `--allow-cloud` | Required for nonlocal providers |
| `--dry-run` | Print suggestions; never commit |
| `--yes` | Explicitly commit the first suggestion, including in noninteractive environments |
| `--help` | Print help without reading Git or contacting a provider |

Exit code `0` means success or user cancellation; `1` means an error. Requests time out after 60 seconds. Provider errors are sanitized to avoid echoing response bodies or credentials.

## Safety and limitations

- Only staged changes are read. Diffs above 24 KB are refused, not silently truncated. Split larger work into separate commits.
- Common secret-like file names (`.env*`, `.key`, `.pem`, credentials and similar) are blocked, including example `.env` files. **Inline secrets in normal code are not detected.** Use a dedicated secret scanner and review staged content yourself.
- Generated JSON and Conventional Commit subject format are validated. This does not ensure messages are factually correct. There is no auto-edit or regeneration feature yet; rerun the command for another attempt.
- Git hooks remain enabled. An index fingerprint is checked before committing; avoid concurrent `git add` operations while the tool is running. This check is not an atomic lock against another Git process.
- The tool does not sandbox repository hooks. Do not use it on untrusted repositories.
- The Ollama URL is fixed to loopback; `OLLAMA_HOST` is intentionally not honored. If your local model service itself uses a remote backend, inspect that service's configuration separately.
- This is a CLI running on your machine, not a browser application. Live-provider integration testing is pending; current automated tests mock provider responses.

See [security guidance](../../SECURITY.md) and [contribution instructions](../../CONTRIBUTING.md).

## Example output (illustrative)

```text
Reading 1 staged file(s). Provider: ollama.

1. fix: handle empty input before parsing

Commit suggestion number (Enter to cancel):
```

Actual output depends on your diff and model. Free under the repository's MIT license; no Pro features or hosted service are offered.
