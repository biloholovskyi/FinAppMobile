import { useEditTransactionData } from './useEditTransactionData'
import { useEditTransactionForm } from './useEditTransactionForm'
import { useEditTransactionActions } from './useEditTransactionActions'
import { useEditTransactionSelection } from './useEditTransactionSelection'
import { useSaveTransaction } from './useSaveTransaction'
import { useTransactionSplit } from './useTransactionSplit'
import { useAmountUahEquivalent } from './useAmountUahEquivalent'
import {
  WalletTransactionType,
  getTransactionCurrency,
  getTransactionExchangeRate,
  useTransferTargetAmount,
} from '@/entities/transaction'
import { TRANSACTION_SPLIT_MESSAGES } from '@/shared/constants/transactionSplit'
import { amountStrToKopecks } from '@/shared/utils/currency'

export function useEditTransactionScreen() {
  const { transaction, categories, wallets, isLoading, isCreateMode } = useEditTransactionData()
  const form = useEditTransactionForm(transaction)
  const actions = useEditTransactionActions(transaction?.id)

  const isTransfer = form.type === WalletTransactionType.transfer
  const walletId = isCreateMode ? (form.sourceWalletId ?? '') : (transaction?.walletId ?? '')

  const split = useTransactionSplit({
    amountStr: form.amountStr,
    isAvailable: !isCreateMode && form.type === WalletTransactionType.expense,
  })

  const resetSplit = () => {
    split.resetSplit()
    actions.resetSplitProgress()
  }

  const changeType = (next: WalletTransactionType) => {
    if (next !== WalletTransactionType.expense) resetSplit()
    form.setType(next)
  }

  const transfer = useTransferTargetAmount({
    isTransfer,
    amount: form.amountStr,
    walletId,
    targetWalletId: form.targetWalletId ?? '',
    wallets,
  })

  const isOriginalTransfer = transaction?.type === WalletTransactionType.transfer
  const editCurrency =
    transaction && !isOriginalTransfer
      ? getTransactionCurrency(transaction)
      : walletId
        ? transfer.sourceCurrency
        : ''
  const uahEquivalent = useAmountUahEquivalent({
    isTransfer,
    currency: editCurrency,
    amountKopecks: split.isSplitActive ? split.remainderKopecks : amountStrToKopecks(form.amountStr),
    storedRate: transaction && !isOriginalTransfer ? getTransactionExchangeRate(transaction) : null,
  })

  const selection = useEditTransactionSelection({
    categories,
    wallets,
    categoryId: form.categoryId,
    subCategoryId: form.subCategoryId,
    sourceWalletId: form.sourceWalletId,
    targetWalletId: form.targetWalletId,
  })

  const { onSave } = useSaveTransaction({
    form,
    split,
    transfer,
    actions,
    canSave: isCreateMode ? !!form.sourceWalletId : !!transaction,
    isTransfer,
    walletId,
  })

  return {
    isLoading,
    isSaving: actions.isSaving,
    isDeleting: actions.isDeleting,
    isCreateMode,
    sourceWalletName: isCreateMode
      ? (selection.selectedSourceWallet?.name ?? '')
      : (transaction?.wallet?.name ?? ''),
    walletId,
    categories,
    wallets,
    ...selection,
    showCreditedRow: isTransfer && transfer.isCrossCurrency,
    creditedValue: transfer.targetAmountValue,
    onCreditedChange: transfer.handleTargetAmountChange,
    sourceCurrency: transfer.sourceCurrency,
    targetCurrency: transfer.targetCurrency,
    conversionRate: transfer.conversionRate,
    ...form,
    setType: changeType,
    split,
    onRemoveSplit: resetSplit,
    amountValue: split.isSplitActive ? split.remainderStr : form.amountStr,
    isAmountReadOnly: split.isSplitActive,
    uahEquivalent,
    amountHint: split.isSplitActive ? TRANSACTION_SPLIT_MESSAGES.remainderHint : null,
    onSave,
    handleDelete: actions.handleDelete,
    errorMessage: actions.errorMessage,
    clearError: actions.clearError,
  }
}
