import { useSheetDelete } from './useSheetDelete'
import { useSpendingLeafData } from './useSpendingLeafData'

type Params = { leafKey: string; monthStr: string }

/** Состояние шторки транзакций листа: данные листа и удаление с подтверждением. */
export function useSpendingTransactionsSheet(params: Params) {
  const data = useSpendingLeafData(params)
  const remove = useSheetDelete(data.leafTransactions)

  return { ...data, ...remove }
}
