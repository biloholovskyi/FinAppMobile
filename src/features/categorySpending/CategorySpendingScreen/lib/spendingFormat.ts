import { FULL_PERCENT, PERCENT_MULTIPLIER } from '@/shared/constants'
import { formatUah } from '@/shared/utils/currency'

/** Доля бюджета в процентах, с которой полоса бюджета переходит в предупреждающий цвет. */
export const BUDGET_WARNING_PERCENT = 80

/** Цвет заливки полосы при превышении бюджета: приглушённая база под красной полосой. */
const PROGRESS_COLOR_EXCEEDED = 'rgba(79,158,255,0.35)'

/** Цвет заливки полосы на подходе к границе бюджета. */
const PROGRESS_COLOR_WARNING = '#FFB020'

/** Цвет заливки полосы в пределах бюджета. */
const PROGRESS_COLOR_NORMAL = '#4F9EFF'

/** Форматирует сумму в копейках как денежную строку в гривнах. */
export function formatKopecksUah(kopecks: number): string {
  return formatUah(kopecks, true)
}

/** Форматирует процент с одним знаком после запятой. */
export function formatPct(value: number): string {
  return value.toFixed(1) + '%'
}

/** Подбирает цвет заливки полосы по проценту использования бюджета. */
export function getProgressColor(pct: number): string {
  if (pct > FULL_PERCENT) return PROGRESS_COLOR_EXCEEDED
  if (pct >= BUDGET_WARNING_PERCENT) return PROGRESS_COLOR_WARNING
  return PROGRESS_COLOR_NORMAL
}

/** Состояние полосы бюджета, пригодное для рендера без дополнительных расчётов. */
export type BudgetProgressState = {
  hasBudget: boolean
  /** Процент использования бюджета; `0`, когда бюджет не установлен. */
  pct: number
  /** Ширина основной заливки в процентах, не больше полного бюджета. */
  fillPct: number
  /** Ширина полосы превышения в процентах; `0`, когда превышения нет. */
  overflowPct: number
  isExceeded: boolean
  fillColor: string
}

/** Считает состояние полосы бюджета по сумме расходов и бюджету в копейках. */
export function getBudgetProgress(
  totalSpent: number,
  budget: number | null,
): BudgetProgressState {
  const hasBudget = budget !== null && budget > 0
  const pct = hasBudget ? (totalSpent / budget) * PERCENT_MULTIPLIER : 0
  const isExceeded = pct > FULL_PERCENT
  const overflowRatio = isExceeded
    ? Math.min((pct - FULL_PERCENT) / FULL_PERCENT, 1)
    : 0

  return {
    hasBudget,
    pct,
    fillPct: Math.min(pct, FULL_PERCENT),
    overflowPct: overflowRatio * PERCENT_MULTIPLIER,
    isExceeded,
    fillColor: getProgressColor(pct),
  }
}
