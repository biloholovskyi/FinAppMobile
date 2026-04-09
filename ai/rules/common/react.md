# React Native (AI Optimized)

Shared React/React Native rules for fin-app-mobile (React 18 + Expo SDK 52).

Load order:
- Always: `ai/rules/common/react.md`
- Then: `ai/rules/common/react-18.md`
- For mobile architecture: `ai/rules/projects/fin-app-mobile/architecture.md`

## Constants

- COMPONENT_MAX_LINES = 150
- HOOK_MAX_LINES = 50
- JSX_MAX_DEPTH = 4
- PROPS_MAX_COUNT = 7

## Requirements

### Naming
- Components: PascalCase
- Hooks: `use` + camelCase
- Functions and variables: camelCase
- Types and interfaces: PascalCase
- Files: kebab-case (except screen/component folders — PascalCase)
- JSX props: camelCase (`onPress`, `className`, `testID`)

### Components
- One component per file
- Every screen/component in its own folder: `FooScreen/FooScreen.tsx`
- All business logic in co-located hook: `FooScreen/useFooScreen.ts`
- Use named exports for reusable components and hooks
- Screen files may use default exports (required by Expo Router)
- Keep components at or under COMPONENT_MAX_LINES
- Keep JSX nesting at or under JSX_MAX_DEPTH
- Keep props at or under PROPS_MAX_COUNT
- For variant-based APIs, use discriminated union props with required `variant` key
- Prefer composition over prop drilling

### Hooks
- Keep hooks at or under HOOK_MAX_LINES
- Keep hooks single-purpose
- Extract sub-hooks when hook grows beyond limit

### Styling (NativeWind v4)
- Use NativeWind `className` prop for all layout and design — NOT `style={{}}`
- `style={{}}` only for dynamic computed values (e.g., animated transforms)
- No hardcoded hex colors — use Tailwind tokens or theme variables
- Dark mode: use NativeWind `dark:` prefix, not Platform.select color hacks
- No CSS Modules, no StyleSheet.create for layout (only if required by third-party)

### State
- Keep state local and colocated
- Lift state only when ownership is shared
- Prefer derived values over duplicated state
- Server state: React Query (TanStack Query v5)
- UI/local state: Zustand or useState
- No useEffect to sync derived state

### Lists
- Always use FlatList for long lists (never ScrollView + map for dynamic data)
- Never use array index as key in FlatList/map
- Use `keyExtractor` with stable unique IDs
- Use `getItemLayout` for fixed-height lists (performance)
- Use `windowSize`, `maxToRenderPerBatch` for optimization

### Navigation (Expo Router v3)
- Never import from `expo-router` in shared/, entities/, features/
- Only `src/app/` route files use expo-router
- Use typed routes: `router.push('/path')` with typed Href

### Platform Differences
- Use `Platform.OS` only for unavoidable platform-specific behavior
- Extract ALL Platform.select blocks to `src/shared/lib/platform.ts`
- Never duplicate Platform.select inline in multiple files

### Performance
- Measure before optimizing
- FlatList virtualization for lists > 20 items
- useCallback for handlers passed as props (prevents re-renders)
- useMemo for expensive computations only
- Avoid premature memoization

## Anti-Patterns

- Default exports for shared components and hooks (screen files excepted)
- Wildcard exports (`export *`) in app code
- Deep component trees for simple UI (>JSX_MAX_DEPTH)
- Array index as key in FlatList/ScrollView
- Deriving state with useEffect when derivable in render
- Business logic directly in component JSX (use co-located hook)
- Importing expo-router in shared/, entities/, features/
- `style={{}}` for layout (use NativeWind className)
- Hardcoded hex colors
- Platform.select duplicated inline (extract to platform.ts)
- ScrollView + map for dynamic lists (use FlatList)
