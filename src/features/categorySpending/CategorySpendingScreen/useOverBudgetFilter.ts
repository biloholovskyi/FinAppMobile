import { useState, useCallback } from 'react'

export type OverBudgetFilterState = {
  /** Включён ли фильтр «Превышен бюджет». */
  isOverOnly: boolean
  onToggleOverOnly: () => void
  onResetOverOnly: () => void
}

/** Состояние фильтра «Превышен бюджет»; живёт в памяти экрана. */
export function useOverBudgetFilter(): OverBudgetFilterState {
  const [isOverOnly, setIsOverOnly] = useState(false)

  const onToggleOverOnly = useCallback(() => {
    setIsOverOnly((prev) => !prev)
  }, [])

  const onResetOverOnly = useCallback(() => {
    setIsOverOnly(false)
  }, [])

  return { isOverOnly, onToggleOverOnly, onResetOverOnly }
}
