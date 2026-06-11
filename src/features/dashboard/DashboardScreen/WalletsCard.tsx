import { View, Text } from 'react-native'
import { WalletRow } from './WalletRow'
import { useWalletsCard } from './useWalletsCard'

export function WalletsCard() {
  const { wallets, totalBalance, refreshingId, handleRefresh } = useWalletsCard()
  const formattedTotal = (totalBalance / 100).toLocaleString('uk-UA', {
    style: 'currency',
    currency: 'UAH',
  })

  return (
    <View className="bg-[#10101C] border border-[rgba(255,255,255,0.08)] rounded-2xl p-4 mx-3 mb-2.5">
      <View className="flex-row items-center justify-between mb-3.5">
        <Text className="text-[#8888AA] text-[11px] font-medium tracking-widest uppercase">
          КОШЕЛЬКИ
        </Text>
        <Text className="text-[#F2F2FF] text-sm font-bold">{formattedTotal}</Text>
      </View>

      {wallets.map((wallet, index) => (
        <WalletRow
          key={wallet.id}
          wallet={wallet}
          isLast={index === wallets.length - 1}
          refreshingId={refreshingId}
          onRefresh={handleRefresh}
        />
      ))}
    </View>
  )
}
