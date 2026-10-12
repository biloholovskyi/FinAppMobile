# History

## 10.10.2026 — Phase 01: общее подтверждение удаления
- Модалка и мутация удаления перенесены в `entities/transaction`, экспортируются из `index.ts`
- `useDeleteTransaction` возвращает `deleteById` (rejects on error) и `isDeleting`; инвалидирует транзакции и кошельки
- Лента операций показывает ошибку удаления через `Alert`
- Гейты: lint exit 0, tsc exit 0

## 10.10.2026 — Phase 02: подтверждение удаления на экране редактирования
- `handleDelete` заменён на `requestDelete/confirmDelete/cancelDelete`, модалка из `entities/transaction`
- Ошибка удаления показывается в `ErrorBanner`
- Гейты: lint exit 0, tsc exit 0

## 10.10.2026 — Phase 03: листы расходов и маршрут шторки
- Общие `selectMonthExpenses` и `spendingLeaf`, нажимаемые листы, проп `onOpenLeaf`, маршрут `spending/[leafKey]` с `formSheet`
- Опции формы шторки подтверждены типами; Android — на проверку на устройстве
- Гейты: lint exit 0, tsc exit 0

## 10.10.2026 — Phase 04: шторка транзакций
- `SpendingTransactionsSheet` со сводкой, списком по дням, редактированием, удалением и пустым состоянием
- `TransactionAmountUah` вынесен в `entities/transaction`; `useSpendingData` отдаёт `transactions`
- Гейты: lint exit 0, tsc exit 0

## 10.10.2026 — Phase 05: аудит и харденинг
- Исправлены находки ревью W1–W6 и улучшения; решения перечислены в evidence фазы
- Добавлены `useConfirmedDelete`, `SubCategoryList`, `SheetDayHeader`, `normalizeMonthStr`
- Гейты: lint exit 0, tsc exit 0, agents:check --strict exit 0

## 10.10.2026 — Phase 07: Reflect
- Реализация сверена с `design.md`; отличия от HTML-эталона: нативный `formSheet`, без тостов
- Техдолг: hex-литералы/inline style, `expo-router` в `features/operations`, размер `EditTransactionScreen`
- Фаза 06 (CHANGELOG) отложена до версии от пользователя
