# Phase 02 — dashboard currency application

- Status: todo
- Model tier: BALANCED — conversion and UI integration across dashboard modules
- Required rules: `architecture.md`, `state-management.md`, `patterns.md`, `react.md`, `react-19.md`

## Goal

- Render dashboard aggregates in the selected currency without mixed-currency or partial totals.

## Implementation notes

- Keep rate fetching in TanStack Query and conversion in focused pure helpers.
- Reuse generated currency-rate query options; do not edit generated files or backend contracts.

## Scope

- `src/features/dashboard/DashboardScreen/useWalletsTotalBalance.ts`
- `src/features/dashboard/DashboardScreen/useWalletsCard.ts`
- `src/features/dashboard/DashboardScreen/WalletsCard.tsx`
- `src/features/dashboard/DashboardScreen/useDashboardScreen.ts`
- `src/features/dashboard/DashboardScreen/DashboardScreen.tsx`
- `src/features/dashboard/DashboardScreen/ExpenseComparisonCard.tsx`
- `src/features/dashboard/DashboardScreen/ExpenseDynamicsCard.tsx`
- `src/features/dashboard/lib/aggregateExpenses.ts`
- `src/features/dashboard/lib/convertDisplayAmount.ts` (new)
- `src/shared/utils/currencyConversion.ts` only if a shared pure converter is needed

## Checklist

- [ ] Subscribe to the stable selected-currency selector and wait for hydration.
- [ ] Query required source and target rates with generated options.
- [ ] Convert wallet and transaction amounts from their source currencies before aggregate display.
- [ ] Resolve optional transaction currency through wallet ID and mark unresolved data unavailable.
- [ ] Update amount labels and chart units; preserve native-currency wallet rows.
- [ ] Provide loading and retryable unavailable states for missing or failed rates.
- [ ] Manually check UAH, USD, EUR, mixed wallets, missing rates, and restart.

## Verification commands

- `rtk yarn lint`
- `rtk yarn tsc --noEmit`
- `rtk yarn agents:check --strict`

## Acceptance criteria

- All dashboard aggregate numbers and the chart reflect the chosen currency consistently.
- Missing rates never result in a partial aggregate presented as complete.
- Wallet rows continue to show their own wallet currency.

## Evidence note

- Fill after verification.

## Handoff note

- Record conversion rules, observed API edge cases, and manual checks for phase 03; mirror in `history.md`.
