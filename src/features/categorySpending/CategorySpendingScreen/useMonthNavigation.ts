import { useState, useCallback, useMemo } from 'react'
import {
  getKyivCurrentMonthKey,
  shiftMonthKey,
  toBudgetMonthKey,
  type MonthKey,
} from '@/shared/utils/kyivCalendar'

export type MonthNavigation = {
  /** Выбранный киевский месяц. */
  month: MonthKey
  /** Ключ бюджета выбранного месяца, `YYYY-MM-01T00:00:00.000Z`. */
  monthStr: string
  handlePrevMonth: () => void
  handleNextMonth: () => void
  /** Переход вперёд закрыт на текущем месяце и дальше. */
  isNextDisabled: boolean
}

/** Навигация по месяцам экрана статистики по киевскому календарю. */
export function useMonthNavigation(): MonthNavigation {
  const [month, setSelectedMonth] = useState<MonthKey>(() => getKyivCurrentMonthKey())

  const handlePrevMonth = useCallback(() => {
    setSelectedMonth((current) => shiftMonthKey(current, -1))
  }, [])

  const handleNextMonth = useCallback(() => {
    setSelectedMonth((current) => shiftMonthKey(current, 1))
  }, [])

  const monthStr = useMemo(() => toBudgetMonthKey(month), [month])

  return {
    month,
    monthStr,
    handlePrevMonth,
    handleNextMonth,
    isNextDisabled: month >= getKyivCurrentMonthKey(),
  }
}
