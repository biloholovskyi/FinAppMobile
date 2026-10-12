# Design — единый календарь Europe/Kyiv

Модель — `../fin-app-backend/docs/plans/kyiv-calendar-unification/design.md`. REST-контракт, Orval-клиенты и моменты (`transactionTime`, `createdAt`) не меняются; меняется только их календарная интерпретация.

## Принципы

- День, месяц, «сегодня», «текущий месяц» считаются в `KYIV_TIME_ZONE`; TZ устройства на результат не влияет
- Все календарные расчёты и всё форматирование дат для UI — только через `src/shared/utils/kyivCalendar/`
- Внутри утилиты арифметика дат — на `Date.UTC` и `getUTC*`; вне утилиты локальные геттеры, `setDate/setHours`, `toISOString().slice`, `toLocale*String` для дат запрещены
- Календарные значения передаются ключами-строками, а не локальными `Date`

## Константа

- `src/shared/constants/calendar.ts` — `KYIV_TIME_ZONE = 'Europe/Kyiv'` (`as const`, JSDoc), реэкспорт из `src/shared/constants/index.ts`
- `KYIV_TIME_ZONE_LEGACY = 'Europe/Kiev'` там же — прежнее имя зоны для tzdata старше 2022b
- Строка `'Europe/Kyiv'` в `src/` встречается только здесь

## Утилита `src/shared/utils/kyivCalendar/`

Типы (`kyivCalendar.types.ts`):
- `DayKey` — branded `string` формата `YYYY-MM-DD` (киевская дата)
- `MonthKey` — branded `string` формата `YYYY-MM` (киевский месяц)
- `IsoRange` — `{ dateFrom: string; dateTo: string }`, ISO с `Z`

| Файл | Функции | Контракт |
|------|---------|----------|
| `kyivParts.ts` | `getKyivParts(date)` | киевские `year, month (1-based), day, hour, minute, second` момента |
| `kyivParts.ts` | `KyivCalendarError` | ошибка разбора вывода `Intl` |
| `kyivParts.ts` | `kyivMidnightToUtc(year, month, day)` | момент киевской полуночи даты; смещение уточняется двумя итерациями, корректно в дни DST |
| `dayKey.ts` | `makeDayKey(year, month, day)`, `splitDayKey(day)` | сборка и разбор ключа |
| `dayKey.ts` | `getKyivDayKey(input)` | киевская дата момента (`Date` или ISO) |
| `dayKey.ts` | `getKyivToday(now = new Date())` | `DayKey` для `now` |
| `dayKey.ts` | `shiftDayKey(day, delta)` | сдвиг на `delta` календарных суток |
| `dayKey.ts` | `getKyivDayStart(day)` | `Date` киевской полуночи |
| `dayKey.ts` | `getDayOfMonth(day)` | число месяца |
| `dayKey.ts` | `toStoredDay(day)` | `YYYY-MM-DDT00:00:00.000Z` — формат отправки дня из формы |
| `monthKey.ts` | `makeMonthKey(year, month)` | сборка ключа |
| `monthKey.ts` | `getKyivMonthKey(input)` | киевский месяц момента |
| `monthKey.ts` | `getKyivCurrentMonthKey(now = new Date())` | текущий киевский месяц |
| `monthKey.ts` | `getMonthKeyOfDay(day)` | месяц календарной даты |
| `monthKey.ts` | `shiftMonthKey(month, delta)` | сдвиг на `delta` месяцев |
| `monthKey.ts` | `splitMonthKey(month)` | `{ year, month }` (1-based) |
| `monthKey.ts` | `getDaysInMonth(month)` | число дней месяца |
| `monthKey.ts` | `getKyivMonthStart(month)` | `Date` киевской полуночи 1-го числа |
| `monthKey.ts` | `getKyivMonthRange(month)` | `dateFrom` = киевская полночь 1-го, `dateTo` = киевская полночь следующего месяца − 1 мс |
| `monthKey.ts` | `toBudgetMonthKey(month)` | `YYYY-MM-01T00:00:00.000Z` |
| `monthKey.ts` | `monthKeyFromStoredMonth(iso)` | `iso.slice(0, 7)` с проверкой формата; невалидный вход → `null` |
| `kyivFormat.ts` | `formatKyivMoment(input, locale, options)` | `Intl.DateTimeFormat` с `timeZone: KYIV_TIME_ZONE` |
| `kyivFormat.ts` | `formatKyivTime(input, locale)` | `HH:mm` по Киеву |
| `kyivFormat.ts` | `formatDayKey(day, locale, options)` | форматирует `getKyivDayStart(day)` по Киеву |
| `kyivFormat.ts` | `formatMonthKey(month, locale, options)` | форматирует киевскую полночь 1-го числа по Киеву |
| `kyivFormat.ts` | `formatStoredDay(iso, locale)` | киевская дата хранимого дня (`00:00Z` и legacy `21:00Z`) |
| `kyivTimeZone.ts` | `getKyivTimeZone()` | имя зоны, которое понимает `Intl` устройства: `KYIV_TIME_ZONE`, иначе `KYIV_TIME_ZONE_LEGACY`; определяется один раз |
| `kyivSelfCheck.ts` | `verifyKyivCalendar()` | сверяет два известных момента (зима UTC+2, лето UTC+3); `{ ok: true } \| { ok: false; error: string }` |
| `index.ts` | — | реэкспорт публичных функций и типов |

- Экземпляры `Intl.DateTimeFormat` кэшируются на уровне модуля по ключу `locale + options`
- `getKyivDayKey` кэширует ISO → `DayKey` (до 10 000 записей); `getKyivMonthKey` выводится из `DayKey`
- Невалидный момент → `KyivCalendarError` с исходным входом; фолбэк `format()` отклоняет результат с расхождением больше 14 ч от UTC
- `toStoredDay`, `formatStoredDay` и `getKyivMonthRange` пока без потребителей в UI — нужны для общего контракта и сценариев фазы 09 backend
- `monthKeyFromStoredMonth` используется для параметра маршрута шторки и будущих `budget.month`, `monthly_report.month`, `targetDate`; `targetDate = 2026-10-31T23:59:59.999Z` → `2026-10`, в киевское время не переводится

## Hermes

- `getKyivParts` берёт части из `formatToParts`, если метод есть и вернул `year/month/day/hour/minute/second`
- Иначе разбирает `format()` локали `en-GB` с числовыми опциями и `hourCycle: 'h23'` (`DD/MM/YYYY, HH:mm:ss`; `en-GB` остаётся 24-часовой, даже если движок проигнорирует `hourCycle`) строгим регулярным выражением; несовпадение формата → `KyivCalendarError` (наследник `Error`, в `kyivParts.ts`) с исходной строкой в сообщении, не тихий фолбэк
- `verifyKyivCalendar()` вызывается один раз в `__DEV__` из корневого `src/app/_layout.tsx`; ошибка → `console.error` с причиной
- Проверка на устройстве — в фазе 02 (iOS и Android, TZ устройства `America/New_York`)
- Если на устройстве `timeZone` не поддерживается — фаза останавливается; запасной вариант на решение пользователя: смещение по правилу EET/EEST (последнее воскресенье марта и октября, 01:00 UTC) внутри `kyivParts.ts`

## Применение

| Место | Целевое поведение |
|-------|-------------------|
| `shared/utils/dateAndTime.ts` | `formatTime` делегирует `formatKyivTime`; `formatDayTotal` без изменений |
| `shared/utils/dateWindows.ts` | граница окна = `getKyivDayStart(shiftDayKey(getKyivToday(now), -daysBack))`; зазор 1 мс и открытое окно 0 сохраняются |
| `operations/OperationsScreen/useTransactionsDayGroups.ts` | ключ группы — `getKyivDayKey(transactionTime)`; «Сегодня» / «Вчера» — `getKyivToday()` и `shiftDayKey(today, -1)`; заголовок — `formatDayKey` |
| `operations/OperationsScreen/OperationsScreen.tsx` | месяц в шапке — `formatMonthKey(getKyivCurrentMonthKey())` |
| `operations/EditTransactionScreen/EditTransactionScreen.tsx` | «Сегодня» — сравнение `DayKey`; дата и время — `formatKyivMoment` / `formatKyivTime` |
| `operations/EditTransactionScreen/DateTimePickerModal/DateTimePickerModal.tsx` | все три `DateTimePicker` с `timeZoneName={getKyivTimeZone()}` |
| `categorySpending/CategorySpendingScreen/useMonthNavigation.ts` | состояние — `MonthKey` (старт `getKyivCurrentMonthKey()`), сдвиг `shiftMonthKey`; `monthStr = toBudgetMonthKey(month)`; `isNextDisabled` — `month >= getKyivCurrentMonthKey()` |
| `categorySpending/CategorySpendingScreen/MonthSwitcher.tsx` | проп `month: MonthKey`; имя и год — из `splitMonthKey` |
| `categorySpending/lib/parseMonthStr.ts` | удаляется; параметр маршрута — `normalizeMonthParam(raw)` в `lib/normalizeMonthParam.ts`: `monthKeyFromStoredMonth(raw) ?? getKyivCurrentMonthKey()`, результат — `MonthKey` |
| `categorySpending/lib/selectMonthExpenses.ts` | фильтр — `getKyivMonthKey(transactionTime) === month` |
| `useSpendingData`, `aggregateCategorySpending`, `spendingLeaf`, `useSpendingLeafData`, `useCategorySpendingScreen`, `CategorySpendingScreen`, `SpendingTransactionsSheet` | `selectedMonth: Date` → `month: MonthKey`; `useSpendingData(month)` сам строит ключ бюджета `toBudgetMonthKey(month)`; шторка получает `month: MonthKey` |
| `src/app/spending/[leafKey].tsx` | параметр `month` остаётся строкой `YYYY-MM-01T00:00:00.000Z`; нормализация через `normalizeMonthParam` |
| `categorySpending/SpendingTransactionsSheet/lib/groupTransactionsByDay.ts` | ключ — `getKyivDayKey`; заголовок — `formatDayKey` |
| `categorySpending/SpendingTransactionsSheet/SheetHeader.tsx` | проп `month: MonthKey`; подпись — `formatMonthKey` |
| `dashboard/lib/aggregateExpenses.ts` | вход `today: DayKey`; месяц и день транзакции — `getKyivDayKey`; прошлый месяц — `shiftMonthKey(month, -1)`; длины — `getDaysInMonth` |
| `dashboard/DashboardScreen/useDashboardScreen.ts` | `today = getKyivToday()`; день и индекс месяца — из `DayKey` / `MonthKey` |

- Локали остаются как есть (`ru-RU` в ленте и редактировании, `uk-UA` в шторке)
- `useEditTransactionForm` и отправка `transactionTime` (`toISOString()` момента) не меняются

## Проверка сценариев

- `scripts/check-kyiv-calendar.mjs`, без зависимостей; `package.json` → `"calendar:check": "node scripts/check-kyiv-calendar.mjs"`
- Скрипт регистрирует `module.registerHooks` с резолвером: `@/` → `src/`, спецификатор без расширения → `.ts`, затем `/index.ts`; `.ts` исполняется type stripping Node 24
- Утилита и `dateWindows.ts` пишутся только на стираемом синтаксисе TypeScript (без `enum`, `namespace`, parameter properties) и импортируют константы по точному пути файла (`@/shared/constants/calendar`, `@/shared/constants/pagination`), не через `index.ts`
- Сценарии прогоняются в двух режимах получения частей — нативный `formatToParts` и фолбэк `format()` (метод удаляется с прототипа), — и в каждом для TZ `UTC`, `America/New_York`, `Europe/Kyiv` (`process.env.TZ`); результат — таблица PASS/FAIL, `exit 1` при любом FAIL

| Сценарий | Вызов | Ожидание |
|----------|-------|----------|
| Начало месяца | `getKyivCurrentMonthKey(now)`, `getKyivToday(now)`, `now = 2026-10-31T22:30:00.000Z` | `2026-11`, `2026-11-01` |
| Граница транзакции | `getKyivMonthKey(t)`, `getKyivDayKey(t)`, `t = 2026-09-30T21:30:00.000Z` | `2026-10`, `2026-10-01` |
| Диапазон месяца | `getKyivMonthRange('2026-10')` | `2026-09-30T21:00:00.000Z` .. `2026-10-31T21:59:59.999Z` |
| DST весна | `getKyivMonthRange('2026-03')` | `2026-02-28T22:00:00.000Z` .. `2026-03-31T20:59:59.999Z` |
| Ключ бюджета | `toBudgetMonthKey('2026-10')` | `2026-10-01T00:00:00.000Z` |
| День из формы | `toStoredDay('2026-10-05')`, `formatStoredDay(результат, 'uk-UA')` | `2026-10-05T00:00:00.000Z`, `05.10.2026` |
| Legacy-день | `formatStoredDay('2026-08-15T21:00:00.000Z', 'uk-UA')` | `16.08.2026` |
| Месяц плана | `monthKeyFromStoredMonth('2026-10-31T23:59:59.999Z')` | `2026-10` |
| Окно ленты | `getTransactionsDateWindow(0, now)`, `getTransactionsDateWindow(1, now)` при `now` из «Начало месяца» | `dateFrom` — киевские полуночи; `dateTo` окна 1 = `dateFrom` окна 0 − 1 мс; окно 0 `dateFrom = 2026-09-21T21:00:00.000Z`; окно 1 `2026-09-11T21:00:00.000Z` .. `2026-09-21T20:59:59.999Z` |
| Самопроверка | `verifyKyivCalendar()` | `{ ok: true }` |

## Критерий готовности

- Поиск из задачи находит совпадения только в `src/shared/utils/kyivCalendar/`
- `rg -n "Europe/Kyiv" src` — только `src/shared/constants/calendar.ts`
- `rtk yarn calendar:check` — все сценарии PASS при всех трёх TZ
- На устройстве iOS и Android с TZ `America/New_York` лента, шторка, переключатель месяцев и дашборд показывают киевские дни и месяцы

## Доставка

- Только JS: `timeZoneName` — существующий проп нативного модуля `@react-native-community/datetimepicker` 9.1.0; OTA, `runtimeVersion` не меняется
