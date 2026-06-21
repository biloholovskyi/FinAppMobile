# fin-app-mobile

React Native + Expo SDK 52, Expo Router v3, React 18.3, NativeWind v4, TanStack Query v5, Zustand v4, Feature-Sliced Design.

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
| Expo SDK | **52.x** | Ecosystem anchor — all packages must be SDK 52 compatible |
| React Native | **0.76.x** | New Architecture enabled |
| React | **18.3.x** | NOT React 19 |
| Expo Router | **3.x** | NOT v2 API |
| NativeWind | **4.x** | `className` prop — NOT v2/v3 `style={{}}` approach |
| TanStack Query | **5.x** | `useQuery({ queryKey, queryFn })` — NOT v4 `useQuery(key, fn)` |
| Zustand | **4.x** | |
| TypeScript | **5.x** | strict: true required |

## Load Rules By Task

Task-scoped rules also auto-apply via `.claude/rules` path stubs; this table lists the SSoT files.

| Task | Rule file |
|------|-----------|
| New screen / component / hook | @ai/rules/projects/fin-app-mobile/architecture.md |
| API integration / React Query / Zustand | @ai/rules/projects/fin-app-mobile/state-management.md |
| React patterns | @ai/rules/common/react.md |
| TypeScript / async / error patterns | @ai/rules/common/patterns.md |
| React / RN performance | @ai/rules/common/performance/_index.md |
| Planning / implementation plan | @ai/rules/common/implementation-plans.md |
| Plan audit | @ai/rules/common/skills/plan-audit.md |
| UI / UX design rules | @ai/rules/design/design-system.md |
| Git / commit messages | @ai/rules/common/commit-message-and-crosslinks.md |
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

- `/post-code` — post-edit QA workflow
- `/commit` — conventional commit flow
- `/lint` — ESLint fix workflow
- `/implement-plan-step` — execute one implementation plan step
- `/audit-plan`, `/audit-security`, `/review-react-perf` — audits and performance review
- `/ui-ux-pro-max` — UI/UX design intelligence

## Agents

Source definitions: `.claude/agents/<name>.md`.

- `finapp-mobile-expert` — primary implementer; use for ALL mobile screen/component/hook/navigation/styling development
- `code-reviewer` — code quality review
- `codebase-researcher` — read-only explorer
- `screen-designer` — standalone HTML screen design/prototyping
- `plan-auditor` — implementation plan audit
- `react-performance-reviewer` — React Native performance review

Per-agent memory: `.claude/agent-memory/<agent>/MEMORY.md`.

## Environment

- `EXPO_PUBLIC_API_URL` — REST API base URL
