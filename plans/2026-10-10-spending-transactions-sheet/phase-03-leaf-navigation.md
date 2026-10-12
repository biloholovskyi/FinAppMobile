# Phase 03 — Листы расходов и маршрут шторки

- Status: done
- Model tier: BALANCED
- Required rules: `ai/rules/projects/fin-app-mobile/architecture.md`, `ai/rules/common/patterns.md`

## Goal

Листовые элементы экрана расходов нажимаются и открывают маршрут `spending/[leafKey]` с ключом листа и месяцем.

## Implementation Notes

- Ключи листов — из `design.md`; формат строится через существующий `buildCategoryRowId` и id `flattenSpendingRows`
- `selectMonthExpenses` выносится из `aggregateCategorySpending` без изменения его результата
- Навигация передаётся пропом из `src/app/` — фича не импортирует `expo-router`
- Маршрут на этой фазе рендерит каркас шторки из фазы 04 (или временную заглушку, заменяемую в фазе 04)
- Листовой элемент получает шеврон `ChevronRight` и `activeOpacity`

## Scope

- `src/features/categorySpending/lib/selectMonthExpenses.ts` — расходы месяца с `amountUah`
- `src/features/categorySpending/lib/spendingLeaf.ts` — `SpendingLeafKey`, `parseSpendingLeafKey`, `filterLeafTransactions`, `findLeafRow`
- `src/features/categorySpending/CategorySpendingScreen/lib/aggregateCategorySpending.ts` — использует `selectMonthExpenses`
- `CategorySpendingScreen.tsx`, `useCategorySpendingScreen.ts` — проп `onOpenLeaf(leafKey, monthStr)`
- `CategoryCard.tsx` — категория без подкатегорий открывает лист `cat:`; строки подкатегорий открывают `sub:`
- `SubCategoryItem.tsx`, `SpendingRowCard.tsx` — `onPress`
- `src/app/(tabs)/statistics.tsx` — `onOpenLeaf` → `router.push({ pathname: '/spending/[leafKey]', params })`
- `src/app/spending/[leafKey].tsx` — маршрут шторки
- `src/app/_layout.tsx` — `Stack.Screen` `spending/[leafKey]` с `presentation: 'formSheet'`

## Checklist

- [x] Сумма `filterLeafTransactions` по любому листу равна сумме строки
- [x] Категория с подкатегориями по-прежнему раскрывается
- [x] Ключ с неизвестным префиксом → `parseSpendingLeafKey` возвращает `null`
- [x] `expo-router` только в `src/app/`

## Verification Commands

- `rtk yarn lint`
- `rtk yarn tsc --noEmit`

## Acceptance Criteria

- Оба гейта проходят
- `grep -rn "expo-router" src/features/categorySpending` пуст

## Evidence Note

- Добавлены `lib/selectMonthExpenses.ts` (общий фильтр месяца/расхода/amountUah; агрегатор переведён на него без изменения результата) и `lib/spendingLeaf.ts` (`parseSpendingLeafKey`, `filterLeafTransactions`, `findLeafRow`, билдеры ключей; `flattenSpendingRows` строит id через них)
- Листы: `CategoryCard` без подкатегорий (`cat:`), `SubCategoryItem` (`sub:`), `SpendingRowCard` (`row.id`) нажимаются, добавлен `ChevronRight`; карточка с подкатегориями раскрывается как раньше
- `CategorySpendingScreen` принимает `onOpenLeaf(leafKey, monthStr)`; `statistics.tsx` → `router.push({ pathname: '/spending/[leafKey]', params: { leafKey, month } })`
- Маршрут `src/app/spending/[leafKey].tsx` (пока каркас) и `Stack.Screen` в `_layout.tsx`: `presentation: 'formSheet'`, `sheetAllowedDetents: [0.85]`, `sheetGrabberVisible: true`, `headerShown: false` — имена опций подтверждены типами expo-router (tsc exit 0)
- Сходимость сумм: `cat:` = все расходы категории, `sub:` = по `subCategoryId`, `rest:` = категория без `subCategoryId` (= остаток агрегатора)
- Гейты (`rtk proxy yarn.cmd`): `lint` exit 0 (0 errors, 3 warnings вне scope); `tsc --noEmit` exit 0; `grep expo-router src/features/categorySpending` пуст
- Отклонений от design.md нет. Поведение `formSheet` на Android требует проверки на устройстве (по типам expo-router: fallback на modal)

## Handoff Note

- `selectMonthExpenses` — единый фильтр; новые фильтры расходов добавлять только там
- Ключи листов = id `flattenSpendingRows`; билдеры в `lib/spendingLeaf.ts`
- `onOpenLeaf` приходит пропом из `src/app/`
- Маршрут — каркас; фаза 04 подставляет `SpendingTransactionsSheet`
- Проверить `formSheet` на Android
