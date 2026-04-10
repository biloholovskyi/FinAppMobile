import { apiClient } from './base'
import type { Wallet } from '../../entities/wallet'

export async function getWallets(): Promise<Wallet[]> {
  const response = await apiClient.get<Wallet[]>('/wallets')
  return response.data
}

export async function fetchMonobankStatementByWallet(walletId: string): Promise<void> {
  await apiClient.get('/monobank/statement-by-wallet', { params: { walletId } })
}

export async function fetchMonobankBalanceByWallet(walletId: string): Promise<void> {
  await apiClient.get('/monobank/balance-by-wallet', { params: { walletId } })
}
