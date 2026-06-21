import { WalletTransactionType, type Transaction } from '@/entities/transaction'
import { resolveIcon } from '@/shared/utils/icons'
import { hexToRgba } from '@/shared/utils/colors'
import { formatAmount, getCurrencySymbol } from '@/shared/utils/currency'
import { formatTime } from '@/shared/utils/dateAndTime'
import * as icons from 'lucide-react-native'
import type { LucideIcon } from 'lucide-react-native'

type TxDisplay = {
  IconComponent: LucideIcon
  color: string
  iconBg: string
  badgeBg: string
  badgeLabel: string | null
  description: string
  walletName: string
  amountStr: string
  amountColor: string
  time: string
}

export function useDeleteTransactionModal(transaction: Transaction): TxDisplay {
  const categoryInfo = transaction.subCategory ?? transaction.category ?? null
  const isTransfer = transaction.type === WalletTransactionType.transfer
  const isIncome = transaction.type === WalletTransactionType.income

  const color = isTransfer ? '#4F9EFF' : categoryInfo?.color ?? '#8888AA'
  const iconBg = hexToRgba(color, 0.15)
  const badgeBg = hexToRgba(color, 0.15)

  const IconComponent: LucideIcon = isTransfer
    ? icons.ArrowRightLeft
    : resolveIcon(categoryInfo?.icon ?? '')

  const badgeLabel = categoryInfo?.name ?? (isTransfer ? 'Перевод' : null)

  const currencySymbol = getCurrencySymbol(transaction.wallet?.currency)
  const amountStr = isIncome
    ? `+${formatAmount(transaction.amount)} ${currencySymbol}`
    : `−${formatAmount(transaction.amount)} ${currencySymbol}`
  const amountColor = isIncome ? '#00E089' : '#FF4B6B'

  return {
    IconComponent,
    color,
    iconBg,
    badgeBg,
    badgeLabel,
    description: transaction.description || '—',
    walletName: transaction.wallet?.name ?? '',
    amountStr,
    amountColor,
    time: formatTime(transaction.transactionTime),
  }
}
