# Phase 02 — Общие презентационные примитивы экрана

- Status: done
- Model tier: BALANCED (`sonnet`)
- Required rules: `ai/rules/common/react.md`, `ai/rules/common/react-19.md`, `ai/rules/projects/fin-app-mobile/architecture.md`

## Goal

Форматирование, иконка категории и полоса бюджета живут в общих модулях и используются карточкой категории.

## Implementation Notes

- Извлечение из `CategoryCard.tsx` выполняется без изменения визуального результата и без изменения поведения резолвера иконок
- `ICON_MAP` переезжает в `SpendingIcon.tsx` в прежнем составе и с прежним фоллбэком
- `SpendingIcon` объявляется на уровне модуля и рендерится через `createElement`, иначе `react-hooks/static-components` читает его как компонент, созданный во время рендера
- `getBudgetProgress` возвращает объект, а не набор позиционных значений — параметров расчёта больше двух

## Scope

Target state:

- `src/features/categorySpending/CategorySpendingScreen/lib/spendingFormat.ts` — `formatUah`, `formatPct`, `getProgressColor`, `getBudgetProgress`
- `src/features/categorySpending/CategorySpendingScreen/SpendingIcon.tsx` — `ICON_MAP`, `resolveIcon`, компонент `SpendingIcon`
- `src/features/categorySpending/CategorySpendingScreen/BudgetProgress.tsx` — полоса бюджета с заливкой и полосой превышения, параметр высоты
- `src/features/categorySpending/CategorySpendingScreen/CategoryCard.tsx` — карточка категории и `SubCategoryItem` берут форматирование, иконку и полосу из перечисленных модулей; файл укладывается в `COMPONENT_MAX_LINES`
- `src/features/categorySpending/CategorySpendingScreen/BudgetSummaryCard.tsx` — расчёт процентов и форматирование сумм идут через общие модули
- `src/features/categorySpending/CategorySpendingScreen/lib/aggregateCategorySpending.ts` — перевод доли в проценты идёт через `PERCENT_MULTIPLIER`, перевод гривен в копейки — через `KOPECK_MULTIPLIER`
- `src/features/dashboard/DashboardScreen/useDashboardScreen.ts` — расчёт процента изменения идёт через `PERCENT_MULTIPLIER`

## Checklist

- [x] `formatUah` форматирует копейки через деление на `KOPECK_DIVISOR` и `toLocaleString('uk-UA')` с валютой UAH
- [x] `getBudgetProgress` возвращает `hasBudget`, `pct`, `fillPct`, `overflowPct`, `isExceeded`, `fillColor`
- [x] Отсутствие бюджета и нулевой бюджет обрабатываются одинаково и не дают деления на ноль
- [x] `BudgetProgress` принимает высоту полосы и покрывает оба размера, используемых на экране
- [x] `SpendingIcon` объявлен на уровне модуля, не создаётся во время рендера
- [x] `CategoryCard.tsx` не содержит собственных копий `formatUah`, `formatPct`, `getProgressColor`, `ICON_MAP` и разметки полосы бюджета
- [x] `CategoryCard.tsx` укладывается в 150 строк
- [x] Ни один из новых файлов не импортирует `expo-router`
- [x] Разметка использует `className`; `style` остаётся только для вычисляемых ширин, цветов и трансформаций
- [x] Литерал `100` в значении процентного множителя заменён на `PERCENT_MULTIPLIER` во всех точках экрана статистики и в `useDashboardScreen.ts`
- [x] Литерал `100` в значении перевода гривен в копейки заменён на `KOPECK_MULTIPLIER` в `aggregateCategorySpending.ts`
- [x] Порог полного бюджета вынесен в именованную константу и не остаётся числовым литералом в сравнениях и в расчёте полосы превышения

## Verification Commands

- `rtk yarn lint`
- `rtk yarn tsc --noEmit`

## Acceptance Criteria

- Оба гейта проходят без ошибок
- `wc -l src/features/categorySpending/CategorySpendingScreen/CategoryCard.tsx` даёт не больше 150
- `grep -c "formatUah\|getProgressColor" ` по `CategoryCard.tsx` показывает только вызовы, объявлений нет
- `grep -rn "\* 100" src/` не находит вхождений вне `src/shared/constants/`
- Режим «Категории» сохраняет полный набор поведения: раскрытие подкатегорий, бюджеты, превышения, проценты

## Evidence Note

Выполнено 14.09.2026.

- `lib/spendingFormat.ts` (66 строк) владеет `formatKopecksUah`, `formatPct`, `getProgressColor`, `getBudgetProgress`, `BUDGET_WARNING_PERCENT`
- `SpendingIcon.tsx`, `BudgetProgress.tsx`, `BudgetMetaRow.tsx`, `SubCategoryItem.tsx` выделены в отдельные файлы; `CategoryCard.tsx` сократился до 137 строк
- `FULL_PERCENT` добавлен в `src/shared/constants/percent.ts`; порог предупреждения и порог полного бюджета больше не числовые литералы
- Литерал `100` в процентном смысле в `src/` не встречается: `grep -rn "\* 100" src/` пуст
- `BudgetSummaryCard.tsx`, `aggregateCategorySpending.ts`, `useDashboardScreen.ts` переведены на `PERCENT_MULTIPLIER` и `KOPECK_MULTIPLIER`
- Гейты: `rtk yarn lint` — 0 ошибок, `rtk yarn tsc --noEmit` — без ошибок
- Отклонение от плана: `formatUah` не создавался заново — в `src/shared/utils/currency.ts` он уже был, а `CategoryCard` и `BudgetSummaryCard` держали по локальной копии. `formatKopecksUah` делегирует shared-функции, снимая булев флаг с 15 точек вызова
- Отклонение от плана: дополнительно выделены `BudgetMetaRow.tsx` и `SubCategoryItem.tsx` — без них `CategoryCard.tsx` не укладывался в 150 строк, и правило «один компонент на файл» требовало того же
- Отклонение от плана: у `CategoryCard` и `SubCategoryItem` убран проп `totalExpenses` — доля уже посчитана в `percentOfTotal` агрегатором, а повторный расчёт делил на величину, способную быть нулём
- Отклонение от скоупа: в `src/shared/utils/currency.ts` два литерала `/ 100` заменены на `KOPECK_DIVISOR`, который файл уже импортировал

## Handoff Note

- `getBudgetProgress(totalSpent, budget)` — единственный источник расчёта полосы бюджета, Phase 04 берёт его для плоской строки
- `BudgetProgress` и `BudgetMetaRow` готовы к переиспользованию; высоты берутся из `BUDGET_PROGRESS_HEIGHT`
- `SpendingIcon` принимает kebab-case имя и цвет, подходит для строки плоского списка без изменений
- `formatKopecksUah` и `formatPct` — единственные точки форматирования на экране
- `CategoryCard` принимает только проп `row`; вызов в экране уже обновлён
- Техдолг: `/ 100` в копеечном смысле остался в `WalletRow.tsx`, `WalletsCard.tsx`, `aggregateExpenses.ts`, `useEditTransactionForm.ts`, `dateAndTime.ts` — файлы вне скоупа плана, зафиксировать в Phase 07
