import type { Transaction } from '@/entities/transaction'
import { getKyivMonthKey, type MonthKey } from '@/shared/utils/kyivCalendar'
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
 * Выбирает расходы выбранного месяца: тип `expense`, киевский месяц момента
 * `transactionTime`, известный эквивалент в UAH.
 * Единый источник фильтра для агрегатора и шторки транзакций, чтобы суммы совпадали.
 *
 * @param transactions Все загруженные транзакции.
 * @param month Выбранный киевский месяц.
 */
export function selectMonthExpenses(
  transactions: Transaction[],
  month: MonthKey,
): MonthExpense[] {
  const expenses: MonthExpense[] = []

  for (const transaction of transactions) {
    if (transaction.type !== WalletTransactionType.expense) continue
    if (getKyivMonthKey(transaction.transactionTime) !== month) continue
    const amountUah = getTransactionAmountUah(transaction)
    if (amountUah === null) continue
    expenses.push({ transaction, amountUah: Math.abs(amountUah) })
  }

  return expenses
}
