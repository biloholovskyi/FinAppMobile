# Tooling

Mission: define shell behavior, package scripts, and the Claude-native configuration layout for `fin-app-mobile`.

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

## Claude Layout

`.claude/` is canonical and hand-edited:
- Rules: `.claude/rules/*.md` — path-gated pointers to `ai/rules/...`
- Agents: `.claude/agents/*.md`
- Skills: `.claude/skills/<name>/SKILL.md`
- Agent memory: `.claude/agent-memory/<agent>/MEMORY.md`
- Settings: `.claude/settings.json` (project, committed) and `.claude/settings.local.json` (local only)
- MCP servers: `.mcp.json`
- Entry point: `CLAUDE.md` (root) → `.claude/rules/*.md` → `ai/rules/AGENTS.md`

Plans live in `plans/` at the project root — never `docs/plans/`.

## Requirements

- Source rules live under RULES_ROOT; `.claude/rules/*.md` point back to them
- Use PACKAGE_MANAGER for project scripts
- Prefix shell commands with SHELL_PREFIX (`rtk`)
- Prefer `rtk yarn <script>` for package scripts
- Prefer `rtk grep` / `rtk ls` / `rtk read` for search and targeted reads
- Use PowerShell-native commands when shell features are required on Windows
- Keep machine-specific permissions in `.claude/settings.local.json`; shared permissions and hooks in `.claude/settings.json`

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
- Duplicating rule content into `.claude/rules/*.md` instead of pointing back to `ai/rules/...`

## Related Rules

- `ai/rules/common/post-code-workflow.md` — required checks after edits
- `ai/rules/common/deployment.md` — EAS build, OTA update, CI pipeline
- `ai/rules/common/core-rules.md` — task-to-rule routing
