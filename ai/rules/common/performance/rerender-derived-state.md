---
title: Derive State During Render
impact: MEDIUM
impactDescription: Eliminates extra render cycles and reduces re-renders
tags: rerender, state, derived, selectors, useEffect, anti-pattern
---

## Derive State During Render

Calculate derived values directly during render instead of syncing with useEffect (which causes extra render cycles). Subscribe to derived booleans instead of raw values to minimize re-renders.

### Derive during render, not in effects

```tsx
// Bad: two render cycles
function FilteredList({ items, filter }) {
  const [filteredItems, setFilteredItems] = useState([])
  useEffect(() => {
    setFilteredItems(items.filter(item => item.name.includes(filter)))
  }, [items, filter])
  return <List items={filteredItems} />
}

// Good: single render
function FilteredList({ items, filter }) {
  const filteredItems = useMemo(
    () => items.filter(item => item.name.includes(filter)),
    [items, filter]
  )
  return <List items={filteredItems} />
}
```

### Subscribe to derived booleans, not raw values

```tsx
// Bad: re-renders on every item change
const items = useStore(state => state.cart.items)
const hasItems = items.length > 0

// Good: re-renders only when boolean changes
const hasItems = useStore(state => state.cart.items.length > 0)
const itemCount = useStore(state => state.cart.items.length)
```

**Rule of thumb:**
- Value depends only on props/state → derive during render
- User can modify → use state
- Expensive computation → wrap in `useMemo`
