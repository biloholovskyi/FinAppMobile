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
