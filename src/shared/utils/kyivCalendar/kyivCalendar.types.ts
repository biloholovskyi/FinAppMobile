/** Киевская календарная дата `YYYY-MM-DD`. */
export type DayKey = string & { readonly __brand: 'DayKey' }

/** Киевский календарный месяц `YYYY-MM`. */
export type MonthKey = string & { readonly __brand: 'MonthKey' }

/** Диапазон моментов для REST-фильтров: ISO-строки с `Z`, обе границы включительно. */
export type IsoRange = { dateFrom: string; dateTo: string }

/** Момент времени: `Date` или ISO-строка. */
export type MomentInput = Date | string
