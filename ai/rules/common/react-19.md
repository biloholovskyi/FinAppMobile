# React 19 Addendum (AI Optimized)

Load after `ai/rules/common/react.md`. This project runs React 19.1 (bundled with Expo SDK 54).

## Constants

- REACT_VERSION = "19.1.x"
- REACT_TYPES_VERSION = "~19.1.x"

## Decision Matrix

| Need | Use | Notes |
|---|---|---|
| Non-urgent UI updates | `startTransition` / `useTransition` | Keep UI responsive during expensive updates |
| Deferred rendering | `useDeferredValue` | Prefer for search/filter UX |
| Stable IDs | `useId` | Prefer for accessibility attributes |
| External store subscription | `useSyncExternalStore` | Prefer for global store adapters |
| Ref on a custom component | Plain `ref` prop | `forwardRef` is no longer required |
| Async submit + pending state | `useActionState` | Returns `[state, action, isPending]` |
| Instant UI feedback on async work | `useOptimistic` | Reverts automatically when the action settles |
| Reading a promise/context in render | `use` | Only under a Suspense/error boundary |
| Cleanup for a ref callback | Return a cleanup function from the ref callback | New in 19 |

## Requirements

Refs:
- Accept `ref` as a normal prop; do not wrap components in `forwardRef`.
- Do not read `element.ref` — it is removed.
- A ref callback may return a cleanup function; do not return anything else (implicit returns from arrow bodies are an error).

Actions and async state:
- Use `useActionState` for submit flows that need pending/error state instead of manual `useState` bookkeeping.
- Use `useOptimistic` only where UX demands instant feedback; React Query mutations remain the default path for server state.
- `useFormStatus` is web-only — do not use it in React Native code.

`use`:
- `use(promise)` requires a Suspense boundary above it; prefer TanStack Query for data fetching in this project.
- `use(context)` may be called conditionally, unlike `useContext`.

Removed / no longer valid:
- Legacy string refs, `propTypes`, `defaultProps` on function components — removed.
- `ReactDOM.render` / `react-test-renderer` patterns — irrelevant here (React Native + Expo).

Performance:
- Use memoization only for measured bottlenecks.
- Use `memo`, `useMemo`, and `useCallback` selectively; keep dependency arrays complete.
- The React Compiler is NOT enabled in this project — do not assume automatic memoization.

## Anti-Patterns

- Wrapping components in `forwardRef` "for safety".
- Declaring `defaultProps` on a function component.
- Using `useFormStatus` or DOM form Actions in React Native screens.
- Assuming memoization is automatic (React Compiler is off).
- Calling `use()` outside a Suspense/error boundary.
