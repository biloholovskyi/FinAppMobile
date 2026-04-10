# Core Rules — fin-app-mobile

Load this first. Then load task-specific rule(s) from the table below.

## Task → File Routing

| Task | Load |
|------|------|
| New screen / component / hook | `ai/rules/projects/fin-app-mobile/architecture.md` |
| API integration / React Query / Zustand | `ai/rules/projects/fin-app-mobile/state-management.md` |
| Navigation / routing / deep links | `ai/rules/projects/fin-app-mobile/architecture.md` |
| Styling / NativeWind / design tokens | `ai/rules/projects/fin-app-mobile/architecture.md` |
| HTML screen design (designs/) | `.claude/rules/design-system.md` + `.claude/rules/charts.md` |
| React patterns / component rules | `ai/rules/common/react.md` |
| TypeScript / async / error patterns | `ai/rules/common/patterns.md` |
| Post-code QA | `ai/rules/common/post-code-workflow.md` |
| Implementation planning | `ai/rules/common/implementation-plans.md` |
| Plan audit | `ai/rules/common/skills/plan-audit.md` |
| React / RN performance | `ai/rules/common/performance/_index.md` + `ai/rules/common/skills/react-best-practices.md` |
| Git commit | `ai/rules/common/commit-message-and-crosslinks.md` |
| Quality gates (agent team) | `ai/rules/common/skills/agent-team-quality-gates.md` |
| Feature vs bug scope | `ai/rules/common/skills/feature-bug-phase-profiles.md` |
| Token budget | `ai/rules/common/token-economy.md` |
| Model selection | `ai/rules/common/ai-models.md` |
| Full context | `CLAUDE.md` (root) or `.claude/AGENTS.md` |

## Quick Reference

Commands:
- Dev: `rtk npx expo start`
- Lint: `rtk yarn lint`
- TypeCheck: `rtk yarn tsc --noEmit`
- EAS Build: `rtk npx eas build --profile production`

FSD layers (import direction: app → features → entities → shared):
- `src/app/` — Expo Router routes
- `src/features/` — feature slices
- `src/entities/` — business entities
- `src/shared/` — API modules, UI kit, stores, utils

Forbidden cross-layer imports:
- shared → features (NEVER)
- entities → features (NEVER)
- expo-router in shared/, entities/, features/ (NEVER)

Money: API in kopecks → /100 display, *100 Math.round submit
Locale: uk-UA | Currency: UAH
Dates: `toLocaleDateString('uk-UA')`

## Related

- Full routing and constraints: `CLAUDE.md` (project root)
- All agents and skills index: `.claude/AGENTS.md`
