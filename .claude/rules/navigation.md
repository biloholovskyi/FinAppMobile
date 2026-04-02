# Navigation Rules (Expo Router v3)

Applies to: `src/app/**`, any file importing from `expo-router`

## File Structure

```
src/app/
├── _layout.tsx          # Root layout (providers, theme, auth guard)
├── (tabs)/
│   ├── _layout.tsx      # Tab navigator (Tabs component, tabBarIcon)
│   ├── index.tsx        # Default tab — transactions list
│   └── wallets.tsx      # Wallets tab
├── transaction/
│   └── [id].tsx         # Transaction detail (dynamic route)
├── wallet/
│   └── [id].tsx         # Wallet detail (dynamic route)
└── +not-found.tsx       # 404 fallback
```

## Conventions

- Use typed routes: `router.push('/wallets')` with typed Href — not raw string concat
- Use `useLocalSearchParams<{ id: string }>()` for route params
- Use `<Link href="/wallets">` for declarative navigation in JSX
- Do NOT import from `expo-router` in `shared/`, `entities/`, or `features/` —
  only in `app/` route files and feature screens
- Stack options: use `<Stack.Screen options={{ title: '...' }} />` inside the screen
- Modal screens: `<Stack.Screen options={{ presentation: 'modal' }} />`

## Deep Links

- Configure `scheme` in `app.json`: `"scheme": "finapp"`
- Test: `npx uri-scheme open finapp://wallets --ios`

## Auth Guard

- Redirect unauthenticated users in root `_layout.tsx` using `useSegments` + `useRouter`
- Never put auth checks in individual screens

## Platform Differences

- Use `Platform.OS` only for unavoidable platform-specific behavior
- Extract ALL Platform.select blocks to `src/shared/lib/platform.ts`
- Never duplicate Platform.select inline in multiple files
