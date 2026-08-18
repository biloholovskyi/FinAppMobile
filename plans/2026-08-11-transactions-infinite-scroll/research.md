# Research — бесконечная подгрузка транзакций

Факты, собранные до проектирования. Решений здесь нет.

## Бэкенд `GET /wallets/transactions`

Источник: `fin-app-backend/src/core/wallet/wallet.service.ts:348`.

- Параметры: `page`, `limit` (max 500), `dateFrom`, `dateTo` (оба `date-time`, границы включительные `gte`/`lte`).
- Без `page` и `limit` возвращает плоский массив; с любым из них — `{ data, pagination }`. В OpenAPI это `oneOf`, поэтому Orval сгенерирует union — нужен нарроуинг.
- `pagination.total` = `count({ where })` с тем же фильтром, что и выборка. Без дат `where = {}` → это количество всех транзакций; с датами — количество внутри окна.
- Ответ реально содержит `wallet`, `category`, `subCategory` (`WALLET_TRANSACTION_LIST_INCLUDE`), но `WalletTransactionModel` в OpenAPI их не описывает — контрактный разрыв на стороне бэкенда.
- Колонка объявлена как `transaction_time TIMESTAMP(3)` (`prisma/migrations/20260303161950_add_wallet_transaction/migration.sql:9`) — точность миллисекундная, значит граница окна «минус 1 мс» не теряет записи и не создаёт перекрытий.

## Дрейф контракта за пределами транзакций

- В `openapi.json` 17 тегов, включая `photo-print-transactions` и `photo-prints`, которым в `src/shared/api/generated/` не соответствует ни одного каталога.
- Следовательно `rtk yarn api:generate` перезапишет весь каталог generated, создаст новые модули и может изменить существующие модели и сигнатуры. Падение `tsc` возможно в коде, не относящемся к этой задаче.

## Мобильное приложение

- `src/shared/api/generated/wallets/wallets.ts` сгенерирован до появления параметров: `walletControllerGetAllTransactions(signal)` без аргументов, возврат `WalletTransactionModel[]`. Требуется `rtk yarn api:generate`.
- `src/features/operations/OperationsScreen/useOperationsScreen.ts` — обычный `useQuery` на весь список через легаси `fetchTransactions`, клиентская фильтрация и группировка по дням.
- `src/features/operations/OperationsScreen/OperationsScreen.tsx` — `SectionList` без `onEndReached` и футера.
- `src/shared/constants/` содержит только `queryKeys.ts`, файла `index.ts` нет.
- Легаси `src/shared/api/transactions.ts` расширять нельзя (правило `ai/rules/projects/fin-app-mobile/state-management.md`).
- `QUERY_KEYS.transactions.all` = `['transactions']` используется не только как префикс инвалидации, но и как реальный ключ данных тремя экранами: `useDashboardScreen.ts:18`, `useCategorySpendingScreen.ts:40`, `useEditTransactionData.ts:13`. Все три тянут полный непагинированный список через легаси `fetchTransactions`.
- Инвалидация `['transactions']` вызывается из `useOperationsScreen.ts:53`, `useEditTransactionActions.ts:30`, `useWalletsCard.ts:28`.
- `expo-router` уже импортируется в 7 файлах внутри `src/features/`, включая `OperationsScreen.tsx:13`. Правило FSD нарушено до этой задачи.

## Дизайн `designs/screens/transactions.html`

- Зона догрузки: кольцевой спиннер, три «дышащие» точки, подпись «Загружаем ещё…», три скелетон-строки.
- Конец списка: разделительная линия, иконка check-circle, текст «Это все транзакции».

## Открытые вопросы

- Фактическое имя union-типа ответа и типа параметров из generated известно только после `rtk yarn api:generate` — фиксируется в фазе 1.
