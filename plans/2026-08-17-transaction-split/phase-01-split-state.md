# Phase 01 — Состояние разделения

Status: done
Model tier: BALANCED
Required rules: `ai/rules/projects/fin-app-mobile/architecture.md`, `ai/rules/common/react.md`, `ai/rules/common/patterns.md`

## Goal

Хук разделения платежа держит состояние новой части, базовую сумму и остаток без участия UI.

## Implementation notes

Файлов ещё нет — писать с нуля. Хук ≤ 50 строк; если не помещается, вынести расчёты в чистые функции рядом.

## Scope

- `src/features/operations/EditTransactionScreen/useTransactionSplit.ts` — новый хук
- `src/shared/constants/transactionSplit.ts` — константы разделения
- `src/shared/constants/index.ts` — реэкспорт новых констант

## Checklist

- [x] Хук `useTransactionSplit` принимает актуальное значение поля суммы и признак доступности разделения
- [x] Состояние: активность разделения, `categoryId`, `subCategoryId`, строка суммы новой части, базовая сумма
- [x] Включение разделения фиксирует базовую сумму из текущего значения поля «Сумма»
- [x] Ввод суммы новой части клампится диапазоном от нуля до базовой суммы
- [x] Остаток вычисляется как базовая сумма минус сумма новой части и отдаётся строкой в том же формате, что и поле «Сумма»
- [x] Отключение разделения возвращает базовую сумму и очищает категорию, подкатегорию и сумму части
- [x] Хук отдаёт функцию полного сброса для смены типа транзакции
- [x] Константы разделения (тексты валидации, минимальная сумма) вынесены в `src/shared/constants/transactionSplit.ts` с JSDoc
- [ ] Парсинг и форматирование сумм используют существующие утилиты `shared/utils/currency`, без дублирования логики — см. отклонение в evidence

## Verification commands

- `rtk yarn lint`
- `rtk yarn tsc --noEmit`

## Acceptance criteria

- В хуке нет `any`, нет импортов `expo-router`, нет обращений к API
- Магические числа и повторяющиеся строки вынесены в константы
- Остаток никогда не отрицательный при любом вводе

## Evidence note

Создано:
- `src/shared/constants/transactionSplit.ts` — `TRANSACTION_SPLIT_PRECISION_FACTOR`, `TRANSACTION_SPLIT_MIN_AMOUNT`, `TRANSACTION_SPLIT_MESSAGES`, каждая с JSDoc
- `src/features/operations/EditTransactionScreen/useTransactionSplit.ts` — чистые `toKopecks` / `toAmountStr`, под-хук `useSplitPart`, основной хук на 44 строки
- `src/shared/constants/index.ts` — реэкспорт новых констант

Гейты: `yarn lint` — 0 ошибок (2 предупреждения о неиспользуемых переменных в `useDashboardScreen.ts` существовали до фазы); `yarn tsc --noEmit` — чисто.

Отклонение 1: `parseAmountInput` из `shared/utils/currency` не переиспользован. Он возвращает `null` для нуля и пустой строки, тогда как промежуточный ввод новой части обязан считаться нулём, а не ошибкой. Вместо него в хуке лежат `toKopecks` / `toAmountStr` — целочисленная копеечная математика, которой в `currency.ts` нет. Кандидат на вынос в `shared/utils/currency` при аудите фазы 04.

Отклонение 2: `rtk` в этой среде не установлен (`program not found` и в Bash, и в PowerShell), команды выполнены без префикса.

## Handoff note

- Хук вызывается как `useTransactionSplit({ amountStr, isAvailable })`, где `isAvailable` = расход и режим редактирования
- Поле «Сумма» экран рендерит как `isSplitActive ? remainderStr : amountStr` — хук не мутирует состояние формы, поэтому выключение само возвращает базовое значение
- Для фазы 03 отдаются готовые целые копейки: `remainderKopecks` и `splitAmountKopecks` — знак расхода накладывает вызывающая сторона
- Сброс один — `resetSplit`: и кнопка удаления, и смена типа транзакции
- `selectSplitCategory` сам очищает подкатегорию, как это делает основная форма
- Клампинг опирается на базу: при включении разделения с пустым полем «Сумма» база равна нулю и любой ввод схлопывается в `0` — отсечь валидацией в фазе 03
- Тексты валидации и сообщение о частичном сохранении уже лежат в `TRANSACTION_SPLIT_MESSAGES`
