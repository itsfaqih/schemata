# Upstream

- Source: the `install-anti-slop` skill's bundled plugin (`~/.agents/skills/install-anti-slop/assets/anti-slop`), copied with its `scripts/install.mjs` on 2026-10-30. The skill directory is not under version control, so no commit identifies it.
- Snapshot digest: `69fa217ad6262822167aeaa4b4cf9d10bddbba0bd9fcb7f83e1807f3707bdca3` (sha256 over the sorted per-file sha256 list of the source tree, which matches the copy without this file, as `find . -type f | LC_ALL=C sort | xargs shasum -a 256 | shasum -a 256` prints it from the plugin root).
- Installed entry point: `tools/oxlint/anti-slop/index.ts`, registered in `.oxlintrc.json`. The Effect entry point (`effect/`) is copied but not registered, because the project does not depend on Effect.
- Deviations: none.
