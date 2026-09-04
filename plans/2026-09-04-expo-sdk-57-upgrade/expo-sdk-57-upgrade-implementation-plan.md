# Апгрейд Expo SDK 54 → 57 — Implementation Plan

Дата: 04.09.2026
Целевая версия: 1.9.0

## Goal

- Проект работает на Expo SDK 57 (React Native 0.86, React 19.2), бандл снова совместим с Expo Go из App Store.
- Апгрейд идёт инкрементально 54 → 55 → 56 → 57; каждая ступень проверяется отдельно и закрывается до перехода к следующей.

## Task profile

Profile: `feature` (5 сигналов)

| Сигнал | Наличие |
|--------|---------|
| Кросс-слойные изменения: конфиги сборки, `src/**`, CI, правила | да |
| Смена контракта окружения: минимумы Node, iOS, обязательный edge-to-edge | да |
| Архитектурный компромисс: инкрементальный путь против единовременного прыжка | да |
| Релизные артефакты: `app.json`, `runtimeVersion`, CHANGELOG, workflow | да |
| Риск с условной веткой работ: совместимость NativeWind | да |
| Детерминированный баг с минимальной правкой | нет |

## Decisions taken

- Путь решения — апгрейд SDK, а не development / preview build: internal distribution на iPhone требует платного Apple Developer Program, его нет.
- Версии поднимаются по одной мажорной, с полной проверкой на каждой ступени.
- NativeWind остаётся на v4, пока работает; переход на v5 — условная фаза с явным триггером.
- Проверка во время апгрейда идёт на Android через Expo Go, iPhone проверяется на финальной ступени.
- `react-native-linear-gradient` удаляется как неиспользуемый.
- Babel-плагин reanimated переводится на `react-native-worklets/plugin` до начала апгрейда.

## Assumptions

- Каталогов `android/` и `ios/` нет — CNG, нативные проекты собирает EAS в облаке, Mac не нужен.
- Локальный Node 22.14.0 удовлетворяет минимуму SDK 55.
- Апгрейд не OTA-совместим: требуется новый нативный билд и подъём `runtimeVersion`.
- Контракт бэкенда не меняется, регенерация Orval не нужна.
- Нативная iOS-сборка и публикация в App Store вне досягаемости без платного Apple-аккаунта; работоспособность на iPhone подтверждается через Expo Go SDK 57.

## Artifacts

- [research.md](research.md)
- [design.md](design.md)
- [history.md](history.md)

## Phases

- Phase 01 (done) — Базовая линия и зачистка [phase-01-baseline-cleanup.md](phase-01-baseline-cleanup.md)
- Phase 02 (done) — Ступень SDK 55 [phase-02-sdk-55.md](phase-02-sdk-55.md)
- Phase 03 (done) — Ступень SDK 56 [phase-03-sdk-56.md](phase-03-sdk-56.md)
- Phase 04 (done) — Ступень SDK 57 [phase-04-sdk-57.md](phase-04-sdk-57.md)
- Phase 05 (deferred) — Миграция NativeWind на v5, условная [phase-05-nativewind.md](phase-05-nativewind.md)
- Phase 06 (done) — Edge-to-edge на Android [phase-06-edge-to-edge.md](phase-06-edge-to-edge.md)
- Phase 07 (done) — CI и конфигурация EAS [phase-07-ci-eas-config.md](phase-07-ci-eas-config.md)
- Phase 08 (done) — Post-code QA [phase-08-post-code.md](phase-08-post-code.md)
- Phase 09 (done) — Аудит и харденинг [phase-09-audit-hardening.md](phase-09-audit-hardening.md)
- Phase 10 (done) — Синхронизация документации [phase-10-docs-sync.md](phase-10-docs-sync.md)
- Phase 11 (done) — Версия и CHANGELOG [phase-11-version-changelog.md](phase-11-version-changelog.md)
- Phase 12 (done) — Сборка и проверка на устройствах [phase-12-build-verify.md](phase-12-build-verify.md)
- Phase 13 (done) — Reflect [phase-13-reflect.md](phase-13-reflect.md)

## Model schedule

| Тир | Фазы | Обоснование |
|-----|------|-------------|
| FAST | 01, 07, 08, 10, 11, 13 | Механические правки, конфиги, сверка версий |
| BALANCED | 02, 03, 04, 06, 12 | Ступени апгрейда и разбор регрессий |
| DEEP | 05, 09 | Миграция стилизации и аудит безопасности изменений |

## Next actions

1. Пользователь проверяет приложение на физическом iPhone в Expo Go SDK 57 — исходная цель работы. Metro нужен без `--localhost`.
2. Пользователь переключает ветку на `r-1.9.0`.
3. Технический долг из Phase 09 и Phase 13 разносится по отдельным задачам.

## Out of scope

- Development / preview build и работа с Apple Developer Program.
- Апгрейд NativeWind до v5 без срабатывания триггера.
- Изменения бизнес-логики, экранов и API-контрактов.
- Добавление тест-раннера.
- Регенерация Orval.
- Любые git-операции: ветки, коммиты, пуши.

## Open questions

Закрыты:
- Целевая версия — `1.9.0`, задана пользователем на Phase 11.
- Нативных билдов не существует (Phase 01), поэтому подъём `runtimeVersion` никого не затронул.
