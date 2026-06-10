# AGENTS.md — fin-app-mobile

Entry point for every Codex session. Load relevant rule(s) based on task type.

## Task Routing

| Task | Load |
|------|------|
| New screen / component / hook | `ai/rules/projects/fin-app-mobile/architecture.md` |
| API integration / React Query / Zustand | `ai/rules/projects/fin-app-mobile/state-management.md` |
| Navigation / routing / deep links | `ai/rules/projects/fin-app-mobile/architecture.md` |
| Styling / NativeWind / design tokens | `ai/rules/projects/fin-app-mobile/architecture.md` |
| HTML screen design (designs/) | `ai/rules/design/design-system.md` + `ai/rules/design/charts.md` |
| React patterns / component rules | `ai/rules/common/react.md` |
| TypeScript / async / error patterns | `ai/rules/common/patterns.md` |
| Post-code QA | `ai/rules/common/post-code-workflow.md` |
| Implementation planning | `ai/rules/common/implementation-plans.md` |
| Plan audit | `ai/rules/common/skills/plan-audit.md` |
| React / RN performance | `ai/rules/common/performance/_index.md` |
| Full context | `.Codex/AGENTS.md` |

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

## Quick Reference

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

`.Codex/skills/`: `/commit`, `/lint`, `/post-code`, `/implement-plan-step`, `/audit-plan`, `/audit-security`, `/review-react-perf`

## Agents

`.Codex/agents/`: `finapp-mobile-expert`, `code-reviewer`, `screen-designer`, `codebase-researcher`, `plan-auditor`, `react-performance-reviewer`

## Post-Code Reminder

After any code change: `rtk yarn lint` → fix all errors → then commit.
