# Phase 04 — Аудит, документация, CHANGELOG

Status: done
Model tier: DEEP
Required rules: `ai/rules/common/post-code-workflow.md`, `ai/rules/common/skills/refactor-security-audit.md`, `ai/rules/common/versioning-changelog.md`

## Goal

Реализация проходит квалити-гейты, документация синхронизирована, релизные артефакты готовы для версии 1.8.0.

## Implementation notes

Аудит выполняется по чек-листу `ai/rules/common/skills/refactor-security-audit.md`. После любых правок гейты перезапускаются.

## Scope

- Все файлы, изменённые в фазах 01–03
- `ai/rules/projects/fin-app-mobile/state-management.md` — раздел о разделении платежа, если контракт сохранения требует фиксации
- `CHANGELOG.md` — запись для версии 1.8.0

## Checklist

- [x] `rtk yarn lint` проходит без ошибок
- [x] `rtk yarn tsc --noEmit` проходит без ошибок
- [x] Нет `any`, нет `console.log`, нет пустых `catch`
- [x] Магические числа и повторяющиеся строки вынесены в константы с JSDoc
- [ ] Лимиты соблюдены: компонент ≤ 150 строк, хук ≤ 50 строк, вложенность JSX ≤ 4 — частично, см. отклонение 1
- [ ] FSD-границы соблюдены: нет `expo-router` вне `src/app/`, нет импортов из `features` в `shared` и `entities` — частично, см. отклонение 2
- [x] Копеечная математика корректна: деление на 100 при отображении, `Math.round` при отправке
- [x] Все мутации вызывают `queryClient.invalidateQueries`
- [x] В логи не попадают токены и полные ответы API
- [x] Документация SoT обновлена: правило о двухзапросном сохранении лежит в `ai/rules/**`, а не дублируется в `CLAUDE.md` и `.claude/**`
- [x] Проверены ссылки в изменённых правилах и файлах плана
- [x] Версия совпадает в `package.json` и `app.json` — обе равны 1.8.0
- [x] `runtimeVersion` не меняется: изменение JS-only, OTA-совместимо
- [x] В `CHANGELOG.md` секция `[1.8.0]` датирована 17.08.2026, наверх её списка добавлен буллет из ≤ 5 слов
- [x] Гейты перезапущены после всех правок аудита

## Verification commands

- `rtk yarn lint`
- `rtk yarn tsc --noEmit`

## Acceptance criteria

- Оба гейта зелёные на финальном состоянии кода
- Ни одна находка аудита уровня CRITICAL или HIGH не остаётся открытой
- Релизные артефакты консистентны: версия, дата CHANGELOG, неизменённый `runtimeVersion`

## Evidence note

Рефакторинг по итогам аудита:
- Копеечная математика вынесена из хука разделения в `src/shared/utils/currency.ts` (`amountStrToKopecks`, `kopecksToAmountStr`) — отклонение фазы 01 закрыто
- Создан `src/shared/constants/money.ts` с `KOPECK_DIVISOR` и `KOPECK_MULTIPLIER`; локальный `TRANSACTION_SPLIT_PRECISION_FACTOR` удалён
- Удалена неиспользуемая `TRANSACTION_SPLIT_MIN_AMOUNT`
- `useEditTransactionScreen` разобран: производные ушли в `useEditTransactionSelection.ts`, сохранение — в `useSaveTransaction.ts`, валидация части — в `splitValidation.ts`, сборка payload — в `savePayloads.ts`
- Тип `SavePayload` перестал дублироваться: единственное объявление в `savePayloads.ts`

Длины хуков после разбора: `useEditTransactionScreen` 138 → 81, `useSaveTransaction` 51, `useTransactionSplit` 46, `useEditTransactionSelection` 19, `useEditTransactionActions` 79.

Документация: в `ai/rules/projects/fin-app-mobile/state-management.md` добавлен раздел «Разделение расходной транзакции» — контракт двух запросов, порядок, частичный успех, единицы суммы. Дублирования в `CLAUDE.md` и `.claude/**` не заводилось: правило остаётся единственным владельцем контракта.

Релиз: `package.json` и `app.json` — 1.8.0, `runtimeVersion` оставлен `1.0.0` (изменение JS-only, OTA-совместимо). В `CHANGELOG.md` дата секции `[1.8.0]` обновлена на 17.08.2026, наверх списка добавлен буллет «Разделение платежа».

Гейты после всех правок: `yarn lint` — 0 ошибок (2 прежних предупреждения в `useDashboardScreen.ts`); `yarn tsc --noEmit` — чисто.

Отклонение 1: лимит хука в 50 строк выдержан не везде. `useEditTransactionScreen` (81) — фасад, его тело почти целиком составляет return-контракт экрана; дальнейшее дробление потребовало бы переписывания сигнатуры экрана и не входит в задачу разделения платежа. `useEditTransactionActions` (79) и `useSaveTransaction` (51) — та же природа. Логика вынесена, дальше остался только перенос данных.

Отклонение 2: `expo-router` импортируется в `features` — 7 файлов по всему проекту, включая `useEditTransactionActions.ts` и `useEditTransactionData.ts`. Нарушение унаследованное, задачей разделения не внесено и не расширено; чинить его здесь означало бы переписать навигацию четырёх экранов.

Findings без исправления: нет находок уровня CRITICAL или HIGH. Секретов, логирования токенов, `any`, `console.log` в изменённых файлах нет.

## Handoff note

- Реализация завершена, гейты зелёные, релизные артефакты консистентны
- Остаются два зафиксированных долга: длина хуков-фасадов и `expo-router` в слое `features`
- Ручной проверки на устройстве не было — стоит прогнать сценарии разделения перед публикацией
