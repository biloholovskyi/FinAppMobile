# Android Emulator Setup — Implementation Plan

## Mission

- Дать возможность запускать `fin-app-mobile` целиком на Windows-ПК в Android-эмуляторе, без физического телефона и без зависимости от Wi-Fi/VPN-связки ПК↔телефон.
- Целевое состояние: `rtk yarn android` поднимает Metro, стартует AVD, открывает приложение в Expo Go и успешно ходит в API.

## Task profile

Profile: `hybrid` (infra setup + минимальные изменения конфигурации проекта).

Signals:
- Feature-сигналы (2): новая среда разработки (toolchain + AVD), изменение конфигурации сети/env проекта.
- Bugfix-сигналы (1): устраняется конкретная блокирующая проблема — VPN ломает запуск на устройстве.

Design-артефакты (C4 / DFD / Sequence) не создаются: изменений в архитектуре приложения нет, затрагиваются только dev-окружение и env-конфигурация. Сетевые границы зафиксированы в `research.md`.

## Pre-code artifacts

- Research: `plans/android-emulator-setup/research.md`

## Rule coverage

- `ai/rules/common/core-rules.md` — команды, FSD, `rtk`-префикс
- `ai/rules/projects/fin-app-mobile/architecture.md` — env-переменные (`EXPO_PUBLIC_` префикс), команды Expo
- `ai/rules/projects/fin-app-mobile/state-management.md` — `apiClient` и `EXPO_PUBLIC_API_URL`
- `ai/rules/common/post-code-workflow.md` — для фазы с правкой файлов проекта

## Key decisions

| Решение | Выбор | Почему |
|---------|-------|--------|
| Тулчейн | Android SDK command-line tools + portable JDK 17 | Ставится без прав администратора; Android Studio требует UAC и не обязателен |
| Эмулятор | AVD из состава Android SDK | Официальная поддержка Expo, `adb`, автоустановка Expo Go |
| Клиент приложения | Expo Go | Все импортируемые нативные модули входят в Expo Go SDK 54 (см. `research.md`) |
| Транспорт Metro | `--localhost` (`adb reverse`) | LAN-адрес хоста не работает при активном туннеле WireGuard; loopback от VPN не зависит |
| Аппаратное ускорение | Windows Hypervisor Platform (WHPX) | AMD CPU + активный гипервизор; AEHD-драйвер несовместим. Проверено: WHPX usable без включения одноимённой Windows-фичи |
| Образ системы | `system-images;android-36;google_apis_playstore;x86_64` | Совпадает с target SDK Expo 54; Play Store даёт запасной путь установки Expo Go |
| iOS | вне скоупа | iOS Simulator требует macOS |

## Phases

- Phase 01 (done) — Установка Android-тулчейна и переменных окружения [phase-01-toolchain-install.md](phase-01-toolchain-install.md) — SDK 36 + emulator 37.1.11 + JDK 17, WHPX usable
- Phase 02 (done) — Создание и проверка AVD [phase-02-avd-create.md](phase-02-avd-create.md) — `finapp_pixel7`, API 36, boot ~60 s, сеть и `10.0.2.2` доступны
- Phase 03 (done) — Запуск проекта в эмуляторе через Expo Go [phase-03-run-expo-go.md](phase-03-run-expo-go.md) — работает через `--localhost`, Fast Refresh подтверждён
- Phase 04 (todo) — Сетевая конфигурация API и поведение под VPN [phase-04-network-api.md](phase-04-network-api.md)
- Phase 05 (todo) — Troubleshooting-заметка и опциональный dev build [phase-05-troubleshooting-devbuild.md](phase-05-troubleshooting-devbuild.md)

## Model schedule

- Phase 01–03: FAST — механическая установка и проверка команд
- Phase 04: BALANCED — правка env/конфигурации проекта, проверка сетевых границ
- Phase 05: BALANCED — документация и условная ветка dev build

## Risks

| Риск | Митигация |
|------|-----------|
| ~~WHPX выключен~~ | Снят: `emulator -accel-check` в Phase 01 подтвердил рабочий WHPX |
| VPN ломает DNS внутри эмулятора | Fallback на `-dns-server` в Phase 04 |
| Отсутствие `android.package` в `app.json` | Не блокирует Expo Go; станет обязательным только для dev build (Phase 05) |
| `react-native-linear-gradient` в зависимостях, но не импортируется | Зафиксировано как tech debt в Phase 05, из плана не удаляется без отдельного решения |

## Next actions

1. ~~Phase 01~~ — выполнено.
2. ~~Phase 02~~ — выполнено.
3. ~~Phase 03~~ — выполнено.
4. Выполнить Phase 04 (настроить `EXPO_PUBLIC_API_URL` под выбранный бэкенд).
5. Выполнить Phase 05 только если понадобится нативный модуль вне Expo Go.

## Out of scope

- iOS Simulator (требует macOS)
- EAS-сборки и OTA-обновления
- Обновление устаревшего локального `CLAUDE.md` (там указан SDK 52 / React 18 при фактическом SDK 54 / React 19) — отдельная задача
