# Phase 05 — Troubleshooting-заметка и опциональный dev build

Status: todo
Model tier: BALANCED
Required rules: `ai/rules/common/post-code-workflow.md`

## Goal

Порядок запуска эмулятора зафиксирован в репозитории, а условия перехода на dev client описаны заранее.

## Implementation notes

Фаза выполняется после того, как Phase 01–04 подтверждены на практике: документируется только то, что реально сработало. Ветка dev build выполняется **только при необходимости** — сейчас Expo Go покрывает все импортируемые модули.

## Scope

Целевое состояние:

1. В `README.md` (или `docs/emulator.md`) есть раздел «Запуск на Android-эмуляторе (Windows)»:
   - предусловия: `ANDROID_HOME`, `platform-tools`/`emulator` в `PATH`
   - запуск AVD и запуск проекта
   - таблица типовых сбоев и решений

2. Таблица типовых сбоев покрывает:

| Симптом | Причина | Действие |
|---------|---------|----------|
| `adb devices` пуст | эмулятор не запущен или ADB завис | перезапустить сервер ADB |
| Устройство `offline` | ADB рассинхронизирован | перезапустить сервер ADB, затем эмулятор |
| Эмулятор крайне медленный | WHPX выключен | вернуться к Phase 01 |
| Metro отдаёт старый бандл | кеш Metro | запуск с `--clear` |
| `Network Error` в Axios | неверный `EXPO_PUBLIC_API_URL` или `localhost` вместо `10.0.2.2` | вернуться к Phase 04 |
| Нет интернета в эмуляторе под VPN | DNS внутри эмулятора | запуск эмулятора с `-dns-server` |
| Expo Go падает при старте | несовместимая версия Expo Go | переустановить Expo Go из Play Store в эмуляторе |

3. Зафиксирован tech debt: `react-native-linear-gradient` объявлен в `package.json`, но в `src/` не импортируется (используется `expo-linear-gradient`). Удаление — отдельная задача, не в этом плане.

4. Условная ветка dev build (выполняется только если появится нативный модуль вне Expo Go):
   - в `app.json` добавляется `android.package` (например, `com.amitil13.finappmobile`) — сейчас поле отсутствует
   - устанавливается `expo-dev-client`
   - устанавливается JDK 17
   - в `eas.json` добавляется профиль `development` (`developmentClient: true`, `distribution: internal`), либо используется локальная сборка `expo run:android`
   - Expo Go после этого перестаёт быть точкой входа для локальной разработки

## Checklist

- [ ] Раздел про эмулятор добавлен в документацию репозитория
- [ ] Таблица типовых сбоев заполнена по фактически встреченным проблемам
- [ ] Tech debt по `react-native-linear-gradient` зафиксирован
- [ ] Условия перехода на dev client описаны
- [ ] Dev build выполнен **или** явно помечен как не требующийся
- [ ] `rtk yarn lint` проходит

## Verification commands

```powershell
adb kill-server
adb start-server
adb devices
rtk yarn lint
```

## Acceptance criteria

- Документ позволяет поднять эмулятор с нуля без обращения к этому плану
- В плане-индексе все фазы помечены `done` с evidence-заметками
- Ветка dev build имеет явный статус: выполнена или не требуется

## Handoff note

План закрыт. Дальнейшие работы по эмулятору — только точечные правки документации.
