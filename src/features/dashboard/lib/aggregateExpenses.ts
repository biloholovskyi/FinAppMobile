import type { Transaction } from '@/entities/transaction'
import { WalletTransactionType } from '@/entities/transaction'

export type DailyPoint = { value: number }

type AggregateResult = {
  totalCurrent: number
  totalPrev: number
  chartDataCurrent: DailyPoint[]    // days 1..today (actual)
  chartDataProjected: DailyPoint[]  // days 1..endOfMonth flat at totalCurrent
  chartDataPrev: DailyPoint[]       // full previous month
}

export function aggregateExpenses(
  transactions: Transaction[],
  today: Date,
): AggregateResult {
  const currentDay = today.getDate()
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()

  const prevMonthDate = new Date(currentYear, currentMonth - 1, 1)
  const prevMonth = prevMonthDate.getMonth()
  const prevYear = prevMonthDate.getFullYear()

  const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const daysInPrevMonth = new Date(prevYear, prevMonth + 1, 0).getDate()

  const currentDailyAmounts = new Array<number>(daysInCurrentMonth).fill(0)
  const prevDailyAmounts = new Array<number>(daysInPrevMonth).fill(0)

  const expenses = transactions.filter(
    (t) => t.type === WalletTransactionType.expense,
  )

  for (const t of expenses) {
    const date = new Date(t.transactionTime)
    const month = date.getMonth()
    const year = date.getFullYear()
    const day = date.getDate()
    const amountUah = Math.abs(t.amount / 100)

    if (year === currentYear && month === currentMonth) {
      currentDailyAmounts[day - 1] += amountUah
    } else if (year === prevYear && month === prevMonth) {
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
