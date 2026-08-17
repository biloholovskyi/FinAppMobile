# Design — целевое состояние

## Слой данных

- Оконная математика в `src/shared/utils/dateWindows.ts` — чистые функции, возвращающие ISO-границы окна по его индексу. Окно 0: `dateFrom = начало дня (сегодня − 40 дней)`, `dateTo` отсутствует, чтобы попадали транзакции с будущей датой. Окно N ≥ 1: `dateTo` = граница предыдущего окна минус 1 мс, `dateFrom` = `dateTo − 10 дней`.
- Адаптер ответа в `src/entities/transaction/lib/normalizeTransactionsPage.ts` — принимает union-ответ, отдаёт `{ items: Transaction[]; total: number; totalPages: number }`, дефолтит отсутствующие поля.
- Хук фида `src/features/operations/OperationsScreen/useTransactionsFeed.ts` на `useInfiniteQuery`. `pageParam` — `{ windowIndex, page }`. `getNextPageParam`: пока `page < totalPages` текущего окна — следующая страница того же окна, иначе первая страница следующего окна.
- Глобальный счётчик — отдельный `useQuery` с `page: 1, limit: 1` без дат, ключ `QUERY_KEYS.transactions.total`. Идёт параллельно фиду, не создавая водопада.
- `hasMore` вычисляется в хуке как `loadedCount < total`, а не берётся из `hasNextPage`. Догрузка вызывается только при `hasMore`. Защитный предохранитель: подряд идущие пустые окна сверх `TRANSACTIONS_MAX_EMPTY_WINDOWS_COUNT` останавливают фид, если `total` разошёлся с реальностью.
- Страницы склеиваются с дедупликацией по `id`. Без неё повтор записи задваивает ключ в `SectionList` и перегоняет `loadedCount` через `total`, давая ложный конец списка.
- Автодозагрузка до заполнения экрана: пока видимых после фильтра элементов меньше `TRANSACTIONS_MIN_VISIBLE_ITEMS_COUNT` и список не исчерпан, следующее окно запрашивается само, не дожидаясь `onEndReached`. Без этого при фильтре «Доходы» или «Переводы» окно может дать ноль видимых строк: скроллить нечего, событие не приходит, фид встаёт. Тот же эффект на первом рендере, когда в 40 днях мало записей.
- Группировка по дням и клиентский фильтр по типу выносятся в `useTransactionsDayGroups.ts`, работают поверх плоского списка всех загруженных страниц.
- `useOperationsScreen.ts` остаётся композицией: фид, группы, состояние модалки удаления.

## Кэш и инвалидация

- `QUERY_KEYS.transactions.all` = `['transactions']` остаётся без изменений: это одновременно префикс инвалидации и живой ключ данных дашборда, экрана трат по категориям и экрана редактирования. Добавляются ветки `feed` и `total` под тем же префиксом.
- Цена инвалидации по префиксу принимается осознанно: после создания, правки или удаления транзакции перезапрашивается полный непагинированный список для трёх остальных экранов плюс все загруженные страницы фида. Точечная инвалидация в этой задаче не вводится — она требует перевода тех экранов на пагинированный контракт и выходит за область.
- Pull-to-refresh сбрасывает фид до первого окна и перезапрашивает счётчик, а не рефетчит все загруженные страницы.

## UI

- Футер `src/features/operations/OperationsScreen/OperationsFeedFooter/OperationsFeedFooter.tsx` рендерит одно из трёх: догрузка, конец списка, ничего.
- Скелетон-строка `SkeletonRow.tsx` внутри той же папки, пульсация на Reanimated v4 (`useSharedValue` + `withRepeat`), анимированный стиль — единственное допустимое место для `style`.
- Адаптация дизайна под RN: conic-gradient кольцо заменяется на `ActivityIndicator` цвета `#4F9EFF`; «дышащие» точки опускаются как дублирующий индикатор при наличии скелетонов; бегущий градиент скелетона заменяется пульсацией прозрачности — тот же приём, что `glowPulse` в дизайн-системе, но без замера ширины блока в рантайме. Подпись и скелетоны сохраняются.
- `SectionList` получает `onEndReached`, `onEndReachedThreshold`, `ListFooterComponent`.

## Константы

`src/shared/constants/pagination.ts` с JSDoc на каждую, ре-экспорт через новый `src/shared/constants/index.ts`:

`TRANSACTIONS_INITIAL_WINDOW_DAYS = 40`, `TRANSACTIONS_NEXT_WINDOW_DAYS = 10`, `TRANSACTIONS_WINDOW_PAGE_LIMIT = 500`, `TRANSACTIONS_TOTAL_PROBE_LIMIT = 1`, `TRANSACTIONS_MAX_EMPTY_WINDOWS_COUNT`, `TRANSACTIONS_MIN_VISIBLE_ITEMS_COUNT`, `TRANSACTIONS_END_REACHED_THRESHOLD`, `TRANSACTIONS_SKELETON_ROWS_COUNT`.
