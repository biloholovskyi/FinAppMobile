import { useEffect } from 'react'
import { View } from 'react-native'
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated'

/** Длительность полупериода пульсации плейсхолдера. */
const PULSE_DURATION_MS = 800

/** Нижняя граница прозрачности плейсхолдера. */
const PULSE_MIN_OPACITY = 0.45

export function SkeletonRow() {
  const opacity = useSharedValue(PULSE_MIN_OPACITY)

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, { duration: PULSE_DURATION_MS, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    )
  }, [opacity])

  const pulseStyle = useAnimatedStyle(() => ({ opacity: opacity.value }))

  return (
    <Animated.View style={pulseStyle}>
      <View className="flex-row items-center gap-3 py-2.5">
        <View className="w-[38px] h-[38px] rounded-xl bg-[#181828] flex-shrink-0" />
        <View className="flex-1 min-w-0 gap-[7px]">
          <View className="h-[9px] w-3/5 rounded-lg bg-[#181828]" />
          <View className="h-[9px] w-2/5 rounded-lg bg-[#181828]" />
        </View>
        <View className="w-[46px] h-3 rounded-lg bg-[#181828] flex-shrink-0" />
      </View>
    </Animated.View>
  )
}
