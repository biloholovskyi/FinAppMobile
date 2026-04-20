import { useLocalSearchParams } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import { fetchTransactions } from '@/shared/api/transactions'
import { fetchCategories } from '@/shared/api/categories'
import { getWallets } from '@/shared/api/wallets'
import { QUERY_KEYS } from '@/shared/constants/queryKeys'

export function useEditTransactionData() {
  const { id } = useLocalSearchParams<{ id?: string }>()
  const isCreateMode = !id

  const { data: transactions = [], isLoading: txLoading } = useQuery({
    queryKey: QUERY_KEYS.transactions.all,
    queryFn: fetchTransactions,
    enabled: !isCreateMode,
  })

  const { data: categories = [], isLoading: catLoading } = useQuery({
    queryKey: QUERY_KEYS.categories.all,
    queryFn: fetchCategories,
  })

  const { data: wallets = [], isLoading: walletsLoading } = useQuery({
    queryKey: QUERY_KEYS.wallets.all,
    queryFn: getWallets,
  })

  const transaction = transactions.find((tx) => tx.id === id)
  const isLoading = (!isCreateMode && txLoading) || catLoading || walletsLoading

  return { transaction, categories, wallets, isLoading, isCreateMode }
}
