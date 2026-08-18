# Phase 02 — Создание и проверка AVD

Status: done
Model tier: FAST
Required rules: `ai/rules/common/core-rules.md`

## Goal

Создан и запускается виртуальный Android-девайс, видимый в `adb devices`.

## Implementation notes

Android Studio на машине нет (см. отклонение в Phase 01), поэтому AVD создан через `avdmanager` из command-line tools. При создании `avdmanager` печатает `Error: Could not load devices from ...\system-images\...\devices.xml` — сообщение некритично: профиль `pixel_7` применяется, разрешение и плотность в `config.ini` корректные.

Параметры, которые `avdmanager` задаёт по умолчанию слишком низкими, доводятся правкой `config.ini` (RAM 2G, heap 228M, GPU выключен).

## Scope

Целевое состояние:

1. Создан AVD `finapp_pixel7`:
   - Профиль устройства: `pixel_7` — 1080x2400, density 420, портрет
   - System image: `system-images;android-36;google_apis_playstore;x86_64`
   - Имя без пробелов — упрощает запуск из CLI

2. В `%USERPROFILE%\.android\avd\finapp_pixel7.avd\config.ini` доведены параметры:
   - `hw.ramSize=4096`, `vm.heapSize=512`
   - `hw.gpu.enabled=yes`, `hw.gpu.mode=host`
   - `hw.keyboard=yes` — ввод с физической клавиатуры
   - `PlayStore.enabled=yes`
   - `avd.id` / `avd.name` = `finapp_pixel7`
   - Резервная копия исходника: `config.ini.bak`

3. AVD стартует из терминала без Android Studio.

4. Эмулятор виден для `adb` как `emulator-5554` в состоянии `device`.

5. Внутри эмулятора работают интернет, DNS и доступ к хосту по `10.0.2.2`.

## Checklist

- [x] AVD `finapp_pixel7` создан
- [x] RAM выставлена 4096 MB, heap 512 MB
- [x] GPU-ускорение включено (`host`)
- [x] Эмулятор стартует из терминала
- [x] Эмулятор загружается до домашнего экрана
- [x] `adb devices` показывает устройство в состоянии `device`
- [x] Внутри эмулятора есть интернет и работает DNS
- [x] Хост доступен по `10.0.2.2`

## Verification commands

```powershell
emulator -list-avds
emulator -avd finapp_pixel7
adb devices
adb shell getprop ro.build.version.sdk
```

## Acceptance criteria

- `emulator -list-avds` содержит `finapp_pixel7`
- Эмулятор доходит до домашнего экрана менее чем за ~60 секунд
- `adb devices` показывает `emulator-5554   device` (не `offline`, не `unauthorized`)
- `adb shell getprop ro.build.version.sdk` возвращает `35` или `36`

## Evidence

- `emulator -list-avds` → `finapp_pixel7`
- `sys.boot_completed` = 1 через ~60 секунд после старта
- `adb devices` → `emulator-5554   device`
- `ro.build.version.sdk` = `36`, `ro.build.version.release` = `16`, `ro.product.model` = `sdk_gphone64_x86_64`, `ro.product.cpu.abi` = `x86_64`
- `ping 8.8.8.8` из эмулятора — 0% потерь, ~41 мс
- `ping google.com` из эмулятора — резолв успешен, DNS работает
- `ping 10.0.2.2` — 0% потерь, ~0.5 мс (хост доступен)
- Подготовка к Phase 03: `yarn install` выполнен, exit 0, 24.6 s

## Handoff note

- Эмулятор загружен и доступен для `adb`; ускорение и сеть подтверждены.
- Сеть эмулятора исправна на этапе до старта Metro — если API не заработает, причина в `EXPO_PUBLIC_API_URL`, а не в эмуляторе.
- `node_modules` установлены (`yarn install`, exit 0); `@babel/core` 7.29.0 присутствует несмотря на peer-warning от `react-native-worklets`.
- Expo CLI установит Expo Go в эмулятор при первом запуске Phase 03.
- Эмулятор остаётся запущенным — повторный старт для Phase 03 не нужен.
