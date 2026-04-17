---
description: React Native performance review — FlatList, re-renders, memo
---

# /review-react-perf

Mirror of @.claude/skills/review-react-perf/SKILL.md

## Process

1. Load:
   - @ai/rules/common/performance/_index.md — symptom routing
   - @ai/rules/common/skills/react-best-practices.md — RN checklist

2. Check by priority:
   - **P1** Waterfalls: sequential API calls that could be parallel
   - **P2** FlatList: `keyExtractor`, `getItemLayout`, `windowSize`, `renderItem` memoization
   - **P3** Re-renders: unnecessary `useEffect`, missing `useCallback`/`useMemo`
   - **P4** Derived state: `useEffect` syncing state derivable in render
   - **P5** Static JSX: objects/arrays created in render on every call

3. Report findings with specific file:line references

## FlatList Checklist

- `keyExtractor` — stable ID, never array index
- `getItemLayout` — for fixed-height items
- `windowSize={5}` — for lists > 50 items
- `maxToRenderPerBatch={10}`
- `removeClippedSubviews={true}` — Android
- `renderItem` wrapped in `useCallback`
- Item component wrapped in `React.memo`
