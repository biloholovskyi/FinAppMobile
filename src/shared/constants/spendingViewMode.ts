/** Режимы отображения списка расходов на экране статистики. */
export const SPENDING_VIEW_MODE = {
  /** Категории с раскрытием подкатегорий. */
  categories: 'categories',
  /** Плоский список подкатегорий и категорий без подкатегорий. */
  subcategories: 'subcategories',
} as const

/** Значение режима отображения списка расходов. */
export type SpendingViewMode =
  (typeof SPENDING_VIEW_MODE)[keyof typeof SPENDING_VIEW_MODE]

/** Подписи сегментов переключателя режимов отображения. */
export const SPENDING_VIEW_MODE_LABEL: Record<SpendingViewMode, string> = {
  [SPENDING_VIEW_MODE.categories]: 'Категории',
  [SPENDING_VIEW_MODE.subcategories]: 'Подкатегории',
}

/** Подписи секции списка расходов по режиму отображения. */
export const SPENDING_SECTION_LABEL: Record<SpendingViewMode, string> = {
  [SPENDING_VIEW_MODE.categories]: 'По категориям',
  [SPENDING_VIEW_MODE.subcategories]: 'По подкатегориям',
}

/** Название строки с расходами категории, не отнесёнными ни к одной подкатегории. */
export const UNCATEGORIZED_SUB_LABEL = 'Без подкатегории'

/** Подпись чипа фильтра по превышению бюджета. */
export const OVER_BUDGET_FILTER_LABEL = 'Превышен бюджет'

/** Суффикс подписи секции при включённом фильтре превышения. */
export const OVER_BUDGET_SECTION_SUFFIX = ' · превышено'

/** Существительное в плашке превышения по режиму отображения. */
export const OVER_BUDGET_NOTE_NOUN: Record<SpendingViewMode, string> = {
  [SPENDING_VIEW_MODE.categories]: 'категориям',
  [SPENDING_VIEW_MODE.subcategories]: 'подкатегориям',
}

/** Заголовок пустого состояния фильтра превышения. */
export const OVER_BUDGET_EMPTY_TITLE = 'Превышений нет'

/** Текст пустого состояния фильтра превышения по режиму отображения. */
export const OVER_BUDGET_EMPTY_TEXT: Record<SpendingViewMode, string> = {
  [SPENDING_VIEW_MODE.categories]:
    'Ни одна категория не вышла за бюджет в этом месяце',
  [SPENDING_VIEW_MODE.subcategories]:
    'Ни одна подкатегория не вышла за бюджет в этом месяце',
}

/** Подпись кнопки, выключающей фильтр превышения. */
export const OVER_BUDGET_RESET_LABEL = 'Показать все'

/** Подпись чипа фильтра для скринридера. */
export const OVER_BUDGET_CHIP_A11Y_LABEL = 'Фильтр «Превышен бюджет»'

/** Префикс значения чипа для скринридера: за ним следует число превышений. */
export const OVER_BUDGET_CHIP_A11Y_VALUE_PREFIX = 'Превышений: '

/** Подсказка чипа для скринридера. */
export const OVER_BUDGET_CHIP_A11Y_HINT =
  'Показывает только элементы, превысившие бюджет'
