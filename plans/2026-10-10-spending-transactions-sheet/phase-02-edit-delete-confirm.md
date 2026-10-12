# Phase 02 — Подтверждение удаления на экране редактирования

- Status: done
- Model tier: BALANCED
- Required rules: `ai/rules/projects/fin-app-mobile/architecture.md`, `ai/rules/projects/fin-app-mobile/state-management.md`

## Goal

«Удалить транзакцию» на экране редактирования открывает общую модалку подтверждения; удаление происходит только после подтверждения.

## Implementation Notes

- Удаление идёт через `useDeleteTransaction` из фазы 01; локальная мутация в `useEditTransactionActions` удаляется
- После успеха — `router.back()` (уже существующий импорт в этом файле), ошибка — в `ErrorBanner`, модалка закрывается
- Кнопки «Сохранить» и «Удалить» заблокированы, пока идёт удаление

## Scope

- `src/features/operations/EditTransactionScreen/useEditTransactionActions.ts` — `requestDelete`, `confirmDelete`, `cancelDelete`, `isDeletePending`
- `src/features/operations/EditTransactionScreen/useEditTransactionScreen.ts` — проброс состояния модалки
- `src/features/operations/EditTransactionScreen/EditTransactionScreen.tsx` — `DeleteTransactionModal` с текущей транзакцией

## Checklist

- [x] Нажатие «Удалить транзакцию» не вызывает API без подтверждения
- [x] «Отмена» и тап по фону закрывают модалку (кроме момента удаления)
- [x] Хуки в пределах лимита строк из `architecture.md`

## Verification Commands

- `rtk yarn lint`
- `rtk yarn tsc --noEmit`

## Acceptance Criteria

- Оба гейта проходят
- В `useEditTransactionActions.ts` нет прямого вызова `deleteTransaction`

## Evidence Note

- `useEditTransactionActions` использует `useDeleteTransaction`; прямого вызова `deleteTransaction` нет; добавлены `requestDelete`, `confirmDelete`, `cancelDelete`, `isDeleteConfirmOpen` (`isDeleting` сохранён)
- `useEditTransactionScreen` отдаёт `requestDelete/confirmDelete/cancelDelete/pendingDelete`; `EditTransactionScreen` рендерит `DeleteTransactionModal`
- Успех → `router.back()`; ошибка → закрытие модалки + `ErrorBanner`; кнопки уже блокируются по `isDeleting`
- Гейты (`rtk proxy yarn.cmd`): `lint` exit 0 (0 errors, 3 warnings вне scope); `tsc --noEmit` exit 0
- Отклонение: `useEditTransactionActions` (и `EditTransactionScreen`) превышали лимиты строк и до фазы; рефакторинг вне scope

## Handoff Note

- Подтверждение удаления работает на экране редактирования
- Состояние модалки живёт в `useEditTransactionActions`
- Фаза 03: листы расходов и маршрут шторки
