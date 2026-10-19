# Phase 03 — Post-code, ревью и харденинг

- Status: done
- Model tier: DEEP
- Required rules: `ai/rules/common/post-code-workflow.md`, `ai/rules/common/skills/refactor-security-audit.md`, `ai/rules/common/agent-workflow.md`

## Goal

Изменения фаз 01–02 прошли гейты и независимое ревью, находки исправлены.

## Implementation Notes

- Ревью — роль `code-reviewer` отдельным запуском; отчёт сохраняет основной агент
- Фокус: критерий превышения (только `isExceeded`), элементы без бюджета, сумма превышения в копейках, сохранение фильтра при смене режима и месяца, мемоизация, доступность чипа, токены вместо hex, границы FSD
- Docs sync: правила и команды не меняются; если ревью выявит новое соглашение (токены `spending.*`) — запись в `ai/rules/projects/fin-app-mobile/architecture.md`
- После исправлений гейты перезапускаются

## Scope

- Все файлы, изменённые в фазах 01–02
- `plans/2026-10-19-spending-over-budget-filter/review-spending-over-budget-filter.md`

## Checklist

- [x] `post-code` выполнен
- [x] Ревью выполнено, отчёт сохранён
- [x] Находки уровня bug исправлены или явно отложены
- [x] Docs sync проверен
- [x] Гейты повторно пройдены

## Verification Commands

- `rtk yarn lint`
- `rtk yarn tsc --noEmit`
- `rtk yarn agents:check --strict`

## Acceptance Criteria

- Все гейты проходят
- Отчёт ревью сохранён

## Evidence Note

- `post-code`: `rtk proxy yarn.cmd lint` exit 0 (0 errors, 3 warnings вне scope — `useDashboardScreen.ts`, `shared/api/base.ts`); `rtk proxy yarn.cmd tsc --noEmit` exit 0
- Независимое ревью — `code-reviewer`, verdict APPROVE, критичных находок нет; отчёт: `review-spending-over-budget-filter.md`
- W1 (зона нажатия чипа) — fixed: `hitSlop={CHIP_HIT_SLOP}` (8) в `OverBudgetChip.tsx`
- W2 (доступность чипа) — fixed: `accessibilityLabel`, `accessibilityValue`, `accessibilityHint` из констант `OVER_BUDGET_CHIP_A11Y_*`
- W3 (текст плашки в компоненте) — fixed: чистый `lib/formatOverBudgetNote.ts`
- W4 (пустой месяц при фильтре) — fixed: `hasAnyItems` из `useSpendingListItems`; `OverBudgetEmpty` только при `isOverOnly && hasAnyItems`, иначе «Нет расходов за этот месяц»; `design.md` обновлён
- Improvements: hex-константы цветов иконок — accepted (по дизайну); hex и inline style в `CategorySpendingScreen.tsx` — deferred в Reflect; длинная строка и inline-экспорт типа — no change
- Docs sync: соглашение о токенах `theme.extend.colors` и сбросе кэша Metro добавлено в `ai/rules/projects/fin-app-mobile/architecture.md` (NativeWind v4 Styling)
- Повторные гейты после правок (основной агент): lint exit 0, `tsc --noEmit` exit 0, `agents:check --strict` exit 0 (135 files)
- tsc ревьюером не перезапускался (`[rtk: program not found]`), гейты подтверждены основным агентом

## Handoff Note

- Все предупреждения W1–W4 исправлены, гейты зелёные
- Экран отдаёт `hasAnyItems`; пустое состояние фильтра только при непустом месяце
- Новое соглашение о токенах записано в `architecture.md`
- Техдолг для Reflect: hex и inline style в существующих компонентах экрана
- На устройстве проверить: зону нажатия чипа, VoiceOver/TalkBack, `--clear` после правки Tailwind
