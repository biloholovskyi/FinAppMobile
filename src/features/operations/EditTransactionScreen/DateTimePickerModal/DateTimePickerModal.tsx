import { useEffect, useState } from 'react'
import { Modal, View, Text, TouchableOpacity, Pressable, Platform } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import type { DateTimePickerEvent } from '@react-native-community/datetimepicker'
import * as icons from 'lucide-react-native'

type Props = {
  visible: boolean
  value: Date
  onChange: (date: Date) => void
  onClose: () => void
}

export function DateTimePickerModal({ visible, value, onChange, onClose }: Props) {
  const [androidStep, setAndroidStep] = useState<'date' | 'time'>('date')
  const [pendingDate, setPendingDate] = useState<Date>(value)

  useEffect(() => {
    if (visible) {
      setPendingDate(value)
      setAndroidStep('date')
    }
  }, [visible, value])

  if (Platform.OS === 'android') {
    return (
      <>
        {visible && androidStep === 'date' && (
          <DateTimePicker
            value={pendingDate}
            mode="date"
            display="default"
            onChange={(event: DateTimePickerEvent, date?: Date) => {
              if (event.type === 'dismissed') {
                onClose()
                return
              }
              if (date) {
                setPendingDate(date)
                setAndroidStep('time')
              }
            }}
          />
        )}
        {visible && androidStep === 'time' && (
          <DateTimePicker
            value={pendingDate}
            mode="time"
            display="default"
            onChange={(event: DateTimePickerEvent, date?: Date) => {
              if (event.type !== 'dismissed' && date) {
                onChange(date)
              }
              onClose()
            }}
          />
        )}
      </>
    )
  }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable className="flex-1 bg-black/50" onPress={onClose} />
      <View className="bg-[#10101C] rounded-t-3xl border-t border-white/[0.08]">
        <View className="flex-row items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <Text className="text-[#F2F2FF] text-base font-semibold">Дата и время</Text>
          <TouchableOpacity onPress={onClose} hitSlop={8}>
            <icons.X size={20} color="#8888AA" />
          </TouchableOpacity>
        </View>
        <DateTimePicker
          value={value}
          mode="datetime"
          display="spinner"
          themeVariant="dark"
          textColor="#F2F2FF"
          onChange={(_event: DateTimePickerEvent, date?: Date) => {
            if (date) onChange(date)
          }}
        />
        <View className="px-5 pb-8 pt-2">
          <TouchableOpacity
            className="w-full py-4 rounded-2xl items-center bg-[#4F9EFF]"
            onPress={onClose}
            activeOpacity={0.85}
          >
            <Text style={{ color: '#080810', fontSize: 15, fontWeight: '600' }}>Готово</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}
