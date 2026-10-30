# Upstream

- Source: `templates/tools/annotate.js` from the `setup-agent-ready-codebase` skill (`~/.agents/skills/setup-agent-ready-codebase`), copied on 2026-10-30. The skill directory is not under version control, so no commit identifies it.
- Snapshot digest: `168fcdd5bb052a05450090cb6116b4eb500ba33c8043bc06e90c1b7088c1bd37` (sha256 of the file).
- Why lint and format skip it: the page loads it as a plain script through the driver's evaluate call (`docs/screenshots.md`), so it stays untyped JavaScript in the upstream layout. `.oxlintrc.json` and `.oxfmtrc.json` ignore it, as they ignore the vendored anti-slop plugin.
- Deviations: none.
