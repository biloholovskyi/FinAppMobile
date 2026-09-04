# Phase 07 — CI и конфигурация EAS

Status: done
Model tier: FAST
Required rules: `ai/rules/common/deployment.md`, `ai/rules/common/tooling.md`

## Goal

Пайплайн публикации соответствует требованиям SDK 57 и не падает при первом пуше в `main`.

## Implementation notes

Обе правки обязательны: Node 20 ниже минимума SDK 55, а `eas update` без `--environment` начиная с SDK 55 завершается ошибкой.

Дополнительно из Phase 06: `scripts/start-android.mjs` запускает Expo с флагом `--localhost`, и на SDK 57 Metro при этом слушает только IPv6-loopback `::1`. `adb reverse` пробрасывает устройство на IPv4 `127.0.0.1`, где никто не слушает, и Expo Go падает с `java.io.IOException: Failed to download remote update`. Рабочий обход — запуск без `--localhost`: Metro встаёт на `::` и обслуживает обе стороны.

## Scope

- `.github/workflows/deploy-expo.yml` — версия Node и вызов `eas update`
- `eas.json` — при необходимости привести профиль `production` в соответствие с текущей схемой EAS CLI
- `scripts/start-android.mjs` — режим запуска Metro, сломанный привязкой к `::1`

## Checklist

- [x] Поднять `node-version` в workflow до 22
- [x] Добавить `--environment` в вызов `eas update`
- [x] `EXPO_PUBLIC_API_URL` пробрасывается в шаг публикации без изменений
- [x] `eas.json` парсится, профиль `production` резолвится, SDK 57.0.0 подхвачен
- [x] Поле `splash` в `app.json` — закрыто досрочно в Phase 03
- [x] Починить `scripts/start-android.mjs`
- [x] Синхронизировать `NODE_VERSION_CI` в `ai/rules/common/deployment.md` и `ai/rules/common/tooling.md`

## Verification commands

- `rtk npx eas config --profile production`
- `rtk npx expo-doctor@latest`

## Acceptance criteria

- Workflow описывает Node 22 и вызов `eas update` с `--environment`
- Константы Node в правилах совпадают с workflow
- `eas config` отрабатывает без ошибок

## Evidence note

`.github/workflows/deploy-expo.yml`: `node-version` поднят с 20 до 22 — Node 20 ниже минимума SDK 55 (`^20.19.4`, `^22.13.0`, `^24.3.0`, `^25.0.0`), а образ `actions/setup-node` с `node-version: 20` не гарантирует патч 20.19.4+. В вызов `eas update` добавлен `--environment production`. Флаг подтверждён по справке CLI дословно: «Required for projects using Expo SDK 55 or greater», допустимые значения `production`, `preview`, `development`. Без него первый же пуш в `main` уронил бы публикацию.

`eas config --profile production --platform android` отрабатывает: конфиг парсится, профиль на месте (`credentialsSource: remote`, `distribution: store`, `channel: production`), `sdkVersion` резолвится как `57.0.0`. Правок в `eas.json` не потребовалось.

`scripts/start-android.mjs` — починка находки Phase 06. Скрипт запускает Expo с `--localhost`, Node 22 резолвит `localhost` в `::1` первым, Metro слушает только IPv6, а `adb reverse` форвардит устройство на IPv4 `127.0.0.1` — Expo Go падал с `java.io.IOException: Failed to download remote update`. Убирать `--localhost` было нельзя: режим существует ровно потому, что LAN-путь ломается под VPN. Вместо этого в дочерний процесс прокидывается `NODE_OPTIONS=--dns-result-order=ipv4first` через новую константу `IPV4_FIRST_NODE_OPTION` с JSDoc, существующее значение `NODE_OPTIONS` сохраняется.

Проверка правки на живом эмуляторе: Metro встал на `127.0.0.1` вместо `::1`, приложение открылось само, `Android Bundled 1207ms (3612 modules)`.

Правила синхронизированы: `NODE_VERSION_CI` 20 → 22 в `ai/rules/common/deployment.md` и `ai/rules/common/tooling.md`; добавлена константа `EAS_UPDATE_ENVIRONMENT`; шаг 6 OTA-пайплайна и команда в справочнике команд показывают `--environment`; в анти-паттерны добавлен вызов `eas update` без флага. Вставки написаны по-английски под стиль этих файлов.

Поле `splash` в `app.json` из scope снято — закрыто досрочно на Phase 03.

Проверки: `yarn tsc --noEmit` — чисто; `yarn lint` — те же 24 ошибки из Phase 03, новых нет.

## Handoff note

- CI готов к пушу в `main`: Node 22 и `eas update --environment production`
- `eas.json` правок не потребовал
- `scripts/start-android.mjs` чинится прокидыванием `--dns-result-order=ipv4first`, проверено на эмуляторе
- `NODE_VERSION_CI` и команда `eas update` в правилах приведены к фактическому состоянию — Phase 10 эти два пункта уже не трогает
- Остаётся долг Phase 08: 24 ошибки `react-hooks`
