---
title: Eliminate Async Waterfalls
impact: CRITICAL
impactDescription: 2-10x improvement by parallelizing independent operations
tags: async, parallelization, promises, waterfalls, api-routes
---

## Eliminate Async Waterfalls

Sequential awaits on independent operations multiply latency. Use Promise.all() and start-early/await-late to maximize parallelism.

### Pattern 1: Promise.all() for independent operations

```typescript
// Bad: sequential (3 round trips)
const user = await fetchUser()
const posts = await fetchPosts()
const comments = await fetchComments()

// Good: parallel (1 round trip)
const [user, posts, comments] = await Promise.all([
  fetchUser(),
  fetchPosts(),
  fetchComments()
])
```

### Pattern 2: Start early, await late

```typescript
async function processOrder(orderId: string) {
  const order = await fetchOrder(orderId)
  if (order.status === 'cancelled') return { cancelled: true }

  // Start both in parallel since they don't depend on each other
  const [user, inventory] = await Promise.all([
    fetchUser(order.userId),
    checkInventory(order.items)
  ])
  return { order, user, inventory }
}
```

### Pattern 3: Phased parallelization (partial dependencies)

```typescript
// Phase 1: independent operations in parallel
const [user, preferences, orders] = await Promise.all([
  fetchUser(userId),
  fetchPreferences(userId),
  fetchOrders(userId)
])

// Phase 2: dependent operation
const recommendations = await getRecommendations(user, preferences)
```

### Pattern 4: API route handlers

```typescript
export async function GET(request: Request) {
  const session = await getSession()
  if (!session) return unauthorized()

  // User must be fetched first for roleId
  const user = await fetchUser(session.userId)

  // These can be parallel
  const [permissions, settings] = await Promise.all([
    fetchPermissions(user.roleId),
    fetchSettings(user.id)
  ])
  return Response.json({ user, permissions, settings })
}
```

**When NOT to use:**
- Operations have true data dependencies (each needs the previous result)
- Error from first call should prevent starting others
- Operations share mutable state
