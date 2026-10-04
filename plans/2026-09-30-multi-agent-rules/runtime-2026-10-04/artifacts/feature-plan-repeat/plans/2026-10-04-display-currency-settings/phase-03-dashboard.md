# Phase 03: dashboard display currency

- Status: `todo`
- Model tier: BALANCED — multi-source currency derivation and UI updates.
- Required rules: [architecture](../../ai/rules/projects/fin-app-mobile/architecture.md), [state management](../../ai/rules/projects/fin-app-mobile/state-management.md), [performance](../../ai/rules/common/performance/_index.md), [post-code](../../ai/rules/common/post-code-workflow.md).

## Goal

Show dashboard summaries and charts in the selected display currency.

## Implementation notes

Keep rate data in TanStack Query. Convert integer minor units to major units once with `KOPECK_DIVISOR`; convert from source currency to UAH and then to selected currency without per-row rounding. Require finite, positive rates, use UAH=1, and bypass rates when source equals target. Derive chart values from converted expenses, then format aggregates to two decimals. Add dashboard-specific helpers without changing transfer or category-spending formatting exports. Reuse one conversion contract for wallet and expense totals.

## Scope

- `src/shared/utils/currencyConversion.ts`, `src/shared/utils/currency.ts`
- `src/features/dashboard/lib/aggregateExpenses.ts`
- `src/features/dashboard/DashboardScreen/useDashboardScreen.ts`, `useWalletsTotalBalance.ts`, `useWalletsCard.ts`
- `src/features/dashboard/DashboardScreen/DashboardScreen.tsx`, `ExpenseComparisonCard.tsx`, `ExpenseDynamicsCard.tsx`, `WalletsCard.tsx`

## Checklist

- [ ] Fetch rates required by wallet currencies and selected currency using generated query options.
- [ ] Resolve transaction source currency and convert expense points and totals.
- [ ] Keep chart points and summary totals in major units, applying consistent rates and final-only display rounding.
- [ ] Format all aggregate labels with `uk-UA` and the selected currency.
- [ ] Show hydration, query, and missing-rate states without displaying partial totals.
- [ ] Keep individual wallet rows in their native currency.
- [ ] Inspect read-only transfer and category-spending consumers for unchanged behavior.

## Verification commands

- `rtk yarn lint`
- `rtk yarn tsc --noEmit`
- Manual inspection of 10,000 minor units displaying as 100 UAH; USD/EUR targets; mixed currencies; same-currency conversion; zero, negative, NaN, and missing rates.

## Acceptance criteria

- Settings change immediately updates every planned aggregate and chart; individual wallet rows retain their currency.
- No NaN, false zero, or partial total appears when a needed quote is unavailable.

## Evidence note

Pending.

## Handoff note

Pass changed paths and verification outputs to Phase 04.
