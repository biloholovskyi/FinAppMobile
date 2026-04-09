# React 18 Addendum (AI Optimized)

Load after `ai/rules/common/react.md` when project uses React 18.

## Constants

- REACT_VERSION = "^18.0.0"
- REACT_DOM_VERSION = "^18.0.0"

## Decision Matrix

| Need | Use | Notes |
|---|---|---|
| Non-urgent UI updates | `startTransition` / `useTransition` | Keep UI responsive during expensive updates |
| Deferred rendering | `useDeferredValue` | Prefer for search/filter UX |
| Stable IDs | `useId` | Prefer for accessibility attributes |
| External store subscription | `useSyncExternalStore` | Prefer for global store adapters |
| Ref forwarding | `forwardRef` | Required for custom component refs |
| Form submission | Event handlers | Track pending state explicitly |

## Requirements

React 19-only APIs:
- Do not use `use()` in React 18 code.
- Do not use `useActionState`.
- Do not use `useFormStatus`.
- Do not use `useOptimistic`.
- Do not rely on document metadata hoisting via `title` / `meta` / `link`.

Forms:
- Handle submissions via `onSubmit` and event handlers.
- Track pending state explicitly (`useState` or `useTransition`).

Refs:
- Use `forwardRef` for components that accept a `ref`.

Performance:
- Use memoization only for measured bottlenecks.
- Use `memo`, `useMemo`, and `useCallback` selectively.
- Keep memoization dependency arrays complete.

Testing:
- Prefer Testing Library utilities.
- Only call `act` directly when required.

## Anti-Patterns

- Using React 19-only APIs in React 18 projects.
- Assuming Actions work via form action functions.
- Assuming `ref` can be accessed as a normal prop without `forwardRef`.

