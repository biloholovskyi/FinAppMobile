# Tooling

Mission: define shell behavior and package scripts for `fin-app-mobile`, and point to the client-specific configuration layout.

## Constants

- RULES_ROOT = `ai/rules/`
- PACKAGE_MANAGER = `yarn`
- LOCKFILE = `yarn.lock`
- SHELL = `PowerShell`
- SHELL_PREFIX = `rtk`
- NODE_VERSION_CI = 22

## Package Manager

`yarn` is the only package manager for this project. `yarn.lock` is the single lockfile, and CI installs with `yarn install --frozen-lockfile`.

- `package-lock.json` is stale and must not be updated or committed — it is scheduled for removal
- Never run `npm install` / `pnpm install` here — they desync `yarn.lock`
- For Expo-ecosystem packages prefer `rtk npx expo install <pkg>` over `yarn add` — it resolves the SDK 57 compatible version

## Agent Layout

Shared (tool-neutral):
- Entry point: `AGENTS.md` — read by every client
- Rules: `ai/rules/**`, catalog `ai/rules/INDEX.md`
- Skill procedures: `ai/skills/<name>/procedure.md` (+ helper files next to the procedure)
- Roles: `ai/agents/<name>.md`, routing and permission matrix `ai/agents/INDEX.md`

Claude Code (index `.claude/INDEX.md`):
- `CLAUDE.md` — `@AGENTS.md` + always-loaded imports + Claude-only rules
- `.claude/rules/*.md` — `paths`-gated stubs pointing to `ai/rules/**`
- `.claude/skills/<name>/SKILL.md`, `.claude/agents/<name>.md` — adapters pointing to the canon
- `.claude/agent-memory/` — Claude-only memory, never a source of obligations
- `.claude/settings.json` (committed) and `.claude/settings.local.json` (local), `.mcp.json`

Codex (index `.codex/README.md`):
- `.agents/skills/<name>/SKILL.md` (+ `agents/openai.yaml` for explicit-only skills) — adapters
- `.codex/agents/<name>.toml` — role adapters
- `.codex/config.toml`, `.codex/rules/git.rules`, `.codex/hooks.json` + `.codex/hooks/*.mjs`

Adapters hold only metadata and a pointer; `rtk yarn agents:check --strict` verifies canon ↔ adapter pairs, invocation policy, and every referenced path.

Plans live in `plans/` at the project root — never `docs/plans/`.

## Requirements

- Source rules live under RULES_ROOT; client rule stubs point back to them
- After changing any agent configuration file, run `rtk yarn agents:check --strict`
- Use PACKAGE_MANAGER for project scripts
- Prefix shell commands with SHELL_PREFIX (`rtk`)
- Windows fallback: when `rtk yarn …` or `rtk npx …` fails with `[rtk: program not found]` (rtk cannot spawn the `.cmd` shims), run the same command as `rtk proxy yarn.cmd …` or `rtk proxy npx.cmd …`
- A gate that could not run is reported as not run — never as passed
- Prefer `rtk yarn <script>` for package scripts
- Prefer `rtk grep` / `rtk ls` / `rtk read` for search and targeted reads
- Use PowerShell-native commands when shell features are required on Windows
- Keep machine-specific permissions in the client's local settings; shared permissions and hooks in the client's project settings

## Command Reference

Package scripts (`package.json`):
- `rtk npx expo start` — dev server (`rtk yarn start`)
- `rtk npx expo start --clear` — dev server, cleared Metro cache
- `rtk yarn lint` — ESLint with `--fix` over `src`
- `rtk yarn format` — Prettier over `src`
- `rtk yarn api:generate` — Orval codegen from the backend OpenAPI contract
- `rtk yarn api:generate:watch` — Orval in watch mode

No `typecheck` script is defined — run `rtk yarn tsc --noEmit` directly.
No test runner is installed — there is no `test` script, and none should be added without an explicit request.

EAS:
- `rtk npx eas build --profile production --platform all` — native build
- `rtk npx eas update --branch production --environment production` — OTA update; `--environment` is required from SDK 55 onward
- `rtk npx eas build:list --limit 5` — recent builds
- `rtk npx eas submit --platform ios|android` — store submission

## Anti-Patterns

- Using `npm` or `pnpm` in this project
- Committing changes to `package-lock.json`
- Using unprefixed package-manager commands in assistant-facing docs
- Adding a `test` script or test tooling without an explicit request
- Running Unix-only shell aliases on Windows when PowerShell-native commands are needed
- Duplicating rule content into client rule stubs instead of pointing back to `ai/rules/...`

## Related Rules

- `ai/rules/common/post-code-workflow.md` — required checks after edits
- `ai/rules/common/deployment.md` — EAS build, OTA update, CI pipeline
- `AGENTS.md` — task-to-rule routing
