# Code Review — spending-transactions-sheet (фазы 01–04)

Дата: 10.10.2026. Ревьюер: `code-reviewer` (отдельный запуск). Отчёт сохранён основным агентом.

## Гейты

- `rtk proxy yarn.cmd tsc --noEmit` — 0 ошибок (`rtk yarn` → program not found)
- `rtk proxy npx.cmd eslint src` — 0 ошибок, 3 предупреждения вне scope (`useDashboardScreen.ts` ×2, `shared/api/base.ts`)

## Critical

- Нет

## Warnings

1. `CategoryCard.tsx` (раскрытый список) — остаток категории без подкатегории (`rest:`) доступен только в плоском режиме; в иерархическом режиме его транзакции не открыть, суммы шторок не сходятся с суммой категории. Исправление: строка остатка в раскрытой карточке с `buildRemainderLeafKey`.
2. `useSheetDelete.ts`, `OperationsScreen/useDeleteTransactionModal.ts`, `useEditTransactionActions.ts` `confirmDelete` — двойной тап «Удалить» шлёт два DELETE; второй даёт 404 и ложную ошибку. Исправление: синхронный in-flight guard (ref) в общем хуке.
3. `useEditTransactionActions.ts:95-100` — закрытие RN `Modal` и `router.back()` подряд; на iOS поверх `formSheet` возможна зависшая подложка. Исправление: не закрывать модалку при успехе (экран размонтируется) либо `back` после `onDismiss`; проверить на устройстве.
4. Дублирование логики подтверждения удаления (шторка, лента, экран редактирования) и констант `DELETE_ERROR_*`. Исправление: общий хук в `entities/transaction`.
5. `useSpendingLeafData.ts:26-27` — `lastRow` не привязан к `leafKey`/`monthStr`; при смене параметров того же экземпляра покажется шапка прошлого листа. Исправление: хранить `{ leafKey, monthStr, row }`.
6. `src/app/spending/[leafKey].tsx:8` — `month ?? ''` запрашивает бюджет пустого месяца; `leafKey` может прийти массивом. Исправление: нормализовать параметры.

## Improvements

- Hex-литералы и inline `style` в новых файлах — повторяют соседний код, но нарушают правило; техдолг
- Двойная сортировка: `filterLeafTransactions` и `groupTransactionsByDay`
- Расходы без UAH-эквивалента не видны в шторке — согласовано с агрегатором, принятый компромисс
- `SheetTransactionRow` — сумма без `Math.abs`
- `useDeleteTransactionDisplay` не хук — переименовать в `getDeleteTransactionDisplay`
- `SpendingTransactionsSheet` — вынести `SheetDayHeader` (лимит длины функции)
- Нет JSDoc у `Stat` в `SheetSummary` и `toDayKey`
- `_layout.tsx` — смешанные кавычки

## Done well

- Суммы листов сходятся с агрегатором по построению (`selectMonthExpenses`); `cat:uncategorized`, `sub:`, `rest:` корректны
- Границы месяца и дни — локальное время; `parseMonthStr` согласован с `toMonthStr`
- Копеечная математика только через существующие форматтеры
- `useDeleteTransaction` — v5 object syntax, инвалидация транзакций и кошельков, ошибки не глотаются
- FSD соблюдён, `expo-router` только в `src/app/`, ключи списков по id

## Решения по находкам

См. evidence фазы 05.
