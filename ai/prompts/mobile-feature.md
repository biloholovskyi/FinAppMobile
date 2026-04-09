# Playbook: Mobile Feature

Use when implementing a new feature (screen, component, or user flow).

## Load Before Starting

1. `ai/rules/projects/fin-app-mobile/architecture.md` — FSD structure, tech stack, constraints
2. `ai/rules/projects/fin-app-mobile/state-management.md` — API, React Query v5, Zustand

## Process

1. **Explore** — find 1-2 similar screens in codebase for pattern reference
2. **Check** — `src/shared/ui/` for reusable primitives before creating new ones
3. **Confirm FSD layer** — feature vs entity vs shared
4. **Implement**:
   - Create folder: `src/features/<name>/<Name>Screen/`
   - Screen: `<Name>Screen.tsx` — JSX only, no business logic
   - Hook: `use<Name>Screen.ts` — all logic, queries, mutations
   - API module: `src/shared/api/<name>.ts` (if new endpoint)
5. **Post-code**: `rtk yarn lint && rtk yarn tsc --noEmit`

## Checklist

- [ ] Correct FSD layer
- [ ] Co-located hook (no logic in JSX)
- [ ] NativeWind `className` — no inline `style={{}}`
- [ ] No hardcoded hex colors
- [ ] Amounts: `/100` on load, `Math.round(*100)` on submit
- [ ] Mutations invalidate relevant query keys
- [ ] No array index as key in FlatList
- [ ] `useCallback` for handlers passed as props
- [ ] Lint passes

## References

- `ai/rules/projects/fin-app-mobile/architecture.md`
- `ai/rules/common/react.md`
