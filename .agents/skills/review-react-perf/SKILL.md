---
name: review-react-perf
description: Review React Native performance for fin-app-mobile — FlatList, re-renders, memo
model: sonnet
---

# Skill: Review React Performance

React Native performance review after implementing screens or hooks.

## Process

1. Load:
   - `ai/rules/common/performance/_index.md` — symptom routing
   - `ai/rules/common/skills/react-best-practices.md` — RN checklist

2. Check by priority:
   - **P1** Waterfalls: sequential API calls that could be parallel
   - **P2** FlatList: keyExtractor, getItemLayout, windowSize, renderItem memoization
   - **P3** Re-renders: unnecessary useEffect, missing useCallback/useMemo
   - **P4** Derived state: useEffect syncing state derivable in render
   - **P5** Static JSX: objects/arrays created in render on every call

3. Report findings with specific file:line references

## FlatList Quick Checklist

- `keyExtractor` — stable ID, never array index
- `getItemLayout` — for fixed-height items
- `windowSize={5}` — for lists > 50 items
- `maxToRenderPerBatch={10}`
- `removeClippedSubviews={true}` — Android
- `renderItem` wrapped in `useCallback`
- Item component wrapped in `React.memo`

## References

- `ai/rules/common/performance/_index.md`
- `ai/rules/common/skills/react-best-practices.md`
- `ai/rules/common/performance/rerender-strategy.md`
