# Playbook: Mobile Code Review

Use when reviewing code changes in fin-app-mobile.

## Load Before Starting

1. `ai/rules/projects/fin-app-mobile/architecture.md`
2. `ai/rules/projects/fin-app-mobile/state-management.md`
3. `ai/rules/common/react.md`

## Review Checklist

### Architecture

- [ ] FSD layers respected (no forbidden cross-imports)
- [ ] No `expo-router` imports outside `src/app/`
- [ ] Screen has co-located hook (no business logic in JSX)
- [ ] Component < 150 lines, hook < 50 lines
- [ ] JSX nesting < 4 levels

### Styling

- [ ] NativeWind `className` used (no `style={{}}` for layout)
- [ ] No hardcoded hex colors
- [ ] No Platform.select color hacks (use `dark:` prefix)
- [ ] Platform.select NOT duplicated (extracted to `shared/lib/platform.ts`)

### Data

- [ ] Amounts: API kopecks → `/100` display, `Math.round(*100)` submit
- [ ] `if (!amount) return` before sign operations (prevents -0)
- [ ] Dates: `toLocaleDateString('uk-UA')`

### React Query v5

- [ ] Object syntax: `useQuery({ queryKey, queryFn })`
- [ ] No `onSuccess` in useQuery (v5 removed it)
- [ ] All mutations call `invalidateQueries`
- [ ] Query keys use `QUERY_KEYS.*` constants

### Quality

- [ ] No array index as key in FlatList
- [ ] No `useEffect` for derived state (derive in render)
- [ ] `useCallback` for handlers passed as props
- [ ] No empty catch blocks
- [ ] No `console.log` in production code
- [ ] TypeScript strict mode — no `any`

### Performance (if list/heavy screen)

- [ ] FlatList used for dynamic lists (not ScrollView + map)
- [ ] `keyExtractor` with stable ID
- [ ] `getItemLayout` for fixed-height items

## References

- `ai/rules/projects/fin-app-mobile/architecture.md`
- `ai/rules/common/performance/_index.md`
