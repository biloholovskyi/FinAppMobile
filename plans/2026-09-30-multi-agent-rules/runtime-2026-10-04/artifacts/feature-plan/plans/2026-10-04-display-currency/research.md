# Research — display currency

## Facts

- Target version supplied by the user: `1.11.0`.
- This task has three feature signals: new settings route, a persisted preference, and a dashboard data-flow change. It has zero bugfix signals.
- Routes live in `src/app/`; the dashboard route is `src/app/(tabs)/index.tsx`, with its screen in `src/features/dashboard/DashboardScreen/`.
- The dashboard has a wallet total, an expense comparison, and an expense chart. Wallet rows display each wallet's own currency.
- `useWalletsTotalBalance.ts` uses the generated currency-rate query and rates expressed against UAH. `aggregateExpenses.ts` aggregates transaction amounts without currency conversion.
- Transaction wallet currency is optional in `src/entities/transaction/index.ts`; wallet currency is required in `src/entities/wallet/index.ts`.
- Zustand 5 is installed. No store or `@react-native-async-storage/async-storage` dependency exists. Project state rules require AsyncStorage for nonsensitive persisted preferences.
- `package.json` and `app.json` are `1.10.0`; `app.json` runtimeVersion is `2.0.0`. Current branch is `1.10.0`, whereas the target-version branch convention is `r-1.11.0`.
- The generated `CurrencyRateModel` offers `rateBuy`, `rateSell`, and `rateCross`; all are nullable. Existing wallet total prefers buy, then cross.
- No test runner is installed. Required gates are lint, typecheck, and agent configuration check.
- `eas.json` has a production channel. An AsyncStorage native module requires a compatible native build and runtimeVersion review before release.

## Boundaries and constraints

- FSD direction: app → features → entities → shared. Only app routes import Expo Router.
- API data remains in TanStack Query. The local display preference belongs in Zustand persist.
- No package installation, git mutation, or external publication is authorized in this acceptance copy.
- This plan must be approved before product code is changed. Dependency installation and branch creation remain user actions.

## Open user decisions

- Approve the proposed display scope and currency list in `design.md`.
- Arrange the AsyncStorage dependency and a native release path before executing the storage phase. Its exact Expo SDK 57 compatible version must be checked when installation is authorized.
- Create or select the required `r-1.11.0` branch when doing release preparation.
