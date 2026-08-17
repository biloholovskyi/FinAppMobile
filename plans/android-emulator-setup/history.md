# History — Android Emulator Setup

## 2026-08-17 — Phase 01 (done)

- Установлены Android SDK command-line tools `22.0` и Microsoft OpenJDK 17.0.20 в профиль пользователя — без прав администратора.
- Отклонение от плана: Android Studio не ставился (требует UAC); SDK развёрнут в стандартный путь `%LOCALAPPDATA%\Android\Sdk`, Studio можно добавить позже поверх.
- Через `sdkmanager` поставлены `platform-tools`, `emulator` 37.1.11, `platforms;android-36`, `system-images;android-36;google_apis_playstore;x86_64`.
- Лицензии SDK приняты записью файлов хешей в `Sdk\licenses` — интерактивный `sdkmanager --licenses` не читает stdin из этого окружения.
- Открытие: Windows-фича `HypervisorPlatform` числится выключенной, но `emulator -accel-check` даёт `WHPX(10.0.26200) is installed and usable` — активного `VirtualMachinePlatform` (WSL2) достаточно, риск «WHPX выключен» снят.
- Переменные `ANDROID_HOME`, `JAVA_HOME` и дополнения `PATH` записаны в `HKCU:\Environment` типом `ExpandString` (исходный `PATH` сохранял `%USERPROFILE%`); бэкап — `<scratchpad>\path-backup.txt`.
- Открытые ранее терминалы и IDE новых переменных не видят до перезапуска.

## 2026-08-17 — Phase 02 (done)

- AVD `finapp_pixel7` создан через `avdmanager` (профиль `pixel_7`, образ `android-36;google_apis_playstore;x86_64`) — Android Studio не понадобился.
- `avdmanager` печатает `Error: Could not load devices from ...\devices.xml`, но AVD создаётся корректно: разрешение 1080x2400 и density 420 применены. Сообщение классифицировано как шум.
- Дефолты `avdmanager` слишком слабые (RAM 2G, heap 228M, `hw.gpu.enabled=no`) — доведены правкой `config.ini` до 4096/512/GPU `host`, плюс `hw.keyboard=yes` и `PlayStore.enabled=yes`; бэкап в `config.ini.bak`.
- Первая загрузка эмулятора заняла ~60 секунд; `adb devices` → `emulator-5554 device`, API 36 / Android 16.
- Сеть эмулятора проверена до старта Metro: интернет, DNS-резолв и `10.0.2.2` работают — сетевые проблемы дальше можно списывать только на конфигурацию API.
- Параллельно выполнен `yarn install` (exit 0): `node_modules` в проекте отсутствовали полностью.

## 2026-08-17 — Phase 03 (done)

- `expo start --android` отдал эмулятору LAN-URL `exp://192.168.0.89:8081`; первый бандл собрался (48 с, 3425 модулей) и дашборд отрисовался, но после перезапуска приложения по интенту оно больше не открылось — ни активности, ни записей в logcat, ни нового бандла.
- На хосте активен адаптер `wt0 — WireGuard Tunnel`: исходная жалоба про VPN воспроизвелась и на эмуляторе, но только на LAN-пути.
- Решение — `expo start --android --localhost`: Expo поднимает `adb reverse tcp:8081 tcp:8081`, отдаёт `exp://127.0.0.1:8081`, бандл собрался за 10 с. Точную причину отказа LAN-пути не изолировали — принят рабочий обход.
- Добавлен скрипт `android:emulator`; существующий `android` намеренно не тронут, чтобы не сломать запуск на физическом устройстве.
- Fast Refresh проверен визуально (правка заголовка и откат применились без перезапуска) — по логу Metro это не видно, HMR-патчи не пишут строку `Bundled`.
- Пробные правки в `src/` откачены, `git status` чист; `rtk yarn lint` — 0 ошибок (2 предсуществующих предупреждения), `rtk yarn tsc --noEmit` — чисто.
- Metro сообщает о расхождении версий с ожиданиями Expo 54 (`expo`, `react-native-worklets`, `datetimepicker`, `eslint-config-expo`) — на работу не влияет, вынесено в tech debt Phase 05.
