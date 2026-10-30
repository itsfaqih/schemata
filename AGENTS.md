# Agent instructions

Every check here is a command with a deterministic verdict. A check done by hand (a browser walk, a curl, reading output) becomes a test, script, or lint rule before the work is called done.

## Read a doc when

- **Stack**: you pick or swap a tool, or start or restructure a backend, frontend, or infrastructure → `docs/stack.md`
- **Worktrees**: you add a port, path, compose service, migration, or env var → `docs/worktrees.md`
- **Lint**: you add a file type or hit a lint finding → `docs/lint.md`
- **Boundaries**: you handle input from outside the program (HTTP, database, env, JSON) or branch on a union → `docs/boundaries.md`
- **Testing**: you write or change a unit or integration test, or look for missing tests → `docs/testing.md`
- **Dependencies in tests**: a test needs a database, queue, cloud service, or third-party API → `docs/hermetic-dependencies.md`
- **Falsifiable tests**: you write or review any test, or fix a bug → `docs/falsifiable-tests.md`
- **E2E**: you add or change a user flow or screen → `docs/e2e.md`
- **Browser**: you interact with the running web app directly → `docs/browser.md`
- **Screenshots**: you capture an image for a PR or report → `docs/screenshots.md`
- **Pull request**: you open or update a PR → `docs/pull-requests.md`
- **Lessons**: you make the same mistake twice (the user corrects it twice, or a fix undoes earlier work) → `docs/lessons.md`

## Project facts

- Dev URLs: `https://schemata.localhost` on the main checkout, `https://<branch>.schemata.localhost` in a worktree
- Tool guides: Playwright traces → `.agents/skills/playwright-trace/SKILL.md`; agent-browser → `agent-browser skills get core`
