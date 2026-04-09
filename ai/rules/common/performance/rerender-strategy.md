---
title: Re-render Prevention Strategy
impact: MEDIUM
impactDescription: Reduces unnecessary computation and improves UI responsiveness
tags: rerender, memo, useCallback, useMemo, useState, useTransition, dependencies
---

## Re-render Prevention Strategy

Minimize unnecessary re-renders through memoization, stable callbacks, lazy initialization, primitive dependencies, and transitions.

### 1. Memoize expensive subtrees

```tsx
const MemoizedChart = memo(function ExpensiveChart({ data }) {
  return <Chart data={data} />
})

function Dashboard({ data }) {
  const [filter, setFilter] = useState('')
  return (
    <div>
      <input value={filter} onChange={e => setFilter(e.target.value)} />
      <MemoizedChart data={data} />
    </div>
  )
}
```

When NOT to use memo: component always receives new props, component is cheap to render, props are primitives that change with state.

### 2. Functional setState for stable callbacks

```tsx
// Bad: callback changes every render
const increment = useCallback(() => { setCount(count + 1) }, [count])

// Good: stable callback — never changes
const increment = useCallback(() => { setCount(prev => prev + 1) }, [])
```

### 3. Lazy state initialization

```tsx
// Bad: parseDocument runs on EVERY render
const [content, setContent] = useState(parseDocument(document))

// Good: runs once
const [content, setContent] = useState(() => parseDocument(document))
```

Also helps with SSR — avoids window/localStorage access during server render.

### 4. Primitive dependencies in effects

```tsx
// Bad: effect runs every render (user object is new each time)
useEffect(() => { trackPageView(user.id) }, [user])

// Good: effect runs only when id changes
useEffect(() => { trackPageView(user.id) }, [user.id])
```

For complex objects, use `useMemo` to stabilize or depend on specific fields.

### 5. useTransition for non-urgent updates

```tsx
function SearchableList({ items }) {
  const [query, setQuery] = useState('')
  const [filteredItems, setFilteredItems] = useState(items)
  const [isPending, startTransition] = useTransition()

  const handleChange = (e) => {
    setQuery(e.target.value) // Urgent — update input immediately
    startTransition(() => {
      // Non-urgent — can be interrupted
      setFilteredItems(items.filter(item =>
        item.name.toLowerCase().includes(e.target.value.toLowerCase())
      ))
    })
  }

  return (
    <>
      <input value={query} onChange={handleChange} />
      {isPending && <Spinner />}
      <List items={filteredItems} />
    </>
  )
}
```

Also use isPending for loading states instead of manual boolean state — shows stale content while loading, integrates with Suspense.

Good use cases: search/filter with large lists, tab switching, navigation.
Not for: form inputs, animations, direct user interactions.

**Decision matrix:**

| Problem | Solution |
|---------|----------|
| Expensive child re-renders on parent state change | `memo()` the child |
| Callback prop changes every render | Functional `setState` + `useCallback(fn, [])` |
| Expensive initial state computation | `useState(() => compute())` |
| Effect fires too often | Use primitive deps (`user.id` not `user`) |
| Heavy update blocks input | `startTransition()` |
