# Phase 04 — Сетевая конфигурация API и поведение под VPN

Status: todo
Model tier: BALANCED
Required rules: `ai/rules/projects/fin-app-mobile/state-management.md`, `ai/rules/common/post-code-workflow.md`

## Goal

Приложение в эмуляторе успешно выполняет запросы к бэкенду при включённом на хосте VPN.

## Implementation notes

`apiClient` берёт базовый URL из `process.env['EXPO_PUBLIC_API_URL']` (`src/shared/api/base.ts:8`), файла `.env` в репозитории нет. Значение подставляется Expo на этапе бандлинга, поэтому после любой правки `.env` Metro перезапускается с `--clear`.

Внутри Android-эмулятора `localhost` указывает на сам эмулятор. Хост-машина доступна по адресу `10.0.2.2`.

## Scope

Целевое состояние:

1. В корне проекта существует `.env` (не коммитится) с ключом `EXPO_PUBLIC_API_URL`:
   - локальный `fin-app-backend` на ПК → `http://10.0.2.2:<порт бэкенда>`
   - удалённый бэкенд → обычный `https://...` URL без изменений
2. `.env` и `.env.local` присутствуют в `.gitignore`.
3. В репозитории есть `.env.example` с ключом `EXPO_PUBLIC_API_URL` и комментарием про `10.0.2.2` (значение-плейсхолдер, без секретов — переменные `EXPO_PUBLIC_` попадают в бандл).
4. Запросы приложения проходят: список кошельков/транзакций загружается, ошибок сети в консоли Metro нет.
5. Для случая, когда бэкенд слушает только `127.0.0.1` на хосте, применяется проброс порта через `adb reverse`.
6. Для случая, когда VPN ломает разрешение имён внутри эмулятора, эмулятор стартует с явным DNS.
7. Изменения проекта прошли пост-код проверки.

## VPN-поведение (справочно, фиксируется по факту проверки)

- Metro↔эмулятор идёт через `adb reverse` по loopback → VPN не мешает.
- Трафик эмулятора наружу наследует сетевой стек хоста → VPN-туннель применяется автоматически.
- Типичная точка отказа под VPN — DNS внутри эмулятора; лечится запуском с `-dns-server`.

## Checklist

- [ ] Определён адрес бэкенда (локальный порт или удалённый хост)
- [ ] Создан `.env` с `EXPO_PUBLIC_API_URL`
- [ ] `.env` и `.env.local` в `.gitignore`
- [ ] Создан `.env.example` без реальных значений
- [ ] Metro перезапущен с `--clear`
- [ ] Запросы к API проходят из эмулятора
- [ ] Проверен `adb reverse` для локального бэкенда
- [ ] Проверен запуск эмулятора с явным DNS при включённом VPN
- [ ] `rtk yarn lint` и `rtk yarn tsc --noEmit` проходят

## Verification commands

```powershell
adb reverse tcp:3000 tcp:3000
adb shell ping -c 3 10.0.2.2
adb shell curl -s -o /dev/null -w "%{http_code}" http://10.0.2.2:3000/health
emulator -avd finapp_pixel7 -dns-server 8.8.8.8,1.1.1.1
rtk npx expo start --android --clear
rtk yarn lint
rtk yarn tsc --noEmit
```

## Acceptance criteria

- Экран дашборда показывает данные с бэкенда, а не состояние ошибки
- В консоли Metro нет `Network Error` от Axios
- `git status` не показывает `.env` как неотслеживаемый к коммиту файл
- `rtk yarn lint` и `rtk yarn tsc --noEmit` завершаются без ошибок

## Handoff note

Рабочий цикл разработки в эмуляторе закрыт. Следующая фаза — только документация и условная ветка dev build.
