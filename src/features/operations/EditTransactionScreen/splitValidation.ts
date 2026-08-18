import { TRANSACTION_SPLIT_MESSAGES } from '@/shared/constants/transactionSplit'

type SplitValidationInput = {
  isSplitActive: boolean
  categoryId: string | null
  amountKopecks: number
  remainderKopecks: number
}

/** Проверки новой части разделения. Возвращает текст ошибки или null. */
export function validateSplitPart({
  isSplitActive,
  categoryId,
  amountKopecks,
  remainderKopecks,
}: SplitValidationInput): string | null {
  if (!isSplitActive) return null
  if (!categoryId) return TRANSACTION_SPLIT_MESSAGES.categoryRequired
  if (amountKopecks <= 0) return TRANSACTION_SPLIT_MESSAGES.amountRequired
  if (remainderKopecks <= 0) return TRANSACTION_SPLIT_MESSAGES.amountTooLarge
  return null
}
