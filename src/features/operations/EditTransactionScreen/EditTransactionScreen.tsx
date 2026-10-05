import { View, Text, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Stack, router } from 'expo-router'
import * as icons from 'lucide-react-native'
import { useEditTransactionScreen } from './useEditTransactionScreen'
import { CategoryPickerModal } from './CategoryPickerModal/CategoryPickerModal'
import { WalletPickerModal } from './WalletPickerModal/WalletPickerModal'
import { SourceWalletPickerModal } from './SourceWalletPickerModal'
import { DateTimePickerModal } from './DateTimePickerModal/DateTimePickerModal'
import { FormRow } from './FormRow'
import { CreditedAmountRow } from './CreditedAmountRow'
import { ErrorBanner } from './ErrorBanner'
import { TypeSegment, TYPE_COLOR, TYPE_SIGN } from './TypeSegment'
import { AmountField } from './AmountField'
import { DescriptionRow } from './DescriptionRow'
import { ActionButtons } from './ActionButtons'
import { SplitButton } from './SplitPaymentCard/SplitButton'
import { SplitPaymentCard } from './SplitPaymentCard/SplitPaymentCard'

function formatTransactionTime(isoString: string): string {
  if (!isoString) return '—'
  const date = new Date(isoString)
  const now = new Date()
  const isToday = date.toDateString() === now.toDateString()
  const timeStr = date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
  if (isToday) return `Сегодня, ${timeStr}`
  return `${date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}, ${timeStr}`
}

export function EditTransactionScreen() {
  const {
    isLoading, isSaving, isDeleting, isCreateMode,
    sourceWalletName, walletId,
    type, setType, setAmountStr, description, setDescription, transactionTime, setTransactionTime,
    split, onRemoveSplit, amountValue, isAmountReadOnly, amountHint, uahEquivalent,
    sourceWalletId, setSourceWalletId,
    categoryId, setCategoryId, subCategoryId, setSubCategoryId,
    targetWalletId, setTargetWalletId,
    isCategoryModalOpen, setIsCategoryModalOpen,
    isSubCategoryModalOpen, setIsSubCategoryModalOpen,
    isSourceWalletModalOpen, setIsSourceWalletModalOpen,
    isWalletModalOpen, setIsWalletModalOpen,
    isDatePickerOpen, setIsDatePickerOpen,
    showCategoryRows, showTargetWalletRow,
    showCreditedRow, creditedValue, onCreditedChange, sourceCurrency, targetCurrency, conversionRate,
    selectedCategory, selectedSubCategory, selectedSourceWallet, selectedTargetWallet,
    hasSubCategories, categories, wallets, onSave, handleDelete,
    errorMessage, clearError,
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
          <TypeSegment type={type} onChange={setType} />

          <AmountField
            value={amountValue}
            onChangeText={setAmountStr}
            accentColor={accentColor}
            sign={TYPE_SIGN[type]}
            currency={sourceCurrency}
            isReadOnly={isAmountReadOnly}
            hint={amountHint}
            uahEquivalent={uahEquivalent}
          />

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
            {showCreditedRow && (
              <CreditedAmountRow value={creditedValue} onChangeText={onCreditedChange}
                sourceCurrency={sourceCurrency} targetCurrency={targetCurrency} rate={conversionRate} />
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
            <DescriptionRow value={description} onChangeText={setDescription} />
            <FormRow icon="calendar" label="Дата и время"
              value={formatTransactionTime(transactionTime)}
              onPress={() => setIsDatePickerOpen(true)} showChevron />
          </View>

          {split.isSplitActive && (
            <SplitPaymentCard
              categories={categories}
              part={{
                categoryId: split.splitCategoryId,
                subCategoryId: split.splitSubCategoryId,
                amountStr: split.splitAmountStr,
              }}
              currency={sourceCurrency}
              onSelectCategory={split.selectSplitCategory}
              onSelectSubCategory={split.setSplitSubCategoryId}
              onChangeAmount={split.changeSplitAmount}
              onRemove={onRemoveSplit}
            />
          )}

          {split.canSplit && (
            <View className="px-5 pt-3">
              <SplitButton onPress={split.enableSplit} />
            </View>
          )}

          <View className="px-5 pt-5 gap-2.5">
            {errorMessage && <ErrorBanner message={errorMessage} onClose={clearError} />}
            <ActionButtons
              accentColor={accentColor}
              isSaving={isSaving}
              isDeleting={isDeleting}
              showDelete={!isCreateMode}
              onSave={onSave}
              onDelete={handleDelete}
            />
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
