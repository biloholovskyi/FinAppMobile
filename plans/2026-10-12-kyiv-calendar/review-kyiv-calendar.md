# Code Review: Kyiv calendar unification (fin-app-mobile)
Date: 2026-10-12

Ревьюер: `code-reviewer` (отдельный запуск). Гейты взяты у исполнителя: lint exit 0, tsc exit 0, calendar:check exit 0; проверки на устройствах iOS и Android (TZ `America/New_York`) подтверждены пользователем. Критерий поиска выполняется: совпадения только в `src/shared/utils/kyivCalendar/`, `Europe/Kyiv` — только `src/shared/constants/calendar.ts:2`.

## 🔴 Critical Issues

Нет. Проверено вручную:
- `kyivMidnightToUtc` (`kyivParts.ts:113-117`) верен в дни перехода 2026-03-29 и 2026-10-25: переход в Киеве в 03:00/04:00 местного, полночь не пропускается и не дублируется
- Нормализация часа `24` (`kyivParts.ts:59`) не трогает день
- Отбрасывание миллисекунд в `getKyivOffsetMs` (`kyivParts.ts:106`) верно и для отрицательных меток

## 🟡 Warnings

- W1 — `Europe/Kyiv` есть только в tzdata 2022b+. На устройствах со старой tz-базой Hermes `Intl` может бросить `RangeError: Invalid time zone` на первом `getKyivParts`; пикер с `timeZoneName` может молча уйти в GMT. Самопроверка только в `__DEV__`. Файлы: `src/shared/constants/calendar.ts:2`, `kyivParts.ts:45`, `DateTimePickerModal.tsx:37,55,82`
- W2 — невалидный ISO (`new Date('garbage')`) даёт `RangeError: Invalid time value` из `Intl`, не `KyivCalendarError`, без входа в сообщении; один битый `transactionTime` роняет ленту, дашборд, расходы и шторку. Файлы: `kyivParts.ts:85-99`
- W3 — стоимость на транзакцию: `getKyivDayKey` вызывает `formatToParts` на каждую запись, `aggregateExpenses` пересчитывается на каждый рендер `useDashboardScreen` без `useMemo`; при тысячах транзакций — сотни мс на рендер (оценка). Файлы: `aggregateExpenses.ts:51-53`, `useDashboardScreen.ts:36-37`, `selectMonthExpenses.ts:31`
- W4 — «Сегодня» / «Вчера» в ленте считаются внутри `useMemo([transactions, filter])` и устаревают после полуночи по Киеву без нового запроса. Поведение было и раньше. Файл: `useTransactionsDayGroups.ts:44,63`
- W5 — фолбэк `format()` предполагает порядок `en-GB`; если Hermes молча подставит другую локаль (`M/D/YYYY`), даты с днём ≤ 12 переставятся без ошибки. Файл: `kyivParts.ts:33,74-82`

## 🔵 Improvements

- I1 — `calendar:check`: добавить дни перехода DST (`getKyivDayStart` 2026-03-29 и 2026-10-25), границу года (`shiftMonthKey('2026-12', 1)`, `shiftDayKey('2026-12-31', 1)`, `getDaysInMonth('2028-02')`), невалидный ISO, путь `hour: '24'`; сравнение через `JSON.stringify` зависит от порядка ключей; нет проверки версии Node для `registerHooks`
- I2 — шапка месяца в `OperationsScreen.tsx` (~129) форматируется на каждый рендер; `useMemo` с ключом месяца
- I3 — `monthKeyFromStoredMonth` (`monthKey.ts:88-91`): `Number()` превращает год `0000` в `"0-10"`; собирать ключ из строк `match[1]`, `match[2]`
- I4 — сравнение строк `MonthKey` (`useMonthNavigation.ts:39`) корректно, но инвариант лучше держать в `compareMonthKeys`; `monthStr` выводится дважды (`useMonthNavigation`, `useSpendingData`)
- I5 — `getKyivDayRange` и `toDateInputValue` из backend design не реализованы; `getKyivDayKey` покрывает второе
- I6 — `toMoment`, `padDatePart` логичнее в отдельном внутреннем файле

## ✅ What's done well

- Направление FSD соблюдено; `kyivCalendar` импортирует только `@/shared/constants/calendar` по точному пути, циклов нет; `expo-router` в новом коде не появился
- Нет побочных эффектов при импорте: форматтер частей ленивый, кэш форматтеров — `Map`
- Кэш `Intl` по `locale|options`, `timeZone` принудителен
- `Date.UTC` / `getUTC*` только в утилите; календарь передаётся ключами
- `dateWindows.ts` сохраняет зазор 1 мс и открытое окно 0; `shiftDayKey` + `getKyivDayStart` безопасны при DST
- Семантика хранения совпадает с backend design: месяц — из UTC-строки, ключ бюджета, legacy `21:00Z`, нормализация параметра маршрута
- Громкий `KyivCalendarError` на неожиданный формат и самопроверка в dev

## Top 3 priorities to fix

1. Устойчивость `Europe/Kyiv` на старой tzdata (W1)
2. Обработка невалидной даты в `getKyivParts` (W2)
3. Стоимость на транзакцию: `useMemo` дашборда и кэш ISO → `DayKey` (W3); попутно W4 и W5

## Resolution

Исправления — основной агент, фаза 05, 12.10.2026:

- W1 — исправлено: `KYIV_TIME_ZONE_LEGACY = 'Europe/Kiev'` в `src/shared/constants/calendar.ts`; `getKyivTimeZone()` (`kyivTimeZone.ts`) один раз пробует основное имя и при `RangeError` берёт прежнее; используется в `kyivParts`, `kyivFormat` и `timeZoneName` пикера. На устройстве со старой tzdata не проверено — такого устройства нет
- W2 — исправлено: `getKyivParts` бросает `KyivCalendarError` с исходным входом. Решение: вызывающие строки не пропускают — `transactionTime` из типизированного API, битое значение считается неожиданной ошибкой (`patterns.md`: unexpected → throw)
- W3 — исправлено: `useMemo` для `aggregateExpenses`; кэш ISO → `DayKey` в `getKyivDayKey` (до 10 000 записей, затем сброс); `getKyivMonthKey` выводится из кэшированного `DayKey`
- W4 — исправлено: группировка ленты мемоизирована отдельно, подписи пересчитываются при смене киевского «сегодня» на любом рендере
- W5 — исправлено: фолбэк `format()` отклоняет результат, если разобранное время отличается от UTC больше чем на 14 ч (`KyivCalendarError`)
- I1 — исправлено: сценарии «Дни перехода DST», «Граница года», «Полночь как час 24» (подмена вывода движка; мутационная проверка — без `% 24` сценарий падает), «Невалидная дата»; сравнение без зависимости от порядка ключей; проверка версии Node
- I2 — исправлено: шапка месяца в `OperationsScreen` — `useMemo` по ключу месяца
- I3 — исправлено: `monthKeyFromStoredMonth` собирает ключ из совпавших строк
- I4 — отклонено: сравнение `MonthKey` строками корректно для формата `YYYY-MM`, описано в JSDoc типа; двойной вывод `monthStr` дешёв и разделяет ответственность навигации и данных
- I5 — отклонено: `getKyivDayRange` без потребителей в мобилке (YAGNI); `toDateInputValue` = `getKyivDayKey`
- I6 — отклонено: внутренние помощники не экспортируются из `index.ts`, отдельный файл не нужен

Повторные гейты: lint exit 0, tsc exit 0, calendar:check exit 0 (14 сценариев × 3 TZ × 2 режима), agents:check --strict exit 0; поиск из задачи — только `src/shared/utils/kyivCalendar/`; `Europe/Kyiv` — только `src/shared/constants/calendar.ts`.
