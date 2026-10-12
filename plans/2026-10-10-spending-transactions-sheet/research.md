# Research — транзакции подкатегории на экране расходов

## Затронутые файлы

- `src/app/(tabs)/statistics.tsx` — рендерит `CategorySpendingScreen` без пропсов
- `src/app/_layout.tsx` — корневой `Stack`; `transaction/[id]` без заголовка
- `src/app/transaction/[id].tsx` — рендерит `EditTransactionScreen`
- `src/features/categorySpending/CategorySpendingScreen/`:
  - `useSpendingData.ts` — `QUERY_KEYS.transactions.all` + `fetchTransactions`, бюджет `QUERY_KEYS.budgets.month(monthStr)`, агрегирует `aggregateCategorySpending`
  - `lib/aggregateCategorySpending.ts` — расход месяца: тип `expense`, локальный месяц устройства, `getTransactionAmountUah` не `null`, сумма по модулю
  - `lib/flattenSpendingRows.ts` — id строк: `cat:<id|uncategorized>`, `sub:<id>`, `rest:<categoryId|uncategorized>` (остаток категории без подкатегории)
  - `CategoryCard.tsx` — `TouchableOpacity` раскрывает подкатегории; у категории без подкатегорий нажатие ничего не делает
  - `SubCategoryItem.tsx`, `SpendingRowCard.tsx` — без обработчиков нажатия
  - `useMonthNavigation.ts` — `selectedMonth` (начало месяца), `monthStr` (`YYYY-MM-01T00:00:00.000Z`)
- `src/features/operations/OperationsScreen/`:
  - `OperationsScreen.tsx` — `TxItem` с кнопками карандаш/корзина; редактирование `router.push('/transaction/<id>')`
  - `useDeleteTransactionModal.ts` — мутация `deleteTransaction`, инвалидирует `QUERY_KEYS.transactions.all`, ошибки только в `console.error`
  - `DeleteTransactionModal/` — RN `Modal` подтверждения и хук отображения транзакции
- `src/features/operations/EditTransactionScreen/`:
  - `useEditTransactionData.ts` — транзакция ищется в `QUERY_KEYS.transactions.all` по `id` из `useLocalSearchParams`
  - `useEditTransactionActions.ts` — `handleDelete` удаляет сразу, без подтверждения; успех инвалидирует транзакции и кошельки и делает `router.back()`
  - `ActionButtons.tsx` — кнопка «Удалить транзакцию»
- `src/entities/transaction/` — тип, UAH-хелперы; UI-компонентов нет
- `src/shared/utils/dateAndTime.ts` — `formatTime`, `formatDayTotal`

## Границы и ограничения

- FSD: `app → features → entities → shared`; фича не импортирует другую фичу
- `expo-router` только в `src/app/`; `OperationsScreen.tsx`, `useEditTransactionActions.ts`, `useEditTransactionData.ts` уже нарушают это правило (существующий долг)
- Нативных зависимостей не добавляется — доставка OTA
- `react-native-screens` 4.26 поддерживает `presentation: 'formSheet'` с `sheetAllowedDetents`
- RN `Modal`, открытый поверх экрана, перекрывает и запушенные поверх него маршруты

## Эталоны визуала

- `designs/screens/category-spending.html` — шторка транзакций, редактирование, подтверждение удаления
- `designs/screens/transaction-delete-confirm.html`, `designs/screens/transactions.html`

## Открытые вопросы

- Нет
