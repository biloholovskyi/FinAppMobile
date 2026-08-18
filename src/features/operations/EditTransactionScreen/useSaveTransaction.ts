import { WalletTransactionType } from '@/entities/transaction'
import { parseAmountInput } from '@/shared/utils/currency'
import { validateSplitPart } from './splitValidation'
import { buildSavePayloads } from './savePayloads'
import type { useEditTransactionForm } from './useEditTransactionForm'
import type { useTransactionSplit } from './useTransactionSplit'
import type { useEditTransactionActions } from './useEditTransactionActions'
import type { useTransferTargetAmount } from '@/entities/transaction'

const AMOUNT_ERROR = 'Введите корректную сумму'
const TARGET_WALLET_ERROR = 'Выберите кошелёк-получатель'
const CREDITED_AMOUNT_ERROR = 'Укажите сумму зачисления'

type UseSaveTransactionParams = {
  form: ReturnType<typeof useEditTransactionForm>
  split: ReturnType<typeof useTransactionSplit>
  transfer: ReturnType<typeof useTransferTargetAmount>
  actions: ReturnType<typeof useEditTransactionActions>
  canSave: boolean
  isTransfer: boolean
  walletId: string
}

export function useSaveTransaction({
  form,
  split,
  transfer,
  actions,
  canSave,
  isTransfer,
  walletId,
}: UseSaveTransactionParams) {
  const validate = (): string | null => {
    const splitError = validateSplitPart({
      isSplitActive: split.isSplitActive,
      categoryId: split.splitCategoryId,
      amountKopecks: split.splitAmountKopecks,
      remainderKopecks: split.remainderKopecks,
    })
    if (splitError) return splitError
    if (!isTransfer) return null
    if (!form.targetWalletId) return TARGET_WALLET_ERROR
    if (!(transfer.targetAmountNumber > 0)) return CREDITED_AMOUNT_ERROR
    return null
  }

  const onSave = () => {
    if (!canSave) return

    const amount = split.isSplitActive ? split.remainderAmount : parseAmountInput(form.amountStr)
    if (amount === null) {
      actions.setValidationError(AMOUNT_ERROR)
      return
    }

    const error = validate()
    if (error) {
      actions.setValidationError(error)
      return
    }

    const { payload, splitPayload } = buildSavePayloads({
      form,
      split,
      signedAmount: form.type === WalletTransactionType.expense ? -amount : amount,
      isTransfer,
      targetAmount: transfer.targetAmountNumber,
      walletId,
    })
    void actions.handleSave(payload, splitPayload)
  }

  return { onSave }
}
