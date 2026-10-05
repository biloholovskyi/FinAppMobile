# History

## 05.10.2026 — Phase 01: контракт транзакции и UAH-хелперы

- Хелперы эквивалента — `@/entities/transaction`, других источников логики нет
- Фазы 02–04 используют `getSignedUahAmount` (итог дня), `getTransactionAmountUah` (категории), `getTransactionExchangeRate` (редактор)
- Сгенерированный клиент не правился
- Гейты lint и tsc пройдены

## 05.10.2026 — Phase 02: лента операций

- Итог дня — сумма `getSignedUahAmount`, переводы не входят; `DayGroup.hasTotal` скрывает итог без учтённых транзакций
- `TransactionAmountUah.tsx` — строка `≈ ±N ₴` между суммой и временем
- Символ суммы строки берётся из `getTransactionCurrency(tx)`

## 05.10.2026 — Phase 03: расходы по категориям

- Агрегатор считает расход по `getTransactionAmountUah` по модулю
- Расходы без эквивалента исключены на шаге фильтрации месяца — суммы и проценты сходятся
- `flattenSpendingRows` и остальной экран `t.amount` не читают

## 05.10.2026 — Phase 04: экран редактирования

- `useAmountUahEquivalent.ts` — курс `storedRate ?? pickSellRate`, запрос только когда блок применим и сохранённого курса нет
- Сумма для эквивалента — значение верхнего поля (остаток при разделении)
- `RATE_STALE_TIME_MS` перенесён в `src/shared/constants/currencyRate.ts`

## 05.10.2026 — Phase 05: post-code, ревью и харденинг

- Отчёт ревью: `review-uah-equivalent.md`, критичных находок нет
- Типы транзакции живут в `src/entities/transaction/model/types.ts`, баррель реэкспортирует
- Курс редактора — `pickBackendRate` (как `resolveRate` бэкенда)
- Открыто: проверка `font-[monospace]` на iOS

## 05.10.2026 — Phase 06: версия и CHANGELOG

- Версия `1.11.0` в `package.json` и `app.json`, `runtimeVersion` = `2.0.0`
- CHANGELOG начинается с `[1.11.0] 05.10.2026`
- Ветка `r-1.11.0` не существует, текущая — `1.10.0`; создаёт пользователь

## 05.10.2026 — Phase 07: Reflect

- Реализация совпадает с `design.md` и HTML-эталонами, отклонения перечислены в evidence
- Техдолг: дашборд, `@ApiProperty` бэкенда, iOS-шрифт, индикатор неполного итога дня

## 05.10.2026 — Phase 08: дашборд в UAH и единые границы месяца

- Дашборд считает расход через `getTransactionAmountUah` / `KOPECK_DIVISOR`, валютные расходы без эквивалента пропускаются
- Дашборд и экран категорий определяют месяц транзакции по локальному времени
- Техдолг: группировка ленты по дням (`useTransactionsDayGroups`) режет дату по UTC (`transactionTime.slice(0, 10)`, `toISOString()`) — та же проблема у полуночи
