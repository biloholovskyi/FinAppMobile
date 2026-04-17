# Category Edit Screen — Design Spec

Date: 2026-04-17

## Overview

Экран создания и редактирования категории/подкатегории. Один feature-компонент `CategoryEditScreen` покрывает 4 режима, доступный через два маршрута Expo Router.

---

## File Structure

### New files
- `src/app/category/create.tsx` — роут создания
- `src/app/category/[id].tsx` — роут редактирования
- `src/features/categories/CategoryEditScreen/CategoryEditScreen.tsx`
- `src/features/categories/CategoryEditScreen/useCategoryEditScreen.ts`

### Modified files
- `src/entities/category/index.ts` — добавить `CategoryPriority` enum
- `src/shared/api/categories.ts` — добавить 4 API-функции с переиспользуемым DTO-типом
- `src/app/_layout.tsx` — зарегистрировать `category/create` и `category/[id]`
- `src/features/categories/CategoriesScreen/useCategoriesScreen.ts` — реализовать навигацию
- `src/features/categories/CategoriesScreen/CategoryCard.tsx` — изменить сигнатуру `onEdit` + кнопка "Добавить подкатегорию"

---

## API Layer (`src/shared/api/categories.ts`)

```ts
type CategoryBaseDto = {
  name: string
  priority?: CategoryPriority
  color?: string
  icon?: string
}

type UpdateCategoryDto = Partial<CategoryBaseDto>

// POST /categories
createCategory(dto: CategoryBaseDto): Promise<CategoryModel>

// POST /categories/:parentId/subcategories
createSubcategory(parentId: string, dto: CategoryBaseDto): Promise<CategoryModel>

// PUT /categories/:id
updateCategory(id: string, dto: UpdateCategoryDto): Promise<CategoryModel>

// PUT /subcategories/:id
updateSubcategory(id: string, dto: UpdateCategoryDto): Promise<CategoryModel>
```

---

## Entity (`src/entities/category/index.ts`)

```ts
export enum CategoryPriority {
  High = 'hight',   // typo preserved from backend
  Medium = 'medium',
  Low = 'low',
}
```

`CategoryModel.priority` остаётся `string` — enum используется только при отправке данных.

---

## Navigation

### Route params
- `src/app/category/create.tsx` — search param `parentId?: string`
  - Если `parentId` отсутствует → режим `create-category`
  - Если `parentId` присутствует → режим `create-subcategory`
- `src/app/category/[id].tsx` — path param `id: string` + search param `isSubcategory?: string`
  - `isSubcategory` отсутствует → режим `edit-category`
  - `isSubcategory="true"` → режим `edit-subcategory`

### Navigation calls
- `+` в CategoriesScreen → `router.push('/category/create')`
- Edit категории → `router.push('/category/' + id)`
- Edit подкатегории → `router.push({ pathname: '/category/[id]', params: { id, isSubcategory: 'true' } })`
- "Добавить подкатегорию" в CategoryCard → `router.push({ pathname: '/category/create', params: { parentId: category.id } })`

### Signature change
`onEdit: (id: string, isSubcategory?: boolean) => void` — затрагивает `CategoryCard`, `SubRow`, `useCategoriesScreen`.

---

## Screen Modes

| Режим | Заголовок | Переключатель "Подкатегория" | Данные |
|---|---|---|---|
| `create-category` | "Новая категория" | Виден, выключен | Пустая форма |
| `create-subcategory` | "Новая подкатегория" | Виден, включён и заблокирован | Пустая форма + parentId |
| `edit-category` | Название категории | Скрыт | Из кэша TQ |
| `edit-subcategory` | Название подкатегории | Скрыт | Из кэша TQ (поиск в subCategory[]) |

---

## Hook (`useCategoryEditScreen`)

Входные данные: params из роута (`id?`, `parentId?`, `isSubcategory?`).

Состояние формы: `name`, `priority`, `color`, `icon`, `isSubcategoryToggle`.

Данные для edit: `useQuery(QUERY_KEYS.categories.all)` с `select` — ищет нужную запись без дополнительного запроса.

Submit flow:
1. Определяем нужную API-функцию по режиму
2. `useMutation` → вызов API
3. `onSuccess`: `queryClient.invalidateQueries(QUERY_KEYS.categories.all)` → `router.back()`

---

## UI (дизайн: `designs/screens/category-edit.html`)

- Nav bar: кнопка "Назад" + заголовок
- Preview: иконка (цветной фон) + название + бейдж типа
- Поле "Название" (TextInput)
- Сегментированный контрол "Приоритет": Низкий / Средний / Высокий
- Секция "Тип" с переключателем "Подкатегория" + раскрывающийся выбор родителя (только на create)
- Сетка цветов 6×2 (12 цветов)
- Сетка иконок 5×4 (20 иконок из lucide-react-native)
- Кнопка "Сохранить" (фиксированная снизу)

### Цвета
`#FF4B6B`, `#FB923C`, `#FFB020`, `#EAB308`, `#84CC16`, `#00E089`, `#2DD4BF`, `#22D3EE`, `#4F9EFF`, `#818CF8`, `#A374FF`, `#F472B6`

### Иконки
`shopping-cart`, `coffee`, `car`, `home`, `heart`, `zap`, `music`, `film`, `book`, `briefcase`, `plane`, `utensils`, `dumbbell`, `gift`, `smartphone`, `globe`, `credit-card`, `trending-up`, `shield`, `star`

---

## Constraints

- Компонент: max 150 строк, JSX вложенность max 4 уровня
- Хук: max 50 строк
- NativeWind `className` для layout, `style={{}}` только для динамических значений (цвет)
- Нет inline hex-цветов в layout-стилях
- `useCallback` для всех хендлеров, передаваемых как props
