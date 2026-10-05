# Phase 02: settings and persisted preference

- Status: `todo`
- Model tier: BALANCED — route, UI, and one preference store.
- Required rules: [architecture](../../ai/rules/projects/fin-app-mobile/architecture.md), [state management](../../ai/rules/projects/fin-app-mobile/state-management.md), [React](../../ai/rules/common/react.md), [post-code](../../ai/rules/common/post-code-workflow.md).

## Goal

Let users choose a supported currency and retain the choice across restarts.

## Implementation notes

Use Zustand v5 `persist` and a native storage adapter. Persist only the currency code; validate hydration and expose a stable readiness state.

## Scope

- `src/app/(tabs)/_layout.tsx`, `src/app/(tabs)/settings.tsx`
- `src/features/settings/SettingsScreen/SettingsScreen.tsx`, `src/features/settings/SettingsScreen/useSettingsScreen.ts`
- `src/shared/stores/displayCurrencyStore.ts`, `src/shared/constants/displayCurrencies.ts`, `src/shared/constants/index.ts`

## Checklist

- [ ] Add a Settings tab and route without importing Expo Router below `src/app/`.
- [ ] Render accessible choices, selected state, and UAH default.
- [ ] Persist and validate the preference; expose hydration and storage-error states.
- [ ] Export the supported currency constants through the existing constants barrel.

## Verification commands

- `rtk yarn lint`
- `rtk yarn tsc --noEmit`

## Acceptance criteria

- Currency selection survives an app restart; invalid stored data resolves to UAH.
- Screen remains usable when storage fails, with a visible error state.

## Evidence note

Pending.

## Handoff note

Pass the store interface and hydration behavior to Phase 03.
