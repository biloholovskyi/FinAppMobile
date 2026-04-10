---
paths:
  - "src/**/*.tsx"
  - "src/**/*.jsx"
---

# Screen & Component Rules

Source of truth: `ai/rules/projects/fin-app-mobile/architecture.md`

## Quick Rules

- Every screen/component in its own folder: `FooScreen/FooScreen.tsx`
- All logic in co-located hook: `FooScreen/useFooScreen.ts`
- Component: max 150 lines | Hook: max 50 lines | JSX nesting: max 4 levels
- Use NativeWind `className` — no inline `style={{}}` for layout
- No hardcoded hex colors — use Tailwind tokens
- Dark mode: `dark:` prefix — no Platform.select color hacks
- Amounts from API in kopecks: `/100` on load, `Math.round(*100)` on submit
- No array index as key in FlatList
- No useEffect to sync derived state
- `useCallback` for handlers passed as props
