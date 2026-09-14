import { View, Text } from 'react-native'
import { BudgetProgress, BUDGET_PROGRESS_HEIGHT } from './BudgetProgress'
import {
  formatKopecksUah,
  formatPct,
  getBudgetProgress,
} from './lib/spendingFormat'
import type { SubCategorySpendingRow } from './lib/aggregateCategorySpending'

/** Отступ вложенного содержимого под маркером подкатегории. */
const NESTED_INDENT = 13

/** Цвет маркера подкатегории в пределах бюджета. */
const DOT_COLOR_DEFAULT = '#44445A'

/** Цвет маркера подкатегории с превышенным бюджетом. */
const DOT_COLOR_EXCEEDED = 'rgba(255,75,107,0.6)'

type SubCategoryItemProps = {
  row: SubCategorySpendingRow
}

/** Строка подкатегории внутри раскрытой карточки категории. */
export function SubCategoryItem({ row }: SubCategoryItemProps) {
  const { hasBudget, pct, isExceeded } = getBudgetProgress(
    row.totalSpent,
    row.budget,
  )

  return (
    <View className="gap-1.5">
      <View className="flex-row items-center gap-2">
        <View
          className="h-[5px] w-[5px] rounded-full"
          style={{
            backgroundColor: isExceeded ? DOT_COLOR_EXCEEDED : DOT_COLOR_DEFAULT,
          }}
        />
        <Text className="flex-1 text-[13px] text-[#8888AA]">
          {row.subCategoryName}
        </Text>
        <Text
          className="text-[12px] font-bold"
          style={{
            fontFamily: 'SpaceMono_700Bold',
            color: isExceeded ? '#FF4B6B' : '#F2F2FF',
          }}
        >
          {formatKopecksUah(row.totalSpent)}
        </Text>
        <Text className="w-[38px] text-right text-[11px] text-[#44445A]">
          {formatPct(row.percentOfTotal)}
        </Text>
      </View>

      <View style={{ paddingLeft: NESTED_INDENT }}>
        <BudgetProgress
          totalSpent={row.totalSpent}
          budget={row.budget}
          height={BUDGET_PROGRESS_HEIGHT.nested}
        />
      </View>

      <View
        className="flex-row justify-between"
        style={{ paddingLeft: NESTED_INDENT }}
      >
        {hasBudget ? (
          <>
            <Text className="text-[10px] text-[#44445A]">
              {formatKopecksUah(row.totalSpent)} из{' '}
              {formatKopecksUah(row.budget ?? 0)} · {pct.toFixed(0)}%
            </Text>
            <Text
              className="text-[10px] text-[#44445A]"
              style={isExceeded ? { color: '#FF4B6B', fontWeight: '600' } : undefined}
            >
              {isExceeded
                ? `+${formatKopecksUah(row.totalSpent - (row.budget ?? 0))}`
                : `${pct.toFixed(0)}%`}
            </Text>
          </>
        ) : (
          <Text className="text-[10px] italic text-[#44445A]">
            бюджет не установлен
          </Text>
        )}
      </View>
    </View>
  )
}
