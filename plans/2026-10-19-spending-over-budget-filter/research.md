# Research — Фильтр «Превышен бюджет» на экране расходов

Дата: 19.10.2026
Только факты. Эталон визуала: `designs/screens/category-spending.html` (блок `filter-row`, `filter-note`, `filter-empty`, функции `toggleOverOnly` и `applyFilter`).

## Затронутые файлы

Экран — `src/features/categorySpending/CategorySpendingScreen/`:
- `CategorySpendingScreen.tsx` — `FlatList` с `ListHeaderComponent` (MonthSwitcher → BudgetSummaryCard → ViewModeSegment → подпись секции) и `ListEmptyComponent` «Нет расходов за этот месяц»; подпись секции рендерится только при `listItems.length > 0`
- `useCategorySpendingScreen.ts` — собирает `listItems: SpendingListItem[]` под `viewMode` в `useMemo`; возвращает поля месяца, режима, `listItems`, `summary`, `isLoading`, `isError`
- `useSpendingViewMode.ts` — `useState` режима, `onViewModeChange`, `sectionLabel` из `SPENDING_SECTION_LABEL`
- `ViewModeSegment.tsx` — сегмент-контрол; цвета — именованные hex-константы и `hexToRgba`
- `lib/flattenSpendingRows.ts` — `FlatSpendingRow`, `flattenSpendingRows`, `SpendingListItem` (union по `kind`), `getSpendingListItemKey`
- `lib/aggregateCategorySpending.ts` — `CategorySpendingRow` (`totalSpent`, `budget: number | null`, копейки); бюджет категории = сумма бюджетов подкатегорий, иначе собственная строка бюджета
- `lib/spendingFormat.ts` — `getBudgetProgress(totalSpent, budget)` → `hasBudget` (`budget !== null && budget > 0`), `isExceeded` (`pct > FULL_PERCENT`), `formatKopecksUah`
- `CategoryCard.tsx`, `SpendingRowCard.tsx`, `SubCategoryList.tsx` — уже показывают превышение (красная сумма, полоса overflow, бейдж `exceeded`) через `getBudgetProgress`

Константы — `src/shared/constants/spendingViewMode.ts`: `SPENDING_VIEW_MODE`, `SPENDING_VIEW_MODE_LABEL`, `SPENDING_SECTION_LABEL`, `UNCATEGORIZED_SUB_LABEL`; ре-экспорт из `src/shared/constants/index.ts`.

## Факты о данных

- В режиме «Категории» элементы списка — `CategorySpendingRow`; в режиме «Подкатегории» — `FlatSpendingRow` (подкатегории, остатки `rest:` с `budget = null`, категории без подкатегорий)
- «Без категории» и остатки `rest:` не имеют бюджета
- Все суммы в копейках; данные приходят из `useSpendingData` (два запроса, агрегация в `useMemo`)
- Фильтрация — чистая операция над уже агрегированными данными, сетевых изменений и изменений API не требует

## Ограничения

- FSD: всё в `features/categorySpending` и `shared/constants`; `expo-router` в фичу не импортируется
- `tailwind.config.js` не содержит собственных цветовых токенов; соседние компоненты используют hex в `className` и константах (техдолг из плана `2026-10-10-spending-transactions-sheet`)
- Иконки — `lucide-react-native` (`AlertTriangle`, `TrendingUp`, `CheckCircle` доступны в пакете)
- Хуки ≤ `HOOK_MAX_LINES` (50), функции ≤ `FUNCTION_MAX_LINES`
- Только JS-изменения — доставка OTA, `runtimeVersion` не меняется
- Текущие версии: `package.json` и `app.json` — `1.12.0`, ветка `r-1.12.0`; целевая версия — `1.13.0`

## Открытые вопросы

- Нет
