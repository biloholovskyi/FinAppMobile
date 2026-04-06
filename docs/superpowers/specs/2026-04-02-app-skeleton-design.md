# Design: App Skeleton

**Date:** 2026-04-02  
**Status:** Approved

## Context

The fin-app-mobile project currently has only Claude Code configuration — no Expo project, no source code. This spec defines the skeleton: initialize Expo, configure all tooling, set up FSD architecture, add two stub screens (Transactions, Wallets), and configure EAS Update so the app can be published and opened in Expo Go from the user's account without a local dev server.

## Approach

`create-expo-app --template blank-typescript` + manual dependency and tooling setup. Chosen over the `tabs` template to avoid deleting template cruft and to own every file from the start.

## Directory Structure

```
fin-app-mobile/
├── src/
│   ├── app/                          # Expo Router — routes only
│   │   ├── _layout.tsx               # Root layout: QueryClientProvider + SafeAreaProvider
│   │   ├── (tabs)/
│   │   │   ├── _layout.tsx           # Tab navigator: Transactions + Wallets tabs
│   │   │   ├── index.tsx             # Transactions tab → renders TransactionsScreen
│   │   │   └── wallets.tsx           # Wallets tab → renders WalletsScreen
│   │   └── +not-found.tsx            # 404 fallback
│   ├── features/
│   │   ├── transactions/
│   │   │   └── TransactionsScreen/
│   │   │       ├── TransactionsScreen.tsx    # Stub: <View><Text>Transactions</Text></View>
│   │   │       └── useTransactionsScreen.ts  # Stub hook
│   │   └── wallets/
│   │       └── WalletsScreen/
│   │           ├── WalletsScreen.tsx          # Stub: <View><Text>Wallets</Text></View>
│   │           └── useWalletsScreen.ts        # Stub hook
│   ├── entities/                     # Empty, ready for future entities
│   └── shared/
│       ├── api/
│       │   └── base.ts               # axios instance stub (baseURL from EXPO_PUBLIC_API_URL)
│       ├── lib/
│       │   └── queryClient.ts        # React Query QueryClient instance
│       └── ui/                       # Empty, ready for shared components
├── .env                              # EXPO_PUBLIC_API_URL=
├── app.json                          # name: FinApp, scheme: finapp, owner, projectId, expo-router + expo-updates plugins
├── eas.json                          # production channel for EAS Update
├── babel.config.js                   # babel-preset-expo + nativewind/babel
├── tailwind.config.js                # content: src/**/*.{ts,tsx}
└── tsconfig.json                     # strict: true, path alias @/* → src/*
```

## Dependencies

- `expo-router` — file-based navigation
- `react-native-safe-area-context` + `react-native-screens` — expo-router requirements
- `nativewind` + `tailwindcss` — Tailwind CSS for React Native
- `@tanstack/react-query` — server state
- `zustand` — UI state
- `axios` — HTTP client
- `expo-updates` — OTA update support for EAS Update

## Configuration

- **app.json:** `name: FinApp`, `slug: fin-app-mobile`, `scheme: finapp`, `expo-router` + `expo-updates` in plugins, `owner` (Expo account username), `projectId` (from EAS dashboard after `eas init`)
- **babel.config.js:** `babel-preset-expo` preset + `nativewind/babel` plugin
- **tailwind.config.js:** content paths `./src/**/*.{js,jsx,ts,tsx}`
- **tsconfig.json:** strict mode, `@/*` alias resolving to `src/*`
- **.env:** `EXPO_PUBLIC_API_URL=` (empty placeholder, filled per environment)
- **eas.json:** `production` channel with `update` profile

## EAS Update Flow

Publish: `eas update --channel production --message "description"`  
Open in Expo Go: Profile tab → project appears under the linked account → no local server needed.

## Screens

Both screens are stubs — no real data, no API calls. Each follows the screens.md rule: component in its own folder, logic in co-located hook.

- Tab labels: **Transactions** and **Wallets** (English)
- No icons on tabs at this stage

## Navigation

Root layout wraps everything in `QueryClientProvider` + `SafeAreaProvider`. Tab navigator is a standard Expo Router `<Tabs>` with two tabs. Auth guard deferred — no auth at skeleton stage.

## Verification

1. `rtk npx expo start` — dev server starts without errors
2. Scan QR code in Expo Go — app loads
3. Both tabs visible and tappable
4. Transactions tab shows "Transactions" text
5. Wallets tab shows "Wallets" text
6. `rtk yarn tsc --noEmit` — no TypeScript errors
7. `rtk yarn lint` — no ESLint errors
8. `eas update --channel production` — publishes successfully
9. Expo Go → Profile → project visible and openable without local server
