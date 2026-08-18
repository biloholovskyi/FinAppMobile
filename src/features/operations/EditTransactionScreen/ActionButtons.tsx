import { Text, TouchableOpacity, ActivityIndicator } from 'react-native'

type ActionButtonsProps = {
  accentColor: string
  isSaving: boolean
  isDeleting: boolean
  showDelete: boolean
  onSave: () => void
  onDelete: () => void
}

export function ActionButtons({
  accentColor,
  isSaving,
  isDeleting,
  showDelete,
  onSave,
  onDelete,
}: ActionButtonsProps) {
  return (
    <>
      <TouchableOpacity
        className="w-full py-4 rounded-2xl items-center"
        style={{ backgroundColor: accentColor }}
        onPress={onSave}
        disabled={isSaving || isDeleting}
        activeOpacity={0.85}
      >
        {isSaving ? (
          <ActivityIndicator color="#080810" size="small" />
        ) : (
          <Text style={{ color: '#080810', fontSize: 15, fontWeight: '600' }}>Сохранить</Text>
        )}
      </TouchableOpacity>
      {showDelete && (
        <TouchableOpacity
          className="w-full py-3 items-center"
          onPress={onDelete}
          disabled={isSaving || isDeleting}
          activeOpacity={0.7}
        >
          {isDeleting ? (
            <ActivityIndicator color="#FF4B6B" size="small" />
          ) : (
            <Text className="text-[#FF4B6B] text-sm font-medium">Удалить транзакцию</Text>
          )}
        </TouchableOpacity>
      )}
    </>
  )
}
