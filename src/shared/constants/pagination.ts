/** Глубина первого окна загрузки транзакций в днях. */
export const TRANSACTIONS_INITIAL_WINDOW_DAYS = 40

/** Глубина каждого следующего окна в днях. */
export const TRANSACTIONS_NEXT_WINDOW_DAYS = 10

/** Размер страницы внутри окна; верхний предел, который принимает бэкенд. */
export const TRANSACTIONS_WINDOW_PAGE_LIMIT = 500

/** Размер страницы запроса, который добывает только глобальный `pagination.total`. */
export const TRANSACTIONS_TOTAL_PROBE_LIMIT = 1

/** Сколько подряд пустых окон допускается до принудительной остановки фида. */
export const TRANSACTIONS_MAX_EMPTY_WINDOWS_COUNT = 12

/** Минимум видимых после фильтра строк, до которого фид догружается сам. */
export const TRANSACTIONS_MIN_VISIBLE_ITEMS_COUNT = 15

/** Доля высоты списка от конца, на которой срабатывает `onEndReached`. */
export const TRANSACTIONS_END_REACHED_THRESHOLD = 0.4

/** Количество скелетон-строк в футере догрузки. */
export const TRANSACTIONS_SKELETON_ROWS_COUNT = 3
