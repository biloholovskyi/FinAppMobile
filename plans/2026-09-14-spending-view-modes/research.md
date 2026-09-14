# Research — Переключатель режимов отображения расходов

Дата: 14.09.2026
Тип: facts-only discovery

## Затрагиваемая поверхность

| Файл | Строк | Роль |
|------|-------|------|
| `src/app/(tabs)/statistics.tsx` | 5 | Маршрут вкладки, рендерит `CategorySpendingScreen` |
| `src/features/categorySpending/CategorySpendingScreen/CategorySpendingScreen.tsx` | 73 | JSX экрана, один `FlatList<CategorySpendingRow>` |
| `src/features/categorySpending/CategorySpendingScreen/useCategorySpendingScreen.ts` | 77 | Два `useQuery`, навигация по месяцам, вызов агрегатора |
| `src/features/categorySpending/CategorySpendingScreen/CategoryCard.tsx` | 366 | Карточка категории, `SubCategoryItem`, `ICON_MAP`, хелперы форматирования и прогресса |
| `src/features/categorySpending/CategorySpendingScreen/lib/aggregateCategorySpending.ts` | 163 | Агрегация транзакций и бюджетов в `CategorySpendingRow[]` + `BudgetSummary` |
| `src/features/categorySpending/CategorySpendingScreen/BudgetSummaryCard.tsx` | 112 | Карточка «Бюджет на месяц» |
| `src/features/categorySpending/CategorySpendingScreen/MonthSwitcher.tsx` | 47 | Переключатель месяца |
| `designs/screens/category-spending.html` | — | Эталонный прототип обоих режимов |

## Контракты данных

- `CategorySpendingRow`: `categoryId: string | null`, `categoryName`, `categoryIcon`, `categoryColor`, `totalSpent` (копейки), `budget: number | null` (копейки), `percentOfTotal`, `subCategories: SubCategorySpendingRow[]`
- `SubCategorySpendingRow`: `subCategoryId`, `subCategoryName`, `totalSpent`, `budget`, `percentOfTotal`. Родительских `icon` / `color` / имени категории в типе нет
- `BudgetSummary`: `totalBudget`, `totalSpent` — обе величины в копейках
- Бюджеты приходят из API в гривнах и умножаются на 100; суммы транзакций приходят в копейках
- Бюджет категории с подкатегориями — сумма бюджетных строк её подкатегорий; у категории без подкатегорий берётся её собственная бюджетная строка (`subCategory === null`)
- `percentOfTotal` у категории и у подкатегории считаются от одного знаменателя `totalSpentAll`, поэтому порядок по `totalSpent` и по проценту совпадает

## Ключевой факт агрегации

`catEntry.total` накапливает все расходы категории, а `subMap` пополняется только при наличии `t.subCategoryId`. Для категории с подкатегориями возможен остаток `row.totalSpent − Σ row.subCategories[].totalSpent > 0` — расходы, отнесённые к категории напрямую. В плоском списке этот остаток не представлен ни одной строкой.

## Существующие паттерны для переиспользования

- `src/features/operations/EditTransactionScreen/TypeSegment.tsx` — сегмент-контрол: `flex-row`, `bg-[#181828]`, рамка `white/[0.08]`, `rounded-2xl p-1 gap-0.5`, активный сегмент — фон `hexToRgba(color, 0.2)` и цветной текст
- `src/shared/utils/colors.ts` — `hexToRgba`
- `src/shared/constants/transactionSplit.ts` — прецедент хранения фичевых текстовых констант в `src/shared/constants/` с ре-экспортом из `index.ts`
- `src/shared/ui/Icon/Icon.tsx` + `src/shared/utils/icons.ts` — общий резолвер иконок по kebab-case через PascalCase над всем `lucide-react-native`, фоллбэк `CircleHelp`

## Ограничения и нарушения правил, уже присутствующие на экране

- `CategoryCard.tsx` — 366 строк при `COMPONENT_MAX_LINES = 150`
- `useCategorySpendingScreen.ts` — 77 строк при `HOOK_MAX_LINES = 50`
- `CategoryCard.tsx` держит собственный `ICON_MAP` на 22 иконки с фоллбэком `Tag`, параллельно общему резолверу в `shared/utils/icons.ts`
- Цвета на экране заданы hex-литералами в `className`-скобках и в `style` — установившийся паттерн всего экрана
- `getProgressColor` использует порог предупреждения 80%, прототип рисует amber от 90%
- `keyExtractor` экрана — `item.categoryId ?? 'uncategorized'`; для плоского списка этот ключ неуникален
- `FlatList` параметризован единственным типом `CategorySpendingRow`

## Инфраструктура

- `src/shared/stores/` отсутствует — ни одного Zustand-стора в проекте нет
- Тест-раннер не установлен; гейты качества — `rtk yarn lint` и `rtk yarn tsc --noEmit`
- `package.json` `version` = 1.9.0, `app.json` `expo.version` = 1.9.0, `expo.runtimeVersion` = 2.0.0
- Ветка `r-1.9.0`; секция `CHANGELOG.md` `[1.9.0]` датирована 04.09.2026
- Бэкенд-контракт задачей не затрагивается, перегенерация Orval не требуется

## Открытые вопросы

| Вопрос | Статус |
|--------|--------|
| Целевая версия | Решено пользователем: 1.10.0 |
| Остаток расходов категории без подкатегории в плоском режиме | Решено пользователем: синтетическая строка «Без подкатегории» |
| Порог предупреждения 80% против 90% в прототипе | Вне скоупа — `getProgressColor` остаётся единым источником для обоих режимов |
| Унификация `ICON_MAP` с `shared/ui/Icon` | Вне скоупа — меняет набор поддерживаемых иконок и фоллбэк |

## Связанные правила

- `ai/rules/projects/fin-app-mobile/architecture.md`
- `ai/rules/projects/fin-app-mobile/state-management.md`
- `ai/rules/common/react.md`, `ai/rules/common/react-19.md`
- `ai/rules/common/patterns.md`
- `ai/rules/common/versioning-changelog.md`
