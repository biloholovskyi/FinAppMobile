# Апгрейд Expo SDK 57 → 58 — Implementation Plan

Дата: 24.10.2026
Целевая версия: 1.13.1

## Goal

- Проект работает на Expo SDK 58 (React Native 0.88) и открывается в Expo Go 58 на iPhone и Android.
- Релиз `1.13.1` с поднятым `runtimeVersion`.

## Task profile

Profile: `feature` (4 сигнала)

| Сигнал | Наличие |
|--------|---------|
| Кросс-слойные изменения: конфиги, `src/**`, CI, правила | да |
| Смена контракта окружения: минимум Node, Strict TS API | да |
| Релизные артефакты: `app.json`, `runtimeVersion`, CHANGELOG | да |
| Риск совместимости сторонних библиотек | да |
| Детерминированный баг с минимальной правкой | нет |

## Decisions taken

- Целевая версия — `1.13.1` (пользователь).
- Апгрейд одним шагом 57 → 58.
- Strict TS API чинится в коде, без opt-out.
- NativeWind остаётся v4; v5 — отдельная задача по триггеру из `design.md`.
- `runtimeVersion` → `3.0.0`.

## Assumptions

- CNG: каталогов `android/` и `ios/` нет, нативный билд не нужен для проверки в Expo Go.
- Expo Go 58 доступен в App Store (58.0.5); для Android — Google Play или APK.
- Контракт бэкенда не меняется, регенерация Orval не нужна.
- Ветка `r-1.13.1` создаётся пользователем.

## Artifacts

- [research.md](research.md)
- [design.md](design.md)
- [history.md](history.md)
- [review-sdk-58-upgrade.md](review-sdk-58-upgrade.md)

## Phases

- Phase 01 (done) — Апгрейд до SDK 58 [phase-01-sdk-58.md](phase-01-sdk-58.md)
- Phase 02 (done) — runtimeVersion, CI и EAS [phase-02-release-config.md](phase-02-release-config.md)
- Phase 03 (done) — Post-code QA [phase-03-post-code.md](phase-03-post-code.md)
- Phase 04 (done) — Аудит и харденинг [phase-04-audit-hardening.md](phase-04-audit-hardening.md)
- Phase 05 (done) — Синхронизация документации [phase-05-docs-sync.md](phase-05-docs-sync.md)
- Phase 06 (done) — Версия и CHANGELOG [phase-06-version-changelog.md](phase-06-version-changelog.md)
- Phase 07 (in_progress — Android done, iPhone ожидает пользователя) — Проверка на устройствах [phase-07-device-verify.md](phase-07-device-verify.md)
- Phase 08 (done) — Reflect [phase-08-reflect.md](phase-08-reflect.md)

## Model schedule

| Тир | Фазы | Обоснование |
|-----|------|-------------|
| BALANCED | 01, 07 | Апгрейд и разбор регрессий |
| FAST | 02, 03, 05, 06, 08 | Механические правки и сверка |
| DEEP | 04 | Аудит зависимостей и изменений |

## Next actions

1. Пользователь проверяет приложение на iPhone в Expo Go 58 (Metro без `--localhost`) и закрывает Phase 07.
2. Пользователь вручную проверяет клавиатуру на формах и шаг Android дата → время.
3. Пользователь ревьюит дифф целиком.
4. `deploy-preflight` перед мержем в `main` — `runtimeVersion` 3.0.0 уходит вместе с апгрейдом.
5. Техдолг из Phase 08 разносится по отдельным задачам.

## Out of scope

- Миграция NativeWind на v5.
- Development / preview build, Apple Developer Program, нативные билды EAS.
- Изменения бизнес-логики, экранов, API-контрактов; регенерация Orval.
- Тест-раннер.
- Любые git-операции.
