# Design — Фильтр «Превышен бюджет»

Дата: 19.10.2026
Целевое состояние. Эталон визуала: `designs/screens/category-spending.html`.

## Поведение экрана

Экран держит два независимых состояния: режим списка (`viewMode`) и фильтр превышения (`isOverOnly`, по умолчанию `false`). Смена режима сохраняет фильтр, переключение фильтра сохраняет режим. Смена месяца сохраняет оба. Состояние живёт в памяти экрана и не сохраняется между запусками.

| Режим | Фильтруемые элементы | Критерий |
|-------|---------------------|----------|
| Категории | Карточки категорий | Бюджет категории превышен |
| Подкатегории | Строки плоского списка | Бюджет строки превышен |

Превышение элемента — `getBudgetProgress(totalSpent, budget).isExceeded`. Элемент без бюджета (`budget === null` или `0`), «Без категории» и остатки `rest:` никогда не превышены.

Раскрытая карточка категории в режиме фильтра показывает все свои подкатегории — фильтр применяется только к верхнему уровню списка текущего режима. Сортировка отфильтрованного списка совпадает с исходной (по `totalSpent` по убыванию).

Карточка «Бюджет на месяц» фильтром не затрагивается.

## Шапка списка

Порядок в `ListHeaderComponent`: MonthSwitcher → BudgetSummaryCard → ViewModeSegment → строка фильтра → плашка превышения (только при включённом фильтре и непустом результате).

Строка фильтра — `flex-row justify-between items-center`: слева подпись секции, справа чип. Строка показывается всегда, когда данные загружены без ошибки, чтобы фильтр можно было выключить из любого состояния.

Подпись секции — `SPENDING_SECTION_LABEL[viewMode]`, при включённом фильтре с суффиксом `OVER_BUDGET_SECTION_SUFFIX` (« · превышено»).

## Чип «Превышен бюджет»

`OverBudgetChip` — `Pressable` с `accessibilityRole="button"` и `accessibilityState={{ selected: isOverOnly }}`: иконка `AlertTriangle` 13, подпись `OVER_BUDGET_FILTER_LABEL`, бейдж со счётчиком `overCount` текущего режима.

| Состояние | Фон | Рамка | Текст | Иконка | Бейдж |
|-----------|-----|-------|-------|--------|-------|
| Выкл., `overCount = 0` | surface | border-default | secondary | secondary | elevated / secondary |
| Выкл., `overCount > 0` | surface | border-default | primary | red | red-glow / red |
| Вкл. | red-glow | red-line | red | red | red / inverse |

Форма — `rounded-full`, отступы `py-1 pl-2.5 pr-1.5`, текст 12 medium; бейдж — `min-w-5 h-5 rounded-full px-1.5`, моноширинный 11 bold.

## Плашка превышения

`OverBudgetNote` — `flex-row items-center gap-2 rounded-xl px-3 py-2.5`, фон red-soft, рамка red-line: иконка `TrendingUp` 15 (red), текст `Превышение по {overCount} из {budgetedCount} {noun} с бюджетом` (secondary, 12), сумма `+{formatKopecksUah(overspend)}` (red, моно 13 bold). `noun` — `категориям` или `подкатегориям` по режиму.

## Пустое состояние

`ListEmptyComponent` выбирается по состоянию:
- фильтр включён и нефильтрованный список текущего режима непуст — `OverBudgetEmpty`: иконка `CheckCircle` в зелёном круге, заголовок «Превышений нет», текст по режиму из `OVER_BUDGET_EMPTY_TEXT`, кнопка «Показать все» выключает фильтр;
- фильтр выключен либо в месяце нет расходов вовсе (нефильтрованный список пуст) — существующее «Нет расходов за этот месяц».

## Модель данных

`src/shared/constants/spendingViewMode.ts` дополнительно владеет: `OVER_BUDGET_FILTER_LABEL`, `OVER_BUDGET_SECTION_SUFFIX`, `OVER_BUDGET_NOTE_NOUN: Record<SpendingViewMode, string>`, `OVER_BUDGET_EMPTY_TITLE`, `OVER_BUDGET_EMPTY_TEXT: Record<SpendingViewMode, string>`, `OVER_BUDGET_RESET_LABEL`. Ре-экспорт из `index.ts`.

`lib/filterOverBudget.ts` (чистые функции):
- `getListItemBudget(item: SpendingListItem): { totalSpent: number; budget: number | null }` — исчерпывающий `switch` по `kind`
- `OverBudgetStats` — `overCount: number`, `budgetedCount: number`, `overspend: number` (копейки, сумма `totalSpent − budget` по превышенным)
- `selectOverBudget(items: SpendingListItem[]): { overItems: SpendingListItem[]; stats: OverBudgetStats }` — один проход, порядок сохраняется

`useOverBudgetFilter.ts` — `isOverOnly`, `onToggleOverOnly`, `onResetOverOnly` (`useState` + `useCallback`).

`useCategorySpendingScreen` собирает `allItems` под режим (как сейчас), считает `selectOverBudget(allItems)` в `useMemo`, возвращает `listItems` (= `overItems` при фильтре, иначе `allItems`), `overStats`, `isOverOnly`, обработчики и `sectionLabel` с суффиксом. Хук остаётся ≤ 50 строк; при превышении сборка списка выносится в под-хук.

## Компоненты и цвета

Новые файлы в `CategorySpendingScreen/`: `OverBudgetFilterRow.tsx` (подпись + чип), `OverBudgetChip.tsx`, `OverBudgetNote.tsx`, `OverBudgetEmpty.tsx`.

Цвета новых компонентов — токены `spending.*` в `tailwind.config.js` (`theme.extend.colors`): `surface`, `elevated`, `border`, `primary`, `secondary`, `red`, `red-glow`, `red-soft`, `red-line`, `green`, `green-tint`, `inverse`; значения — из `:root` эталона. Для пропа `color` иконок lucide — именованные константы в файле компонента. Существующие компоненты на токены не переводятся.

## Поток данных

`useSpendingData(month)` → `rows`, `summary` → `allItems` (по `viewMode`) → `selectOverBudget` → `listItems` + `overStats` → `FlatList` / `OverBudgetFilterRow` / `OverBudgetNote` / `ListEmptyComponent`. Сеть и кэш React Query фильтром не затрагиваются.
