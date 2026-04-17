# Category Edit Screen Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Реализовать экран создания и редактирования категории/подкатегории с 4 режимами работы через два маршрута Expo Router.

**Architecture:** Один feature-компонент `CategoryEditScreen` покрывает режимы create-category, create-subcategory, edit-category, edit-subcategory. Режим определяется по параметрам маршрута. Данные для edit берутся из кэша TanStack Query без дополнительного запроса.

**Tech Stack:** React Native, Expo Router v3, NativeWind v4, TanStack Query v5, Axios, lucide-react-native, TypeScript strict.

---

## File Map

| Файл | Действие | Ответственность |
|---|---|---|
| `src/entities/category/index.ts` | Изменить | Добавить `CategoryPriority` enum |
| `src/shared/api/categories.ts` | Изменить | Добавить 4 API-функции |
| `src/app/_layout.tsx` | Изменить | Зарегистрировать новые маршруты |
| `src/app/category/create.tsx` | Создать | Роут создания категории |
| `src/app/category/[id].tsx` | Создать | Роут редактирования категории |
| `src/features/categories/CategoriesScreen/CategoryCard.tsx` | Изменить | Сигнатура onEdit + кнопка добавления подкатегории с навигацией |
| `src/features/categories/CategoriesScreen/useCategoriesScreen.ts` | Изменить | Реализовать handleAddCategory, handleEdit |
| `src/features/categories/CategoryEditScreen/useCategoryEditScreen.ts` | Создать | Хук с логикой форм и мутаций |
| `src/features/categories/CategoryEditScreen/CategoryEditScreen.tsx` | Создать | UI экрана |

---

## Task 1: CategoryPriority enum

**Files:**
- Modify: `src/entities/category/index.ts`

- [ ] **Шаг 1: Добавить enum и обновить CategoryModel**

Заменить содержимое файла `src/entities/category/index.ts`:

```ts
export enum CategoryPriority {
  High = 'hight',
  Medium = 'medium',
  Low = 'low',
}

export type CategoryModel = {
  id: string
  name: string
  priority: string
  color?: string
  icon?: string
  subCategory?: CategoryModel[]
  createdAt: string
  updatedAt: string
}
```

`priority` остаётся `string` в модели (API возвращает строку), enum используется только при отправке данных.

- [ ] **Шаг 2: Проверить линт**

```bash
rtk yarn lint
```

Ошибок быть не должно.

---

## Task 2: API-функции для категорий

**Files:**
- Modify: `src/shared/api/categories.ts`

- [ ] **Шаг 1: Добавить типы и функции**

Заменить содержимое файла `src/shared/api/categories.ts`:

```ts
import { apiClient } from './base'
import type { CategoryModel } from '@/entities/category'
import { CategoryPriority } from '@/entities/category'

export type CategoryBaseDto = {
  name: string
  priority?: CategoryPriority
  color?: string
  icon?: string
}

export type UpdateCategoryDto = Partial<CategoryBaseDto>

export const fetchCategories = (): Promise<CategoryModel[]> =>
  apiClient.get('/categories').then(r => r.data)

export const createCategory = (dto: CategoryBaseDto): Promise<CategoryModel> =>
  apiClient.post('/categories', dto).then(r => r.data)

export const createSubcategory = (
  parentId: string,
  dto: CategoryBaseDto,
): Promise<CategoryModel> =>
  apiClient.post(`/categories/${parentId}/subcategories`, dto).then(r => r.data)

export const updateCategory = (
  id: string,
  dto: UpdateCategoryDto,
): Promise<CategoryModel> =>
  apiClient.put(`/categories/${id}`, dto).then(r => r.data)

export const updateSubcategory = (
  id: string,
  dto: UpdateCategoryDto,
): Promise<CategoryModel> =>
  apiClient.put(`/subcategories/${id}`, dto).then(r => r.data)
```

- [ ] **Шаг 2: Проверить линт**

```bash
rtk yarn lint
```

---

## Task 3: Роуты и регистрация в layout

**Files:**
- Modify: `src/app/_layout.tsx`
- Create: `src/app/category/create.tsx`
- Create: `src/app/category/[id].tsx`

- [ ] **Шаг 1: Создать директорию и файл роута создания**

Создать `src/app/category/create.tsx`:

```tsx
import { useLocalSearchParams } from 'expo-router'
import { CategoryEditScreen } from '@/features/categories/CategoryEditScreen/CategoryEditScreen'

export default function CategoryCreateRoute() {
  const { parentId } = useLocalSearchParams<{ parentId?: string }>()
  return <CategoryEditScreen parentId={parentId} />
}
```

- [ ] **Шаг 2: Создать файл роута редактирования**

Создать `src/app/category/[id].tsx`:

```tsx
import { useLocalSearchParams } from 'expo-router'
import { CategoryEditScreen } from '@/features/categories/CategoryEditScreen/CategoryEditScreen'

export default function CategoryEditRoute() {
  const { id, isSubcategory } = useLocalSearchParams<{ id: string; isSubcategory?: string }>()
  return <CategoryEditScreen id={id} isSubcategory={isSubcategory} />
}
```

- [ ] **Шаг 3: Зарегистрировать маршруты в `src/app/_layout.tsx`**

```tsx
import "../../global.css";

import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { queryClient } from "@/shared/lib/queryClient";

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="transaction/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="category/create" options={{ headerShown: false }} />
          <Stack.Screen name="category/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
```

- [ ] **Шаг 4: Проверить линт**

```bash
rtk yarn lint
```

---

## Task 4: Обновить CategoryCard — сигнатура onEdit и кнопка добавления подкатегории

**Files:**
- Modify: `src/features/categories/CategoriesScreen/CategoryCard.tsx`

Изменяем сигнатуру `onEdit` — добавляем флаг `isSubcategory`. Кнопка "Добавить подкатегорию" теперь вызывает `onAddSubcategory`.

- [ ] **Шаг 1: Обновить типы и Props**

В `CategoryCard.tsx` заменить типы Props и SubRowProps:

```ts
type Props = {
  category: CategoryModel
  onEdit: (id: string, isSubcategory?: boolean) => void
  onDelete: (id: string) => void
  onAddSubcategory: (parentId: string) => void
}

type SubRowProps = {
  sub: CategoryModel
  onEdit: (id: string, isSubcategory?: boolean) => void
  onDelete: (id: string) => void
}
```

- [ ] **Шаг 2: Обновить SubRow — передавать isSubcategory=true**

Внутри `SubRow` изменить вызов `onEdit`:

```tsx
onPress={() => onEdit(sub.id, true)}
```

- [ ] **Шаг 3: Обновить CategoryCard — передать onAddSubcategory**

В сигнатуре `CategoryCard` добавить `onAddSubcategory` в props и передать в кнопку:

```tsx
export function CategoryCard({ category, onEdit, onDelete, onAddSubcategory }: Props) {
```

Кнопку "Добавить подкатегорию" обновить:

```tsx
<TouchableOpacity
  className="flex-row items-center gap-2 pl-8 pr-3.5 py-2.5 opacity-70"
  activeOpacity={0.8}
  onPress={() => onAddSubcategory(category.id)}
>
  <Plus size={13} color="#4F9EFF" />
  <Text className="text-[#4F9EFF] text-[12px] font-semibold">Добавить подкатегорию</Text>
</TouchableOpacity>
```

- [ ] **Шаг 4: Передать SubRow в CategoryCard с обновлёнными props**

```tsx
{category.subCategory!.map(sub => (
  <SubRow key={sub.id} sub={sub} onEdit={onEdit} onDelete={onDelete} />
))}
```

- [ ] **Шаг 5: Проверить линт**

```bash
rtk yarn lint
```

---

## Task 5: Обновить useCategoriesScreen — реализовать навигацию

**Files:**
- Modify: `src/features/categories/CategoriesScreen/useCategoriesScreen.ts`

- [ ] **Шаг 1: Заменить содержимое хука**

```ts
import { useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { fetchCategories } from '@/shared/api/categories'
import { QUERY_KEYS } from '@/shared/constants/queryKeys'
import type { CategoryModel } from '@/entities/category'

export function useCategoriesScreen() {
  const router = useRouter()

  const { data = [], isLoading, refetch, isRefetching } = useQuery<CategoryModel[]>({
    queryKey: QUERY_KEYS.categories.all,
    queryFn: fetchCategories,
  })

  const handleAddCategory = useCallback(() => {
    router.push('/category/create')
  }, [router])

  const handleEdit = useCallback(
    (id: string, isSubcategory?: boolean) => {
      router.push({
        pathname: '/category/[id]',
        params: { id, ...(isSubcategory && { isSubcategory: 'true' }) },
      })
    },
    [router],
  )

  const handleAddSubcategory = useCallback(
    (parentId: string) => {
      router.push({
        pathname: '/category/create',
        params: { parentId },
      })
    },
    [router],
  )

  const handleDelete = useCallback((_id: string) => {
    // TODO: показать подтверждение удаления
  }, [])

  return {
    categories: data,
    isLoading,
    refetch,
    isRefetching,
    handleAddCategory,
    handleEdit,
    handleDelete,
    handleAddSubcategory,
  }
}
```

- [ ] **Шаг 2: Обновить CategoriesScreen.tsx — передать handleAddSubcategory в CategoryCard**

В `src/features/categories/CategoriesScreen/CategoriesScreen.tsx` добавить `handleAddSubcategory` из хука и передать в `CategoryCard`:

```tsx
const {
  categories,
  isLoading,
  refetch,
  isRefetching,
  handleAddCategory,
  handleEdit,
  handleDelete,
  handleAddSubcategory,
} = useCategoriesScreen()

const renderItem = useCallback(
  ({ item }: { item: CategoryModel }) => (
    <CategoryCard
      category={item}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onAddSubcategory={handleAddSubcategory}
    />
  ),
  [handleEdit, handleDelete, handleAddSubcategory],
)
```

- [ ] **Шаг 3: Проверить линт**

```bash
rtk yarn lint
```

---

## Task 6: Хук useCategoryEditScreen

**Files:**
- Create: `src/features/categories/CategoryEditScreen/useCategoryEditScreen.ts`

- [ ] **Шаг 1: Создать хук**

```ts
import { useState, useCallback, useMemo, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import {
  fetchCategories,
  createCategory,
  createSubcategory,
  updateCategory,
  updateSubcategory,
} from '@/shared/api/categories'
import { QUERY_KEYS } from '@/shared/constants/queryKeys'
import { CategoryPriority } from '@/entities/category'

type Params = { id?: string; parentId?: string; isSubcategory?: string }

export function useCategoryEditScreen({ id, parentId, isSubcategory }: Params) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const isEditMode = !!id
  const isSubMode = isSubcategory === 'true' || !!parentId

  const { data: categories = [] } = useQuery({
    queryKey: QUERY_KEYS.categories.all,
    queryFn: fetchCategories,
    enabled: isEditMode,
  })

  const existing = useMemo(() => {
    if (!isEditMode) return null
    if (isSubMode) {
      for (const cat of categories) {
        const sub = cat.subCategory?.find(s => s.id === id)
        if (sub) return sub
      }
      return null
    }
    return categories.find(c => c.id === id) ?? null
  }, [categories, id, isEditMode, isSubMode])

  const [name, setName] = useState('')
  const [priority, setPriority] = useState<CategoryPriority>(CategoryPriority.Medium)
  const [color, setColor] = useState('#4F9EFF')
  const [icon, setIcon] = useState('zap')
  const [isSubToggle, setIsSubToggle] = useState(!isEditMode && isSubMode)

  useEffect(() => {
    if (existing) {
      setName(existing.name)
      setPriority((existing.priority as CategoryPriority) ?? CategoryPriority.Medium)
      setColor(existing.color ?? '#4F9EFF')
      setIcon(existing.icon ?? 'zap')
    }
  }, [existing?.id])

  const { mutate, isPending } = useMutation({
    mutationFn: () => {
      const dto = { name, priority, color, icon }
      if (isEditMode) {
        return isSubMode ? updateSubcategory(id!, dto) : updateCategory(id!, dto)
      }
      return isSubToggle && parentId
        ? createSubcategory(parentId, dto)
        : createCategory(dto)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.categories.all })
      router.back()
    },
  })

  const handleSubmit = useCallback(() => mutate(), [mutate])

  const title = useMemo(() => {
    if (isEditMode) return existing?.name ?? (isSubMode ? 'Подкатегория' : 'Категория')
    return isSubToggle ? 'Новая подкатегория' : 'Новая категория'
  }, [isEditMode, existing?.name, isSubMode, isSubToggle])

  return {
    name, setName,
    priority, setPriority,
    color, setColor,
    icon, setIcon,
    isSubToggle, setIsSubToggle,
    isEditMode,
    isSubMode,
    parentId,
    title,
    handleSubmit,
    isPending,
  }
}
```

- [ ] **Шаг 2: Проверить линт**

```bash
rtk yarn lint
```

---

## Task 7: Компонент CategoryEditScreen

**Files:**
- Create: `src/features/categories/CategoryEditScreen/CategoryEditScreen.tsx`

- [ ] **Шаг 1: Создать файл компонента**

```tsx
import { ScrollView, View, Text, TextInput, TouchableOpacity, Switch, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ChevronLeft, Check, Tag, Layers } from 'lucide-react-native'
import { useRouter } from 'expo-router'
import { resolveIcon } from '@/shared/utils/icons'
import { hexToRgba } from '@/shared/utils/colors'
import { CategoryPriority } from '@/entities/category'
import { useCategoryEditScreen } from './useCategoryEditScreen'

const COLORS = [
  '#FF4B6B','#FB923C','#FFB020','#EAB308',
  '#84CC16','#00E089','#2DD4BF','#22D3EE',
  '#4F9EFF','#818CF8','#A374FF','#F472B6',
]

const ICONS = [
  'shopping-cart','coffee','car','home','heart',
  'zap','music','film','book','briefcase',
  'plane','utensils','dumbbell','gift','smartphone',
  'globe','credit-card','trending-up','shield','star',
]

const PRIORITIES = [
  { value: CategoryPriority.Low, label: 'Низкий' },
  { value: CategoryPriority.Medium, label: 'Средний' },
  { value: CategoryPriority.High, label: 'Высокий' },
]

type Props = { id?: string; parentId?: string; isSubcategory?: string }

export function CategoryEditScreen({ id, parentId, isSubcategory }: Props) {
  const router = useRouter()
  const {
    name, setName,
    priority, setPriority,
    color, setColor,
    icon, setIcon,
    isSubToggle, setIsSubToggle,
    isEditMode,
    title,
    handleSubmit,
    isPending,
  } = useCategoryEditScreen({ id, parentId, isSubcategory })

  const IconComponent = resolveIcon(icon)

  return (
    <SafeAreaView className="flex-1 bg-[#0A0A12]">
      {/* Nav bar */}
      <View className="flex-row items-center justify-between px-5 pt-3 pb-2">
        <TouchableOpacity
          className="flex-row items-center gap-1"
          activeOpacity={0.7}
          onPress={() => router.back()}
        >
          <ChevronLeft size={18} color="#4F9EFF" />
          <Text className="text-[#4F9EFF] text-[14px] font-medium">Назад</Text>
        </TouchableOpacity>
        <Text className="text-[#F2F2FF] text-[17px] font-bold">{title}</Text>
        <View className="w-16" />
      </View>

      <ScrollView className="flex-1" contentContainerClassName="pb-6" showsVerticalScrollIndicator={false}>
        {/* Preview */}
        <View className="items-center py-4 gap-2">
          <View
            className="w-[68px] h-[68px] rounded-[20px] items-center justify-center"
            style={{ backgroundColor: hexToRgba(color, 0.14) }}
          >
            <IconComponent size={32} color={color} />
          </View>
          <Text className="text-[#F2F2FF] text-[22px] font-bold tracking-[-0.5px]">
            {name || 'Новая'}
          </Text>
          <View className="flex-row items-center gap-1 px-2.5 py-1 rounded-full bg-[#181828] border border-white/[0.08]">
            {isSubToggle
              ? <Layers size={10} color="#8888AA" />
              : <Tag size={10} color="#8888AA" />}
            <Text className="text-[#8888AA] text-[11px] font-medium">
              {isSubToggle ? 'Подкатегория' : 'Категория'}
            </Text>
          </View>
        </View>

        {/* Name */}
        <View className="px-5 mb-4">
          <Text className="text-[#8888AA] text-[11px] font-semibold uppercase tracking-[0.8px] mb-2">Название</Text>
          <TextInput
            className="bg-[#181828] border border-white/[0.08] rounded-2xl px-4 py-3.5 text-[#F2F2FF] text-[15px]"
            placeholder="Введите название"
            placeholderTextColor="#44445A"
            value={name}
            onChangeText={setName}
          />
        </View>

        {/* Priority */}
        <View className="px-5 mb-4">
          <Text className="text-[#8888AA] text-[11px] font-semibold uppercase tracking-[0.8px] mb-2">Приоритет</Text>
          <View className="flex-row bg-[#181828] border border-white/[0.08] rounded-2xl p-1 gap-1">
            {PRIORITIES.map(p => (
              <TouchableOpacity
                key={p.value}
                className="flex-1 py-2.5 rounded-lg items-center"
                style={priority === p.value ? { backgroundColor: hexToRgba('#4F9EFF', 0.2) } : undefined}
                activeOpacity={0.7}
                onPress={() => setPriority(p.value)}
              >
                <Text
                  className="text-[13px] font-semibold"
                  style={{ color: priority === p.value ? '#4F9EFF' : '#44445A' }}
                >
                  {p.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Type toggle — only on create */}
        {!isEditMode && (
          <View className="px-5 mb-4">
            <Text className="text-[#8888AA] text-[11px] font-semibold uppercase tracking-[0.8px] mb-2">Тип</Text>
            <View className="bg-[#181828] border border-white/[0.08] rounded-2xl overflow-hidden">
              <View className="flex-row items-center px-4 py-3.5 gap-3">
                <View className="flex-1">
                  <Text className="text-[#F2F2FF] text-[15px] font-medium">Подкатегория</Text>
                  <Text className="text-[#8888AA] text-[12px] mt-0.5">Вложена в другую категорию</Text>
                </View>
                <Switch
                  value={isSubToggle}
                  onValueChange={setIsSubToggle}
                  trackColor={{ false: '#1E1E35', true: '#4F9EFF' }}
                  thumbColor="#ffffff"
                  disabled={!!parentId}
                />
              </View>
            </View>
          </View>
        )}

        {/* Colors */}
        <View className="px-5 mb-4">
          <Text className="text-[#8888AA] text-[11px] font-semibold uppercase tracking-[0.8px] mb-2">Цвет</Text>
          <View className="flex-row flex-wrap gap-2.5">
            {COLORS.map(c => (
              <TouchableOpacity
                key={c}
                className="w-10 h-10 rounded-full items-center justify-center"
                style={{ backgroundColor: c, borderWidth: color === c ? 2 : 0, borderColor: '#ffffff', opacity: color === c ? 1 : 0.85 }}
                activeOpacity={0.8}
                onPress={() => setColor(c)}
              />
            ))}
          </View>
        </View>

        {/* Icons */}
        <View className="px-5 mb-4">
          <Text className="text-[#8888AA] text-[11px] font-semibold uppercase tracking-[0.8px] mb-2">Иконка</Text>
          <View className="flex-row flex-wrap gap-2">
            {ICONS.map(ic => {
              const Ic = resolveIcon(ic)
              return (
                <TouchableOpacity
                  key={ic}
                  className="w-[52px] h-[52px] rounded-2xl items-center justify-center border"
                  style={{
                    backgroundColor: icon === ic ? hexToRgba('#4F9EFF', 0.2) : '#181828',
                    borderColor: icon === ic ? '#4F9EFF' : 'rgba(255,255,255,0.08)',
                  }}
                  activeOpacity={0.7}
                  onPress={() => setIcon(ic)}
                >
                  <Ic size={22} color={icon === ic ? '#4F9EFF' : '#8888AA'} />
                </TouchableOpacity>
              )
            })}
          </View>
        </View>
      </ScrollView>

      {/* Save button */}
      <View className="px-5 py-3.5 border-t border-white/[0.04]">
        <TouchableOpacity
          className="w-full py-4 bg-[#4F9EFF] rounded-2xl flex-row items-center justify-center gap-2"
          activeOpacity={0.85}
          onPress={handleSubmit}
          disabled={isPending || !name.trim()}
        >
          {isPending
            ? <ActivityIndicator color="#080810" size="small" />
            : <Check size={18} color="#080810" />}
          <Text className="text-[#080810] text-[16px] font-bold">Сохранить</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}
```

- [ ] **Шаг 2: Проверить линт и типы**

```bash
rtk yarn lint
rtk yarn tsc --noEmit
```

Нет ошибок — реализация завершена.
