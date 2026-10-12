# Reflect — единый календарь Europe/Kyiv (fin-app-mobile)

Дата: 12.10.2026. Материал для фазы 09 backend-плана `kyiv-calendar-unification` (`../fin-app-backend/docs/plans/kyiv-calendar-unification/phase-09-cross-project-verification.md`). Backend «Изменения design» на эту дату — только исходная запись, изменений нет.

## Соответствие design

Mobile [design.md](design.md) — выполнен полностью. Отклонения, внесённые в design по ходу:
- Служебная локаль разбора `en-GB` вместо `en-US` — 24-часовой вывод без опоры на `hourCycle` (фаза 01)
- Добавлены `makeDayKey`, `splitDayKey`, `makeMonthKey`, `getMonthKeyOfDay`, `getKyivMonthStart`, экспорт `KyivCalendarError` (фаза 01)
- `normalizeMonthStr` → `normalizeMonthParam`, возвращает `MonthKey`; `useSpendingData(month)` строит ключ бюджета сам (фаза 03)
- `KYIV_TIME_ZONE_LEGACY = 'Europe/Kiev'` и `getKyivTimeZone()` для старой tzdata; кэш ISO → `DayKey`; `KyivCalendarError` на невалидную дату; проверка правдоподобия фолбэка `format()` (фаза 05, по ревью)

Backend design, раздел «Клиенты»:

| Понятие backend design | Mobile |
|------------------------|--------|
| `getKyivToday` | `getKyivToday(now?)` |
| `getKyivMonthKey` | `getKyivMonthKey(input)`, `getKyivCurrentMonthKey(now?)` |
| `shiftMonthKey` | `shiftMonthKey(month, delta)` |
| `getKyivMonthRange` | `getKyivMonthRange(month)` — пока без потребителей в UI |
| `getKyivDayRange` | не реализован — потребителей в мобилке нет |
| `toDateInputValue` | `getKyivDayKey(input)` — форм с календарным днём в мобилке нет |
| `dateFrom` / `dateTo` месяца | киевская полночь 1-го .. полночь следующего месяца − 1 мс |
| Ключ бюджета | `toBudgetMonthKey` → `YYYY-MM-01T00:00:00.000Z` |
| Хранимый день | `formatStoredDay` — киевская дата момента |
| Хранимый месяц | `monthKeyFromStoredMonth` — `iso.slice(0, 7)` с проверкой |
| `Intl.DateTimeFormat` с `timeZone` | `getKyivTimeZone()` → `Europe/Kyiv` (фолбэк `Europe/Kiev`) |

## Сценарии (свежий прогон `rtk yarn calendar:check`, 12.10.2026)

Каждый сценарий прогнан при TZ процесса `UTC`, `America/New_York`, `Europe/Kyiv`, в двух режимах: нативный `formatToParts` и фолбэк `format()`. Факт одинаков во всех шести прогонах.

| Сценарий | Вход | Ожидание | Факт | UTC | New York | Kyiv |
|----------|------|----------|------|-----|----------|------|
| Начало месяца | `now = 2026-10-31T22:30:00.000Z` | `2026-11`, `2026-11-01` | `2026-11`, `2026-11-01` | PASS | PASS | PASS |
| Граница транзакции | `2026-09-30T21:30:00.000Z` | `2026-10`, `2026-10-01` | `2026-10`, `2026-10-01` | PASS | PASS | PASS |
| Диапазон месяца | `2026-10` | `2026-09-30T21:00:00.000Z` .. `2026-10-31T21:59:59.999Z` | совпадает | PASS | PASS | PASS |
| DST весна | `2026-03` | `2026-02-28T22:00:00.000Z` .. `2026-03-31T20:59:59.999Z` | совпадает | PASS | PASS | PASS |
| Ключ бюджета | `2026-10` | `2026-10-01T00:00:00.000Z` | совпадает | PASS | PASS | PASS |
| День из формы | `2026-10-05` | `2026-10-05T00:00:00.000Z`, `05.10.2026` | совпадает | PASS | PASS | PASS |
| Legacy-день | `2026-08-15T21:00:00.000Z` | `16.08.2026` | `16.08.2026` | PASS | PASS | PASS |
| Месяц плана | `2026-10-31T23:59:59.999Z` | `2026-10` | `2026-10` | PASS | PASS | PASS |
| Окно ленты | `now` из «Начало месяца» | окно 0 от `2026-09-21T21:00:00.000Z`; окно 1 `2026-09-11T21:00:00.000Z` .. `2026-09-21T20:59:59.999Z` | совпадает | PASS | PASS | PASS |
| Дни перехода DST | `2026-03-29`, `03-30`, `10-25`, `10-26` | `03-28T22:00Z`, `03-29T21:00Z`, `10-24T21:00Z`, `10-25T22:00Z` | совпадает | PASS | PASS | PASS |
| Граница года | `2026-12 +1`, `2026-01 −1`, `2026-12-31 +1`, дни `2028-02`, `2026-02` | `2027-01`, `2025-12`, `2027-01-01`, `29`, `28` | совпадает | PASS | PASS | PASS |
| Полночь как час 24 | подмена вывода движка, `2026-01-15T22:30:00.000Z` | день `16`, час `0` | совпадает | PASS | PASS | PASS |
| Невалидная дата | `'garbage'`, `2026-13-01` | `KyivCalendarError`, `null` | совпадает | PASS | PASS | PASS |
| Самопроверка | `verifyKyivCalendar()` | `{ ok: true }` | совпадает | PASS | PASS | PASS |

## Hermes на устройствах

- Hermes V1 (RN 0.86.3) поддерживает `Intl.DateTimeFormat` с `timeZone` на iOS и Android — подтверждено пользователем в фазе 02 (TZ устройства `America/New_York`): самопроверка без ошибок, дни, «Сегодня» / «Вчера», время, пикер — по Киеву
- Фазы 03 и 04 подтверждены на устройствах пользователем
- Официальный `IntlAPIs.md` не упоминает `timeZone` и `DateTimeFormat.formatToParts` — документ отстаёт от Hermes V1
- Не проверено на устройстве: путь `Europe/Kiev` (старая tzdata) и правки фазы 05

## Финальный поиск

`rg -n "getFullYear\(|getMonth\(|getDate\(|getDay\(|getHours\(|setDate\(|setMonth\(|setHours\(|getUTC|Date\.UTC|toISOString\(\)\.slice|toLocaleDateString|toLocaleTimeString|new Date\(\w+, " src --glob "!**/generated/**"` — 7 совпадений, все в утилите (`Date.UTC` / `getUTC*`):
- `src/shared/utils/kyivCalendar/dayKey.ts:50-51` — `shiftDayKey`
- `src/shared/utils/kyivCalendar/monthKey.ts:48-49,55` — `shiftMonthKey`, `getDaysInMonth`
- `src/shared/utils/kyivCalendar/kyivParts.ts:78,131` — `toWallMs`, `kyivMidnightToUtc`

`rg -n "Europe/Kyiv" src` — только `src/shared/constants/calendar.ts`.

## Изменённые файлы

Новые:
- `src/shared/constants/calendar.ts`
- `src/shared/utils/kyivCalendar/` — `kyivCalendar.types.ts`, `kyivParts.ts`, `kyivTimeZone.ts`, `dayKey.ts`, `monthKey.ts`, `kyivFormat.ts`, `kyivSelfCheck.ts`, `index.ts`
- `src/features/categorySpending/lib/normalizeMonthParam.ts`
- `scripts/check-kyiv-calendar.mjs`

Удалённые:
- `src/features/categorySpending/lib/parseMonthStr.ts`

Изменённые (код):
- `src/shared/constants/index.ts`, `src/shared/utils/dateWindows.ts`, `src/shared/utils/dateAndTime.ts`
- `src/app/_layout.tsx`, `src/app/spending/[leafKey].tsx`
- `src/features/operations/OperationsScreen/OperationsScreen.tsx`, `useTransactionsDayGroups.ts`
- `src/features/operations/EditTransactionScreen/EditTransactionScreen.tsx`, `DateTimePickerModal/DateTimePickerModal.tsx`
- `src/features/categorySpending/lib/selectMonthExpenses.ts`, `lib/spendingLeaf.ts`
- `src/features/categorySpending/CategorySpendingScreen/` — `CategorySpendingScreen.tsx`, `MonthSwitcher.tsx`, `useCategorySpendingScreen.ts`, `useMonthNavigation.ts`, `useSpendingData.ts`, `lib/aggregateCategorySpending.ts`
- `src/features/categorySpending/SpendingTransactionsSheet/` — `SheetHeader.tsx`, `SpendingTransactionsSheet.tsx`, `useSpendingLeafData.ts`, `useSpendingTransactionsSheet.ts`, `lib/groupTransactionsByDay.ts`
- `src/features/dashboard/lib/aggregateExpenses.ts`, `DashboardScreen/useDashboardScreen.ts`

Изменённые (конфигурация, документация, релиз):
- `package.json` (`calendar:check`, версия `1.12.0`), `app.json` (версия `1.12.0`), `CHANGELOG.md` (`1.12.0`, весь файл на английском)
- `AGENTS.md`, `ai/rules/projects/fin-app-mobile/architecture.md` (`## Dates`), `ai/rules/common/tooling.md`, `ai/rules/common/post-code-workflow.md`

## Уроки

- Документация Hermes по `Intl` устарела: поддержку нужно подтверждать на устройстве, а утилиту писать с проверяемым фолбэком
- Сценарии в Node с подменой `process.env.TZ` и удалением `formatToParts` дают быструю проверку обоих путей без тест-раннера; мутационная проверка показала, что сценарий «час 24» действительно ловит регрессию
- Шаблон поиска ловит ложные совпадения (`setMonth` как React-сеттер) — имена сеттеров подбираются под критерий
- Независимое ревью нашло реальные риски (старая tzdata, невалидная дата, стоимость на транзакцию), которых не было в design
- Процесс: удаление файлов — только через файловую систему; попытка `git rm` в фазе 03 была отклонена и нарушала `git-policy.md`
- Длинные bash-heredoc с кириллицей и кавычками ненадёжны — правки удобнее через скрипт-файл

## Техдолг

- Путь `Europe/Kiev` и правки фазы 05 не проверены на устройстве
- `getKyivDayRange` не реализован — добавить при первом потребителе дневного фильтра
- Смешанные локали UI: `ru-RU` (лента, редактирование, переключатель месяцев) и `uk-UA` (шторка, время)
- `MonthSwitcher` и `useDashboardScreen` держат имена месяцев массивами вместо `formatMonthKey`
- `architecture.md` — 292 строки при цели 250
- Из прошлого плана: hex-литералы и inline `style` в `MonthSwitcher`, `SheetHeader`; `expo-router` в `features/operations`
- Запись CHANGELOG шторки транзакций (план `2026-10-10-spending-transactions-sheet`, фаза 06) не добавлена — решение пользователя
