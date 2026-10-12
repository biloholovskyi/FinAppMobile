# Транзакции подкатегории на экране расходов — Implementation Plan

Дата: 10.10.2026

## Goal

- Нажатие на подкатегорию или категорию без подкатегорий на экране расходов открывает шторку с транзакциями листа за выбранный месяц
- Из шторки транзакцию можно отредактировать (тот же экран редактирования) и удалить; удаление везде требует подтверждения

## Task Profile

`feature` — 3 feature-сигнала против 0 bugfix-сигналов.

Feature-сигналы:
1. Новый маршрут `spending/[leafKey]` и новый экран-шторка
2. Изменения в нескольких слоях — `app`, `features/categorySpending`, `features/operations`, `entities/transaction`
3. Изменение поведения удаления на экране редактирования (подтверждение)

## Decisions Taken

- Эталон визуала — `designs/screens/category-spending.html` (шторка, редактирование, подтверждение)
- Подтверждение удаления показывается везде, включая экран редактирования
- Все фазы выполняются подряд без промежуточных остановок; пользователь проверяет результат один раз в конце
- Версию и CHANGELOG пользователь определит в конце — фаза CHANGELOG отложена

## Assumptions

- Изменения только в JS — доставка OTA, `runtimeVersion` не меняется
- Остаток категории без подкатегории — лист `rest:`; он доступен в плоском режиме и отдельной строкой в раскрытой карточке категории
- Существующие импорты `expo-router` в `features/operations` не переносятся — вне scope

## Artifacts

- [research.md](research.md)
- [design.md](design.md)
- [history.md](history.md)

## Phases

- Phase 01 (done) — Общее подтверждение удаления в `entities/transaction` [phase-01-delete-confirm.md](phase-01-delete-confirm.md)
- Phase 02 (done) — Подтверждение удаления на экране редактирования [phase-02-edit-delete-confirm.md](phase-02-edit-delete-confirm.md)
- Phase 03 (done) — Листы расходов и маршрут шторки [phase-03-leaf-navigation.md](phase-03-leaf-navigation.md)
- Phase 04 (done) — Шторка транзакций: список, редактирование, удаление [phase-04-transactions-sheet.md](phase-04-transactions-sheet.md)
- Phase 05 (done) — Post-code, ревью и харденинг [phase-05-audit-hardening.md](phase-05-audit-hardening.md)
- Phase 06 (deferred) — CHANGELOG [phase-06-changelog.md](phase-06-changelog.md)
- Phase 07 (done) — Reflect [phase-07-reflect.md](phase-07-reflect.md)

## Model Schedule

| Фазы | Тир | Обоснование |
|------|-----|-------------|
| 01–04 | BALANCED | Реализация по существующим паттернам |
| 05 | DEEP | Независимое ревью, сходимость сумм, границы FSD |
| 06–07 | FAST | CHANGELOG и ретроспектива |

## Next Actions

1. Пользователь проверяет на устройстве (iOS и Android): `formSheet`, редактирование поверх шторки и возврат, удаление с экрана редактирования поверх шторки, строку остатка в раскрытой карточке, sticky-заголовки дней
2. Пользователь называет версию → фаза 06 (CHANGELOG)
3. Техдолг: hex-литералы и inline `style` в `SpendingTransactionsSheet/`, `entities/transaction/ui/` и соседних файлах — перевести на токены Tailwind
4. Техдолг: `expo-router` в `features/operations` (`OperationsScreen`, `useEditTransactionActions`, `useEditTransactionData`) — перенести навигацию в `src/app/`
5. Техдолг: `EditTransactionScreen` и `useEditTransactionActions` превышают лимиты строк

## Out of Scope

- Перенос `expo-router` из `features/operations` в `src/app/`
- Отмена удаления (undo)
- Тесты — тест-раннера нет
- Любые git-операции
