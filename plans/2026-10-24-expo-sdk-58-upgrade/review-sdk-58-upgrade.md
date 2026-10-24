# Code Review — Expo SDK 58 upgrade (RN 0.88 / React 19.3)

Дата: 24.10.2026
Ревьюеры: `code-reviewer` (дифф), `dependency-analyst` (зависимости) — отдельные запуски, файлы не правили.
Скоуп: `package.json`, `yarn.lock`, `app.json`, `src/features/categories/CategoriesScreen/{CategoriesScreen.tsx,useCategoriesScreen.ts}`, целевой скан `src/`.
Гейты взяты у имплементера: tsc чисто, eslint 0 ошибок / 3 предсуществующих предупреждения, `agents:check`, `calendar:check`, `expo-doctor` 20/20, дымовой прогон в Expo Go 58.0.5.

## 🔴 Critical

- Нет в коде.
- Зависимости: `react-native > react-devtools-core > shell-quote@1.8.3` — critical + high (dev-server tooling, в бандл не попадает). Исправлено: lockfile перерезолвлен в пределах `^1.6.1` → `shell-quote@1.12.0`.

## 🟡 Warnings

1. `DateTimePickerModal.tsx` (строки 40, 58, 87) использует `onChange`, помеченный в `@react-native-community/datetimepicker@9.2.1` как deprecated (→ `onValueChange` / `onDismiss` / `onNeutralButtonPress`). Работает, tsc проходит. Решение: технический долг, миграция отдельной задачей; пути Android дата → время и iOS-спиннер проверить на устройстве.
2. `runtimeVersion` 3.0.0 корректен; должен попасть в `main` вместе с апгрейдом. Решение: `deploy-preflight` перед мержем (за пользователем).
3. `axios > follow-redirects@1.16.0` — high. В RN axios работает через XHR-адаптер, путь не исполняется. Исправлено: перерезолв в пределах `^1.16.0` → `1.16.1`.
4. Остальные 144 high / 36 moderate / 6 low — транзитивные в `@expo/cli`, `@expo/config-plugins`, `react-native > ws`, build tooling; в приложение не поставляются. Решение: ждать патч-релизов Expo/RN; `resolutions` не вводятся.

## 🔵 Improvements

1. `handleRefresh` корректен: `await refetch()` в `useCallback([refetch])`, `refetch` в TanStack v5 стабилен и по умолчанию не реджектит. Других потребителей `refetch` из хука нет.
2. `OperationsScreen` `RefreshControl.onRefresh` — tsc чист, тип совместим.
3. Предупреждение `ImageBackground is deprecated` — источник `react-native-css-interop@0.2.3` (nativewind 4), `remapProps(ImageBackground, …)` при импорте. В `src/` не используется. Решение: не подавлять, ждать upstream; долг связан с будущей миграцией NativeWind v5.
4. Peer-предупреждения worklets (`@babel/core` захоистен, `@react-native/metro-config` не нужен с `@expo/metro-config`) — безвредны.
5. Прочий скан: `StatusBar` (expo-status-bar, только `style`), `Modal` (без `animated`), `EXPO_PUBLIC_API_URL` (не зависит от `NODE_ENV`), навигация через `router.push` / `router.back` — без находок.

## ✅ Done well

- Минимальная правка типов, логика остаётся в хуке.
- Версии зависимостей совпадают с пинами SDK 58 (`expo install --check` — up to date), `yarn check --integrity` — in sync, `package-lock.json` не тронут.
- Все сторонние библиотеки (gifted-charts, lucide, nativewind 4, react-query, zustand) по peer-диапазонам совместимы с RN 0.88 / React 19.3.

## Итог

Блокеров нет. Critical закрыт перерезолвом lockfile; аудит `--groups dependencies`: 190 → 186 (critical 1 → 0, high 147 → 144). Гейты перезапущены после правки — зелёные.
