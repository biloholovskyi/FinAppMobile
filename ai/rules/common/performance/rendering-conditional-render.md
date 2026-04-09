---
title: Use Ternary for Conditional Rendering
impact: MEDIUM
impactDescription: Prevents rendering bugs with falsy values
tags: rendering, conditional, jsx, ternary
---

## Use Ternary for Conditional Rendering

Use ternary operators instead of `&&` for conditional rendering. `&&` can render unexpected values like `0` or `NaN`.

**Incorrect (renders "0" when count is 0):**

```tsx
function ItemCount({ count }) {
  return (
    <div>
      {count && <span>{count} items</span>}
    </div>
  )
}
// When count = 0, renders: <div>0</div>
```

**Correct (explicit ternary):**

```tsx
function ItemCount({ count }) {
  return (
    <div>
      {count > 0 ? <span>{count} items</span> : null}
    </div>
  )
}
// When count = 0, renders: <div></div>
```

**Also correct (Boolean conversion):**

```tsx
function ItemCount({ count }) {
  return (
    <div>
      {!!count && <span>{count} items</span>}
    </div>
  )
}
```

**Common pitfalls:**

```tsx
// Bad - renders "0" when array is empty
{items.length && <List items={items} />}

// Good
{items.length > 0 ? <List items={items} /> : null}
{items.length > 0 && <List items={items} />}

// Bad - renders "NaN" if value is NaN
{value && <Display value={value} />}

// Good
{typeof value === 'number' && !isNaN(value) ? <Display value={value} /> : null}
```

**Rule of thumb:**
- Use `&&` only with boolean expressions
- Use ternary when the left side could be falsy (0, '', NaN)
- Prefer explicit `> 0` or `!== 0` checks for numbers
