# Phase 2 — Хук бесконечной подгрузки

Статус: done
Модель: BALANCED
Правила: `ai/rules/projects/fin-app-mobile/state-management.md`, `ai/rules/common/react.md`

## Цель

Собрать фид транзакций на `useInfiniteQuery` с оконной пагинацией и точным стоп-условием по общему количеству.

## Заметки по реализации

- `useTransactionsFeed.ts` и `useTransactionsDayGroups.ts` пишутся с нуля.
- `useOperationsScreen.ts` переписывается в композицию: текущая логика запроса и группировки уезжает в новые хуки.
- Лимит хука — 50 строк; при выходе за него дробить на под-хуки, а не растягивать файл.
- Ключ `QUERY_KEYS.transactions.all` не переименовывается и не сужается: на нём висят данные дашборда, трат по категориям и экрана редактирования.

## Область

- `src/features/operations/OperationsScreen/useTransactionsFeed.ts` — новый.
- `src/features/operations/OperationsScreen/useTransactionsDayGroups.ts` — новый.
- `src/features/operations/OperationsScreen/useOperationsScreen.ts` — композиция.

## Чек-лист

- [x] `useInfiniteQuery` в объектном синтаксисе v5 с `initialPageParam` и `getNextPageParam`
- [x] Страницы внутри окна добираются, пока `page < totalPages`
- [x] Глобальный счётчик запрашивается параллельно, `hasMore` = `loaded < total`
- [x] Склейка страниц дедуплицирует записи по `id`
- [x] Реализована автодозагрузка, пока видимых после фильтра элементов меньше `TRANSACTIONS_MIN_VISIBLE_ITEMS_COUNT` и список не исчерпан
- [x] Реализован предохранитель по подряд идущим пустым окнам, стоп-условие не полагается только на `total`
- [x] Pull-to-refresh сбрасывает фид до первого окна и обновляет счётчик
- [x] Удаление транзакции инвалидирует префикс `['transactions']`
- [x] Каждый хук ≤ 50 строк, `any` отсутствует
- [x] Суммы остаются в копейках до форматирования, деление на 100 только в утилитах отображения

## Верификация

- `rtk yarn lint` && `rtk yarn tsc --noEmit`
- Ручные сценарии в `rtk npx expo start`: фильтр «Переводы» на редких данных догружается сам, без скролла; пустая база даёт конец списка сразу; докрутка до конца не задваивает записи

## Приёмка

При пустой базе экран сразу показывает конец списка; при непустой — количество отрисованных элементов сходится с `total` после докрутки. Ни один фильтр не оставляет экран пустым при `hasMore`.

## Evidence

- Чистые функции фида прогнаны на фикстурах: `page < totalPages` даёт следующую страницу того же окна; последняя страница и пустое окно переводят на следующее окно; предохранитель молчит на 11 пустых окнах подряд и гасит фид ровно на 12-м; склейка отбрасывает дубликат `id` с сохранением порядка; `trimFeedToFirstPage` оставляет одну страницу и один `pageParam`, на `undefined` не падает.
- Длина хуков: `useTransactionsFeed` 44, `useDeleteTransactionModal` 31, `useOperationsScreen` 26, `useTransactionsDayGroups` 21 — все под лимитом 50. `any` в новых файлах нет.
- Гейты: `rtk yarn lint` — 0 ошибок (те же 2 предупреждения в `useDashboardScreen.ts`); `rtk yarn tsc --noEmit` — зелёный, `--listFiles` подтверждает, что новые модули попадают в компиляцию.
- Ручные сценарии на устройстве не прогонялись — фаза сдаётся на автоматических гейтах и прогоне чистых функций.

## Handoff

- Хук отдаёт `grouped`, `hasMore`, `loadMore`, `isLoadingMore`, `refresh`, `isRefreshing` — фазе 3 остаётся подключить `onEndReached` и футер.
- Отклонение: сверх плановых двух файлов добавлены `transactionsFeed.ts` (чистые функции и запросы) и `useDeleteTransactionModal.ts` — иначе `useOperationsScreen` не влезал в 50 строк.
- Отклонение: в `OperationsScreen.tsx` переименованы две строки (`refetch`/`isRefetching` → `refresh`/`isRefreshing`), иначе typecheck падал. Файл в основном правится фазой 3.
- Pull-to-refresh реализован как обрезка кэша до первой страницы плюс `refetch`, а не `resetQueries`: иначе экран показал бы полноэкранный лоадер вместо `RefreshControl`.
- `hasMore` держится истинным, пока счётчик не загружен, — ложный «конец списка» на старте невозможен.
- Автодозагрузка живёт в `useOperationsScreen`, потому что число видимых строк известно только после клиентского фильтра.
- `visibleCount` отдаёт `useTransactionsDayGroups` вместе с секциями — отдельный проход по списку не нужен.
