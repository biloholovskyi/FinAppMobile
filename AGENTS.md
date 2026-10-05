# fin-app-mobile

React Native + Expo mobile client of FinApp. Shared entry point for every coding agent; client-specific layers are listed under Agent Tooling.

## Read First

Read these before any task:
- `ai/rules/common/response-rules.md` — response style, the `np` shortcut
- `ai/rules/common/agent-workflow.md` — execution contract: precedence, planning, state, delegation, review artifacts
- `ai/rules/common/git-policy.md` — git reads allowed, git mutations never
- `ai/rules/common/patterns.md` — TypeScript, async, error handling, constants
- `ai/rules/common/token-economy.md` — load only the rules the task needs

When creating, executing, or resuming a plan, also read `ai/rules/common/implementation-plans.md`.

Project rules define the workflow within system limits, permissions, and available tools (`ai/rules/common/agent-workflow.md`).

## Stack

Pinned — never use APIs from other major versions (full table: `ai/rules/projects/fin-app-mobile/architecture.md`):
- Expo SDK 57 (managed), React Native 0.86 (New Architecture only), React 19.2
- Expo Router 57, NativeWind 4, TanStack Query 5, Zustand 5, Reanimated 4 + `react-native-worklets`
- TypeScript 6.0 strict — no `baseUrl`; `paths` resolve from the config directory
- Axios via `src/shared/api/base.ts`; generated Orval hooks in `src/shared/api/generated/`

## Critical Constraints

- Package manager: `yarn` only; `package-lock.json` is stale — never update it
- Shell commands use the `rtk` prefix; on Windows, when `rtk yarn …` or `rtk npx …` fails with `[rtk: program not found]`, rerun it as `rtk proxy yarn.cmd …` or `rtk proxy npx.cmd …`
- A gate sequence stops at the first step that fails or cannot run; that step is reported as failed or not run — never as passed
- No test runner — quality gates are lint, type check, and `agents:check` (`ai/rules/common/post-code-workflow.md`)
- FSD import direction: `app → features → entities → shared`
- `expo-router` only in `src/app/` — never in `shared/`, `entities/`, `features/`
- NativeWind `className` for layout — no inline `style={{}}`, no hardcoded hex colors
- TanStack Query v5 object syntax: `useQuery({ queryKey, queryFn })`; every mutation invalidates its queries
- Money: API amounts in kopecks — `/100` for display, `Math.round(*100)` on submit
- Locale `uk-UA`, currency `UAH`, dates `toLocaleDateString('uk-UA')`
- Push to `main` auto-publishes an OTA update — run the `deploy-preflight` skill before merging
- Mutating git commands are never run by agents; the user writes every commit (`ai/rules/common/git-policy.md`)
- Version and CHANGELOG are decided by the user (`ai/rules/common/versioning-changelog.md`)
- Every review ends with a saved report: `plans/<plan-folder>/review-<scope>.md`, or `plans/reviews/YYYY-MM-DD-<slug>-review.md` without a plan (`ai/rules/common/agent-workflow.md`)

## Commands

- `rtk npx expo start` — dev server (`--clear` to reset the Metro cache)
- `rtk yarn lint` — ESLint with `--fix` over `src`
- `rtk yarn tsc --noEmit` — type check
- `rtk yarn agents:check --strict` — agent configuration consistency: canon ↔ adapters, invocation policy, paths
- `rtk yarn api:generate` — Orval codegen from the backend OpenAPI contract
- `rtk npx eas build --profile production --platform all` — native build (explicit user request only)

## Task → Rule

Load only what the task needs.

| Task | Load |
|------|------|
| New screen / component / hook / navigation / styling | `ai/rules/projects/fin-app-mobile/architecture.md` |
| API integration / React Query / Zustand | `ai/rules/projects/fin-app-mobile/state-management.md` |
| React patterns | `ai/rules/common/react.md` + `ai/rules/common/react-19.md` |
| TypeScript / async / error patterns | `ai/rules/common/patterns.md` |
| React Native performance | `ai/rules/common/performance/_index.md` + `ai/rules/common/skills/react-best-practices.md` |
| HTML screen design (`designs/`) | `ai/rules/design/design-system.md` + `ai/rules/design/charts.md` |
| Planning / implementation plan | `ai/rules/common/implementation-plans.md` |
| Feature vs bug scope | `ai/rules/common/skills/feature-bug-phase-profiles.md` |
| Plan audit | `ai/rules/common/skills/plan-audit.md` |
| Refactor / security audit | `ai/rules/common/skills/refactor-security-audit.md` |
| Quality gates (agent team) | `ai/rules/common/skills/agent-team-quality-gates.md` |
| After any change | `ai/rules/common/post-code-workflow.md` |
| Shell commands / package scripts | `ai/rules/common/tooling.md` |
| Version / CHANGELOG / release prep | `ai/rules/common/versioning-changelog.md` |
| EAS build / OTA update / CI | `ai/rules/common/deployment.md` |
| Execution contract / delegation / review artifacts | `ai/rules/common/agent-workflow.md` |
| Git operations | `ai/rules/common/git-policy.md` |
| Crosslink style | `ai/rules/common/commit-message-and-crosslinks.md` |
| Model tier | `ai/rules/common/ai-models.md` |
| Full rule catalog | `ai/rules/INDEX.md` |

## Agent Tooling

- Skill procedures: `ai/skills/<name>/procedure.md` — `start-task`, `implement-plan-step`, `post-code`, `lint`, `typecheck`, `commit`, `audit-plan`, `audit-security`, `review-react-perf`, `deploy-preflight`, `eas-build`, `eas-submit`, `eas-status`, `ui-ux-pro-max`
- `eas-build` and `eas-submit` run only on an explicit request and still confirm before any external action
- Roles: `ai/agents/INDEX.md` — task → role routing, permission matrix; each role in `ai/agents/<name>.md`
- Plans: `plans/YYYY-MM-DD-<slug>/` at the project root — never `docs/plans/`
- Client layers: Claude Code — `.claude/INDEX.md`; Codex — `.codex/README.md`

## Environment

- `EXPO_PUBLIC_API_URL` — REST API base URL; bundled into the app, never a secret
