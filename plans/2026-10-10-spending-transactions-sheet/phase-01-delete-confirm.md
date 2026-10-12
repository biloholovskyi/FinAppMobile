# Phase 01 — Общее подтверждение удаления в `entities/transaction`

- Status: done
- Model tier: BALANCED
- Required rules: `ai/rules/projects/fin-app-mobile/architecture.md`, `ai/rules/projects/fin-app-mobile/state-management.md`, `ai/rules/common/patterns.md`

## Goal

Модалка подтверждения и мутация удаления живут в `entities/transaction` и переиспользуются любой фичей.

## Implementation Notes

- Перенос, а не переписывание: визуал модалки не меняется
- Символ валюты в модалке — `getTransactionCurrency(tx)`, как в строке ленты
- Ошибка мутации не глотается: хук отдаёт `onError` вызывающему или `errorMessage`

## Scope

- `src/entities/transaction/ui/DeleteTransactionModal/DeleteTransactionModal.tsx` — модалка (из `features/operations/OperationsScreen/DeleteTransactionModal/`)
- `src/entities/transaction/ui/DeleteTransactionModal/useDeleteTransactionDisplay.ts` — хук отображения транзакции
- `src/entities/transaction/lib/useDeleteTransaction.ts` — мутация `deleteTransaction`, инвалидация `QUERY_KEYS.transactions.all` и `QUERY_KEYS.wallets.all`
- `src/entities/transaction/index.ts` — экспорт модалки и хука
- `src/features/operations/OperationsScreen/useDeleteTransactionModal.ts` — состояние модалки поверх `useDeleteTransaction`; ошибка → `Alert` с `getApiErrorMessage`
- `src/features/operations/OperationsScreen/OperationsScreen.tsx` — импорт модалки из `@/entities/transaction`
- Старая папка `features/operations/OperationsScreen/DeleteTransactionModal/` удалена

## Checklist

- [x] Модалка и хуки без `expo-router`
- [x] Лента операций удаляет с подтверждением, как раньше
- [x] JSDoc у экспортов, без `any`

## Verification Commands

- `rtk yarn lint`
- `rtk yarn tsc --noEmit`

## Acceptance Criteria

- Оба гейта проходят
- `grep -rn "DeleteTransactionModal" src` — только `entities/transaction` и потребители

## Evidence Note

- Модалка и хук отображения перенесены в `src/entities/transaction/ui/DeleteTransactionModal/` (хук переименован в `useDeleteTransactionDisplay`), символ валюты теперь через `getTransactionCurrency(tx)`
- Добавлен `src/entities/transaction/lib/useDeleteTransaction.ts` (`deleteById` — `mutateAsync`, инвалидирует транзакции и кошельки), экспорт в `index.ts`
- `useDeleteTransactionModal` ленты работает поверх него; ошибка → `Alert` с `getApiErrorMessage`, модалка остаётся открытой
- Гейты (`rtk proxy yarn.cmd`; `rtk yarn` даёт program not found): `lint` exit 0 (0 errors, 3 warnings вне scope); `tsc --noEmit` exit 0
- `grep DeleteTransactionModal src` — только `entities/transaction` и `features/operations/OperationsScreen`
- Отклонений нет

## Handoff Note

- `useDeleteTransaction().deleteById(id)` отклоняется при ошибке — вызывающий ловит и показывает `Alert`/баннер
- Инвалидирует `QUERY_KEYS.transactions.all` и `QUERY_KEYS.wallets.all`
- Модалка экспортируется из `@/entities/transaction`
- Фаза 02 подключает её на экране редактирования
