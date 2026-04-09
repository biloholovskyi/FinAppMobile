# Post-Code Workflow (fin-app-mobile)

Mandatory quality checks after any code change.

## Required Steps (In Order)

- Lint: `rtk yarn lint` — fix ALL ESLint errors before proceeding
- Type Check: `rtk yarn tsc --noEmit` — run only if TypeScript errors suspected

Stop at first error. Fix before moving to next step.
Never commit code that fails lint.

## One-Line Workflow

`rtk yarn lint && rtk yarn tsc --noEmit`

## Pre-Commit Checklist

- [ ] Lint passes (rtk yarn lint)
- [ ] No TypeScript errors (if tsc was run)
- [ ] No console.log in production code
- [ ] No hardcoded hex colors — use Tailwind tokens only
- [ ] No inline style={{}} for layout (only for computed dynamic values)
- [ ] kopeck math: divide by 100 on load, multiply by 100 (Math.round) on submit
- [ ] Cache invalidation: all mutations call queryClient.invalidateQueries()
- [ ] No array index as key in FlatList items
- [ ] Platform.select not duplicated inline — extracted to shared/lib/platform.ts

## Performance

Lint: <10s | TypeCheck: <30s

## Common Lint Errors

NativeWind: use className prop, not style={{}} for layout
Import order: run `rtk yarn lint --fix` first for auto-fixable issues
Unused vars: remove or prefix with _ if intentional
Missing deps in useCallback/useEffect: add to dependency array

## Related Rules

- `ai/rules/projects/fin-app-mobile/architecture.md` — project conventions
- `ai/rules/common/git-conventions.md` — commit format after QA passes
