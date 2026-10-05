# Phase 07 — Reflect

- Status: done
- Model tier: FAST
- Required rules: `ai/rules/common/implementation-plans.md`

## Goal

Итоги задачи, расхождения с дизайном и техдолг записаны.

## Scope

- `history.md` — итоговая запись
- Индекс плана — статусы фаз и Next Actions

## Checklist

- [x] Реализация сверена с `design.md` и HTML-эталонами
- [x] Техдолг записан: `aggregateExpenses` на дашборде, типы полей в `@ApiProperty` бэкенда, прочие находки ревью
- [x] Next Actions индекса обновлены

## Verification Commands

- `rtk yarn tsc --noEmit`

## Acceptance Criteria

- Все фазы плана в статусе `done` или `deferred` с причиной

## Evidence Note

Выполнено 05.10.2026.

- Сверка с `design.md`: модель, лента, категории, редактор реализованы по целевому состоянию
- Отклонения от плана: типы транзакции вынесены в `src/entities/transaction/model/types.ts` (разрыв цикла импорта по ревью); курс редактора — `pickBackendRate` (`rateSell ?? rateCross`), а не `pickSellRate`, чтобы совпадать с бэкендом; `RATE_STALE_TIME_MS` вынесен в `src/shared/constants/currencyRate.ts`
- Фазы 02 и 03 выполнены параллельно без конфликтов
- Уроки: `rtk yarn` / `rtk npx` на этой машине требуют `rtk proxy yarn.cmd` / `rtk proxy npx.cmd`; при параллельных фазах `rtk yarn lint` (с `--fix` по всему `src`) заменять на `eslint` по своим папкам
- Техдолг:
  - `src/features/dashboard/lib/aggregateExpenses.ts` суммирует `t.amount` без учёта валюты и делит на литерал `100`
  - Бэкенд: в `@ApiProperty` для `currency`, `exchangeRate`, `amountUah`, `targetAmount` не указан `type` — Orval генерирует `{ [key]: unknown }`
  - Проверить на iOS `font-[monospace]` строки эквивалента рядом с `fontFamily: 'monospace'` суммы
  - Валютная транзакция без `amountUah` молча выпадает из итога дня и расходов — нет индикатора неполноты
- `rtk proxy yarn.cmd tsc --noEmit` — exit 0

## Handoff Note

- Реализация совпадает с `design.md` и HTML-эталонами, отклонения перечислены в evidence
- Техдолг: дашборд, `@ApiProperty` бэкенда, iOS-шрифт, индикатор неполного итога дня
