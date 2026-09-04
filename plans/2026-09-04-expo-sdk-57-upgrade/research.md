# Research — Апгрейд Expo SDK 54 → 57

Дата: 04.09.2026
Статус: facts only

## Причина

Expo Go в App Store обновился до SDK 57. Expo Go поддерживает только одну версию SDK, откат на iPhone невозможен, установка старой версии на физическое iOS-устройство недоступна. Альтернатива (development / preview build через EAS internal distribution) требует платного Apple Developer Program — его нет. Остаётся апгрейд проекта до SDK 57.

## Текущее состояние

| Пакет | Версия сейчас |
|-------|---------------|
| expo | ~54.0.33 |
| react-native | 0.81.5 |
| react | 19.1.0 |
| expo-router | ~6.0.23 |
| expo-updates | ~29.0.16 |
| react-native-reanimated | ~4.1.1 |
| react-native-worklets | 0.5.1 |
| nativewind | ^4.2.3 |
| tailwindcss | ^3.0.0 |
| eslint-config-expo | ^55.0.0 |
| typescript | ~5.9.2 |

Прочие: `@react-native-community/datetimepicker@^9.1.0`, `react-native-gifted-charts@^1.4.76`, `react-native-svg@15.12.1`, `react-native-screens@~4.16.0`, `react-native-safe-area-context@~5.6.0`, `lucide-react-native@^1.7.0`, `react-native-linear-gradient@^2.8.3`, `@tanstack/react-query@^5.96.1`, `zustand@^5.0.12`, `axios@^1.14.0`.

- Каталогов `android/` и `ios/` нет — Continuous Native Generation, нативные проекты собирает EAS.
- Локальный Node: 22.14.0.
- CI (`.github/workflows/deploy-expo.yml`): Node 20, `yarn install --frozen-lockfile`, `yarn tsc --noEmit`, `eas update --branch production`.
- `app.json`: `runtimeVersion: "1.0.0"`, плагины `expo-router`, `expo-updates`, легаси-поле `splash` верхнего уровня. Полей `newArchEnabled` / `edgeToEdgeEnabled` нет.
- `eas.json`: единственный профиль `production` на канале `production`.
- `babel.config.js`: пресеты `babel-preset-expo` (`jsxImportSource: nativewind`) + `nativewind/babel`, плагин `react-native-reanimated/plugin`.
- `metro.config.js`: `withNativeWind(config, { input: "./global.css" })`.
- `tailwind.config.js`: пресет `nativewind/preset`, `theme.extend` пустой.
- В корне лежат и `.eslintrc.js`, и `eslint.config.js`.
- `package-lock.json` присутствует и устарел (правило `ai/rules/common/tooling.md` требует его удаления).

## Целевые версии SDK

| SDK | React Native | React | Дата |
|-----|--------------|-------|------|
| 55 | 0.83 | 19.2 | — |
| 56 | 0.85 | 19.2 | — |
| 57 | 0.86 | 19.2 | 30.06.2026 |

Expo рекомендует поднимать SDK по одной мажорной версии.

## Breaking changes по ступеням

SDK 54 → 55:
- Legacy Architecture удалена, опция `newArchEnabled` убрана из схемы app config.
- Edge-to-edge на Android обязателен, `edgeToEdgeEnabled` удалён.
- Минимум Node: `^20.19.4`, `^22.13.0`, `^24.3.0` или `^25.0.0`. Минимум Xcode 26.
- `eas update` требует флаг `--environment` (раньше опциональный).
- Транспиляция app config использует установленный TypeScript вместо внутреннего.
- `expo-router`: серверные типы `ExpoRequest` / `ExpoResponse` заменены на стандартные `Request` / `Response`.
- `expo-av` удалён из Expo Go; `notification` в app.json удалён; fast resolver и `EXPO_USE_FAST_RESOLVER` удалены; `removeSubscription` устарел.

SDK 55 → 56:
- `expo-router` больше не зависит от React Navigation; прямые импорты `@react-navigation/*` перестают работать. Кодмод: `npx expo-codemod sdk-56-expo-router-react-navigation-replace`.
- Минимум iOS 16.4, Xcode 26.4.
- `expo-file-system`: `copy()` / `move()` асинхронные.
- `expo/fetch` становится глобальным `fetch`; отключение через `EXPO_PUBLIC_USE_RN_FETCH=1`.
- `@expo/dom-webview` вместо `react-native-webview` для DOM-компонентов.
- `@expo/vector-icons` больше не зависимость пакета `expo`.
- Известная регрессия: Hermes V1 увеличивает потребление памяти с `reanimated` / `worklets`, чинится в SDK 57.

SDK 56 → 57:
- Breaking changes отсутствуют.

## Что из этого затрагивает проект

| Пункт | Затронуто | Основание |
|-------|-----------|-----------|
| Импорты `@react-navigation/*` | нет | в `src/` не найдено |
| `expo-av`, `@expo/vector-icons`, `react-native-webview`, `expo-file-system`, `expo-blur` | нет | в `src/` не используются |
| `expo-router` серверные типы | нет | серверных роутов нет |
| Edge-to-edge Android | да | все экраны, `react-native-safe-area-context` |
| Node 20 в CI | да | ниже минимума SDK 55 |
| `eas update --environment` | да | шаг публикации в CI |
| `react-native-linear-gradient` | да | в зависимостях, но нигде не импортируется (везде `expo-linear-gradient`) |
| Babel-плагин reanimated | да | `react-native-reanimated/plugin` перенесён в `react-native-worklets/plugin`, старый путь молча ломает ворклеты |
| `runtimeVersion` | да | смена RN/React — нативное изменение |

## NativeWind

NativeWind v4 официальной совместимости с RN 0.86 не заявляет. Требования v5: Tailwind CSS 4.1+, RN 0.81+, Reanimated 4+, New Architecture — проект удовлетворяет всему, кроме версии Tailwind.

Стоимость возможной миграции v4 → v5 для этого проекта низкая:
- В `src/` используются только дефолтные утилиты Tailwind (`bg-black`, `bg-white`, `text-sm`, `border-t` и т.п.), кастомной темы нет — `theme.extend` пустой.
- Классы `shadow-*` и `elevation*`, у которых в v5 менялись имена и семантика, в коде не встречаются.
- `vars()`, `cssInterop`, `remapProps` не используются.
- Изменения ограничиваются конфигами: babel (убрать `nativewind/babel` и `jsxImportSource`), metro (`withNativeWind` без второго аргумента), `global.css` (импорты Tailwind v4 + `nativewind/theme`), новый `postcss.config.mjs`, `tailwindcss` 3 → 4.1.

`react-native-reanimated` в `src/` используется в одном месте: `src/features/operations/OperationsScreen/OperationsFeedFooter/SkeletonRow.tsx`.

## Открытые вопросы

- Целевая версия релиза для `package.json`, `app.json` и CHANGELOG — решает пользователь.
- Были ли вообще нативные билды и установленные сборки на канале `production` (проверяется `eas build:list`). От этого зависит, кого затронет бамп `runtimeVersion`.
- Совместимость `react-native-gifted-charts`, `lucide-react-native`, `@react-native-community/datetimepicker`, `react-native-svg` с RN 0.86 — не входят в набор `expo install --fix`, проверяются на каждой ступени.
