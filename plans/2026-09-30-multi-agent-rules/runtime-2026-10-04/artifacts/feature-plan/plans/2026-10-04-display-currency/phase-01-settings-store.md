# Phase 01 — settings and persisted preference

- Status: todo
- Model tier: BALANCED — bounded multi-file feature work
- Required rules: `architecture.md`, `state-management.md`, `patterns.md`, `react.md`, `react-19.md`

## Goal

- Provide an accessible settings route and a validated, hydrated, persisted display-currency preference.

## Implementation notes

- Create the first Zustand store from scratch with Zustand 5 persist middleware and AsyncStorage storage adapter.
- Confirm an Expo SDK 57 compatible AsyncStorage version before dependency work; the user handles installation in this acceptance run.

## Scope

- `src/app/(tabs)/settings.tsx`
- `src/app/(tabs)/_layout.tsx`
- `src/features/settings/SettingsScreen/SettingsScreen.tsx`
- `src/shared/stores/displayCurrencyStore.ts`
- `src/shared/constants/displayCurrencies.ts`
- `src/shared/constants/index.ts`
- `package.json` and `yarn.lock` only when dependency installation is authorized outside this run

## Checklist

- [ ] Confirm AsyncStorage is available and compatible; otherwise stop this phase as blocked.
- [ ] Add the settings route and tab with one selected option and accessible labels.
- [ ] Add an allowlisted Zustand preference with UAH default, persisted value only, hydration state, and corrupt-value fallback.
- [ ] Keep Expo Router imports in the app layer.
- [ ] Verify selection survives a relaunch and does not flash a wrong currency label.

## Verification commands

- `rtk yarn lint`
- `rtk yarn tsc --noEmit`
- `rtk yarn agents:check --strict`

## Acceptance criteria

- A user can select UAH, USD, or EUR in Settings; the choice survives relaunch and invalid stored data resolves to UAH.
- No API response data is stored in Zustand.

## Evidence note

- Fill after verification.

## Handoff note

- Record the store API and hydration behavior for phase 02; mirror in `history.md`.
