export type WalletType = 'cash' | 'card'
export type WalletIntegrationType = 'manual' | 'monobank' | null

export type Wallet = {
  id: string
  name: string
  balance: number
  type: WalletType
  integrationType: WalletIntegrationType
  systemId: string | null
  currency: string
  createdAt: string
  updatedAt: string
}
