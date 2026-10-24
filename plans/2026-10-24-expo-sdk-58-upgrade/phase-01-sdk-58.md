# Phase 01 — Апгрейд до SDK 58

Status: done
Model tier: BALANCED — установка и разбор ошибок совместимости
Required rules: `ai/rules/common/tooling.md`, `ai/rules/projects/fin-app-mobile/architecture.md`, `ai/rules/common/patterns.md`

## Goal

Зависимости проекта соответствуют SDK 58, проект собирается и запускается в Expo Go 58.

## Implementation notes

- Установка через Expo CLI, пакетный менеджер — yarn; `package-lock.json` не трогается.
- Если `expo install` записал в `package.json` литерал вместо диапазона (`"58"`), привести к `~58.0.x`.
- Ошибки Strict TS API чинятся типами-инстансами RN (`ViewInstance`, `TextInputInstance` и т.п.) и публичными импортами из `react-native`.
- Opt-out `react-native-legacy-deep-imports` не добавляется.
- При срабатывании триггера NativeWind (`design.md`) — стоп фазы, решение пользователя.

## Scope

- `package.json` — `expo@~58`, Expo-пакеты, `react-native@0.88.x`, нативные зависимости, `eslint-config-expo` в версиях SDK 58
- `yarn.lock`
- `app.json` — только если `expo-doctor` требует правок схемы или плагинов
- `src/**` — только правки совместимости типов и удалённых API
- `tsconfig.json`, `babel.config.js`, `metro.config.js` — только если того требует SDK 58

## Checklist

- [ ] Зафиксировать baseline: версии ключевых пакетов, результат `expo-doctor`
- [ ] `expo install expo@^58.0.0 --fix`
- [ ] `expo install react-native-safe-area-context`
- [ ] `expo-doctor@latest` без провалов
- [ ] `tsc --noEmit` чисто
- [ ] `lint` без новых ошибок
- [ ] `expo export --platform android` собирает бандл
- [ ] Дымовой прогон в Expo Go 58 на эмуляторе: все табы, график, пикер даты, модалки, бесконечная прокрутка, скелетон на ворклетах
- [ ] Проверить, применяются ли классы NativeWind

## Verification commands

- `rtk proxy npx.cmd expo install expo@^58.0.0 --fix`
- `rtk proxy npx.cmd expo-doctor@latest`
- `rtk yarn tsc --noEmit`
- `rtk yarn lint`
- `rtk proxy npx.cmd expo export --platform android --output-dir <scratchpad>`

## Acceptance criteria

- `expo` на `58.x`, `react-native` на `0.88.x`
- `expo-doctor` — все проверки пройдены
- tsc чист, lint без ошибок
- Бандл собирается, приложение открывается в Expo Go 58 без красного экрана

## Evidence note

24.10.2026, done.
- Baseline: `expo-doctor` 19/20 (7 Expo-пакетов отставали по патчу внутри SDK 57)
- `expo install expo@^58.0.0 --fix`: `expo@58.0.19`, `react-native@0.88.0`, `react@19.3.0`, `@types/react@~19.3.0`, `expo-router@~58.0.26`, `expo-updates@~58.0.18`, `reanimated@4.7.1`, `worklets@0.13.0`, `safe-area-context@~5.10.1`, `screens@~4.30.0`, `svg@15.16.0`, `datetimepicker@9.2.1`, `eslint-config-expo@~58.0.4`
- Литерал `^58.0.0` у `expo` приведён к `~58.0.19`
- `expo-doctor` 20/20
- `tsc`: 1 ошибка — `RefreshControl.onRefresh` в RN 0.88 типизирован как `() => void | Promise<void>`; `refetch` заменён на `handleRefresh` в `useCategoriesScreen.ts` / `CategoriesScreen.tsx`. Strict TS API других ошибок не дал; opt-out не добавлен
- `lint`: 0 ошибок, 3 предсуществующих предупреждения
- `expo export --platform android`: бандл 6.4 MB
- Эмулятор `finapp_pixel7`, Expo Go обновлён CLI до 58.0.5: бандл 3730 модулей, все четыре таба, прокрутка ленты, модалка категорий, нативный пикер даты — без ошибок; NativeWind применяется, триггер v5 не сработал
- Новые предупреждения: `ImageBackground is deprecated` (из зависимостей, в `src/` не используется), `DateTimePicker: onChange is deprecated` (`DateTimePickerModal.tsx`)

## Handoff note

- SDK 58 установлен, `expo-doctor` 20/20, tsc и lint чисты
- React поднялся до 19.3.0 — правила называют 19.2, обновить в Phase 05
- Единственная правка типов — `onRefresh` на экране категорий
- NativeWind v4 работает на RN 0.88
- Expo Go 58.0.5 доступен и на Android
- Два deprecation-предупреждения — в долг (Phase 08)
