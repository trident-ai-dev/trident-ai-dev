# Repo Doctor

An offline, dependency-free checklist for a repository's presentation and contributor setup. Useful before sharing a portfolio project or handing a repository to a client.

It **does not** judge code quality, execute tests, verify CI success, detect vulnerabilities or validate legal terms. A full checklist is not a certification.

## Run

Requires Node.js 22+. Clone the parent repository; no package installation or API key is needed.

```bash
node tools/repo-doctor/cli.js .
node tools/repo-doctor/cli.js /path/to/another/repository
node tools/repo-doctor/cli.js . --json
node tools/repo-doctor/cli.js . --json --strict
```

To scan another project, use the absolute path to this CLI and pass that project's path as the argument. Paths containing spaces should be quoted.

## The eight checks

| Check | What is actually detected |
| --- | --- |
| README | README.md/rst/txt or README with at least 200 non-padding characters |
| License | LICENSE, LICENSE.md/txt or COPYING file exists |
| Contribution guide | CONTRIBUTING.md at root or in .github |
| Security policy | SECURITY.md at root or in .github |
| Ignore file | .gitignore exists |
| CI | A .yml or .yaml file exists under .github/workflows |
| Tests | A file exists directly in test/tests/__tests__, or package.json has a non-placeholder test script |
| Issue template | .github/ISSUE_TEMPLATE.md or a Markdown/YAML template in .github/ISSUE_TEMPLATE (not config.yml) |

Matching is case-sensitive on case-sensitive filesystems. Other CI systems, lowercase filenames, deeply nested test layouts and other ecosystems' test commands may not be recognized. Presence does not mean completeness: an empty LICENSE file or invalid workflow can still pass the corresponding existence check. README and package.json reads are limited to 1 MB each. Symlinks beneath the selected root are ignored.

## Output

```text
Trident Repo Doctor | 8/8 checks present

[PASS] README has at least 200 characters
[PASS] License file exists
...

Presence checks only; not proof of quality, security or passing CI.
```

The example is abbreviated. JSON output has `schemaVersion`, absolute `directory`, `passed`, `total`, and `checks`. Each check contains `id`, `title`, `passed` and a suggested `fix`. JSON includes the absolute local path, so sanitize it before sharing if needed.

### Exit codes

- `0`: scan completed (or help displayed). Without `--strict`, missing checks are informational.
- `1`: `--strict` was set and at least one check is missing.
- `2`: invalid arguments, inaccessible path or filesystem error.

Example CI step after checking out this repository:

```yaml
- run: node tools/repo-doctor/cli.js . --strict
```

The scanner never modifies files, runs project scripts or makes network requests. See [tests](../../test/repo-doctor.test.js) for fixtures and CLI behavior. Licensed under [MIT](../../LICENSE).
