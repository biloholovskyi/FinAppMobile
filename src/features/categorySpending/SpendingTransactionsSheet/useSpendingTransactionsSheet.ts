import { useSheetDelete } from './useSheetDelete'
import { useSpendingLeafData } from './useSpendingLeafData'
import type { MonthKey } from '@/shared/utils/kyivCalendar'

type Params = { leafKey: string; month: MonthKey }

/** Состояние шторки транзакций листа: данные листа и удаление с подтверждением. */
export function useSpendingTransactionsSheet(params: Params) {
  const data = useSpendingLeafData(params)
  const remove = useSheetDelete(data.leafTransactions)

  return { ...data, ...remove }
}
