import type { Transaction } from '@/entities/transaction'
import {
  getTransactionAmountUah,
  WalletTransactionType,
} from '@/entities/transaction'

/** Расход месяца вместе с суммой в гривнах (копейки, по модулю). */
export type MonthExpense = {
  transaction: Transaction
  /** Сумма в UAH, копейки, всегда неотрицательная. */
  amountUah: number
}

/**
 * Выбирает расходы выбранного месяца: тип `expense`, локальный месяц устройства
 * (`transactionTime` — реальный момент времени), известный эквивалент в UAH.
 * Единый источник фильтра для агрегатора и шторки транзакций, чтобы суммы совпадали.
 *
 * @param transactions Все загруженные транзакции.
 * @param selectedMonth Любая дата выбранного месяца (локальный месяц устройства).
 */
export function selectMonthExpenses(
  transactions: Transaction[],
  selectedMonth: Date,
): MonthExpense[] {
  const year = selectedMonth.getFullYear()
  const month = selectedMonth.getMonth()
  const expenses: MonthExpense[] = []

  for (const transaction of transactions) {
    if (transaction.type !== WalletTransactionType.expense) continue
    const date = new Date(transaction.transactionTime)
    if (date.getFullYear() !== year || date.getMonth() !== month) continue
    const amountUah = getTransactionAmountUah(transaction)
    if (amountUah === null) continue
    expenses.push({ transaction, amountUah: Math.abs(amountUah) })
  }

  return expenses
}
