import { useEffect, useRef } from 'react'
import { View, Text, TouchableOpacity, Animated } from 'react-native'
import * as icons from 'lucide-react-native'

type Props = {
  message: string
  onClose: () => void
}

export function ErrorBanner({ message, onClose }: Props) {
  const opacity = useRef(new Animated.Value(0)).current
  const translateY = useRef(new Animated.Value(12)).current
  const shakeX = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const shakeStep = (toValue: number) =>
      Animated.timing(shakeX, { toValue, duration: 60, useNativeDriver: true })

    Animated.sequence([
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 280, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 0, duration: 280, useNativeDriver: true }),
      ]),
      Animated.sequence([shakeStep(-4), shakeStep(4), shakeStep(-3), shakeStep(2), shakeStep(0)]),
    ]).start()
  }, [opacity, translateY, shakeX])

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }, { translateX: shakeX }] }}
      className="flex-row items-start gap-2.5 px-3.5 py-3 rounded-2xl bg-[#FF4B6B]/10 border border-[#FF4B6B]/35">
      <View className="w-[26px] h-[26px] rounded-lg bg-[#FF4B6B]/20 items-center justify-center flex-shrink-0">
        <icons.CircleAlert size={14} color="#FF4B6B" />
      </View>
      <Text className="flex-1 text-[#FF4B6B] text-[13px] font-medium leading-[19px] pt-[3px]">
        {message}
      </Text>
      <TouchableOpacity className="p-1 opacity-60" onPress={onClose} activeOpacity={0.7}
        accessibilityLabel="Скрыть ошибку">
        <icons.X size={14} color="#FF4B6B" />
      </TouchableOpacity>
    </Animated.View>
  )
}
