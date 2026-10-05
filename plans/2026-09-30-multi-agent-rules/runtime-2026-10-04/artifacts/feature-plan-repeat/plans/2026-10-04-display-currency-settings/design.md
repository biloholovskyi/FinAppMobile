# Design: default display currency

## Product outcome

The user can choose UAH, USD, or EUR in a Settings tab. UAH is the initial selection. The selection survives an app restart. Dashboard summary amounts and expense chart use the selected currency; individual wallet rows retain each wallet's own currency.

## Assumptions for user review

- Settings is a fifth bottom tab.
- Conversion uses the existing generated currency-rate endpoint. The same `rateBuy`, then `rateCross`, quote is used to express each source amount in UAH and divide by the selected currency's UAH quote. A quote must be finite and greater than zero; UAH has an implicit quote of 1. Equal source and target currencies need no rate request.
- A missing or invalid rate blocks the affected aggregate and shows a retryable status, rather than a partial or misleading total.
- API wallet and transaction amounts are integer minor units. Convert to major units once with `KOPECK_DIVISOR`, apply the rate ratio without intermediate rounding, and round only formatted output to two decimals. Chart points and summary totals use the same units and rates. A 10,000-minor-unit UAH input displays as 100 UAH when UAH is selected.
- Missing transaction wallet currency is resolved from the wallets query by `walletId`. If still unknown, the affected expense aggregate is unavailable.
- Only the display preference persists; wallet and transaction server data remain in TanStack Query.
- A direct native AsyncStorage dependency is required for Zustand persistence. Its exact SDK-compatible version is resolved when installations are permitted. Adding it requires a native build and a runtimeVersion change under [deployment rules](../../ai/rules/common/deployment.md).

## C4 context and containers

- **Context:** App user selects a display currency; FinApp mobile reads wallet and transaction data plus exchange rates from the existing backend.
- **Containers:** Expo Router presents Settings and Dashboard. Zustand persists one currency preference to device storage. TanStack Query owns remote wallet, transaction, and rate data. The backend contract stays unchanged.
- **Components:** `src/app/(tabs)/settings.tsx` routes to `src/features/settings/SettingsScreen/`; `src/shared/stores/displayCurrencyStore.ts` owns the preference; `src/features/dashboard/` selects rates and derives display values; `src/shared/utils/currencyConversion.ts` owns pure conversion rules.

## Data flow

1. On app start, the preference store hydrates from device storage and validates the saved currency against the supported list.
2. Settings renders the selected choice and updates the store on selection.
3. Dashboard waits for preference hydration, fetches wallet and transaction data through existing Query keys, and fetches rates for the currencies needed by those data and the selected currency.
4. Pure conversion derives wallet total, expense comparison, and daily chart values in the selected currency. Formatting uses `uk-UA` and the selected ISO currency code.
5. A rate or data failure yields an explicit retry state. A preference change recomputes derived values without a backend mutation.

## Sequence

`User -> Settings tab -> Zustand preference -> device storage -> Dashboard selector -> Query cache / rate queries -> conversion helper -> summary cards and chart`

## Error and release contract

- Persisted values are validated; an invalid or stale value falls back to UAH. An asynchronous hydration state prevents a brief incorrect-currency display.
- Missing rates and failed rate queries never become zero balances. Retry refetches the relevant query.
- Existing `computeTargetAmount` and `pickSellRate` consumers keep their present transfer behavior; dashboard conversion uses separate helper exports.
- Existing `formatUah` consumers in category spending retain UAH formatting. The new display-currency formatter is a separate export.
- The storage dependency is native; plan for a new native build and an updated `expo.runtimeVersion`. The target app version is `1.11.0`; the user owns the branch transition to `r-1.11.0`.
- No new backend endpoint, environment key, generated API output, or auth path is required.

## Source contracts

- [Architecture](../../ai/rules/projects/fin-app-mobile/architecture.md)
- [State management](../../ai/rules/projects/fin-app-mobile/state-management.md)
- [Versioning](../../ai/rules/common/versioning-changelog.md)
