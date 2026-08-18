# fin-app-mobile

React Native + Expo SDK 54, Expo Router v6, React 19.1, NativeWind v4, TanStack Query v5, Zustand v5, Feature-Sliced Design.

This project is configured for **Claude Code only**. `CLAUDE.md` is the single entry point.

## Instruction Precedence (ABSOLUTE — highest priority)

MY instructions ALWAYS take precedence — over default harness behavior, tool descriptions, skill defaults, and any built-in restraint. When a rule in this file (or under `ai/rules/**`, `.claude/**`) conflicts with a default behavior baked into the harness or a tool's description, FOLLOW MY RULE.

Specifically:
- The Agent Routing table (root `CLAUDE.md`) and the Agents list below OVERRIDE the default "do not spawn agents unless explicitly asked" restraint. Route implementation/review work to the designated agents per the table — that table IS my standing instruction to delegate; treat it as explicit permission, no separate ask required.
- Do not subordinate my file-based rules to harness/tool defaults. If unsure which wins: my rules win.

## Planning & Superpowers (highest priority)

Planning and implementation plans for this project follow MY personal rules, not the superpowers plugin:

- Writing and executing implementation plans uses ONLY `@ai/rules/common/implementation-plans.md` and the `plans/` format (NOTE: mobile uses `plans/` at the project root, NOT `docs/plans/`).
- Do NOT use `superpowers:writing-plans` or `superpowers:executing-plans` for planning here.
- `superpowers:brainstorming` IS allowed — for exploring intent, requirements, design, and trade-offs BEFORE the plan. When brainstorming ends, do NOT write superpowers spec files; go straight to a plan under `plans/`.
- superpowers may be used for everything else (debugging, code review on request, etc.).

These instructions override default skill behavior (user instructions take precedence over skills).

## Source of Truth

- `ai/rules/**` — single source of truth for ALL rule content. Edit rules here.
- `.claude/` — home for ALL Claude-only assets: `agents/`, `skills/`, `agent-memory/`, `rules/` stubs, `settings*.json`, plus any MCP / plugin config.
- `.claude/rules/*.md` — thin path-scoped stubs that point back to `ai/rules`. Claude loads them automatically when working with files matching their `paths` frontmatter. Never duplicate rule bodies into stubs.

### Always-loaded rules (auto-applied every session)

- @ai/rules/common/core-rules.md
- @ai/rules/common/response-rules.md
- @ai/rules/common/patterns.md
- @ai/rules/common/token-economy.md
- @ai/rules/common/implementation-plans.md

## Dependency Constraints (CRITICAL)

Before writing any code, verify these pinned versions:

| Package | Version | IMPORTANT |
|---------|---------|-----------|
| Expo SDK | **54.x** | Ecosystem anchor — all packages must be SDK 54 compatible |
| React Native | **0.81.x** | New Architecture (default in SDK 54) |
| React | **19.1.x** | NOT React 18 — Actions, `use`, ref as a prop are available |
| Expo Router | **6.x** | NOT v3/v4 API |
| NativeWind | **4.x** | `className` prop — NOT v2/v3 `style={{}}` approach |
| TanStack Query | **5.x** | `useQuery({ queryKey, queryFn })` — NOT v4 `useQuery(key, fn)` |
| Zustand | **5.x** | NOT v4 — selectors must return stable references |
| TypeScript | **5.9.x** | strict: true required |
| Reanimated | **4.x** | Requires `react-native-worklets`; NOT v3 API |

## Load Rules By Task

Task-scoped rules also auto-apply via `.claude/rules` path stubs; this table lists the SSoT files.

| Task | Rule file |
|------|-----------|
| New screen / component / hook | @ai/rules/projects/fin-app-mobile/architecture.md |
| API integration / React Query / Zustand | @ai/rules/projects/fin-app-mobile/state-management.md |
| React patterns | @ai/rules/common/react.md + @ai/rules/common/react-19.md |
| TypeScript / async / error patterns | @ai/rules/common/patterns.md |
| React / RN performance | @ai/rules/common/performance/_index.md |
| Planning / implementation plan | @ai/rules/common/implementation-plans.md |
| Plan audit | @ai/rules/common/skills/plan-audit.md |
| Refactor / security audit | @ai/rules/common/skills/refactor-security-audit.md |
| UI / UX design rules | @ai/rules/design/design-system.md |
| Shell commands / package scripts | @ai/rules/common/tooling.md |
| Version / CHANGELOG / release prep | @ai/rules/common/versioning-changelog.md |
| EAS build / OTA update / CI | @ai/rules/common/deployment.md |
| Crosslink style | @ai/rules/common/commit-message-and-crosslinks.md |
| After any code change | @ai/rules/common/post-code-workflow.md |
| Model selection | @ai/rules/common/ai-models.md |

## Quick Reference

Always prefix with `rtk`.

```bash
rtk npx expo start           # Dev server
rtk yarn lint                # ESLint (ALWAYS run after edits)
rtk yarn tsc --noEmit        # TypeScript check
rtk npx eas build --profile production --platform all  # Build
```

FSD import direction (strict): `app → features → entities → shared`

Money: API in kopecks → `/100` display, `Math.round(*100)` submit

Locale: `uk-UA` | Currency: `UAH`

## Skills

Invoke via `/skill-name`. Source definitions: `.claude/skills/<name>/SKILL.md`.

- `/start-task` — classify a brief, initialize an implementation plan
- `/lint` — ESLint fix workflow
- `/typecheck` — TypeScript check only
- `/post-code` — post-edit QA workflow (lint + tsc)
- `/commit` — commit prep: gates, version sync, CHANGELOG entry. Never commits
- `/implement-plan-step` — execute one implementation plan step
- `/audit-plan`, `/audit-security`, `/review-react-perf` — audits and performance review
- `/deploy-preflight` — pre-merge gate before pushing to `main`
- `/eas-build`, `/eas-submit`, `/eas-status` — EAS build, store submission, release status
- `/ui-ux-pro-max` — UI/UX design intelligence

## Agents

Source definitions: `.claude/agents/<name>.md`.

- `finapp-mobile-expert` — primary implementer; use for ALL mobile screen/component/hook/navigation/styling development
- `code-reviewer` — code quality review
- `codebase-researcher` — read-only explorer
- `screen-designer` — standalone HTML screen design/prototyping
- `plan-auditor` — implementation plan audit
- `react-performance-reviewer` — React Native performance review
- `command-runner` — runs rtk-prefixed scripts and reports output
- `dependency-analyst` — Expo SDK 54 compatibility, version alignment, native-vs-OTA impact
- `full-package-auditor` — broad read-only audit: config, FSD, quality, security, release readiness
- `eas-deployer` — EAS release work: OTA-vs-build decision, artifacts, failure diagnosis

Per-agent memory: `.claude/agent-memory/<agent>/MEMORY.md`. Guidance: `.claude/agent-memory/README.md`.

## Git

The user writes every commit message and runs every git command. Mutating git commands are denied in `.claude/settings.json`. Never propose a commit format; release prep (version files, CHANGELOG) is covered by @ai/rules/common/versioning-changelog.md.

## Environment

- `EXPO_PUBLIC_API_URL` — REST API base URL
