# Phase 02 — UI: чип, плашка, пустое состояние

- Status: done
- Model tier: BALANCED
- Required rules: `ai/rules/projects/fin-app-mobile/architecture.md`, `ai/rules/common/react.md`, `ai/rules/common/react-19.md`

## Goal

Экран показывает чип фильтра со счётчиком, плашку превышения и пустое состояние по `design.md`.

## Implementation Notes

- Визуал сверяется с `designs/screens/category-spending.html` (`.filter-chip`, `.filter-note`, `#filter-empty`)
- Цвета — токены `spending.*` в `className`; inline `style` для раскладки и hex в `className` новых компонентов не используются
- Цвет иконок lucide — именованные константы в файле компонента
- Чип — `Pressable` с `accessibilityRole="button"`, `accessibilityState.selected` и `accessibilityLabel` со счётчиком
- Строка фильтра показывается всегда после успешной загрузки, в том числе при пустом списке

## Scope

Target state:

- `tailwind.config.js` — `theme.extend.colors.spending` с токенами из `design.md`, раздел «Компоненты и цвета»
- `src/features/categorySpending/CategorySpendingScreen/OverBudgetChip.tsx` — три состояния из таблицы `design.md`
- `src/features/categorySpending/CategorySpendingScreen/OverBudgetFilterRow.tsx` — подпись секции слева, чип справа
- `src/features/categorySpending/CategorySpendingScreen/OverBudgetNote.tsx` — текст по режиму и сумма превышения через `formatKopecksUah`
- `src/features/categorySpending/CategorySpendingScreen/OverBudgetEmpty.tsx` — заголовок, текст по режиму, кнопка «Показать все»
- `src/features/categorySpending/CategorySpendingScreen/CategorySpendingScreen.tsx` — `OverBudgetFilterRow` вместо одиночной подписи секции, `OverBudgetNote` под ней, выбор `ListEmptyComponent` по `isOverOnly`

## Checklist

- [x] Токены `spending.*` добавлены, значения совпадают с `:root` эталона
- [x] Чип переключает фильтр; счётчик соответствует текущему режиму
- [x] Плашка видна только при включённом фильтре и непустом результате
- [x] «Показать все» выключает фильтр
- [x] При выключенном фильтре и пустом месяце — «Нет расходов за этот месяц»
- [x] Компоненты ≤ `COMPONENT_MAX_LINES`, пропсы типизированы, JSDoc у экспортов
- [x] Нет `expo-router` в фиче

## Verification Commands

- `rtk yarn lint`
- `rtk yarn tsc --noEmit`

## Acceptance Criteria

- Оба гейта проходят без ошибок
- В обоих режимах фильтр оставляет только превышенные элементы; смена режима сохраняет фильтр
- Месяц без превышений при включённом фильтре показывает «Превышений нет» и «Показать все»
- Проверка на устройстве — за пользователем

## Evidence Note

- Файлы: `tailwind.config.js` (токены `spending.*`, 12 штук, значения из `:root` эталона), `OverBudgetChip.tsx` (95 строк), `OverBudgetFilterRow.tsx` (32), `OverBudgetNote.tsx` (40), `OverBudgetEmpty.tsx` (46), `CategorySpendingScreen.tsx` (130 строк, лимит 150)
- Строка фильтра рендерится всегда после успешной загрузки; плашка — при `isOverOnly` и непустом `listItems`; `ListEmptyComponent` выбирается по `isOverOnly`
- Моноширинный шрифт задан через `style={{ fontFamily }}` с именованной константой, как в соседних компонентах (не раскладка)
- `rtk yarn lint` через `rtk proxy yarn.cmd lint`: exit 0, 0 ошибок, те же 3 предупреждения вне области фазы
- `rtk yarn tsc --noEmit` через `rtk proxy yarn.cmd tsc --noEmit`: exit 0
- Отклонений от плана нет; проверка на устройстве — за пользователем

## Handoff Note

- Токены `spending.*` добавлены в `tailwind.config.js`: после запуска нужен сброс кэша Metro (`rtk npx expo start --clear`), иначе классы не применятся
- Новые компоненты используют только токены `spending.*`; цвета иконок lucide — константы в файлах
- Чип: три состояния, `accessibilityState.selected`, `accessibilityLabel` со счётчиком
- Существующие компоненты экрана на токены не переводились
- Для Phase 03: проверить схождение `overspend`/счётчика с карточками и границы FSD
