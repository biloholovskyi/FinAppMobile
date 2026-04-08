import { useState, useCallback } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '../../../shared/constants/queryKeys'
import {
  getWallets,
  fetchMonobankStatementByWallet,
  fetchMonobankBalanceByWallet,
} from '../../../shared/api/wallets'
import type { Wallet } from '../../../entities/wallet'

export function useWalletsCard() {
  const queryClient = useQueryClient()
  const { data: wallets = [], isLoading } = useQuery({
    queryKey: QUERY_KEYS.wallets.all,
    queryFn: getWallets,
  })
  const [refreshingId, setRefreshingId] = useState<string | null>(null)

  const totalBalance = wallets.reduce((sum, w) => sum + w.balance, 0)

  const handleRefresh = useCallback(async (wallet: Wallet) => {
    setRefreshingId(wallet.id)
    try {
      await fetchMonobankStatementByWallet(wallet.id)
      await fetchMonobankBalanceByWallet(wallet.id)
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.wallets.all })
    } finally {
      setRefreshingId(null)
    }
  }, [queryClient])

  return { wallets, isLoading, totalBalance, refreshingId, handleRefresh }
}
