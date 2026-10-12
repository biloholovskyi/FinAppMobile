# Phase 02 — Лента операций, окна, редактирование и проверка Hermes

- Status: done
- Model tier: BALANCED — перевод потребителей на готовую утилиту
- Required rules: `ai/rules/projects/fin-app-mobile/architecture.md`, `ai/rules/common/react.md`, `ai/rules/common/patterns.md`

## Goal

Лента операций, окна загрузки и экран редактирования считают и показывают дни по Киеву, а поддержка `Intl` с `timeZone` подтверждена на iOS и Android.

## Implementation Notes

- Патч существующих файлов по таблице «Применение» в [design.md](design.md)
- `dateWindows.ts`: сигнатура `getTransactionsDateWindow(windowIndex, now)` и зазор 1 мс без изменений; импорт констант пагинации — `@/shared/constants/pagination`
- `formatTime` остаётся экспортом `dateAndTime.ts` — потребители (`OperationsScreen`, `SheetTransactionRow`, `getDeleteTransactionDisplay`) не меняются
- `verifyKyivCalendar()` подключается в `src/app/_layout.tsx` под `__DEV__`
- Проверка на устройстве — пользователь; агент даёт шаги и ждёт результат

## Scope

- `src/shared/utils/dateWindows.ts`
- `src/shared/utils/dateAndTime.ts` — `formatTime` через `formatKyivTime`
- `src/features/operations/OperationsScreen/useTransactionsDayGroups.ts`
- `src/features/operations/OperationsScreen/OperationsScreen.tsx` — месяц в шапке
- `src/features/operations/EditTransactionScreen/EditTransactionScreen.tsx` — `formatTransactionTime`
- `src/features/operations/EditTransactionScreen/DateTimePickerModal/DateTimePickerModal.tsx` — `timeZoneName={KYIV_TIME_ZONE}` у трёх пикеров
- `src/app/_layout.tsx` — `verifyKyivCalendar()` в `__DEV__`
- `scripts/check-kyiv-calendar.mjs` — включён сценарий «Окно ленты»

## Checklist

- [x] Перечитан «Изменения design» в backend `history.md`; новые записи — план обновлён, пользователь уведомлён
- [x] Группировка ленты по `getKyivDayKey`, «Сегодня» / «Вчера» по Киеву
- [x] Окна от киевской полуночи, окно 0 без верхней границы
- [x] Пикер выбирает и показывает время по Киеву на iOS и Android
- [x] Устройство: TZ `America/New_York`, транзакция `21:30–23:59` по Киеву в последний день месяца — попадает в киевский день, заголовки «Сегодня» / «Вчера» верны, время в строке и в редактировании — киевское, в логах нет ошибки `verifyKyivCalendar`
- [x] Результат проверки на iOS и Android записан в evidence; при ошибке `timeZone` — остановка и вопрос пользователю по запасному варианту из design

## Verification Commands

- `rtk yarn calendar:check`
- `rtk yarn lint`
- `rtk yarn tsc --noEmit`
- `rg -n "getFullYear\(|getMonth\(|getDate\(|setDate\(|setHours\(|toISOString\(\)\.slice|toLocaleDateString|toLocaleTimeString|toDateString" src/shared/utils/dateWindows.ts src/shared/utils/dateAndTime.ts src/features/operations`

## Acceptance Criteria

- `calendar:check` с «Окном ленты» — PASS при трёх TZ
- Lint и tsc — exit 0
- Последний `rg` — пусто
- Проверка на устройстве iOS и Android — PASS (подтверждение пользователя)

## Evidence Note

- Backend «Изменения design» перечитан 12.10.2026 — новых записей нет
- Код по scope готов; `useTransactionsDayGroups` — `DayGroup.date: DayKey`, «Сегодня» / «Вчера» от одного `getKyivToday()` на пересчёт
- `formatTime` сохраняет локаль `uk-UA`; `EditTransactionScreen` и лента — `ru-RU`, как было
- `useKyivCalendarSelfCheck` в `src/app/_layout.tsx`: `verifyKyivCalendar()` в `useEffect` под `__DEV__`, ошибка → `console.error('[kyivCalendar] self-check failed: …')`
- `calendar:check` с «Окном ленты» — exit 0, 10 сценариев PASS × 3 TZ × 2 режима
- `lint` exit 0 (3 warnings вне scope); `tsc --noEmit` exit 0; `rg` фазы — пусто
- Устройства iOS и Android с TZ `America/New_York`: пользователь подтвердил 12.10.2026 — всё ок (самопроверка без ошибок, дни, «Сегодня» / «Вчера», время и пикер — по Киеву)
- Hermes V1 поддерживает `Intl.DateTimeFormat` с `timeZone`; запасной вариант EET/EEST не нужен

## Handoff Note

- Лента, окна загрузки, редактирование и пикер работают по Киеву
- `DayGroup.date` — `DayKey`
- `formatTime` из `dateAndTime.ts` — киевское время для всех потребителей
- Hermes на устройствах подтверждён — фазы 03–04 используют утилиту без дополнительных проверок движка
