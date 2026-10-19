import { OVER_BUDGET_NOTE_NOUN } from '@/shared/constants'
import type { SpendingViewMode } from '@/shared/constants'

type FormatOverBudgetNoteParams = {
  /** Число превышенных элементов. */
  overCount: number
  /** Число элементов с установленным бюджетом. */
  budgetedCount: number
  viewMode: SpendingViewMode
}

/** Формирует текст плашки превышения для режима отображения. */
export function formatOverBudgetNote({
  overCount,
  budgetedCount,
  viewMode,
}: FormatOverBudgetNoteParams): string {
  return `Превышение по ${overCount} из ${budgetedCount} ${OVER_BUDGET_NOTE_NOUN[viewMode]} с бюджетом`
}
