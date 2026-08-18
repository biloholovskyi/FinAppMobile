# Phase 1 — Кодогенерация Orval и слой данных

Статус: done
Модель: BALANCED
Правила: `ai/rules/projects/fin-app-mobile/state-management.md`

## Цель

Получить типизированный доступ к пагинированному эндпоинту транзакций и чистые примитивы оконной математики.

## Заметки по реализации

- `dateWindows.ts` и `normalizeTransactionsPage.ts` пишутся с нуля — аналогов в проекте нет.
- `queryKeys.ts` патчится: префикс `['transactions']` сохраняется как есть, добавляются ветки `feed` и `total`.
- Имя union-типа ответа заранее неизвестно — фиксируется по факту генерации.
- Регенерация затрагивает весь каталог generated, а не только `wallets`: контракт разъехался и по другим тегам. Сначала генерация и прогон typecheck, затем оценка регрессий, и только потом новый код задачи — иначе непонятно, чьё падение разбираем.

## Область

- `src/shared/api/generated/**` — перегенерировано из `../fin-app-backend/docs/openapi.json`, включая новые теги.
- Файлы-потребители generated за пределами транзакций — правки только если регенерация их сломала.
- `src/shared/constants/pagination.ts`, `src/shared/constants/index.ts` — новые.
- `src/shared/constants/queryKeys.ts` — ключи `transactions.feed(windowIndex?)` и `transactions.total`.
- `src/shared/utils/dateWindows.ts` — новый.
- `src/entities/transaction/lib/normalizeTransactionsPage.ts` + экспорт из `src/entities/transaction/index.ts` — новые.

## Чек-лист

- [x] `rtk yarn api:generate` выполнен, в `wallets.ts` появились параметры `page`/`limit`/`dateFrom`/`dateTo`
- [x] Просмотрен полный diff `src/shared/api/generated`, а не только каталог `wallets`
- [x] `rtk yarn tsc --noEmit` прогнан сразу после генерации; поломки в чужом коде разобраны до написания нового
- [x] По каждой регрессии принято решение: починить сейчас или вынести из области с записью в `history.md`
- [x] Зафиксировано фактическое имя union-типа ответа и типа параметров из generated
- [x] Константы окон и лимитов вынесены с JSDoc, ре-экспорт из `constants/index.ts`
- [x] Границы окон не пересекаются: `dateTo` окна N+1 строго меньше `dateFrom` окна N
- [x] Окно 0 без `dateTo`
- [x] Адаптер сужает union и дефолтит `data`/`pagination` без `any`

## Верификация

- `rtk yarn lint` && `rtk yarn tsc --noEmit`

## Приёмка

Типы параметров и пагинации импортируются из generated, рендер-тип `Transaction` не дублирует generated-модель, typecheck зелёный по всему проекту, а не только по изменённым файлам.

## Evidence

- `rtk yarn api:generate` (orval 7.9.0): 25 новых файлов, изменены только `models/index.ts` и `wallets/wallets.ts`, удалённых файлов нет.
- Регрессий нет: `rtk yarn tsc --noEmit` зелёный и до генерации, и сразу после неё.
- Фактические имена из generated: `WalletControllerGetAllTransactionsParams` (`page`, `limit`, `dateFrom`, `dateTo`), union ответа `WalletControllerGetAllTransactions200 = WalletTransactionModel[] | PaginatedWalletTransactionsModel`, `PaginationModel { page, limit, total, totalPages }`.
- Границы окон проверены прогоном `getTransactionsDateWindow` на фиксированном `now`: окно 0 без `dateTo`, зазор ровно 1 мс, `dateFrom` строго убывает, перекрытий нет.
- Гейты: `rtk yarn lint` — 0 ошибок (2 предупреждения о неиспользуемых переменных в `useDashboardScreen.ts`, существовали до фазы); `rtk yarn tsc --noEmit` — зелёный.

## Handoff

- Параметры запроса берутся из `WalletControllerGetAllTransactionsParams`, ответ сужается через `normalizeTransactionsPage` → `{ items, total, totalPages }`.
- `getTransactionsDateWindow(windowIndex, now?)` отдаёт `{ dateFrom, dateTo? }`; `now` опционален и нужен только для детерминированной проверки.
- Отклонение от плана: `QUERY_KEYS.transactions.feed` — плоский кортеж `['transactions', 'feed']`, а не функция от `windowIndex`. У `useInfiniteQuery` окно живёт в `pageParam`, ключ на все страницы один.
- Генерация сменила `TError` хука транзакций с `unknown` на `void` — потребителей у хука пока нет, влияния нет.
- Контрактный разрыв (`wallet`/`category`/`subCategory` вне OpenAPI) локализован в одном приведении внутри `normalizeTransactionsPage.ts`.
