import { useState, useCallback } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { ChevronDown } from 'lucide-react-native'
import { BudgetProgress, BUDGET_PROGRESS_HEIGHT } from './BudgetProgress'
import { BudgetMetaRow } from './BudgetMetaRow'
import { PercentBadge } from './PercentBadge'
import { SpendingIcon } from './SpendingIcon'
import { SubCategoryItem } from './SubCategoryItem'
import { formatKopecksUah, getBudgetProgress } from './lib/spendingFormat'
import type { CategorySpendingRow } from './lib/aggregateCategorySpending'

/** Прозрачность в hex для подложки иконки категории. */
const ICON_BG_ALPHA = '26'

/** Цвет иконки категории, у которой собственный цвет не задан. */
const ICON_COLOR_FALLBACK = '#44445A'

type CategoryCardProps = {
  row: CategorySpendingRow
}

/** Карточка категории с раскрытием списка подкатегорий. */
export function CategoryCard({ row }: CategoryCardProps) {
  const [isOpen, setIsOpen] = useState(false)
  const hasSubCategories = row.subCategories.length > 0

  const handlePress = useCallback(() => {
    if (hasSubCategories) setIsOpen((v) => !v)
  }, [hasSubCategories])

  const { hasBudget, isExceeded } = getBudgetProgress(row.totalSpent, row.budget)
  const iconColor = row.categoryColor ?? ICON_COLOR_FALLBACK

  return (
    <View
      className="overflow-hidden rounded-2xl bg-[#10101C]"
      style={{
        borderWidth: 1,
        borderColor: isOpen
          ? 'rgba(255,255,255,0.12)'
          : 'rgba(255,255,255,0.08)',
      }}
    >
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={hasSubCategories ? 0.7 : 1}
        className="gap-2.5 p-3.5"
      >
        <View className="flex-row items-center gap-2.5">
          <View
            className="h-9 w-9 items-center justify-center rounded-lg"
            style={{ backgroundColor: iconColor + ICON_BG_ALPHA }}
          >
            <SpendingIcon name={row.categoryIcon} size={18} color={iconColor} />
          </View>

          <View className="min-w-0 flex-1">
            <View className="flex-row flex-wrap items-center gap-1.5">
              <Text className="text-[14px] font-semibold text-[#F2F2FF]">
                {row.categoryName}
              </Text>
              {hasSubCategories && (
                <View className="rounded-full bg-[#181828] px-1.5 py-[1px]">
                  <Text className="text-[10px] text-[#44445A]">
                    {row.subCategories.length}
                  </Text>
                </View>
              )}
            </View>
            {hasBudget && (
              <Text className="mt-0.5 text-[11px] text-[#44445A]">
                Бюджет: {formatKopecksUah(row.budget ?? 0)}
              </Text>
            )}
          </View>

          <View className="shrink-0 items-end gap-1">
            <Text
              className="text-[13px] font-bold"
              style={{
                fontFamily: 'SpaceMono_700Bold',
                color: isExceeded ? '#FF4B6B' : '#F2F2FF',
              }}
            >
              {formatKopecksUah(row.totalSpent)}
            </Text>
            <PercentBadge
              percent={row.percentOfTotal}
              variant={isExceeded ? 'exceeded' : 'normal'}
            />
          </View>

          <View style={{ opacity: hasSubCategories ? 1 : 0 }}>
            <View
              style={{ transform: [{ rotate: isOpen ? '180deg' : '0deg' }] }}
            >
              <ChevronDown size={15} color={isOpen ? '#4F9EFF' : '#44445A'} />
            </View>
          </View>
        </View>

        {hasBudget && (
          <View className="gap-1.5">
            <BudgetProgress
              totalSpent={row.totalSpent}
              budget={row.budget}
              height={BUDGET_PROGRESS_HEIGHT.row}
            />
            <BudgetMetaRow totalSpent={row.totalSpent} budget={row.budget} />
          </View>
        )}
      </TouchableOpacity>

      {isOpen && hasSubCategories && (
        <View className="gap-3 border-t border-white/[0.04] px-3.5 pb-3.5 pt-2">
          {row.subCategories.map((sub) => (
            <SubCategoryItem key={sub.subCategoryId} row={sub} />
          ))}
        </View>
      )}
    </View>
  )
}
