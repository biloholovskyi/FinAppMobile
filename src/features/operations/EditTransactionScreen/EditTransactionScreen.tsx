import { View, Text, TextInput, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Stack, router } from 'expo-router'
import * as icons from 'lucide-react-native'
import { WalletTransactionType } from '@/entities/transaction'
import { hexToRgba } from '@/shared/utils/colors'
import { useEditTransactionScreen } from './useEditTransactionScreen'
import { CategoryPickerModal } from './CategoryPickerModal/CategoryPickerModal'
import { WalletPickerModal } from './WalletPickerModal/WalletPickerModal'
import { SourceWalletPickerModal } from './SourceWalletPickerModal'
import { DateTimePickerModal } from './DateTimePickerModal/DateTimePickerModal'
import { FormRow } from './FormRow'

function formatTransactionTime(isoString: string): string {
  if (!isoString) return '—'
  const date = new Date(isoString)
  const now = new Date()
  const isToday = date.toDateString() === now.toDateString()
  const timeStr = date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
  if (isToday) return `Сегодня, ${timeStr}`
  return `${date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}, ${timeStr}`
}

const TYPE_COLOR: Record<WalletTransactionType, string> = {
  [WalletTransactionType.expense]: '#FF4B6B',
  [WalletTransactionType.income]: '#00E089',
  [WalletTransactionType.transfer]: '#4F9EFF',
}
const TYPE_SIGN: Record<WalletTransactionType, string> = {
  [WalletTransactionType.expense]: '−',
  [WalletTransactionType.income]: '+',
  [WalletTransactionType.transfer]: '',
}
const TYPE_LABEL: Record<WalletTransactionType, string> = {
  [WalletTransactionType.expense]: 'Расход',
  [WalletTransactionType.income]: 'Доход',
  [WalletTransactionType.transfer]: 'Перевод',
}
const TYPES = [WalletTransactionType.expense, WalletTransactionType.income, WalletTransactionType.transfer] as const

export function EditTransactionScreen() {
  const {
    isLoading, isSaving, isDeleting, isCreateMode,
    sourceWalletName, walletId,
    type, setType, amountStr, setAmountStr, description, setDescription, transactionTime, setTransactionTime,
    sourceWalletId, setSourceWalletId,
    categoryId, setCategoryId, subCategoryId, setSubCategoryId,
    targetWalletId, setTargetWalletId,
    isCategoryModalOpen, setIsCategoryModalOpen,
    isSubCategoryModalOpen, setIsSubCategoryModalOpen,
    isSourceWalletModalOpen, setIsSourceWalletModalOpen,
    isWalletModalOpen, setIsWalletModalOpen,
    isDatePickerOpen, setIsDatePickerOpen,
    showCategoryRows, showTargetWalletRow,
    selectedCategory, selectedSubCategory, selectedSourceWallet, selectedTargetWallet,
    hasSubCategories, categories, wallets, onSave, handleDelete,
  } = useEditTransactionScreen()

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-[#0A0A12] items-center justify-center">
        <Stack.Screen options={{ headerShown: false }} />
        <ActivityIndicator color="#4F9EFF" />
      </SafeAreaView>
    )
  }

  const accentColor = TYPE_COLOR[type]

  return (
    <SafeAreaView className="flex-1 bg-[#0A0A12]">
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-row items-center justify-between px-5 pt-2 pb-2.5">
        <TouchableOpacity className="flex-row items-center gap-1.5" onPress={() => router.back()} activeOpacity={0.7}>
          <icons.ChevronLeft size={18} color="#4F9EFF" />
          <Text className="text-[#4F9EFF] text-sm font-medium">Назад</Text>
        </TouchableOpacity>
        <Text className="text-[#F2F2FF] text-[17px] font-bold">
          {isCreateMode ? 'Создать' : 'Редактировать'}
        </Text>
        <View className="w-14" />
      </View>

      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerClassName="pb-8">
          <View className="px-5 pb-4">
            <View className="flex-row bg-[#181828] border border-white/[0.08] rounded-2xl p-1 gap-0.5">
              {TYPES.map(t => (
                <TouchableOpacity key={t} className="flex-1 py-2 rounded-lg items-center"
                  style={type === t ? { backgroundColor: hexToRgba(TYPE_COLOR[t], 0.2) } : undefined}
                  onPress={() => setType(t)} activeOpacity={0.7}>
                  <Text className="text-[13px] font-semibold" style={{ color: type === t ? TYPE_COLOR[t] : '#44445A' }}>
                    {TYPE_LABEL[t]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View className="items-center px-5 pb-6 gap-1.5">
            <Text className="text-[#8888AA] text-[11px] font-medium uppercase tracking-[0.6px]">Сумма</Text>
            <View className="flex-row items-baseline justify-center w-full pb-2.5 border-b" style={{ borderBottomColor: accentColor }}>
              {TYPE_SIGN[type] ? <Text style={{ color: accentColor, fontSize: 36, fontWeight: '700', marginRight: 2 }}>{TYPE_SIGN[type]}</Text> : null}
              <TextInput className="text-[#F2F2FF] text-center min-w-[40px] max-w-[220px]"
                style={{ fontSize: 42, fontWeight: '700', letterSpacing: -2 }}
                value={amountStr} onChangeText={setAmountStr} keyboardType="decimal-pad" maxLength={10} selectTextOnFocus />
              <Text className="text-[#8888AA]" style={{ fontSize: 24, fontWeight: '700' }}>₴</Text>
            </View>
          </View>

          <View className="mx-5 bg-[#10101C] border border-white/[0.08] rounded-2xl overflow-hidden">
            <FormRow icon="building-2" label="Кошелёк"
              value={sourceWalletName || undefined} isEmpty={isCreateMode && !selectedSourceWallet}
              onPress={isCreateMode ? () => setIsSourceWalletModalOpen(true) : undefined}
              showChevron={isCreateMode} />
            {showTargetWalletRow && (
              <FormRow icon="wallet" label="Кошелёк-получатель"
                value={selectedTargetWallet?.name ?? 'Выберите...'} isEmpty={!selectedTargetWallet}
                onPress={() => setIsWalletModalOpen(true)} showChevron />
            )}
            {showCategoryRows && (
              <FormRow icon="tag" label="Категория" value={selectedCategory?.name}
                categoryColor={selectedCategory?.color ?? undefined} isEmpty={!selectedCategory}
                onPress={() => setIsCategoryModalOpen(true)} showChevron />
            )}
            {showCategoryRows && hasSubCategories && (
              <FormRow icon="tag" label="Подкатегория" value={selectedSubCategory?.name}
                categoryColor={selectedSubCategory?.color ?? undefined} isEmpty={!selectedSubCategory}
                onPress={() => setIsSubCategoryModalOpen(true)} showChevron />
            )}
            <View className="flex-row items-center gap-3 px-4 py-3.5 border-b border-white/[0.04]">
              <View className="w-[30px] h-[30px] rounded-lg bg-[#181828] border border-white/[0.04] items-center justify-center flex-shrink-0">
                <icons.PencilLine size={14} color="#8888AA" />
              </View>
              <View className="flex-1 gap-[1px]">
                <Text className="text-[#8888AA] text-[11px] font-medium">Описание</Text>
                <TextInput className="text-[#F2F2FF] text-sm" value={description} onChangeText={setDescription}
                  placeholder="Добавить описание..." placeholderTextColor="#44445A" maxLength={512} />
              </View>
            </View>
            <FormRow icon="calendar" label="Дата и время"
              value={formatTransactionTime(transactionTime)}
              onPress={() => setIsDatePickerOpen(true)} showChevron />
          </View>

          <View className="px-5 pt-5 gap-2.5">
            <TouchableOpacity className="w-full py-4 rounded-2xl items-center" style={{ backgroundColor: accentColor }}
              onPress={onSave} disabled={isSaving || isDeleting} activeOpacity={0.85}>
              {isSaving ? <ActivityIndicator color="#080810" size="small" /> :
                <Text style={{ color: '#080810', fontSize: 15, fontWeight: '600' }}>Сохранить</Text>}
            </TouchableOpacity>
            {!isCreateMode && (
              <TouchableOpacity className="w-full py-3 items-center" onPress={() => handleDelete()}
                disabled={isSaving || isDeleting} activeOpacity={0.7}>
                {isDeleting ? <ActivityIndicator color="#FF4B6B" size="small" /> :
                  <Text className="text-[#FF4B6B] text-sm font-medium">Удалить транзакцию</Text>}
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <CategoryPickerModal visible={isCategoryModalOpen} title="Категория" categories={categories}
        selectedId={categoryId} onSelect={id => { setCategoryId(id); setSubCategoryId(null) }}
        onClose={() => setIsCategoryModalOpen(false)} />
      <CategoryPickerModal visible={isSubCategoryModalOpen} title="Подкатегория"
        categories={selectedCategory?.subCategory ?? []} selectedId={subCategoryId}
        onSelect={setSubCategoryId} onClose={() => setIsSubCategoryModalOpen(false)} />
      <SourceWalletPickerModal visible={isSourceWalletModalOpen} wallets={wallets}
        selectedId={sourceWalletId} excludeId={targetWalletId}
        onSelect={setSourceWalletId}
        onClose={() => setIsSourceWalletModalOpen(false)} />
      <WalletPickerModal visible={isWalletModalOpen} wallets={wallets} selectedId={targetWalletId}
        sourceWalletId={walletId} onSelect={setTargetWalletId} onClose={() => setIsWalletModalOpen(false)} />
      <DateTimePickerModal
        visible={isDatePickerOpen}
        value={transactionTime ? new Date(transactionTime) : new Date()}
        onChange={date => setTransactionTime(date.toISOString())}
        onClose={() => setIsDatePickerOpen(false)}
      />
    </SafeAreaView>
  )
}
