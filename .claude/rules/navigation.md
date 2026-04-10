---
paths:
  - "src/app/**"
  - "src/**/*router*"
  - "src/**/*navigation*"
---

# Navigation Rules (Expo Router v3)

Source of truth: `ai/rules/projects/fin-app-mobile/architecture.md`

## Quick Rules

- Use typed routes: `router.push('/wallets')` — not raw string concat
- Use `useLocalSearchParams<{ id: string }>()` for route params
- Do NOT import from `expo-router` in `shared/`, `entities/`, or `features/`
- Stack options: `<Stack.Screen options={{ title: '...' }} />` inside screen
- Auth guard: in root `_layout.tsx` with `useSegments` + `useRouter`, never in individual screens
- Extract ALL `Platform.select` to `src/shared/lib/platform.ts`

## File Structure

```
src/app/
├── _layout.tsx          # Root layout (providers, auth guard)
├── (tabs)/
│   ├── _layout.tsx      # Tab navigator
│   ├── index.tsx        # Transactions tab
│   └── wallets.tsx      # Wallets tab
├── transaction/[id].tsx
├── wallet/[id].tsx
└── +not-found.tsx
```
