import { View } from 'react-native'
import { UNCATEGORIZED_SUB_LABEL } from '@/shared/constants'
import { SubCategoryItem } from './SubCategoryItem'
import type {
  CategorySpendingRow,
  SubCategorySpendingRow,
} from './lib/aggregateCategorySpending'
import { buildRemainderLeafKey, buildSubCategoryLeafKey } from '../lib/spendingLeaf'

type SubCategoryListProps = {
  row: CategorySpendingRow
  onOpenLeaf: (leafKey: string) => void
}

/** Расходы категории вне подкатегорий в виде строки подкатегории; `null`, если остатка нет. */
function buildRemainderRow(row: CategorySpendingRow): SubCategorySpendingRow | null {
  const subTotal = row.subCategories.reduce((sum, sub) => sum + sub.totalSpent, 0)
  const remainder = row.totalSpent - subTotal
  if (remainder <= 0) return null

  return {
    subCategoryId: buildRemainderLeafKey(row.categoryId),
    subCategoryName: UNCATEGORIZED_SUB_LABEL,
    totalSpent: remainder,
    budget: null,
    percentOfTotal: (row.percentOfTotal * remainder) / row.totalSpent,
  }
}

/** Подкатегории раскрытой карточки и строка остатка без подкатегории. */
export function SubCategoryList({ row, onOpenLeaf }: SubCategoryListProps) {
  const remainderRow = buildRemainderRow(row)

  return (
    <View className="gap-3 border-t border-white/[0.04] px-3.5 pb-3.5 pt-2">
      {row.subCategories.map((sub) => (
        <SubCategoryItem
          key={sub.subCategoryId}
          row={sub}
          onPress={() => onOpenLeaf(buildSubCategoryLeafKey(sub.subCategoryId))}
        />
      ))}
      {remainderRow && (
        <SubCategoryItem
          key={remainderRow.subCategoryId}
          row={remainderRow}
          onPress={() => onOpenLeaf(remainderRow.subCategoryId)}
        />
      )}
    </View>
  )
}
