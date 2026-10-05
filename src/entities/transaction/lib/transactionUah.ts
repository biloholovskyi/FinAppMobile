import { UAH_CURRENCY_CODE } from '@/shared/utils/currencyConversion'

import { WalletTransactionType } from '../model/types'
import type { Transaction } from '../model/types'

type TransactionUahInput = Pick<Transaction, 'type' | 'amount' | 'wallet'> & {
  currency?: unknown
  exchangeRate?: unknown
  amountUah?: unknown
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

/**
 * Returns the uppercase currency code of a transaction:
 * own currency, then wallet currency, then UAH.
 */
export function getTransactionCurrency(tx: TransactionUahInput): string {
  const own = typeof tx.currency === 'string' ? tx.currency : ''
  return (own || tx.wallet?.currency || UAH_CURRENCY_CODE).toUpperCase()
}

/**
 * True when the transaction is not a transfer and its currency differs from UAH.
 */
export function isForeignCurrencyTransaction(tx: TransactionUahInput): boolean {
  return (
    tx.type !== WalletTransactionType.transfer && getTransactionCurrency(tx) !== UAH_CURRENCY_CODE
  )
}

/**
 * Returns the exchange rate (UAH per 1 unit) when it is a finite number > 0, otherwise null.
 */
export function getTransactionExchangeRate(tx: TransactionUahInput): number | null {
  return isFiniteNumber(tx.exchangeRate) && tx.exchangeRate > 0 ? tx.exchangeRate : null
}

/**
 * Returns the UAH equivalent in kopecks (sign preserved), or null when unavailable.
 * Transfers have no equivalent; UAH transactions fall back to their own amount.
 */
export function getTransactionAmountUah(tx: TransactionUahInput): number | null {
  if (tx.type === WalletTransactionType.transfer) return null
  if (isFiniteNumber(tx.amountUah)) return tx.amountUah
  if (getTransactionCurrency(tx) === UAH_CURRENCY_CODE) return tx.amount
  return null
}

/**
 * Returns the UAH equivalent in kopecks signed by transaction type
 * (income positive, expense negative), or null when there is no equivalent
 * or the type is not income/expense.
 */
export function getSignedUahAmount(tx: TransactionUahInput): number | null {
  const amountUah = getTransactionAmountUah(tx)
  if (amountUah === null) return null
  if (tx.type === WalletTransactionType.income) return Math.abs(amountUah)
  if (tx.type === WalletTransactionType.expense) return -Math.abs(amountUah)
  return null
}
