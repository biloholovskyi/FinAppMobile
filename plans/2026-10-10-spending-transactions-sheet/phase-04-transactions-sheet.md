# Phase 04 — Шторка транзакций: список, редактирование, удаление

- Status: done
- Model tier: BALANCED
- Required rules: `ai/rules/projects/fin-app-mobile/architecture.md`, `ai/rules/projects/fin-app-mobile/state-management.md`, `ai/rules/common/react.md`, `ai/rules/common/performance/_index.md`

## Goal

Шторка показывает транзакции листа за месяц по дням со сводкой и даёт отредактировать или удалить транзакцию с подтверждением.

## Implementation Notes

- Write from scratch по `design.md` и эталону `designs/screens/category-spending.html`
- Данные только из существующих запросов (`useSpendingData`); новых query-ключей нет
- Строка транзакции повторяет `TxItem` ленты без бейджа категории; повторное использование — через вынос общих частей, если это не тянет фичу в фичу
- Группировка по локальной дате; сумма дня — сумма `getTransactionAmountUah` по модулю, форматирование через `KOPECK_DIVISOR`
- Месяц из `monthStr` → `Date` начала месяца в локальном времени
- Компонент ≤ 150 строк, хук ≤ 50 строк — делить на подкомпоненты и подхуки

## Scope

- `src/features/categorySpending/SpendingTransactionsSheet/SpendingTransactionsSheet.tsx` — экран-шторка
- `useSpendingTransactionsSheet.ts` — лист, строка, секции по дням, состояние удаления
- `SheetHeader.tsx`, `SheetSummary.tsx`, `SheetTransactionRow.tsx`, `SheetEmptyState.tsx`
- `lib/groupTransactionsByDay.ts` — секции и суммы дней
- `src/app/spending/[leafKey].tsx` — пропсы `leafKey`, `monthStr`, `onEditTransaction`, `onClose`

## Checklist

- [x] Сводка и суммы совпадают со строкой листа на экране расходов
- [x] Нажатие на строку и карандаш открывают `transaction/[id]` поверх шторки; «назад» возвращает в шторку
- [x] После сохранения с переносом в другую категорию или месяц транзакция исчезает из шторки
- [x] Корзина открывает модалку подтверждения; после удаления список и сводка пересчитаны
- [x] Удаление последней транзакции → пустое состояние
- [x] `FlatList`/`SectionList` с `keyExtractor` по `id`, без индекса

## Verification Commands

- `rtk yarn lint`
- `rtk yarn tsc --noEmit`

## Acceptance Criteria

- Оба гейта проходят
- Цвета через существующие токены и константы, без нового inline-layout

## Evidence Note

- Фича `src/features/categorySpending/SpendingTransactionsSheet/`: `SpendingTransactionsSheet`, `SheetHeader`, `SheetSummary`, `SheetTransactionRow`, `SheetEmptyState`, хуки `useSpendingTransactionsSheet` (композиция) / `useSpendingLeafData` / `useSheetDelete`, `lib/groupTransactionsByDay.ts`; также `lib/parseMonthStr.ts`
- Маршрут `src/app/spending/[leafKey].tsx` передаёт `leafKey`, `monthStr`, `onEditTransaction` (`router.push('/transaction/<id>')`), `onClose` (`router.back()`)
- Данные из `useSpendingData` (в него добавлено поле `transactions` того же кэша `QUERY_KEYS.transactions.all`) + `flattenSpendingRows` + `filterLeafTransactions`; новых query-ключей нет; сумма берётся из строки листа
- Строка листа запоминается (render-time `useState`), поэтому после удаления последней транзакции остаются шапка/бюджет и показывается пустое состояние
- `TransactionAmountUah` перенесён из `features/operations` в `entities/transaction/ui` (экспорт из `index.ts`), чтобы не импортировать фичу из фичи; лента операций обновлена
- Гейты (`rtk proxy yarn.cmd`): `lint` exit 0 (0 errors, 3 warnings вне scope); `tsc --noEmit` exit 0; `grep expo-router` в features/entities пуст
- Отклонения: дублирование ~25 строк логики удаления с лентой (фича-в-фичу запрещена); цвета — те же hex-литералы, что в соседних файлах (токенов в проекте нет). Сценарии «назад возвращает в шторку», перенос в другую категорию/месяц, formSheet на iOS/Android не проверялись на устройстве

## Handoff Note

- Шторка собрана и подключена к маршруту; удаление через общую модалку, ошибка → `Alert`
- Редактирование открывается поверх шторки; рефетч после сохранения убирает перенесённую транзакцию
- Нужна проверка на устройстве: `formSheet` (особенно Android), модалка удаления внутри формы-шторки, sticky-заголовки
- Фаза 05: ревью независимым ревьюером, проверка сходимости сумм
