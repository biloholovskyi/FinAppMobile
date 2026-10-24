# Phase 04 — Аудит и харденинг

Status: done
Model tier: DEEP — аудит зависимостей и изменений
Required rules: `ai/rules/common/skills/refactor-security-audit.md`, `ai/rules/common/agent-workflow.md`

## Goal

Изменения апгрейда проверены независимым ревьюером, адвайзори новых зависимостей оценены.

## Implementation notes

- Ревью выполняет роль `code-reviewer` отдельным запуском; аудит зависимостей — роль `dependency-analyst`.
- Отчёт сохраняет главный агент в `review-sdk-58-upgrade.md` этой папки.
- Предсуществующие проблемы (Orval 7.9.0, хардкод-цвета, `expo-router` в `features`) не чинятся, только отмечаются.
- После исправлений гейты Phase 03 перезапускаются.

## Scope

- `package.json`, `yarn.lock`, `app.json`, `.github/workflows/deploy-expo.yml`
- Правки в `src/**` из Phase 01
- `plans/2026-10-24-expo-sdk-58-upgrade/review-sdk-58-upgrade.md`

## Checklist

- [ ] `yarn audit` по рантайм-зависимостям
- [ ] Ревью диффа апгрейда
- [ ] Исправить находки в рамках скоупа
- [ ] Перезапустить гейты Phase 03
- [ ] Сохранить отчёт

## Verification commands

- `rtk proxy yarn.cmd audit --groups dependencies`
- `rtk yarn lint`
- `rtk yarn tsc --noEmit`

## Acceptance criteria

- Нет новых high/critical адвайзори в рантайм-зависимостях без записанного решения
- Отчёт ревью сохранён, находки закрыты или вынесены в долг
- Гейты зелёные после исправлений

## Evidence note

24.10.2026, done.
- Ревью диффа — `code-reviewer`, аудит зависимостей — `dependency-analyst`, отдельные запуски; отчёт: [review-sdk-58-upgrade.md](review-sdk-58-upgrade.md)
- Критичных находок в коде нет
- `yarn audit --groups dependencies`: 190 (1 critical, 147 high) → 186 (0 critical, 144 high) после перерезолва `shell-quote` 1.8.3 → 1.12.0 и `follow-redirects` 1.16.0 → 1.16.1 в `yarn.lock`, без правок `package.json`
- Остаток high — транзитивные в Expo CLI / build tooling / dev-server, в бандл не поставляются; решение — ждать патч-релизов, `resolutions` не вводятся
- Источник `ImageBackground is deprecated` — `react-native-css-interop@0.2.3` (nativewind 4)
- После правок: lint 0 ошибок, tsc чисто, `expo-doctor` 20/20, `yarn check --integrity` in sync

## Handoff note

- Блокеров нет, отчёт сохранён
- Critical закрыт в пределах существующих диапазонов
- Долг: `DateTimePicker onChange` → `onValueChange`; предупреждение `ImageBackground` из nativewind 4
