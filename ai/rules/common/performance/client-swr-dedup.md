---
title: Use SWR/React Query for Request Deduplication
impact: MEDIUM-HIGH
impactDescription: Eliminates duplicate network requests
tags: client, data-fetching, swr, react-query, deduplication
---

## Use SWR/React Query for Request Deduplication

Use data fetching libraries like SWR or React Query to automatically deduplicate identical requests. Multiple components requesting the same data will share a single request.

**Incorrect (duplicate requests):**

```tsx
// Component A
function UserAvatar({ userId }) {
  const [user, setUser] = useState(null)
  useEffect(() => {
    fetch(`/api/users/${userId}`).then(r => r.json()).then(setUser)
  }, [userId])
  return <Avatar src={user?.avatar} />
}

// Component B - makes the SAME request
function UserName({ userId }) {
  const [user, setUser] = useState(null)
  useEffect(() => {
    fetch(`/api/users/${userId}`).then(r => r.json()).then(setUser)
  }, [userId])
  return <span>{user?.name}</span>
}
```

**Correct (SWR):**

```tsx
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(r => r.json())

// Component A
function UserAvatar({ userId }) {
  const { data: user } = useSWR(`/api/users/${userId}`, fetcher)
  return <Avatar src={user?.avatar} />
}

// Component B - shares the same request
function UserName({ userId }) {
  const { data: user } = useSWR(`/api/users/${userId}`, fetcher)
  return <span>{user?.name}</span>
}
```

**Correct (React Query):**

```tsx
import { useQuery } from '@tanstack/react-query'

function useUser(userId: string) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetch(`/api/users/${userId}`).then(r => r.json())
  })
}

// Both components use the hook - single request
function UserAvatar({ userId }) {
  const { data: user } = useUser(userId)
  return <Avatar src={user?.avatar} />
}
```

**Additional benefits:**
- Automatic caching
- Background revalidation
- Error retry
- Optimistic updates
- Request deduplication across the app
