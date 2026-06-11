import { useRef, useEffect } from 'react'
import { View, Text, TouchableOpacity, Animated } from 'react-native'
import { Wallet as WalletIcon, CreditCard, RefreshCw } from 'lucide-react-native'
import type { Wallet } from '../../../entities/wallet'

type WalletRowProps = {
  wallet: Wallet
  isLast: boolean
  refreshingId: string | null
  onRefresh: (wallet: Wallet) => void
}

export function WalletRow({ wallet, isLast, refreshingId, onRefresh }: WalletRowProps) {
  const isSpinning = refreshingId === wallet.id
  const spinAnim = useRef(new Animated.Value(0)).current
  const animRef = useRef<Animated.CompositeAnimation | null>(null)

  useEffect(() => {
    if (isSpinning) {
      animRef.current = Animated.loop(
        Animated.timing(spinAnim, { toValue: 1, duration: 1000, useNativeDriver: true })
      )
      animRef.current.start()
    } else {
      animRef.current?.stop()
      spinAnim.setValue(0)
    }
  }, [isSpinning, spinAnim])

  const spin = spinAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] })
  const balanceColor = wallet.balance > 0 ? '#00E089' : wallet.balance < 0 ? '#FF4B6B' : '#8888AA'
  const formattedBalance = (wallet.balance / 100).toLocaleString('uk-UA', {
    style: 'currency',
    currency: wallet.currency,
  })

  return (
    <View
      className="flex-row items-center gap-2.5 py-2.5"
      style={!isLast ? { borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.04)' } : undefined}
    >
      <View className="w-7 h-7 rounded-lg bg-[#181828] border border-[rgba(255,255,255,0.08)] items-center justify-center">
        {wallet.type === 'cash'
          ? <WalletIcon size={14} color="#8888AA" />
          : <CreditCard size={14} color="#8888AA" />}
      </View>

      <View className="flex-1 min-w-0 gap-0.5">
        <Text className="text-[#F2F2FF] text-[13px] font-medium" numberOfLines={1}>
          {wallet.name}
        </Text>
        {wallet.integrationType === 'monobank' && (
          <View className="self-start px-1.5 py-px rounded-full bg-[#181828] border border-[rgba(255,255,255,0.04)]">
            <Text className="text-[#00E089] text-[9px] font-semibold uppercase tracking-wider">
              monobank
            </Text>
          </View>
        )}
      </View>

      <Text className="text-[13px] font-bold mr-2" style={{ color: balanceColor }}>
        {formattedBalance}
      </Text>

      {wallet.integrationType === 'monobank' && (
        <TouchableOpacity
          onPress={() => onRefresh(wallet)}
          disabled={refreshingId !== null}
          className="w-7 h-7 rounded-lg border border-[rgba(255,255,255,0.08)] items-center justify-center"
          style={{ opacity: refreshingId !== null && !isSpinning ? 0.4 : 1 }}
        >
          <Animated.View style={{ transform: [{ rotate: spin }] }}>
            <RefreshCw size={13} color="#8888AA" />
          </Animated.View>
        </TouchableOpacity>
      )}
    </View>
  )
}
