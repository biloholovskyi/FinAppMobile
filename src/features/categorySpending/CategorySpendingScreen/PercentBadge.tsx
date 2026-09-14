import { View, Text } from 'react-native'
import { formatPct } from './lib/spendingFormat'

const BADGE_STYLE = {
  normal: { backgroundColor: 'rgba(79,158,255,0.25)', color: '#4F9EFF' },
  exceeded: { backgroundColor: 'rgba(255,75,107,0.2)', color: '#FF4B6B' },
  muted: { backgroundColor: 'rgba(68,68,90,0.25)', color: '#44445A' },
} as const

export type PercentBadgeVariant = keyof typeof BADGE_STYLE

type PercentBadgeProps = {
  /** Доля в процентах от всех расходов месяца. */
  percent: number
  variant: PercentBadgeVariant
}

/** Бейдж с долей затрат. */
export function PercentBadge({ percent, variant }: PercentBadgeProps) {
  const { backgroundColor, color } = BADGE_STYLE[variant]

  return (
    <View className="rounded-full px-[7px] py-[2px]" style={{ backgroundColor }}>
      <Text className="text-[11px] font-medium" style={{ color }}>
        {formatPct(percent)}
      </Text>
    </View>
  )
}
