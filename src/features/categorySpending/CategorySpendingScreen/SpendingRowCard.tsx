import { View, Text } from 'react-native'
import { BudgetProgress, BUDGET_PROGRESS_HEIGHT } from './BudgetProgress'
import { BudgetMetaRow } from './BudgetMetaRow'
import { PercentBadge } from './PercentBadge'
import type { PercentBadgeVariant } from './PercentBadge'
import { SpendingIcon } from './SpendingIcon'
import { formatKopecksUah, getBudgetProgress } from './lib/spendingFormat'
import { buildCategoryRowId } from './lib/flattenSpendingRows'
import type { FlatSpendingRow } from './lib/flattenSpendingRows'

/** Прозрачность в hex для подложки иконки. */
const ICON_BG_ALPHA = '26'

/** Цвет иконки строки, у которой собственный цвет не задан. */
const ICON_COLOR_FALLBACK = '#44445A'

/** Ключ строки расходов, не отнесённых ни к одной категории. */
const UNCATEGORIZED_ROW_ID = buildCategoryRowId(null)

function getBadgeVariant(
  isMuted: boolean,
  isExceeded: boolean,
): PercentBadgeVariant {
  if (isMuted) return 'muted'
  return isExceeded ? 'exceeded' : 'normal'
}

type SpendingRowCardProps = {
  row: FlatSpendingRow
}

/** Строка плоского списка: подкатегория, остаток категории или категория без подкатегорий. */
export function SpendingRowCard({ row }: SpendingRowCardProps) {
  const { hasBudget, isExceeded } = getBudgetProgress(row.totalSpent, row.budget)
  const isMuted = row.id === UNCATEGORIZED_ROW_ID
  const iconColor = row.color ?? ICON_COLOR_FALLBACK
  const amountColor = isExceeded ? '#FF4B6B' : isMuted ? '#8888AA' : '#F2F2FF'

  return (
    <View className="gap-2.5 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#10101C] p-3.5">
      <View className="flex-row items-center gap-2.5">
        <View
          className="h-9 w-9 items-center justify-center rounded-lg"
          style={{ backgroundColor: iconColor + ICON_BG_ALPHA }}
        >
          <SpendingIcon name={row.icon} size={18} color={iconColor} />
        </View>

        <View className="min-w-0 flex-1">
          <Text
            className="text-[14px] font-semibold"
            style={{ color: isMuted ? '#8888AA' : '#F2F2FF' }}
          >
            {row.name}
          </Text>
          {row.parentName !== null && (
            <Text className="mt-0.5 text-[11px] text-[#44445A]">
              {row.parentName}
            </Text>
          )}
        </View>

        <View className="shrink-0 items-end gap-1">
          <Text
            className="text-[13px] font-bold"
            style={{ fontFamily: 'SpaceMono_700Bold', color: amountColor }}
          >
            {formatKopecksUah(row.totalSpent)}
          </Text>
          <PercentBadge
            percent={row.percentOfTotal}
            variant={getBadgeVariant(isMuted, isExceeded)}
          />
        </View>
      </View>

      <View className="gap-1.5">
        <BudgetProgress
          totalSpent={row.totalSpent}
          budget={row.budget}
          height={BUDGET_PROGRESS_HEIGHT.row}
        />
        {hasBudget ? (
          <BudgetMetaRow totalSpent={row.totalSpent} budget={row.budget} />
        ) : (
          <Text className="text-[10px] italic text-[#44445A]">
            бюджет не установлен
          </Text>
        )}
      </View>
    </View>
  )
}
