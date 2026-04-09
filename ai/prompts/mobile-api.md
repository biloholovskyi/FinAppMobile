# Playbook: Mobile API Integration

Use when integrating a new API endpoint or adding server state management.

## Load Before Starting

1. `ai/rules/projects/fin-app-mobile/state-management.md` — Axios, React Query v5, Zustand

## Process

1. **Add API function** in `src/shared/api/<resource>.ts`:
   ```typescript
   export const fetchResource = (): Promise<Resource[]> =>
     apiClient.get('/resource').then((r) => r.data);
   ```

2. **Add query key** in `src/shared/constants/queryKeys.ts`:
   ```typescript
   resource: {
     all: ['resource'] as const,
     byId: (id: string) => ['resource', id] as const,
   }
   ```

3. **Add hook** in `src/features/<name>/use<Name>.ts`:
   ```typescript
   const { data = [], isLoading, error } = useQuery({
     queryKey: QUERY_KEYS.resource.all,
     queryFn: fetchResource,
   });
   ```

4. **Add mutation** (if write operation):
   ```typescript
   const mutation = useMutation({
     mutationFn: createResource,
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: QUERY_KEYS.resource.all });
     },
   });
   ```

5. **Post-code**: `rtk yarn lint && rtk yarn tsc --noEmit`

## Checklist

- [ ] API function in `src/shared/api/` only (never in screens/hooks directly)
- [ ] Uses `apiClient` from `src/shared/api/base.ts`
- [ ] Query key uses `QUERY_KEYS.*` constant
- [ ] Mutation calls `invalidateQueries` on success
- [ ] React Query v5 syntax (object syntax, not v4 positional args)
- [ ] Error handling: 401 → re-auth, others → toast
- [ ] No empty catch blocks

## TanStack Query v5 Syntax (CRITICAL)

```typescript
// ✅ v5 — always use this
useQuery({ queryKey: [...], queryFn: fn })
invalidateQueries({ queryKey: [...] })

// ❌ v4 — never use this
useQuery(['key'], fn, { onSuccess })
invalidateQueries(['key'])
```

## References

- `ai/rules/projects/fin-app-mobile/state-management.md`
