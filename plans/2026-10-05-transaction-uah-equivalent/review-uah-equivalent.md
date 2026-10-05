# Code Review: transaction-uah-equivalent (phases 01–04)

Дата: 05.10.2026
Ревьюер: `code-reviewer` (DEEP), отдельный запуск от реализации

Гейты ревьюера: `rtk proxy yarn.cmd tsc --noEmit` — exit 0; `rtk proxy npx.cmd eslint src` (без `--fix`) — exit 0, 0 ошибок, 3 старых предупреждения (`useDashboardScreen.ts`, `base.ts`).

Бэкенд сверен read-only: `exchangeRate` — `Float?`, `amountUah` — `Int?`; `computeAmountUah` = `Math.round(amount * rate)`; обновление — `current.currency ?? current.wallet.currency` и `current.exchangeRate`; `resolveRate` — `rateSell ?? rateCross`, иначе 502.

## Critical Issues

Нет.

## Warnings

1. `useAmountUahEquivalent.ts:27` — `pickSellRate` берёт `rateSell ?? rateCross ?? rateBuy`, бэкенд — `rateSell ?? rateCross`. При наличии только `rateBuy` экран показывает эквивалент, а создание падает с 502. Нужен хелпер `rateSell ?? rateCross ?? null` в `currencyConversion.ts`
2. `useEditTransactionScreen.ts:158` — в режиме редактирования валюта берётся из списка кошельков с фоллбэком `UAH`; бэкенд — `current.currency ?? wallet.currency`. Пока кошельки грузятся, эквивалент USD-транзакции скрыт. Нужен `getTransactionCurrency(transaction)` для не-перевода в режиме редактирования
3. `transactionUah.ts:3` — циклический импорт рантайм-enum из `../index` (барреля). Вынести `WalletTransactionType` и `Transaction` в `src/entities/transaction/model/types.ts`
4. `TransactionAmountUah.tsx:23` — захардкожен `₴`; использовать `getCurrencySymbol(UAH_CURRENCY_CODE)` на уровне модуля
5. `AmountUahEquivalent.tsx:21` — inline `style` с фоном; в репо есть `bg-[rgba(79,158,255,0.2)]` через `className`
6. Нет JSDoc у `useAmountUahEquivalent`, компонента `AmountUahEquivalent`; тип и компонент называются одинаково — переименовать тип (`AmountUahEquivalentState`)
7. `TransactionAmountUah.tsx` лежит плоско, а компоненты `OperationsScreen/` — в своих папках; перенести в `OperationsScreen/TransactionAmountUah/`

## Improvements

1. `AmountUahEquivalent.tsx:11` — курс с 2 знаками теряет точность для мелких курсов; `maximumFractionDigits: 4`
2. Эталон показывает `≈ 13 150,00 ₴` (2 знака), `formatAmount` даёт минимум 0 знаков
3. `TransactionAmountUah.tsx:19` — знак выводить из `signedUah < 0` вместо повторной проверки типа
4. `useEditTransactionScreen.ts:159` — передавать `split.remainderKopecks` вместо повторного парсинга строки
5. `font-[monospace]` — первое использование в репо; сверить на iOS с соседней строкой суммы
6. Валютная транзакция без `amountUah` молча выпадает из итога дня — соответствует допущению плана, отметить в Reflect

## What's Done Well

- Копеечная математика совпадает с бэкендом, парсинг суммы совпадает с путём сохранения
- Рантайм-гарды закрывают неточные сгенерированные типы без приведений
- Исключение переводов — в одной точке (`getTransactionAmountUah`)
- Суммы категорий сходятся с `summary.totalSpent`, общий знаменатель процентов
- `hasTotal` корректно скрывает итог для фильтра «Переводы»
- Выбор курса в редакторе совпадает с `buildCurrencyFields`; запрос курса выключен там, где не нужен; хуки вызываются безусловно
- Направление FSD соблюдено, `RATE_STALE_TIME_MS` вынесен, `formatDayTotal` на `KOPECK_DIVISOR`
- Строки ленты без состояния, зависимости memo не изменились

## Resolution

Исправления выполнены implementer-ролью отдельным запуском, 05.10.2026.

- Warnings 1–7 — fixed: `pickBackendRate` в `currencyConversion.ts`; валюта из `getTransactionCurrency(transaction)` в режиме редактирования; типы перенесены в `src/entities/transaction/model/types.ts`; `UAH_SYMBOL` на уровне модуля; фон пилюли через `className`; тип `AmountUahEquivalentState` и JSDoc; компонент в `OperationsScreen/TransactionAmountUah/`
- Improvements 1–4 — fixed: курс 2–4 знака; `formatAmountFixed` (2 знака) в редакторе; знак из `signedUah < 0`; хук принимает `amountKopecks`, при разделении — `split.remainderKopecks`
- Improvement 5 — открыт: проверка `font-[monospace]` на iOS, за пользователем
- Improvement 6 — перенесён в Reflect
- Гейты после исправлений: `rtk proxy yarn.cmd lint` — exit 0, 0 ошибок, 3 старых предупреждения; `rtk proxy yarn.cmd tsc --noEmit` — exit 0; `rtk proxy yarn.cmd agents:check --strict` — exit 0
