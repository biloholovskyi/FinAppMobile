# Phase 08 — Reflect

Status: done
Model tier: FAST — сверка и запись итогов
Required rules: `ai/rules/common/implementation-plans.md`

## Goal

Итоги апгрейда, расхождения с `design.md` и технический долг записаны.

## Implementation notes

- Сверка целевого состояния `design.md` с фактом пункт за пунктом.
- Долг из Phase 04 и Phase 07 выносится отдельными задачами, не чинится здесь.

## Scope

- Этот файл
- `history.md`
- Индекс плана — статусы и Next actions

## Checklist

- [ ] Сверка с целевым состоянием
- [ ] Lessons learned
- [ ] Список технического долга
- [ ] Обновить Next actions в индексе

## Verification commands

- `rtk yarn agents:check --strict`

## Acceptance criteria

- Каждый пункт целевого состояния отмечен как достигнутый или с причиной расхождения
- Все фазы плана в статусе `done` или `deferred`

## Evidence note

24.10.2026, done.

Сверка с `design.md`:
- SDK 58 / RN 0.88 через `expo install --fix` — достигнуто (`expo@58.0.19`, `react-native@0.88.0`)
- `expo-doctor` без провалов — 20/20
- Expo Go 58 на Android — достигнуто; на iPhone — ожидает пользователя
- lint, tsc, `agents:check`, `calendar:check` — зелёные
- Strict TS API без opt-out — достигнуто, одна правка `onRefresh`
- `runtimeVersion` 3.0.0 — достигнуто
- Node в CI — удовлетворяет минимуму без правок
- Версия 1.13.1 — достигнуто
- Правила называют SDK 58 / RN 0.88 — достигнуто; расхождение: React 19.3, а не 19.2 — SDK 58 поднял React, правила обновлены

Lessons learned:
- Апгрейд одним мажором занял одну фазу кода; Strict TS API на этом проекте почти бесплатен
- Expo CLI сам обновляет Expo Go на эмуляторе — ручная установка APK не нужна
- Codex-адаптеры тоже содержат версии SDK; `agents:check` ловит расхождение, но только после правки Claude-стороны
- `npx eas` без локального `eas-cli` не работает — форма записана в `tooling.md`

Технический долг (отдельные задачи):
- `DateTimePickerModal.tsx`: `onChange` → `onValueChange` / `onDismiss` (datetimepicker 9.2)
- `ImageBackground is deprecated` из `react-native-css-interop` (nativewind 4) — снимается миграцией NativeWind v5 или upstream-фиксом
- 144 high-адвайзори в транзитивных зависимостях Expo CLI / RN dev tooling — ждать патч-релизов
- Предсуществующее: Orval 7.9.0, хардкод-цвета, `expo-router` в `features`, 3 предупреждения линта

## Handoff note

- Целевое состояние достигнуто, кроме проверки на iPhone
- Долг перечислен выше, в план не входит
