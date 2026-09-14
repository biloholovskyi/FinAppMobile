import { useState, useCallback, useMemo } from 'react'

/** Месяц в формате, пригодном для ключа запроса бюджета. */
function toMonthStr(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}-01T00:00:00.000Z`
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

export type MonthNavigation = {
  selectedMonth: Date
  monthStr: string
  handlePrevMonth: () => void
  handleNextMonth: () => void
  /** Переход вперёд закрыт на текущем месяце и дальше. */
  isNextDisabled: boolean
}

/** Навигация по месяцам экрана статистики. */
export function useMonthNavigation(): MonthNavigation {
  const [selectedMonth, setSelectedMonth] = useState(() =>
    startOfMonth(new Date()),
  )

  const handlePrevMonth = useCallback(() => {
    setSelectedMonth((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))
  }, [])

  const handleNextMonth = useCallback(() => {
    setSelectedMonth((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))
  }, [])

  const monthStr = useMemo(() => toMonthStr(selectedMonth), [selectedMonth])

  return {
    selectedMonth,
    monthStr,
    handlePrevMonth,
    handleNextMonth,
    isNextDisabled: monthStr >= toMonthStr(startOfMonth(new Date())),
  }
}
