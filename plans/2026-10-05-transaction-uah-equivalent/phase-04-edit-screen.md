# Phase 04 — Эквивалент на экране редактирования

- Status: done
- Model tier: BALANCED
- Required rules: `ai/rules/projects/fin-app-mobile/architecture.md`, `ai/rules/projects/fin-app-mobile/state-management.md`, `ai/rules/common/react.md`, `ai/rules/common/react-19.md`

## Goal

Для расхода и дохода с не-UAH кошельком под полем суммы показывается живой эквивалент в UAH и курс.

## Implementation Notes

- Визуал — `#uahEquiv` из `designs/screens/transaction-edit.html`
- Запрос курса повторяет паттерн `useTransferTargetAmount`: `useCurrencyRateControllerGetRate`, `pickSellRate`, тот же `staleTime`; `enabled` только когда эквивалент виден и сохранённого курса нет
- Сохранённый курс — `getTransactionExchangeRate(transaction)`, только в режиме редактирования и когда исходная транзакция не перевод
- Сумма поля разбирается так же, как при сохранении (`amountStrToKopecks`), результат в копейках UAH → `formatAmount`
- При разделении платежа источник — значение верхнего поля (остаток)
- Сохранение не зависит от эквивалента; payload не меняется

## Scope

- `src/features/operations/EditTransactionScreen/useAmountUahEquivalent.ts` — вход: `isTransfer`, `currency`, `amountStr`, `storedRate`; выход: `{ isVisible, amountUahKopecks, rate }`
- `src/features/operations/EditTransactionScreen/AmountUahEquivalent.tsx` — `≈ N ₴` и `1 $ = R ₴`
- `src/features/operations/EditTransactionScreen/AmountField.tsx` — принимает и рендерит эквивалент под полем
- `src/features/operations/EditTransactionScreen/useEditTransactionScreen.ts` — вызывает хук, отдаёт результат экрану
- `src/features/operations/EditTransactionScreen/EditTransactionScreen.tsx` — пробрасывает эквивалент в `AmountField`

## Checklist

- [x] Перевод — блок скрыт
- [x] UAH-кошелёк — блок скрыт, запрос курса не уходит
- [x] Смена кошелька в режиме создания переключает видимость и валюту
- [x] Ввод суммы и изменение суммы разделения обновляют значение
- [x] Курс не загружен — блок скрыт, ошибок в UI нет
- [x] Файлы в пределах лимитов строк, без inline-стилей раскладки

## Verification Commands

- `rtk yarn lint`
- `rtk yarn tsc --noEmit`

## Acceptance Criteria

- Оба гейта проходят
- Ручная проверка: редактирование USD-расхода показывает эквивалент по сохранённому курсу; после сохранения `amountUah` в ленте совпадает с показанным

## Evidence Note

Выполнено 05.10.2026.

- Новые: `useAmountUahEquivalent.ts`, `AmountUahEquivalent.tsx`, `src/shared/constants/currencyRate.ts` (`RATE_STALE_TIME_MS`, реэкспорт из `index.ts`)
- `useTransferTargetAmount.ts` использует общий `RATE_STALE_TIME_MS`
- `AmountField.tsx` — проп `uahEquivalent`, рендер под полем над `hint`
- `useEditTransactionScreen.ts` — `storedRate` = `getTransactionExchangeRate(transaction)` только если исходная транзакция не перевод; сумма — `split.isSplitActive ? split.remainderStr : form.amountStr`; валюта пустая, пока кошелёк не выбран
- Пилюля повторяет стиль пилюли курса из `CreditedAmountRow.tsx`, новых цветов нет
- Payload сохранения не изменён
- Гейты: `rtk proxy yarn.cmd lint` — exit 0, 0 ошибок, 3 старых предупреждения вне scope; `rtk proxy yarn.cmd tsc --noEmit` — exit 0
- Ручная проверка на устройстве не выполнялась — за пользователем

## Handoff Note

- `useAmountUahEquivalent.ts` — курс `storedRate ?? pickSellRate`, запрос только когда блок применим и сохранённого курса нет
- Сумма для эквивалента — значение верхнего поля (остаток при разделении)
- `RATE_STALE_TIME_MS` перенесён в `src/shared/constants/currencyRate.ts`
