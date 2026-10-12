import type { Transaction } from '@/entities/transaction'
import {
  getTransactionAmountUah,
  WalletTransactionType,
} from '@/entities/transaction'
import { KOPECK_DIVISOR } from '@/shared/constants/money'
import {
  getDayOfMonth,
  getDaysInMonth,
  getKyivDayKey,
  getMonthKeyOfDay,
  shiftMonthKey,
  type DayKey,
} from '@/shared/utils/kyivCalendar'

export type DailyPoint = { value: number }

type AggregateResult = {
  totalCurrent: number
  totalPrev: number
  chartDataCurrent: DailyPoint[]    // days 1..today (actual)
  chartDataProjected: DailyPoint[]  // days 1..endOfMonth flat at totalCurrent
  chartDataPrev: DailyPoint[]       // full previous month
}

/**
 * Расходы текущего и прошлого киевского месяца по дням.
 *
 * @param transactions Все загруженные транзакции.
 * @param today Киевское «сегодня».
 */
export function aggregateExpenses(
  transactions: Transaction[],
  today: DayKey,
): AggregateResult {
  const currentDay = getDayOfMonth(today)
  const currentMonth = getMonthKeyOfDay(today)
  const prevMonth = shiftMonthKey(currentMonth, -1)

  const daysInCurrentMonth = getDaysInMonth(currentMonth)
  const daysInPrevMonth = getDaysInMonth(prevMonth)

  const currentDailyAmounts = new Array<number>(daysInCurrentMonth).fill(0)
  const prevDailyAmounts = new Array<number>(daysInPrevMonth).fill(0)

  const expenses = transactions.filter(
    (t) => t.type === WalletTransactionType.expense,
  )

  for (const t of expenses) {
    const dayKey = getKyivDayKey(t.transactionTime)
    const month = getMonthKeyOfDay(dayKey)
    const day = getDayOfMonth(dayKey)
    const uah = getTransactionAmountUah(t)
    if (uah === null) continue
    const amountUah = Math.abs(uah) / KOPECK_DIVISOR

    if (month === currentMonth) {
      currentDailyAmounts[day - 1] += amountUah
    } else if (month === prevMonth) {
      prevDailyAmounts[day - 1] += amountUah
    }
  }

  // Current month: actual 1..today, flat projection today+1..end (full month length)
  // Full length needed so gifted-charts x-axis covers the whole month
  let runningCurrent = 0
  const chartDataCurrent: DailyPoint[] = currentDailyAmounts.map((amt, i) => {
    if (i < currentDay) runningCurrent += amt
    return { value: runningCurrent }
  })
  const totalCurrent = runningCurrent

  // Projected: same flat value for the full month (startIndex in chart clips it to today)
  const chartDataProjected: DailyPoint[] = Array.from(
    { length: daysInCurrentMonth },
    () => ({ value: totalCurrent }),
  )

  // Previous month: full cumulative
  let runningPrev = 0
  const chartDataPrev: DailyPoint[] = prevDailyAmounts.map((amt) => {
    runningPrev += amt
    return { value: runningPrev }
  })

  // totalPrev for comparison: up to the same day number
  const totalPrev = prevDailyAmounts
    .slice(0, currentDay)
    .reduce((sum, amt) => sum + amt, 0)

  return { totalCurrent, totalPrev, chartDataCurrent, chartDataProjected, chartDataPrev }
}
