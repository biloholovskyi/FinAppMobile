# Post-Code Workflow (fin-app-mobile)

Mandatory quality checks after any change.

## Required Steps (In Order)

Stop at the first error and fix it before the next step. A failed step is never reported as a passed QA.

1. Code or build config changed (`src/**`, `*.ts`, `*.tsx`, `tsconfig.json`, `eslint.config.js`, `package.json`):
   - `rtk yarn lint` — fix ALL ESLint errors
   - `rtk yarn tsc --noEmit` — always, right after lint
2. Agent configuration changed (`AGENTS.md`, `CLAUDE.md`, `ai/**`, `.claude/**`, `.codex/**`, `.agents/**`):
   - `rtk yarn agents:check --strict`
3. Both sets changed: step 1, then step 2; a failure in step 1 stops the sequence and step 2 is reported as not run

Never commit code that fails lint or the type check.

## One-Line Workflow

- Code: `rtk yarn lint && rtk yarn tsc --noEmit`
- Agent configuration: `rtk yarn agents:check --strict`

## Pre-Commit Checklist

- [ ] Lint passes (`rtk yarn lint`)
- [ ] Type check passes (`rtk yarn tsc --noEmit`)
- [ ] Agent configuration check passes when agent files changed (`rtk yarn agents:check --strict`)
- [ ] No console.log in production code
- [ ] No hardcoded hex colors — use Tailwind tokens only
- [ ] No inline style={{}} for layout (only for computed dynamic values)
- [ ] kopeck math: divide by 100 on load, multiply by 100 (Math.round) on submit
- [ ] Cache invalidation: all mutations call queryClient.invalidateQueries()
- [ ] No array index as key in FlatList items
- [ ] Platform.select not duplicated inline — extracted to shared/utils/platform.ts

## Performance

Lint: <10s | TypeCheck: <30s

## Common Lint Errors

NativeWind: use className prop, not style={{}} for layout
Import order: run `rtk yarn lint --fix` first for auto-fixable issues
Unused vars: remove or prefix with _ if intentional
Missing deps in useCallback/useEffect: add to dependency array

## Related Rules

- `ai/rules/projects/fin-app-mobile/architecture.md` — project conventions
- `ai/rules/common/agent-workflow.md` — reviewer-safe commands without `--fix`
