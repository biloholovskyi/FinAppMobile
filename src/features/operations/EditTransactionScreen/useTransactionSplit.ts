import { useState } from 'react'
import { amountStrToKopecks, kopecksToAmountStr } from '@/shared/utils/currency'
import { KOPECK_DIVISOR } from '@/shared/constants/money'

type UseTransactionSplitParams = {
  /** Актуальное значение поля «Сумма» — база фиксируется из него при включении. */
  amountStr: string
  /** Разделение доступно: расход в режиме редактирования существующей транзакции. */
  isAvailable: boolean
}

/** Поля нового платежа: сумма, категория, подкатегория. */
function useSplitPart() {
  const [amountStr, setAmountStr] = useState('')
  const [categoryId, setCategoryId] = useState<string | null>(null)
  const [subCategoryId, setSubCategoryId] = useState<string | null>(null)

  const clear = () => {
    setAmountStr('')
    setCategoryId(null)
    setSubCategoryId(null)
  }

  const selectCategory = (id: string | null) => {
    setCategoryId(id)
    setSubCategoryId(null)
  }

  return { amountStr, setAmountStr, categoryId, subCategoryId, setSubCategoryId, selectCategory, clear }
}

export function useTransactionSplit({ amountStr, isAvailable }: UseTransactionSplitParams) {
  const [isSplitActive, setIsSplitActive] = useState(false)
  const [baseAmountStr, setBaseAmountStr] = useState('')
  const part = useSplitPart()

  const baseKopecks = amountStrToKopecks(baseAmountStr)
  const splitKopecks = amountStrToKopecks(part.amountStr)
  const remainderKopecks = Math.max(0, baseKopecks - splitKopecks)

  const enableSplit = () => {
    if (!isAvailable || isSplitActive) return
    setBaseAmountStr(amountStr)
    part.clear()
    setIsSplitActive(true)
  }

  /** Выключение и полный сброс: используется и кнопкой удаления, и сменой типа транзакции. */
  const resetSplit = () => {
    setIsSplitActive(false)
    setBaseAmountStr('')
    part.clear()
  }

  const changeSplitAmount = (raw: string) => {
    part.setAmountStr(amountStrToKopecks(raw) > baseKopecks ? kopecksToAmountStr(baseKopecks) : raw)
  }

  return {
    isSplitActive,
    canSplit: isAvailable && !isSplitActive,
    baseAmountStr,
    splitAmountStr: part.amountStr,
    splitAmountKopecks: splitKopecks,
    splitAmount: splitKopecks / KOPECK_DIVISOR,
    remainderStr: kopecksToAmountStr(remainderKopecks),
    remainderKopecks,
    remainderAmount: remainderKopecks / KOPECK_DIVISOR,
    splitCategoryId: part.categoryId,
    splitSubCategoryId: part.subCategoryId,
    enableSplit,
    resetSplit,
    changeSplitAmount,
    selectSplitCategory: part.selectCategory,
    setSplitSubCategoryId: part.setSubCategoryId,
  }
}
