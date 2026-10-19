# Code Review: spending-over-budget-filter (phases 01–02)

Дата: 19.10.2026
Ревьюер: `code-reviewer` (отдельный запуск)
Verdict: APPROVE — критичных находок нет, предупреждения незначительные.

Гейты: lint exit 0 взят у исполнителя; собственный запуск `rtk yarn tsc --noEmit` ревьюером не выполнился (`[rtk: program not found]`, fallback не применён) — tsc ревьюером не подтверждён.

## 🔴 Critical Issues

Нет.

## 🟡 Warnings

1. `OverBudgetChip.tsx:72-78` — маленькая зона нажатия (~28pt, без `hitSlop`). Fix: `hitSlop` именованной константой.
2. `OverBudgetChip.tsx:75` — `accessibilityLabel` «Превышен бюджет: N» не объясняет, что это фильтр и что означает число. Fix: описательная подпись или `accessibilityHint`, строки в константах.
3. `OverBudgetNote.tsx:30` — текст плашки собирается шаблонной строкой в компоненте, остальные тексты — в `spendingViewMode.ts`. Fix: форматтер в `lib/` или константа.
4. `CategorySpendingScreen.tsx:~112` — при включённом фильтре месяц совсем без расходов показывает «Превышений нет» с зелёной галочкой. Fix: показывать пустое состояние фильтра только при непустом нефильтрованном списке.

## 🔵 Improvements

- Цвета иконок lucide — hex-константы, дублирующие токены `spending.*` (`OverBudgetChip.tsx:9,12`, `OverBudgetEmpty.tsx:14`, `OverBudgetNote.tsx:12`); дизайн это допускает, риск рассинхронизации
- Существующие hex-классы и inline `contentContainerStyle` в `CategorySpendingScreen.tsx` — вне scope, записать в Reflect
- `filterOverBudget.ts:45` — длинная строка, косметика
- `OverBudgetFilterState` экспортируется inline из хука — допустимо
- Соглашение о токенах `spending.*` — кандидат в `ai/rules/projects/fin-app-mobile/architecture.md` (docs sync фазы 03)

## ✅ What's done well

- Критерий — только `getBudgetProgress(...).isExceeded`, тот же, что в `CategoryCard` и `SpendingRowCard`: фильтр и красные визуалы не расходятся
- Элементы без бюджета, «Без категории» и `rest:` никогда не считаются превышенными
- Сумма превышения — целые копейки, вывод через `formatKopecksUah`
- `isOverOnly` независим от режима и месяца
- Мемоизация в `useSpendingListItems.ts` корректна, обработчики стабильны
- Лимиты длины соблюдены, исчерпывающий `switch` с `never`
- Токены Tailwind генерируют нужные классы; inline `style` только для `fontFamily`
- Границы FSD чистые, `expo-router` не импортируется, константы с JSDoc

## Решения по находкам

См. Evidence Note в `phase-03-audit-hardening.md`.
