# Phase 01 — Установка Android-тулчейна и переменных окружения

Status: done
Model tier: FAST
Required rules: `ai/rules/common/core-rules.md`

## Goal

На Windows-ПК доступны `adb` и `emulator`, Android SDK установлен, аппаратное ускорение работает.

## Implementation notes

Ничего из тулчейна на машине не было — всё ставилось с нуля.

Отклонение от исходного плана: вместо Android Studio установлены Android SDK command-line tools + portable Microsoft OpenJDK 17. Причина — установщик Studio требует UAC, а CLI-путь целиком разворачивается в профиль пользователя без прав администратора. Android Studio при желании ставится сверху позже и подхватывает готовый SDK по `ANDROID_HOME`.

Второе уточнение: функция Windows `HypervisorPlatform` числится выключенной (`InstallState: 2`), но `emulator -accel-check` подтверждает, что WHPX доступен и пригоден — активного `VirtualMachinePlatform` (WSL2) для этого достаточно. Включение фичи и перезагрузка не требуются. Драйвер AEHD/gvm для AMD не ставится — конфликтует с активным гипервизором.

## Scope

Целевое состояние машины:

1. Аппаратное ускорение эмулятора доступно (WHPX).

2. Установлен Microsoft OpenJDK 17 в `%LOCALAPPDATA%\Programs\jdk-17.0.20+8` (portable zip, нужен для `sdkmanager`/`avdmanager`).

3. Установлены Android SDK command-line tools в `%LOCALAPPDATA%\Android\Sdk\cmdline-tools\latest`.

4. Приняты лицензии SDK — файлы хешей в `%LOCALAPPDATA%\Android\Sdk\licenses`.

5. Через `sdkmanager` установлены:
   - `platform-tools`
   - `emulator`
   - `platforms;android-36`
   - `system-images;android-36;google_apis_playstore;x86_64`

6. Заданы пользовательские переменные окружения (реестр `HKCU:\Environment`, тип `ExpandString`):
   - `ANDROID_HOME` = `%LOCALAPPDATA%\Android\Sdk`
   - `JAVA_HOME` = `%LOCALAPPDATA%\Programs\jdk-17.0.20+8`
   - `PATH` дополнен: `platform-tools`, `emulator`, `cmdline-tools\latest\bin`, `jdk-17.0.20+8\bin`
   - Разослан `WM_SETTINGCHANGE`; уже открытые терминалы переменные не подхватят — нужен новый.

## Checklist

- [x] Аппаратное ускорение подтверждено (`emulator -accel-check`)
- [x] JDK 17 установлен
- [x] Command-line tools установлены
- [x] Лицензии SDK приняты
- [x] SDK Platform (API 36) установлен
- [x] Platform-Tools и Emulator установлены
- [x] System image `google_apis_playstore x86_64` скачан
- [x] `ANDROID_HOME` и `JAVA_HOME` заданы
- [x] Пути добавлены в `PATH`
- [ ] Открыт новый терминал (проверяет пользователь)

## Verification commands

```powershell
$env:ANDROID_HOME
adb --version
emulator -version
emulator -accel-check
```

## Acceptance criteria

- `$env:ANDROID_HOME` выводит путь к SDK
- `adb --version` выводит версию Android Debug Bridge
- `emulator -version` выводит версию эмулятора
- `emulator -accel-check` сообщает, что ускорение доступно (WHPX)

## Evidence

- `adb --version` → `Android Debug Bridge version 1.0.41`, `C:\Users\biloh\AppData\Local\Android\Sdk\platform-tools\adb.exe`
- `emulator -version` → `Android emulator version 37.1.11.0 (build_id 15917651)`
- `emulator -accel-check` → `WHPX(10.0.26200) is installed and usable.`, exit 0
- `java -version` → `openjdk version "17.0.20" 2026-07-21 LTS`
- `sdkmanager --version` → `22.0` (тул помечен deprecated в пользу нового `android` CLI — на работу не влияет)
- Компоненты SDK на диске: `platform-tools\adb.exe`, `emulator\emulator.exe`, `platforms\android-36`, `system-images\android-36\google_apis_playstore\x86_64`
- Бэкап исходного `PATH`: `<scratchpad>\path-backup.txt`

## Handoff note

- Тулчейн готов, ускорение WHPX подтверждено.
- Следующая фаза создаёт AVD; `avdmanager` лежит в `cmdline-tools\latest\bin` и требует `JAVA_HOME`.
- System image для AVD: `system-images;android-36;google_apis_playstore;x86_64`.
- Уже открытые терминалы (включая IDE) не видят новые переменные — для ручного запуска команд нужен свежий терминал.
