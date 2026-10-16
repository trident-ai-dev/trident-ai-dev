'use strict';

const fs = require('node:fs');
const path = require('node:path');

function inspectRepository(directory) {
  const root = fs.realpathSync(directory);
  if (!fs.statSync(root).isDirectory()) throw new Error('Path must be a directory.');

  // Refuse all symlinks below the requested root; never follow links to private files.
  function safeStat(relative) {
    let current = root;
    for (const part of relative.split('/')) {
      current = path.join(current, part);
      let info;
      try { info = fs.lstatSync(current); } catch (e) {
        if (e.code === 'ENOENT' || e.code === 'ENOTDIR') return null;
        throw e;
      }
      if (info.isSymbolicLink()) return null;
    }
    return fs.lstatSync(current);
  }
  const file = (name) => safeStat(name)?.isFile() || false;
  const folder = (name) => safeStat(name)?.isDirectory() || false;
  const anyFile = (names) => names.some(file);
  function entries(name) {
    return folder(name) ? fs.readdirSync(path.join(root, name)) : [];
  }
  function meaningfulReadme() {
    const name = ['README.md', 'README.rst', 'README.txt', 'README'].find(file);
    if (!name) return false;
    const stat = safeStat(name);
    if (stat.size > 1024 * 1024) return false;
    return fs.readFileSync(path.join(root, name), 'utf8').trim().length >= 200;
  }
  let configuredTests = false;
  if (file('package.json') && safeStat('package.json').size <= 1024 * 1024) {
    try {
      const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
      const script = pkg.scripts?.test;
      configuredTests = typeof script === 'string' && !!script.trim() && !/no test specified|^echo\b/i.test(script.trim());
    } catch { /* Invalid metadata is not evidence of a configured test command. */ }
  }
  const checks = [
    { id: 'readme', title: 'README has at least 200 characters', passed: meaningfulReadme(), fix: 'Explain the problem, setup, usage and limitations in README.md.' },
    { id: 'license', title: 'License file exists', passed: anyFile(['LICENSE', 'LICENSE.md', 'LICENSE.txt', 'COPYING']), fix: 'Choose a suitable license and add its actual text.' },
    { id: 'contributing', title: 'Contribution guide exists', passed: anyFile(['CONTRIBUTING.md', '.github/CONTRIBUTING.md']), fix: 'Document local setup, tests and the pull request process.' },
    { id: 'security', title: 'Security policy exists', passed: anyFile(['SECURITY.md', '.github/SECURITY.md']), fix: 'Provide a private vulnerability reporting route in SECURITY.md.' },
    { id: 'ignore', title: 'Git ignore file exists', passed: file('.gitignore'), fix: 'Ignore local secrets, dependencies and generated artifacts.' },
    { id: 'ci', title: 'GitHub Actions workflow exists', passed: entries('.github/workflows').some((name) => /\.ya?ml$/i.test(name) && file(`.github/workflows/${name}`)), fix: 'Add a workflow under .github/workflows/ to run real checks.' },
    { id: 'tests', title: 'Test directory or test command exists', passed: configuredTests || ['test', 'tests', '__tests__'].some((name) => entries(name).some((entry) => file(`${name}/${entry}`))), fix: 'Add tests and document how to run them.' },
    { id: 'issue-template', title: 'Issue template exists', passed: file('.github/ISSUE_TEMPLATE.md') || entries('.github/ISSUE_TEMPLATE').some((name) => /\.(md|ya?ml)$/i.test(name) && !/^config\.ya?ml$/i.test(name) && file(`.github/ISSUE_TEMPLATE/${name}`)), fix: 'Add a bug report template under .github/ISSUE_TEMPLATE/.' },
  ];
  return { schemaVersion: 1, directory: root, passed: checks.filter((c) => c.passed).length, total: checks.length, checks };
}

module.exports = { inspectRepository };
