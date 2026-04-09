# Skill: React Native Best Practices (Performance + Component Guidance)

React Native and Expo performance optimization and component structure guide.

## Triggers

- Writing new React Native components or screens
- Reviewing code for performance issues
- Refactoring existing React Native code
- "check performance", "optimize React", "component structure", "FlatList jank"

## Component Guidance

- Follow `ai/rules/common/react.md` and `ai/rules/common/react-18.md`
- Prefer small, focused components and explicit props
- Every screen in its own folder with co-located hook (`FooScreen/useFooScreen.ts`)
- For variant-driven components, model props as discriminated unions keyed by required `variant`/`kind`
- Keep state management minimal and colocated
- Align file naming and folder structure with FSD conventions

## Performance Rules by Priority

| Priority | Category | Impact | Rule File |
|----------|----------|--------|-----------|
| 1 | Eliminating Waterfalls | CRITICAL | `async-waterfalls.md`, `async-suspense-boundaries.md` |
| 2 | FlatList Optimization | CRITICAL | `rerender-strategy.md` + `rendering-hoist-jsx.md` |
| 3 | Client-Side Data | MEDIUM-HIGH | `client-swr-dedup.md` |
| 4 | Re-render Prevention | MEDIUM | `rerender-strategy.md`, `rerender-derived-state.md` |
| 5 | Rendering | MEDIUM | `rendering-*.md` (4 files) |
| 6 | JavaScript | LOW-MEDIUM | `js-*.md` (2 files) |

## FlatList Optimization Checklist

- `keyExtractor` with stable unique ID (never array index)
- `getItemLayout` for fixed-height items (skips measurement)
- `windowSize={5}` — render 5 screen-heights worth of items
- `maxToRenderPerBatch={10}` — batch size for initial render
- `removeClippedSubviews={true}` — unmount off-screen on Android
- `renderItem` wrapped in `useCallback`
- Item component wrapped in `React.memo`

## Process

1. Identify performance issue category (see `ai/rules/common/performance/_index.md` for symptom-based routing)
2. Load relevant rule file(s) from `ai/rules/common/performance/`
3. Check code against rules in priority order
4. Apply fixes following correct patterns
5. Run post-code workflow: `rtk yarn lint && rtk yarn tsc --noEmit`

## Output

- Issues found with rule file reference
- Code changes following correct patterns
- Verification that changes don't break functionality

## References

- Decision tree: `ai/rules/common/performance/_index.md`
- Section catalog: `ai/rules/common/performance/_sections.md`
- Individual rules: `ai/rules/common/performance/*.md`
- React Native rules: `ai/rules/common/react.md`
