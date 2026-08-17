# Phase 03 — Запуск проекта в эмуляторе через Expo Go

Status: done
Model tier: FAST
Required rules: `ai/rules/projects/fin-app-mobile/architecture.md`

## Goal

`rtk yarn android:emulator` открывает FinApp в Expo Go внутри AVD, Fast Refresh работает.

## Implementation notes

Ключевое открытие фазы: `expo start --android` по умолчанию отдаёт эмулятору LAN-адрес хоста (`exp://192.168.0.89:8081`). На машине активен туннель WireGuard (адаптер `wt0`), и этот путь оказался нерабочим — после первого бандла приложение больше не открывалось по интенту.

Рабочая конфигурация — флаг `--localhost`: Expo поднимает `adb reverse tcp:8081 tcp:8081` и отдаёт `exp://127.0.0.1:8081`. Связка Metro↔эмулятор идёт через loopback ADB и от VPN не зависит.

Все нативные модули, реально импортируемые в `src/`, входят в Expo Go SDK 54 (см. `research.md`) — prebuild и dev client не нужны.

## Scope

Целевое состояние:

1. Эмулятор из Phase 02 запущен до старта Metro.
2. В `package.json` есть скрипт `android:emulator` = `expo start --android --localhost`. Существующий `android` не меняется — он остаётся для запуска на физическом устройстве по LAN.
3. Проект стартует командой `rtk yarn android:emulator` из корня `FinAppMobile`.
4. Expo Go установлен в эмуляторе (автоматически при первом запуске).
5. Приложение открывается на стартовом маршруте Expo Router.
6. Fast Refresh перерисовывает экран после правки любого файла в `src/` без перезапуска приложения.
7. Dev-меню Expo Go доступно и показывает подключение к `127.0.0.1:8081`.
8. Известен способ сброса кеша Metro при странном поведении бандлера.

## Checklist

- [x] Эмулятор запущен, `adb devices` = `device`
- [x] Скрипт `android:emulator` добавлен в `package.json`
- [x] Запуск завершает сборку бандла без ошибок
- [x] Expo Go установлен и открыт в эмуляторе
- [x] Приложение отрисовывает первый экран
- [x] Fast Refresh подхватывает правку в `src/`
- [x] Dev-меню открывается
- [x] `adb reverse` подтверждён
- [x] Пробные правки откачены, рабочее дерево чистое
- [x] `rtk yarn lint` и `rtk yarn tsc --noEmit` проходят

## Verification commands

```powershell
adb devices
rtk yarn android:emulator
adb reverse --list
adb shell pm list packages | Select-String exponent
rtk npx expo start --android --localhost --clear
```

## Acceptance criteria

- В терминале Metro отображается `Android Bundled ... ms` без красных ошибок
- В эмуляторе виден первый экран приложения, а не красный экран ошибки
- `adb shell pm list packages` содержит `host.exp.exponent` (Expo Go)
- Правка текста в любом компоненте `src/` отражается в эмуляторе без ручного релоада

## Evidence

- LAN-режим: `Opening exp://192.168.0.89:8081`, первый бандл `Android Bundled 48106ms (3425 modules)`, экран дашборда отрисован
- После `am force-stop` + повторного интента на `exp://192.168.0.89:8081` приложение не открылось: на переднем плане остался лаунчер, в logcat нет записей Expo Go, нового бандла Metro не собрал за 120 с
- Хост-адаптеры: `wt0 — WireGuard Tunnel` (активен), `Wi-Fi`
- Localhost-режим: `Opening exp://127.0.0.1:8081`, `Android Bundled 10093ms (3425 modules)`
- `adb reverse --list` → `host-19 tcp:8081 tcp:8081`
- Dev-меню Expo Go: `FinApp`, `SDK version: 54.0.0`, `Runtime version: 1.0.0`, `Connected to expo-cli ● 127.0.0.1:8081`, доступен пункт `Disable Fast Refresh` (то есть Fast Refresh включён)
- Fast Refresh: правка заголовка на `Дашборд HMR-OK` и обратный откат отразились в эмуляторе без перезапуска приложения
- `host.exp.exponent` присутствует в `pm list packages`; `topResumedActivity` = `host.exp.exponent/.experience.ExperienceActivity`
- `git status` после отката пробных правок: изменений в `src/` нет
- `rtk yarn lint` → 0 errors, 2 warnings (предсуществующие, `useDashboardScreen.ts:17` — неиспользуемые `isError` и `error`)
- `rtk yarn tsc --noEmit` → без ошибок

## Handoff note

- Приложение работает в эмуляторе; для запуска использовать `android:emulator`, а не `android`.
- Причина отказа LAN-режима до конца не изолирована — зафиксировано наблюдение и рабочий обход; при работе на физическом устройстве это место всплывёт снова.
- Экран отрисован, но данные нулевые: `EXPO_PUBLIC_API_URL` не задан (`src/shared/api/base.ts:8`). Это Phase 04.
- Metro-лог сообщает о расхождении версий с ожиданиями Expo 54 (`expo` 54.0.33 vs `~54.0.36`, `react-native-worklets` 0.8.1 vs 0.5.1, `@react-native-community/datetimepicker` 9.1.0 vs 8.4.4, `eslint-config-expo` 55.0.0 vs `~10.0.0`) — на запуск не влияет, вынести в tech debt в Phase 05.
