# Phase 05 — Post-code, ревью и харденинг

- Status: done
- Model tier: DEEP
- Required rules: `ai/rules/common/post-code-workflow.md`, `ai/rules/common/skills/refactor-security-audit.md`, `ai/rules/common/agent-workflow.md`

## Goal

Изменения фаз 01–04 прошли гейты и независимое ревью, находки исправлены.

## Implementation Notes

- Ревью — роль `code-reviewer` отдельным запуском; отчёт сохраняет основной агент
- Фокус: сходимость сумм листа и строки, фильтр месяца, копеечная математика, подтверждение удаления во всех точках, обработка ошибок удаления, границы FSD и `expo-router`, навигация шторка → редактирование → назад
- После исправлений гейты перезапускаются

## Scope

- Все файлы, изменённые в фазах 01–04
- `plans/2026-10-10-spending-transactions-sheet/review-spending-transactions-sheet.md`

## Checklist

- [x] `post-code` выполнен
- [x] Ревью выполнено, отчёт сохранён
- [x] Находки уровня bug исправлены или явно отложены
- [x] Гейты повторно пройдены

## Verification Commands

- `rtk yarn lint`
- `rtk yarn tsc --noEmit`
- `rtk yarn agents:check --strict`

## Acceptance Criteria

- Все гейты проходят
- Отчёт ревью сохранён

## Evidence Note

- Независимое ревью выполнено (`code-reviewer`), отчёт: `review-spending-transactions-sheet.md`; критичных находок нет
- Гейты после правок (`rtk proxy yarn.cmd`): `lint` exit 0 (0 errors, 3 warnings вне scope); `tsc --noEmit` exit 0; `agents:check --strict` exit 0 (135 files)

Решения по находкам:
- W1 (остаток в раскрытой карточке) — fixed: `SubCategoryList.tsx` добавляет строку остатка (`buildRemainderRow`, лист `rest:`); `CategoryCard` сократился; индекс плана и `design.md` обновлены
- W2 (двойной DELETE) — fixed: `useConfirmedDelete` с синхронным `inFlightRef`
- W3 (модалка + `router.back()`) — fixed: на экране редактирования `keepOpenOnSuccess: true` — модалка не закрывается вручную, экран размонтируется через `router.back()`; при ошибке `closeOnError: true` и баннер. Проверить на устройстве
- W4 (дублирование) — fixed: один хук `useConfirmedDelete` в `entities/transaction` используется шторкой, лентой и экраном редактирования; `DELETE_ERROR_*` в одном месте; ошибка отдаётся через `onError` (Alert в ленте/шторке, `ErrorBanner` на экране редактирования)
- W5 (`lastRow`) — fixed: хранится `{ leafKey, monthStr, row }`, чужой лист не показывается
- W6 (параметры маршрута) — fixed: `string[]` → первый элемент, `normalizeMonthStr` (+ `toMonthStr` вынесен в `lib/parseMonthStr.ts`, переиспользован в `useMonthNavigation`); неверный `leafKey` даёт пустое состояние с заголовком «Транзакции»
- Hex-литералы и inline style — deferred: повторяют соседний код, техдолг фиксируется в Reflect
- Двойная сортировка — fixed: убрана из `filterLeafTransactions`
- Расходы без UAH-эквивалента — accepted: согласовано с агрегатором
- `Math.abs` в сумме строки — fixed; `useDeleteTransactionDisplay` → `getDeleteTransactionDisplay` (файл переименован) — fixed; `SheetDayHeader` — fixed; JSDoc у `Stat` и `toDayKey` — fixed
- Кавычки в `_layout.tsx` — no change: файл целиком в двойных кавычках, смешения нет

## Handoff Note

- Все находки W1–W6 исправлены, hex-литералы отложены в Reflect
- Единая точка удаления: `useConfirmedDelete` (`onError`, `keepOpenOnSuccess`, `closeOnError`)
- `lib/parseMonthStr.ts` теперь содержит `toMonthStr` и `normalizeMonthStr`
- На устройстве проверить: удаление с экрана редактирования поверх `formSheet`, строка остатка в иерархическом режиме
- Фаза 06 отложена до версии, фаза 07 — Reflect
