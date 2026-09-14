import { useState, useCallback } from 'react'
import {
  SPENDING_SECTION_LABEL,
  SPENDING_VIEW_MODE,
  type SpendingViewMode,
} from '@/shared/constants'

export type SpendingViewModeState = {
  viewMode: SpendingViewMode
  onViewModeChange: (mode: SpendingViewMode) => void
  /** Подпись секции списка под текущий режим. */
  sectionLabel: string
}

/** Режим отображения списка расходов на экране статистики. */
export function useSpendingViewMode(): SpendingViewModeState {
  const [viewMode, setViewMode] = useState<SpendingViewMode>(
    SPENDING_VIEW_MODE.categories,
  )

  const onViewModeChange = useCallback((mode: SpendingViewMode) => {
    setViewMode(mode)
  }, [])

  return {
    viewMode,
    onViewModeChange,
    sectionLabel: SPENDING_SECTION_LABEL[viewMode],
  }
}
