---
title: Hoist Static JSX Outside Components
impact: MEDIUM
impactDescription: Avoids recreating elements on every render
tags: rendering, jsx, static, hoist
---

## Hoist Static JSX Outside Components

Extract static JSX elements that don't depend on props or state outside the component. This prevents recreating the same elements on every render.

**Incorrect (recreates icon on every render):**

```tsx
function Button({ onClick, children }) {
  const icon = (
    <svg viewBox="0 0 24 24">
      <path d="M12 2L2 22h20L12 2z" />
    </svg>
  )

  return (
    <button onClick={onClick}>
      {icon}
      {children}
    </button>
  )
}
```

**Correct (icon created once):**

```tsx
const WarningIcon = (
  <svg viewBox="0 0 24 24">
    <path d="M12 2L2 22h20L12 2z" />
  </svg>
)

function Button({ onClick, children }) {
  return (
    <button onClick={onClick}>
      {WarningIcon}
      {children}
    </button>
  )
}
```

**For configurable static content:**

```tsx
const EMPTY_STATE = (
  <div className="empty-state">
    <EmptyIcon />
    <p>No items found</p>
  </div>
)

const LOADING_STATE = (
  <div className="loading-state">
    <Spinner />
    <p>Loading...</p>
  </div>
)

function ItemList({ items, isLoading }) {
  if (isLoading) return LOADING_STATE
  if (items.length === 0) return EMPTY_STATE

  return <List items={items} />
}
```

**When NOT to hoist:**
- Element depends on props or state
- Element needs to access component context
- Element uses hooks
