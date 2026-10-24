# Design — Апгрейд Expo SDK 57 → 58

Дата: 24.10.2026

## Целевое состояние

- `package.json` и `app.json` описывают проект на Expo SDK 58: React Native 0.88, все Expo-пакеты и нативные зависимости в версиях, которые резолвит `expo install --fix` для SDK 58.
- `expo-doctor` проходит без провалов.
- Приложение запускается в Expo Go SDK 58 на iPhone и на Android-эмуляторе `finapp_pixel7`.
- `rtk yarn lint`, `rtk yarn tsc --noEmit`, `rtk yarn agents:check --strict`, `rtk yarn calendar:check` проходят.
- Код совместим со Strict TypeScript API React Native без opt-out `react-native-legacy-deep-imports`.
- `expo.runtimeVersion` поднят до `3.0.0`.
- CI устанавливает Node, удовлетворяющий минимуму SDK 58.
- Версия приложения `1.13.1` в `package.json`, `app.json` и CHANGELOG.
- Правила и роли (`AGENTS.md`, `ai/**`, `.claude/agents/**`) называют SDK 58 и RN 0.88.

## Стратегия

Один шаг 57 → 58 — мажор единственный, инкрементальный путь не нужен. Установка через `expo install --fix`, затем `expo-doctor`, tsc, lint, экспорт бандла и дымовой прогон в Expo Go. Ошибки типов Strict TS API чинятся в коде, а не opt-out'ом.

## Ключевые решения

| Решение | Выбор | Причина |
|---------|-------|---------|
| Путь | Один шаг 57 → 58 | Один мажор SDK |
| Strict TS API | Чинить код | Opt-out удаляется после RN 0.89 |
| NativeWind | Остаётся v4 | Работает на RN 0.86; v5 — только по триггеру ниже |
| `runtimeVersion` | `2.0.0` → `3.0.0` | Нативное изменение; старые билды не должны получать JS под RN 0.88 |
| Версия | `1.13.1` | Решение пользователя |
| `web.output` | Не задаётся | Web-таргет не публикуется |

## Триггер миграции NativeWind v5

Отдельная задача вне плана, если после установки SDK 58:
- Metro падает на `nativewind/metro` или `nativewind/babel`;
- классы не применяются в рантайме;
- `expo-doctor` или Metro сообщают о несовместимости NativeWind.

## Риски

| Риск | Влияние | Реакция |
|------|---------|---------|
| NativeWind v4 несовместим с RN 0.88 | Ломается вёрстка | Стоп фазы, решение пользователя по триггеру |
| Strict TS API в сгенерированном Orval-коде | tsc падает | Правка через конфиг Orval или точечные типы; без регенерации контракта |
| Сторонние библиотеки без поддержки RN 0.88 | Падают графики, иконки, date-picker | Проверка экранов в рантайме, ручной подъём версий |
| Пуш в `main` с бандлом SDK 58 | OTA не дойдёт до билдов на `2.0.0` | Бамп `runtimeVersion` до первого пуша |
| Expo Go 58 нет в Google Play | Нет прогона на Android | Установка APK Expo Go 58 с expo.dev |

## Границы

- Миграция NativeWind на v5.
- Development / preview build, Apple Developer Program.
- Бизнес-логика, экраны, API-контракт, регенерация Orval.
- Тест-раннер.
- Git-операции.

## Связанные правила

- `ai/rules/projects/fin-app-mobile/architecture.md` — таблица закреплённых версий
- `ai/rules/common/react-19.md`, `ai/rules/common/react.md` — версии RN
- `ai/rules/common/deployment.md` — CI, `runtimeVersion`
- `ai/rules/common/versioning-changelog.md` — version-файлы и CHANGELOG
- `ai/rules/common/tooling.md` — команды, минимум Node
