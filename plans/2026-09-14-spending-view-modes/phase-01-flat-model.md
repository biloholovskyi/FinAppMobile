# Phase 01 — Константы режимов и плоская модель списка

- Status: done
- Model tier: BALANCED (`sonnet`)
- Required rules: `ai/rules/common/patterns.md`, `ai/rules/projects/fin-app-mobile/architecture.md`

## Goal

Экран получает типизированную модель плоского списка и константы режимов, пригодные к рендеру без UI-изменений.

## Implementation Notes

- `flattenSpendingRows` пишется с нуля как чистая функция без побочных эффектов и без обращения к React
- Функция работает поверх готового результата `aggregateCategorySpending`; сам агрегатор не трогается
- Остаток категории считается как `row.totalSpent − Σ row.subCategories[].totalSpent` и включается только при строго положительном значении
- Копеечная математика остаётся целочисленной: деление на 100 выполняется только при форматировании

## Scope

Target state:

- `src/shared/constants/spendingViewMode.ts` — `SPENDING_VIEW_MODE` (const object, `as const`), тип `SpendingViewMode`, `SPENDING_VIEW_MODE_LABEL`, `SPENDING_SECTION_LABEL`, `UNCATEGORIZED_SUB_LABEL`; каждая константа снабжена JSDoc
- `src/shared/constants/index.ts` — ре-экспорт перечисленного
- `src/features/categorySpending/CategorySpendingScreen/lib/flattenSpendingRows.ts` — тип `FlatSpendingRow` и функция `flattenSpendingRows(rows, totalSpent)` по контракту из `design.md`

## Checklist

- [x] `SPENDING_VIEW_MODE` объявлен const object с `as const`, тип `SpendingViewMode` выведен из его значений
- [x] Подписи сегментов и секции вынесены в константы, строковых литералов подписей в коде нет
- [x] `UNCATEGORIZED_SUB_LABEL` объявлен один раз и экспортирован из барреля
- [x] `FlatSpendingRow` экспортируется через `export type`
- [x] Подкатегории отдают `id` вида `sub:<subCategoryId>`, остаток — `rest:<categoryId>`, категории — `cat:<categoryId>` и `cat:uncategorized`
- [x] Строка остатка создаётся только при положительном остатке и получает `budget = null`
- [x] Категория с непустым `subCategories` собственной строки не отдаёт
- [x] Результат отсортирован по `totalSpent` по убыванию
- [x] При `totalSpent === 0` возвращается пустой массив, деления на ноль нет
- [x] Иконка и цвет строки подкатегории наследуются от родительской категории
- [x] Функция чистая: без `console.log`, без обращения к дате и к сети

## Verification Commands

- `rtk yarn lint`
- `rtk yarn tsc --noEmit`

## Acceptance Criteria

- Оба гейта проходят без ошибок
- `grep` по `src/` не находит строковых литералов `'Без подкатегории'`, `'По категориям'`, `'По подкатегориям'` вне `src/shared/constants/spendingViewMode.ts`
- Сумма `totalSpent` всех элементов результата равна переданному `totalSpent` для любого набора строк
- Все `id` в результате уникальны
- UI не изменён: экран рендерится как прежде

## Evidence Note

Выполнено 14.09.2026.

- Созданы `src/shared/constants/spendingViewMode.ts` и `src/features/categorySpending/CategorySpendingScreen/lib/flattenSpendingRows.ts` (124 строки), константы ре-экспортированы из `src/shared/constants/index.ts`
- `rtk yarn lint` — 0 ошибок, 3 предупреждения в файлах вне скоупа (`useDashboardScreen.ts`, `shared/api/base.ts`)
- `rtk yarn tsc --noEmit` — без ошибок
- Логика проверена прогоном скомпилированного модуля на наборе из 7 категорий, включая категорию с положительным остатком и категорию `null`: 13 строк, сумма совпала с `totalSpent` до копейки, сумма процентов 100.0000, все `id` уникальны, порядок по убыванию соблюдён, категории с подкатегориями в результате отсутствуют, `totalSpent === 0` вернул пустой массив
- Отклонение от скоупа: в `CategorySpendingScreen.tsx` подпись секции переключена с литерала на `SPENDING_SECTION_LABEL[SPENDING_VIEW_MODE.categories]` — без этого критерий приёмки о единственном источнике подписей не выполнялся. Phase 03 заменит обращение на `sectionLabel` из хука
- Отклонение от плана: добавлен экспорт `buildCategoryRowId` — префикс `cat:` нужен и в Phase 04 для ключей иерархического режима, дублировать его знание в двух модулях не следует
- По замечанию пользователя `PERCENT_MULTIPLIER` вынесен в `src/shared/constants/percent.ts` и ре-экспортирован из барреля: процентный множитель встречается в 8 точках проекта и является третьим по счёту смыслом числа 100 наряду с `KOPECK_DIVISOR` и порогом полного бюджета. Перевод остальных точек передан в Phase 02
- Гейты перепрогнаны после выноса константы: `rtk yarn lint` — 0 ошибок, `rtk yarn tsc --noEmit` — без ошибок

## Handoff Note

- `FlatSpendingRow` и `flattenSpendingRows(rows, totalSpent)` готовы к использованию из хука экрана
- `buildCategoryRowId(categoryId)` — единственный источник ключа строки категории, Phase 04 берёт `keyExtractor` оттуда
- `PERCENT_MULTIPLIER` живёт в `src/shared/constants/percent.ts`; Phase 02 переводит на него остальные точки экрана и дашборда
- `UNCATEGORIZED_CATEGORY_KEY` объявлен локально в модуле — единственный потребитель, вынос не требуется
- Тип `SpendingListItem` в модуле пока отсутствует — его добавляет Phase 03
- `CategorySpendingScreen.tsx` уже импортирует `SPENDING_SECTION_LABEL` и `SPENDING_VIEW_MODE`; Phase 03 переводит подпись на `sectionLabel`
- Агрегатор `aggregateCategorySpending.ts` не изменялся
