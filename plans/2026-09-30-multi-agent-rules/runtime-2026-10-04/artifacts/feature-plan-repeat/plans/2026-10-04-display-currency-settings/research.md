# Research: display currency settings

- Target version supplied by the user: `1.11.0`. Current `package.json` and `app.json` versions are `1.10.0`; `app.json` runtimeVersion is `2.0.0`.
- Current branch name is `1.10.0`; release policy expects `r-1.11.0`. Branch changes belong to the user.
- `src/app/(tabs)/_layout.tsx` defines four tabs; there is no settings route.
- `src/features/dashboard/DashboardScreen/` owns dashboard totals, chart rendering, and wallet list. `ExpenseComparisonCard.tsx` and `WalletsCard.tsx` hardcode UAH formatting. `ExpenseDynamicsCard.tsx` has numeric y-axis labels without a currency marker.
- `src/features/dashboard/lib/aggregateExpenses.ts` aggregates expense transaction amounts as though all transaction amounts were UAH. `src/entities/transaction/index.ts` includes optional `transaction.wallet.currency`.
- `useWalletsTotalBalance.ts` converts foreign wallet balances into UAH using generated currency-rate query options and `rateBuy`, falling back to `rateCross`. Rates are expressed against UAH.
- `src/shared/utils/currencyConversion.ts` supplies conversion math; `src/shared/utils/currency.ts` supplies currency symbols and UAH formatting.
- Read-only existing consumers: `src/entities/transaction/lib/useTransferTargetAmount.ts` uses sell-rate transfer helpers; `src/features/categorySpending/CategorySpendingScreen/lib/spendingFormat.ts` uses UAH formatting. Their contracts must remain intact.
- Zustand is a direct dependency, but no native persistent storage package is a direct dependency in `package.json`. No existing `src/shared/stores/` directory or Zustand persistence implementation was found.
- The generated currency-rate API supports a currency code parameter and returns buy, sell, and cross rates. No backend contract edit is required by the brief.
- `yarn.lock` includes `expo-file-system` transitively, not as a direct package. User instructions prohibit package installation in this acceptance copy.
- `eas.json` has a `production` build profile; release policy distinguishes JS-only OTA updates from changes that add a native module.
- No `.env` or authorization files were read.

## Open decisions

- Dashboard coverage, supported currency choices, and conversion-rate failure behavior are stated assumptions in the design pending user review.
- Native persistence needs a direct supported storage dependency; installation is prohibited in this acceptance copy.

## Relevant contracts

- [Architecture](../../ai/rules/projects/fin-app-mobile/architecture.md)
- [State management](../../ai/rules/projects/fin-app-mobile/state-management.md) — canonical owner of the new persistence and dashboard conversion convention.
- [Versioning and changelog](../../ai/rules/common/versioning-changelog.md)
- [Deployment](../../ai/rules/common/deployment.md)
