# Design — Переключатель режимов отображения расходов

Дата: 14.09.2026
Целевое состояние. Эталон визуала: `designs/screens/category-spending.html`.

## Поведение экрана

Экран статистики держит режим отображения списка. Режим переключается сегмент-контролом, расположенным между карточкой «Бюджет на месяц» и подписью секции, внутри `ListHeaderComponent`.

| Режим | Значение | Подпись секции | Состав списка |
|-------|----------|----------------|---------------|
| Категории | `categories` (по умолчанию) | «По категориям» | Карточки категорий с раскрытием подкатегорий |
| Подкатегории | `subcategories` | «По подкатегориям» | Плоский список подкатегорий и категорий без подкатегорий |

Плоский список содержит:
- по строке на каждую подкатегорию каждой категории, у которой есть подкатегории;
- строку «Без подкатегории» для остатка расходов такой категории, когда остаток положителен;
- по строке на каждую категорию, у которой нет ни одной подкатегории, включая «Без категории».

Категория, у которой есть хотя бы одна подкатегория, собственной строкой в плоском списке не представлена. Сумма всех строк плоского списка равна `summary.totalSpent`.

Сортировка плоского списка — по `totalSpent` по убыванию, что совпадает с порядком по проценту затрат.

Смена режима не трогает выбранный месяц, не инициирует сетевые запросы и не сбрасывает кэш React Query.

## Модель данных

`src/shared/constants/spendingViewMode.ts` владеет режимами и подписями:
- `SPENDING_VIEW_MODE` — const object со значениями `categories` и `subcategories`
- `SpendingViewMode` — union-тип из значений объекта
- `SPENDING_VIEW_MODE_LABEL` — подписи сегментов
- `SPENDING_SECTION_LABEL` — подписи секции по режиму
- `UNCATEGORIZED_SUB_LABEL` — `'Без подкатегории'`

Всё перечисленное ре-экспортируется из `src/shared/constants/index.ts`.

`src/features/categorySpending/CategorySpendingScreen/lib/flattenSpendingRows.ts` владеет плоской моделью:

`FlatSpendingRow` — `id: string`, `name: string`, `parentName: string | null`, `icon: string | null`, `color: string | null`, `totalSpent: number` (копейки), `budget: number | null` (копейки), `percentOfTotal: number`.

`flattenSpendingRows(rows: CategorySpendingRow[], totalSpent: number): FlatSpendingRow[]`:
- категория с подкатегориями отдаёт строку на каждую подкатегорию; `parentName` — имя категории, `icon` и `color` наследуются от категории, `budget` — бюджет подкатегории;
- остаток категории отдаёт строку с `name = UNCATEGORIZED_SUB_LABEL`, `budget = null`, `parentName` — имя категории;
- категория без подкатегорий отдаёт одну строку с `parentName = null` и собственным бюджетом;
- `percentOfTotal` для синтетической строки считается от `totalSpent`, для остальных берётся из уже посчитанных значений;
- при `totalSpent === 0` функция возвращает пустой массив.

Схема `id`, обеспечивающая уникальность ключей `FlatList`: `sub:<subCategoryId>`, `rest:<categoryId>`, `cat:<categoryId>`, `cat:uncategorized`.

## Тип элемента списка

Экран рендерит один `FlatList`, параметризованный дискриминированным union:

`SpendingListItem` — `{ kind: 'category'; row: CategorySpendingRow }` либо `{ kind: 'flat'; row: FlatSpendingRow }`.

`renderItem` разбирает `kind` исчерпывающим сужением. `keyExtractor` возвращает `cat:<categoryId ?? 'uncategorized'>` для `category` и `row.id` для `flat`.

## Разбиение хука

`useCategorySpendingScreen` остаётся входной точкой экрана и укладывается в `HOOK_MAX_LINES`, делегируя:
- `useMonthNavigation.ts` — выбранный месяц, переходы вперёд и назад, признак блокировки будущего месяца, строковый ключ месяца;
- `useSpendingViewMode.ts` — текущий режим и его смену.

Основной хук выполняет два запроса, вызывает агрегатор, мемоизирует плоский список и возвращает готовый `listItems: SpendingListItem[]` под текущий режим вместе с `viewMode`, `onViewModeChange`, `sectionLabel`, `summary`, `isLoading`, `isError` и полями навигации по месяцу.

Плоский список считается в `useMemo` от `rows` и `summary.totalSpent` и не пересчитывается при смене месяца без смены данных.

## Компоненты

`ViewModeSegment.tsx` — сегмент-контрол на два сегмента по паттерну `TypeSegment`: `flex-row`, фон `#181828`, рамка `white/[0.08]`, `rounded-2xl p-1`, активный сегмент — фон `hexToRgba('#4F9EFF', 0.2)` и текст `#4F9EFF`, неактивный — `#44445A`. Принимает `viewMode` и `onChange`.

`SpendingRowCard.tsx` — карточка строки плоского списка: иконка и цвет родителя, название, подпись с именем родительской категории для подкатегорий, сумма, процент-бейдж, полоса бюджета и мета-строка бюджета. Карточка не раскрывается и не имеет шеврона. Строка «Без категории» и строки без бюджета получают приглушённое оформление.

`SpendingIcon.tsx` — рендер иконки категории по kebab-case имени, общий для обеих карточек. Компонент объявлен на уровне модуля, чтобы не читаться как компонент, созданный во время рендера.

`BudgetProgress.tsx` — полоса бюджета с заливкой и полосой превышения, общая для обеих карточек. Принимает `totalSpent`, `budget` и высоту полосы.

`lib/spendingFormat.ts` — общие чистые хелперы: `formatUah`, `formatPct`, `getProgressColor`, `getBudgetProgress`. `getBudgetProgress` возвращает `hasBudget`, `pct`, `fillPct`, `overflowPct`, `isExceeded`, `fillColor`.

`CategoryCard` и `SpendingRowCard` берут форматирование, иконку и полосу бюджета из этих модулей, за счёт чего `CategoryCard` укладывается в `COMPONENT_MAX_LINES`.

## Границы

- Все новые файлы лежат в слое `features`; импортов `expo-router` в них нет
- Константы режимов лежат в `shared`, `shared` ни на что из `features` не ссылается
- Режим хранится локальным состоянием экрана, без персиста и без Zustand
- Сетевой слой, ключи React Query и бэкенд-контракт не меняются
- Изменения только в JS — доставка OTA-совместима, `expo.runtimeVersion` не трогается

## Связанные правила

- `ai/rules/projects/fin-app-mobile/architecture.md` — FSD, NativeWind, FlatList
- `ai/rules/projects/fin-app-mobile/state-management.md` — React Query, границы стора
- `ai/rules/common/react.md` — лимиты компонентов и хуков, правила списков
- `ai/rules/common/patterns.md` — константы, дискриминированные union, чистые функции
