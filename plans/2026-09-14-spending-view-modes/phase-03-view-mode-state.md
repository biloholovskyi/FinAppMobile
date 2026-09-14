# Phase 03 — Сегмент-контрол и состояние режима

- Status: done
- Model tier: BALANCED (`sonnet`)
- Required rules: `ai/rules/common/react.md`, `ai/rules/projects/fin-app-mobile/state-management.md`

## Goal

Экран хранит выбранный режим, отдаёт готовый список элементов под него и показывает сегмент-контрол.

## Implementation Notes

- `useCategorySpendingScreen` разбивается на под-хуки: хук вышел за `HOOK_MAX_LINES` ещё до этой задачи, добавление режима усугубляет превышение
- Плоский список считается в `useMemo` от `rows` и `summary.totalSpent`
- `ViewModeSegment` пишется по образцу `src/features/operations/EditTransactionScreen/TypeSegment.tsx`; общий компонент из двух сегмент-контролов не выделяется — цветовые и размерные контракты у них разные
- Обработчик смены режима стабилизируется `useCallback`, так как передаётся пропом

## Scope

Target state:

- `src/features/categorySpending/CategorySpendingScreen/useMonthNavigation.ts` — выбранный месяц, переходы вперёд и назад, `isNextDisabled`, строковый ключ месяца
- `src/features/categorySpending/CategorySpendingScreen/useSpendingViewMode.ts` — `viewMode`, `onViewModeChange`
- `src/features/categorySpending/CategorySpendingScreen/useCategorySpendingScreen.ts` — два запроса, агрегация, мемоизация плоского списка, сборка `listItems: SpendingListItem[]`; возвращает `viewMode`, `onViewModeChange`, `sectionLabel`, `listItems`, `summary`, `isLoading`, `isError` и поля навигации по месяцу
- `src/features/categorySpending/CategorySpendingScreen/lib/flattenSpendingRows.ts` — дополнительно тип `SpendingListItem` как дискриминированный union по полю `kind`
- `src/features/categorySpending/CategorySpendingScreen/ViewModeSegment.tsx` — сегмент-контрол на два режима

## Checklist

- [x] `useSpendingViewMode` хранит режим через `useState` с начальным значением `SPENDING_VIEW_MODE.categories`
- [x] `useMonthNavigation` владеет всей логикой месяца, основной хук её не дублирует
- [x] Каждый из трёх хуков укладывается в `HOOK_MAX_LINES`
- [x] `listItems` собирается под текущий режим и типизирован как `SpendingListItem[]`
- [x] Плоский список обёрнут в `useMemo` с полным списком зависимостей
- [x] `sectionLabel` берётся из `SPENDING_SECTION_LABEL`, а не собирается условием в JSX
- [x] `ViewModeSegment` принимает `viewMode` и `onChange`, подписи берёт из `SPENDING_VIEW_MODE_LABEL`
- [x] Активный сегмент оформлен через `hexToRgba` из `src/shared/utils/colors.ts`
- [x] Смена режима не приводит к новым запросам и не инвалидирует кэш React Query
- [x] Ни один из новых файлов не импортирует `expo-router`

## Verification Commands

- `rtk yarn lint`
- `rtk yarn tsc --noEmit`

## Acceptance Criteria

- Оба гейта проходят без ошибок
- Каждый хук экрана не превышает 50 строк
- Переключение сегмента меняет `listItems` и подпись секции, выбранный месяц сохраняется
- В React Query DevTools или по счётчику запросов смена режима не порождает обращений к сети

## Evidence Note

Выполнено 14.09.2026.

- `useMonthNavigation.ts` (46), `useSpendingViewMode.ts` (30), `useSpendingData.ts` (53), `useCategorySpendingScreen.ts` (29) — каждое тело хука в пределах `HOOK_MAX_LINES`
- `ViewModeSegment.tsx` (57) собран по паттерну `TypeSegment`, подписи берутся из `SPENDING_VIEW_MODE_LABEL`, подложка активного сегмента — через `hexToRgba`
- `SpendingListItem` и `getSpendingListItemKey` добавлены в `lib/flattenSpendingRows.ts`, ключ разбирается исчерпывающим `switch` со стражем `never`
- Экран переведён на `listItems`, `sectionLabel` берётся из хука, сегмент-контрол стоит между `BudgetSummaryCard` и подписью секции
- Агрегация обёрнута в `useMemo` — до этого она выполнялась на каждый рендер
- Гейты: `rtk yarn lint` — 0 ошибок, `rtk yarn tsc --noEmit` — без ошибок
- Отклонение от плана: два запроса и агрегация вынесены в отдельный хук `useSpendingData.ts` — с ними основной хук выходил на 63 строки при лимите 50
- Промежуточное состояние: `renderSpendingItem` для ветки `flat` возвращает `null`, карточку добавляет Phase 04

## Handoff Note

- `listItems: SpendingListItem[]` готов в обоих режимах, `keyExtractor` подключён к `getSpendingListItemKey`
- Phase 04 заменяет ветку `case 'flat'` в `renderSpendingItem` на карточку строки
- Подпись секции и пустое состояние уже реагируют на режим
- `hexToRgba` подтверждён рабочим для подложки активного сегмента
- `summary` остаётся в возврате хука ради `BudgetSummaryCard`
- Смена режима пересобирает только `listItems`, запросы не повторяются
