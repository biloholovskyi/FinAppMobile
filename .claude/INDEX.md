# Claude Code Layer Index — fin-app-mobile

Claude-only adapters and configuration. Rule bodies, procedures, and roles live in `ai/`; the shared entry point is `AGENTS.md`, imported by `CLAUDE.md`.

## Skills

Invoke as `/<name>`. Each `.claude/skills/<name>/SKILL.md` holds only metadata and a pointer to `ai/skills/<name>/procedure.md`.

| Skill | Use When |
|-------|----------|
| `/start-task` | Classifying a brief and initializing an implementation plan |
| `/implement-plan-step` | Executing one phase of an implementation plan |
| `/post-code` | QA after changes (lint, type check, agents:check) |
| `/lint` | Running ESLint and fixing errors |
| `/typecheck` | TypeScript check only (no emit) |
| `/commit` | Commit prep — gates, version sync, CHANGELOG entry (never commits) |
| `/audit-plan` | Reviewing an implementation plan for completeness |
| `/audit-security` | Security review of code changes |
| `/review-react-perf` | React Native performance review |
| `/deploy-preflight` | Pre-merge gate before pushing to `main` |
| `/eas-build` | EAS native build — user-invoked only |
| `/eas-submit` | Store submission — user-invoked only |
| `/eas-status` | Read-only snapshot of builds, channel, runtimeVersion |
| `/ui-ux-pro-max` | UI/UX design intelligence |

## Agents

Each `.claude/agents/<name>.md` holds frontmatter (`name`, `description`, `tools`, `model`, `color`, `memory`), a pointer to `ai/agents/<name>.md`, and what Claude enforces technically. Routing and the permission matrix: `ai/agents/INDEX.md`.

`finapp-mobile-expert`, `code-reviewer`, `codebase-researcher`, `plan-auditor`, `screen-designer`, `react-performance-reviewer`, `command-runner`, `dependency-analyst`, `full-package-auditor`, `eas-deployer`.

## Path-Gated Stubs

`.claude/rules/*.md` carry only `paths` frontmatter and a pointer to the owning rule; Claude loads them when matching files are touched.

| Stub | Loaded when editing | Rule |
|------|---------------------|------|
| `.claude/rules/screens.md` | `src/**/*.tsx`, `src/**/*.jsx` | `ai/rules/projects/fin-app-mobile/architecture.md` |
| `.claude/rules/navigation.md` | `src/app/**` | `ai/rules/projects/fin-app-mobile/architecture.md` |
| `.claude/rules/architecture.md` | `src/**` | `ai/rules/projects/fin-app-mobile/architecture.md` |
| `.claude/rules/api.md` | `src/shared/api/**` | `ai/rules/projects/fin-app-mobile/state-management.md` |
| `.claude/rules/react.md` | `src/**/*.tsx`, `src/**/*.jsx` | `ai/rules/common/react.md` |
| `.claude/rules/patterns.md` | `src/**/*.ts`, `src/**/*.tsx` | `ai/rules/common/patterns.md` |
| `.claude/rules/performance.md` | `src/**` | `ai/rules/common/performance/_index.md` |
| `.claude/rules/post-code.md` | `src/**/*.ts`, `src/**/*.tsx` | `ai/rules/common/post-code-workflow.md` |
| `.claude/rules/design-system.md` | `designs/**/*.html` | `ai/rules/design/design-system.md` |
| `.claude/rules/charts.md` | `designs/**/*.html` | `ai/rules/design/charts.md` |
| `.claude/rules/tooling.md` | `package.json`, `yarn.lock`, `orval.config.ts`, `eslint.config.js`, `tsconfig.json` | `ai/rules/common/tooling.md` |
| `.claude/rules/versioning-changelog.md` | `CHANGELOG.md`, `package.json`, `app.json` | `ai/rules/common/versioning-changelog.md` |
| `.claude/rules/deployment.md` | `eas.json`, `app.json`, `.github/workflows/**`, `.mcp.json` | `ai/rules/common/deployment.md` |

Always-loaded rules come from the imports in `CLAUDE.md`, not from stubs. Full rule catalog: `ai/rules/INDEX.md`.

## Agent Memory

`.claude/agent-memory/<agent>/MEMORY.md` — Claude-only optimization for the six agents with `memory: project`. Never a source of obligations: mandatory state lives in `ai/**` and `plans/**`. Guidance: `.claude/agent-memory/README.md`.

## Configuration

- `.claude/settings.json` — committed: permissions (git mutations denied per `ai/rules/common/git-policy.md`), plugins, MCP servers, reminder hooks
- `.claude/settings.local.json` — machine-specific permissions only
- `.mcp.json` — MCP servers (`context7`)
- `.claude/reviews/` — historical review reports; new reports go to `plans/**` (`ai/rules/common/agent-workflow.md`)
