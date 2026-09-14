import { View } from 'react-native'
import { getBudgetProgress } from './lib/spendingFormat'

/** Фон трека, когда бюджет не установлен. */
const EMPTY_TRACK_COLOR = 'rgba(255,255,255,0.03)'

/** Фон трека с установленным бюджетом. */
const TRACK_COLOR = '#181828'

/** Цвет полосы превышения бюджета. */
const OVERFLOW_COLOR = '#FF4B6B'

/** Радиус скругления полос, заведомо больше их высоты. */
const BAR_RADIUS = 99

/** Высоты полосы бюджета по месту использования. */
export const BUDGET_PROGRESS_HEIGHT = {
  /** Карточка категории и строка плоского списка. */
  row: 7,
  /** Вложенная подкатегория. */
  nested: 5,
} as const

type BudgetProgressProps = {
  /** Сумма расходов в копейках. */
  totalSpent: number
  /** Бюджет в копейках; `null` — бюджет не установлен. */
  budget: number | null
  /** Высота полосы в пикселях. */
  height: number
}

/** Полоса использования бюджета с отдельной полосой превышения. */
export function BudgetProgress({
  totalSpent,
  budget,
  height,
}: BudgetProgressProps) {
  const { hasBudget, fillPct, overflowPct, fillColor } = getBudgetProgress(
    totalSpent,
    budget,
  )

  return (
    <View
      className="overflow-hidden rounded-full"
      style={{
        height,
        backgroundColor: hasBudget ? TRACK_COLOR : EMPTY_TRACK_COLOR,
      }}
    >
      {hasBudget && (
        <View
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: `${fillPct}%`,
            backgroundColor: fillColor,
            borderRadius: BAR_RADIUS,
          }}
        />
      )}
      {overflowPct > 0 && (
        <View
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: `${overflowPct}%`,
            backgroundColor: OVERFLOW_COLOR,
            borderRadius: BAR_RADIUS,
          }}
        />
      )}
    </View>
  )
}
