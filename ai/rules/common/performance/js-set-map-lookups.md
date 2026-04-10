---
title: Use Set/Map for O(1) Lookups
impact: LOW-MEDIUM
impactDescription: O(1) vs O(n) lookup time
tags: js, performance, set, map, lookup
---

## Use Set/Map for O(1) Lookups

Use Set for membership checks and Map for key-value lookups instead of arrays. Array.includes() is O(n), Set.has() is O(1).

**Incorrect (O(n) lookup):**

```typescript
const allowedIds = ['id1', 'id2', 'id3', /* ... hundreds more */]

function isAllowed(id: string) {
  return allowedIds.includes(id) // O(n) - scans entire array
}

// In a loop - O(n*m) complexity
items.filter(item => allowedIds.includes(item.id))
```

**Correct (O(1) lookup):**

```typescript
const allowedIds = new Set(['id1', 'id2', 'id3', /* ... hundreds more */])

function isAllowed(id: string) {
  return allowedIds.has(id) // O(1) - constant time
}

// In a loop - O(n) complexity
items.filter(item => allowedIds.has(item.id))
```

**For key-value pairs:**

```typescript
// Incorrect - O(n) find
const users = [
  { id: '1', name: 'Alice' },
  { id: '2', name: 'Bob' }
]
const user = users.find(u => u.id === targetId)

// Correct - O(1) lookup
const userMap = new Map(users.map(u => [u.id, u]))
const user = userMap.get(targetId)
```

**When to convert:**
- Lookups in loops (filter, map, some, every)
- Repeated membership checks (5+ lookups)
- Large collections (100+ items)

**When array is fine:**
- Small collections (< 10 items)
- Single lookup
- Need to preserve insertion order with duplicates
