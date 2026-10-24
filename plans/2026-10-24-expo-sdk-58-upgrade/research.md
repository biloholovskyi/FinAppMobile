# Research — Апгрейд Expo SDK 57 → 58

Дата: 24.10.2026
Статус: facts only

## Причина

Expo SDK 58 стабилен с 15.10.2026. Expo Go поддерживает только одну версию SDK; в App Store опубликован Expo Go 58.0.5 с поддержкой SDK 58, установленное приложение на SDK 57 в нём не откроется. Development build недоступен — нет платного Apple Developer Program.

## Текущее состояние

| Пакет | Версия |
|-------|--------|
| expo | ~57.0.20 |
| react-native | 0.86.3 |
| react | 19.2.3 |
| expo-router | ~57.0.19 |
| expo-updates | ~57.0.21 |
| react-native-reanimated | 4.5.1 |
| react-native-worklets | 0.10.1 |
| react-native-safe-area-context | ~5.7.0 |
| react-native-screens | ~4.26.0 |
| react-native-svg | 15.15.4 |
| @react-native-community/datetimepicker | 9.1.0 |
| eslint-config-expo | ~57.0.2 |
| nativewind | ^4.2.3 |
| typescript | ~6.0.3 |

- Версия приложения `1.13.0`, `runtimeVersion` `2.0.0`, ветка `r-1.13.0`.
- Каталогов `android/` и `ios/` нет — CNG.
- Локальный Node 24.21.0; CI — `node-version: 22` (резолвится в последний 22.x).
- В корне один файл окружения — `.env`; `.env.development` / `.env.production` нет.
- `tsconfig.json` расширяет `expo/tsconfig.base`, `customConditions` не задан.
- `app.json` не задаёт `web.output`.

## SDK 58 — ключевые факты

- React Native 0.86 → 0.88 (включая изменения 0.87).
- Node: `^22.13`, `^24.3` или `>=26`; нечётные мажоры не поддерживаются.
- Сборка под iOS 27 SDK; Android совместим с AGP 9.
- Шаги апгрейда по Expo: `npx expo install expo@^58.0.0 --fix`, `npx expo-doctor@latest`, `npx expo install react-native-safe-area-context`.
- Сторонний источник: Reanimated 4.7 / Worklets 0.13 поддерживают RN 0.86–0.88.

## Breaking changes и что затронуто

| Изменение | Затронуто | Основание |
|-----------|-----------|-----------|
| Strict TypeScript API RN по умолчанию: deep imports `react-native/Libraries/*` — ошибка типов, ref-типы `ViewInstance` и т.п. | возможно | deep imports в `src/` нет; типизированных `useRef<View…>` нет; проверяется tsc, включая Orval и `node_modules` |
| Удалены `InteractionManager`, экспорт `Touchable`, типы `NativeMethods` | нет | в `src/` не найдено |
| Удалён prop `animated` у `Modal` | нет | 5 модалок используют `animationType`, не `animated` |
| Удалены часть props `StatusBar` (RN) | нет | используется `expo-status-bar` с `style="light"` |
| Expo CLI выставляет `NODE_ENV` по команде, меняется набор `.env` | нет | есть только `.env`, он грузится всегда |
| Android R8 включён в release | только нативный билд | рефлексия в JS-зависимостях не ожидается |
| iOS `SceneDelegate.swift` при prebuild | нет | кастомного `AppDelegate` нет, CNG |
| expo-router: переработан navigation core, `withLayoutContext` → `integrateWithRouter`, импорты `expo-router/react-navigation` | нет | кастомных навигаторов и таких импортов нет |
| expo-router: server output по умолчанию при незаданном `web.output` | только web | web-таргет не используется в продакшене |
| expo-file-system, expo-sqlite, expo-notifications, @expo/ui, expo-media-library, expo-localization | нет | пакеты не установлены |
| `@expo/fingerprint` пресет `balanced` | нет | `runtimeVersion` задан строкой, не policy `fingerprint` |
| `updates.maxUpdatesToKeep` (новое) | нет | опционально |
| `runtimeVersion` | да | смена RN — нативное изменение |

## Открытые вопросы

- Совместимость `react-native-gifted-charts`, `lucide-react-native`, `react-native-svg`, `nativewind@4` с RN 0.88 — вне набора `expo install --fix`, проверяется в рантайме.
- Наличие Expo Go 58 в Google Play — проверяется перед дымовым прогоном на Android.
- Существуют ли нативные билды на `runtimeVersion` `2.0.0` (`eas build:list`) — влияет только на формулировку в evidence, бамп нужен в любом случае.

## Источники

- https://expo.dev/changelog/sdk-58
- https://expo.dev/blog/how-to-upgrade-to-sdk-58
- https://apps.apple.com/us/app/expo-go/id982107779
