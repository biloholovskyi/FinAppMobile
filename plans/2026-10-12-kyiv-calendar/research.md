# Research — единый календарь Europe/Kyiv

Дата: 12.10.2026

## Источник модели

- `../fin-app-backend/docs/plans/kyiv-calendar-unification/design.md` — разделы «Три вида значений», «Чтение хранимых значений», «Клиенты»
- `../fin-app-backend/docs/plans/kyiv-calendar-unification/history.md`, «Изменения design» — на 12.10.2026 одна запись: исходная версия выдана, изменений нет
- Финальная сверка трёх проектов — фаза 09 backend-плана (`phase-09-cross-project-verification.md`)

## Поиск расхождений

Команда из задачи (`rg ... src --glob "!**/generated/**"`) — совпадения:

| Файл | Что найдено |
|------|-------------|
| `src/shared/utils/dateAndTime.ts` | `formatTime` — `toLocaleTimeString('uk-UA')` без `timeZone` |
| `src/shared/utils/dateWindows.ts` | граница окна — `setDate` / `setHours` по локальному времени |
| `src/features/operations/OperationsScreen/useTransactionsDayGroups.ts` | «сегодня» / «вчера» — `toISOString().slice` (UTC) и `setDate`; заголовок дня — `toLocaleDateString('ru-RU')` без `timeZone` |
| `src/features/operations/OperationsScreen/OperationsScreen.tsx` | текущий месяц — `toLocaleDateString('ru-RU')` без `timeZone` |
| `src/features/operations/EditTransactionScreen/EditTransactionScreen.tsx` | `formatTransactionTime` — `toLocale*String('ru-RU')` без `timeZone` |
| `src/features/dashboard/lib/aggregateExpenses.ts` | день, месяц, длина месяца — локальные геттеры и `new Date(y, m, d)` |
| `src/features/dashboard/DashboardScreen/useDashboardScreen.ts` | день и индекс месяца — локальные геттеры |
| `src/features/categorySpending/lib/selectMonthExpenses.ts` | фильтр месяца — локальные геттеры |
| `src/features/categorySpending/lib/parseMonthStr.ts` | ключ бюджета из локального месяца; фолбэк — локальный текущий месяц |
| `src/features/categorySpending/CategorySpendingScreen/useMonthNavigation.ts` | выбранный месяц — локальный `Date`, сдвиг через `new Date(y, m ± 1, 1)` |
| `src/features/categorySpending/CategorySpendingScreen/MonthSwitcher.tsx` | имя месяца и год — `getMonth` / `getFullYear` |
| `src/features/categorySpending/SpendingTransactionsSheet/lib/groupTransactionsByDay.ts` | ключ дня — локальные геттеры; заголовок — без `timeZone` |
| `src/features/categorySpending/SpendingTransactionsSheet/SheetHeader.tsx` | месяц — `toLocaleDateString('uk-UA')` без `timeZone` |

Найдено дополнительно (вне шаблона поиска):
- `useTransactionsDayGroups.ts:49` — группировка ленты по `tx.transactionTime.slice(0, 10)`, то есть по UTC-дню
- `EditTransactionScreen.tsx:25` — «сегодня» через `toDateString()` (локальный день)
- `EditTransactionScreen/DateTimePickerModal/DateTimePickerModal.tsx` — три `DateTimePicker` (Android date, Android time, iOS datetime) без `timeZoneName`: пикер показывает и выбирает время в TZ устройства

## Распространение выбранного месяца

`selectedMonth: Date` передаётся через:
- `CategorySpendingScreen/useMonthNavigation.ts` → `useCategorySpendingScreen.ts` → `useSpendingData.ts` → `lib/aggregateCategorySpending.ts` → `lib/selectMonthExpenses.ts`
- `CategorySpendingScreen.tsx` → `MonthSwitcher.tsx`
- `SpendingTransactionsSheet/useSpendingLeafData.ts` (`parseMonthStr(monthStr)`) → `useSpendingData.ts`, `lib/spendingLeaf.ts` (`filterLeafTransactions`) → `SpendingTransactionsSheet.tsx` → `SheetHeader.tsx`
- `monthStr` (`YYYY-MM-01T00:00:00.000Z`) — ключ запроса бюджета `QUERY_KEYS.budgets.month(monthStr)` и параметр маршрута `src/app/spending/[leafKey].tsx` (`normalizeMonthStr`)

## Хранимые дни и месяцы

- `nextPaymentDate`, `date` коммунальных, `budget.month` как поле ответа, `monthly_report.month`, `targetDate` — в `src/` вне `generated/` не используются
- Мобилка не отправляет календарные дни из форм; `transactionTime` — момент (`useEditTransactionForm.ts`, пикер → `toISOString()`)
- Сценарии «День из формы», «Legacy-день», «Месяц плана» сейчас без потребителей в UI

## Hermes и Intl

- React Native `0.86.3`, Hermes V1 (`node_modules/react-native/sdks/hermes-engine/version.properties`: `HERMES_V1_VERSION_NAME=250829098.0.17`)
- Официальный `facebook/hermes/doc/IntlAPIs.md`: на обеих платформах — `Intl.DateTimeFormat` (`format`, `resolvedOptions`, `supportedLocalesOf`), `Date.prototype.toLocaleString/DateString/TimeString`
- `Intl.DateTimeFormat.prototype.formatToParts` в документе не указан ни для одной платформы
- Опция `timeZone` в документе не описана — ни как поддерживаемая, ни как ограничение
- `Intl.NumberFormat.prototype.formatToParts` — только Android; `src/shared/utils/currency.ts` уже оборачивает его в `try/catch`
- Документ ссылается на ECMA-402 7-й редакции (2020) и может отставать от Hermes V1
- Вывод: поддержку `timeZone` и `formatToParts` статически подтвердить нельзя — нужна проверка на устройстве (iOS и Android)

## Node для проверки сценариев

- Node `v24.21.0`; type stripping импортирует `.ts` напрямую, но только с явным расширением в спецификаторе
- Алиас `@/` и импорты без расширения Node не разрешает
- `TZ` из переменной окружения shell на Windows Node не учитывает (проверено); присваивание `process.env.TZ` внутри процесса работает (`UTC`, `America/New_York` дают разные локальные полуночи)
- `tsconfig.json`: `moduleResolution: bundler`, `noEmit: true` (из `expo/tsconfig.base`), `paths` `@/*`

## Прочее

- Локали UI смешаны: лента и редактирование — `ru-RU`, шторка расходов — `uk-UA`
- `dateWindows.ts` уже принимает `now` параметром; зазор окна `WINDOW_BOUNDARY_GAP_MS = 1`
- `src/shared/constants/` — константы по файлам с реэкспортом из `index.ts`; константы часового пояса нет
- Тестового раннера нет; `scripts/` — `.mjs`-скрипты без зависимостей
- Версия: `package.json` и `app.json` — `1.11.0`, ветка `r-1.12.0`, в `CHANGELOG.md` секции `1.12.0` нет

## Открытые вопросы

- Поведение Hermes V1 с `timeZone` и `formatToParts` на iOS и Android — закрывается проверкой на устройстве в фазе 02
