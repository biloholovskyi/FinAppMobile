# Playbook: Mobile Bug Fix

Use when fixing a bug in fin-app-mobile.

## Load Before Starting

1. `ai/rules/projects/fin-app-mobile/architecture.md` — constraints and conventions
2. `ai/rules/common/patterns.md` — error handling patterns

## Process

1. **Reproduce** — confirm the bug is reproducible before touching code
2. **Locate** — find the exact file and line causing the issue
3. **Root cause** — understand WHY it fails, not just where
4. **Fix** — minimal change, don't refactor surrounding code
5. **Verify** — confirm bug is gone and nothing else broke
6. **Post-code**: `rtk yarn lint && rtk yarn tsc --noEmit`

## Common Bug Categories

**Kopeck math**: amounts not divided by 100 on display, not multiplied on submit
- Check: `apiAmount / 100` on load, `Math.round(amount * 100)` on submit
- Check: `if (!amount) return` before sign operations

**React Query cache**: stale data after mutation
- Check: mutation has `onSuccess: () => queryClient.invalidateQueries(...)`
- Check: query key matches between query and invalidation

**NativeWind not working**: style not applied
- Check: `className` prop (not `style={{}}`)
- Check: `tailwind.config.js` includes the file pattern

**FlatList key warning**: array index used as key
- Check: `keyExtractor={(item) => item.id}` (stable unique ID)

**Navigation crash**: expo-router used outside `src/app/`
- Check: `expo-router` imports only in `src/app/` files

## References

- `ai/rules/projects/fin-app-mobile/architecture.md`
- `ai/rules/projects/fin-app-mobile/state-management.md`
