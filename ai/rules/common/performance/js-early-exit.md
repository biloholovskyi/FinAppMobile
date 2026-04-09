---
title: Return Early from Functions
impact: LOW-MEDIUM
impactDescription: Reduces nesting, improves readability
tags: js, patterns, early-return, guard-clauses
---

## Return Early from Functions

Use early returns (guard clauses) to handle edge cases first. This reduces nesting and makes the happy path clear.

**Incorrect (deeply nested):**

```typescript
function processOrder(order: Order | null) {
  if (order) {
    if (order.items.length > 0) {
      if (order.status === 'pending') {
        const total = calculateTotal(order.items)
        if (total > 0) {
          return submitOrder(order, total)
        } else {
          return { error: 'Invalid total' }
        }
      } else {
        return { error: 'Order not pending' }
      }
    } else {
      return { error: 'No items' }
    }
  } else {
    return { error: 'No order' }
  }
}
```

**Correct (early returns):**

```typescript
function processOrder(order: Order | null) {
  if (!order) {
    return { error: 'No order' }
  }

  if (order.items.length === 0) {
    return { error: 'No items' }
  }

  if (order.status !== 'pending') {
    return { error: 'Order not pending' }
  }

  const total = calculateTotal(order.items)

  if (total <= 0) {
    return { error: 'Invalid total' }
  }

  return submitOrder(order, total)
}
```

**Benefits:**
- Maximum nesting depth of 1
- Easy to see all failure cases at the top
- Happy path is clearly visible at the bottom
- Easier to add new guard clauses

**Pattern:**
1. Check for invalid inputs first
2. Return error/null/empty early
3. Main logic at the end with no nesting
