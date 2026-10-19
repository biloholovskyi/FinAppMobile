# History

## Phase 01 — Модель фильтра и состояние экрана (19.10.2026)

- Хук экрана отдаёт `isOverOnly`, `onToggleOverOnly`, `onResetOverOnly`, `overStats`, `listItems` с учётом фильтра
- `sectionLabel` получает суффикс `OVER_BUDGET_SECTION_SUFFIX` при включённом фильтре
- Список собирается в `useSpendingListItems` (вынесен из-за лимита 50 строк); `selectOverBudget` — в `useMemo` от `allItems`
- Константы фильтра экспортируются из `@/shared/constants`
- Гейты: lint и tsc — exit 0
- Для Phase 02: экран пока скрывает подпись секции при пустом `listItems`

## Phase 02 — UI: чип, плашка, пустое состояние (19.10.2026)

- Токены `spending.*` добавлены в `tailwind.config.js`: после запуска нужен сброс кэша Metro (`rtk npx expo start --clear`)
- Новые компоненты: `OverBudgetChip`, `OverBudgetFilterRow`, `OverBudgetNote`, `OverBudgetEmpty`; экран выбирает `ListEmptyComponent` по `isOverOnly`
- Строка фильтра видна всегда после загрузки; плашка — только при фильтре и непустом результате
- Гейты: lint и tsc — exit 0 (3 предупреждения вне области фазы)
- Для Phase 03: проверить схождение `overspend`/счётчика с карточками и границы FSD

## Phase 03 — Post-code, ревью и харденинг (19.10.2026)

- Ревью `code-reviewer`: APPROVE, отчёт `review-spending-over-budget-filter.md`
- W1–W4 исправлены: `hitSlop`, описательная доступность чипа, `formatOverBudgetNote`, `hasAnyItems` для пустого месяца
- Docs sync: соглашение о токенах в `ai/rules/projects/fin-app-mobile/architecture.md`
- Гейты: lint, tsc, `agents:check --strict` — exit 0
- Техдолг для Reflect: hex и inline style в существующих компонентах экрана

## Phase 04 — Версия 1.13.0 и CHANGELOG (19.10.2026)

- `package.json`, `app.json` — `1.13.0`; ветка `r-1.13.0`; `runtimeVersion` без изменений
- `CHANGELOG.md` — `[1.13.0] 19.10.2026`, `- Over budget filter`
- `agents:check --strict` exit 0

## Phase 05 — Reflect (19.10.2026)

- Реализация соответствует `design.md`; дельта — пустое состояние фильтра только при непустом месяце
- Уроки: общий `getBudgetProgress` держит фильтр и визуалы консистентными
- Техдолг: hex и inline style в существующих компонентах экрана, дубли цветов иконок
- План закрыт; проверка на устройстве и `deploy-preflight` — за пользователем
