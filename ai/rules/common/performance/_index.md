# Performance Rules — Decision Tree (React Native)

Use this to find the right rule for your problem. Load only the relevant file(s).

| Symptom | Load |
|---------|------|
| API response is slow / sequential awaits | `async-waterfalls.md` |
| Screen loads slowly / large bundle | `bundle-strategy.md` |
| React Native component loads blank then fills in | `async-suspense-boundaries.md` |
| Same data fetched by multiple components | `client-swr-dedup.md` |
| UI janky during filtering/search | `rerender-strategy.md` (useTransition section) |
| Component re-renders too often | `rerender-strategy.md` (memo/deps sections) |
| Derived state synced via useEffect | `rerender-derived-state.md` |
| Falsy value (0, NaN) rendered in JSX | `rendering-conditional-render.md` |
| FlatList scrolling is janky / slow | `rerender-strategy.md` + `rendering-hoist-jsx.md` |
| FlatList re-renders all items on data change | `rerender-derived-state.md` |
| Long list / many off-screen items | `rendering-content-visibility.md` (NOTE: web-specific `content-visibility` CSS not applicable in RN — use FlatList virtualization instead) |
| Flash of wrong theme on app load | `rendering-hydration-no-flicker.md` (NOTE: hydration concept is web-specific — in RN, use NativeWind `dark:` prefix and avoid Platform.select color hacks) |
| Static JSX recreated every render | `rendering-hoist-jsx.md` |
| Array.includes in loop / hot path | `js-set-map-lookups.md` |
| Deeply nested if/else | `js-early-exit.md` |

## React Native Specific

FlatList performance checklist:
- Set `keyExtractor` with stable unique IDs (never array index)
- Use `getItemLayout` for fixed-height items
- Set `windowSize={5}` for large lists
- Set `maxToRenderPerBatch={10}`
- Use `removeClippedSubviews={true}` on Android
- Memoize `renderItem` with useCallback
- Keep item components pure (React.memo)

Metro bundler (Expo):
- Use dynamic imports for heavy screens (lazy loading)
- Avoid importing heavy libraries at top-level if used conditionally

For full catalog with impact levels, see `_sections.md`.
