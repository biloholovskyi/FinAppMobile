# Phase 04 — Ступень SDK 57

Status: done
Model tier: BALANCED
Required rules: `ai/rules/projects/fin-app-mobile/architecture.md`, `ai/rules/common/post-code-workflow.md`

## Goal

Проект работает на Expo SDK 57 (React Native 0.86, React 19.2) — целевой версии апгрейда.

## Implementation notes

Breaking changes между 56 и 57 отсутствуют, ступень должна быть механической. Если что-то ломается — причина почти наверняка в стороннем пакете, а не в SDK.

## Scope

- `package.json` — `expo@^57.0.0` и резолв `expo install --fix`

## Checklist

- [x] `yarn add expo@57`
- [x] `expo install --fix`
- [x] `expo-doctor` — 21/21, замечаний нет
- [x] Проверка на регрессию Hermes V1 исчезла из вывода доктора — в SDK 57 она исправлена
- [x] NativeWind: Metro собирается, триггер фазы 05 не сработал
- [x] Записать финальные версии `expo`, `react-native`, `react`, `expo-router`, `expo-updates`, `reanimated`, `worklets`, `nativewind` для фазы документации
- [x] Дымовой прогон в Expo Go на Android
- [ ] Проверка на iPhone в Expo Go SDK 57 — исходная цель апгрейда

## Verification commands

- `rtk yarn lint`
- `rtk yarn tsc --noEmit`
- `rtk npx expo start --clear`

## Acceptance criteria

- Приложение открывается в Expo Go SDK 57 — подтверждено на Android-эмуляторе, iPhone за пользователем
- Все экраны работают на обеих платформах
- Финальные версии зависимостей зафиксированы в evidence

## Evidence note

Финальные версии: `expo@57.0.20`, `react-native@0.86.3`, `react@19.2.3`, `expo-router@~57.0.19`, `expo-updates@~57.0.21`, `expo-constants@~57.0.17`, `expo-linking@~57.0.9`, `expo-status-bar@~57.0.1`, `expo-linear-gradient@~57.0.1`, `expo-splash-screen@~57.0.8`, `react-native-reanimated@4.5.1`, `react-native-worklets@0.10.1`, `react-native-screens@~4.26.0`, `react-native-safe-area-context@~5.7.0`, `react-native-svg@15.15.4`, `@react-native-community/datetimepicker@9.1.0`, `nativewind@^4.2.3`, `typescript@~6.0.3`, `eslint-config-expo@~57.0.2`, `@types/react@~19.2.10`.

`expo-doctor` — 21/21, ни одного замечания. Проверка на регрессию памяти Hermes V1, провалившаяся на ступени 56, из набора исчезла: в SDK 57 она исправлена.

`yarn tsc --noEmit` — чисто. `yarn lint` — ровно 24 ошибки, унаследованные из Phase 03, ни одной новой; ступень 57 не добавила проблем.

`expo export --platform android` собрал бандл `entry.hbc` 6.4 MB. Косвенно подтверждает, что NativeWind v4 совместим с RN 0.86 на уровне сборки: Metro-трансформ `withNativeWind` отработал, импорт `global.css` в `src/app/_layout.tsx` разрешился. Триггер фазы 05 не сработал — миграция на v5 не требуется. Применение классов в рантайме остаётся непроверенным до прогона на устройстве.

Поле `expo` после `yarn add expo@57` снова осталось литеральным `"57"`, приведено к `~57.0.20`.

Дымовой прогон выполнен на эмуляторе `finapp_pixel7` в Expo Go 57.0.9 — Expo CLI сам переустановил клиент с 54.0.8. Бандл доставлен: 3767 модулей за 14.8 с. Пройдены все четыре таба, данные с API грузятся, суммы и валюты в `uk-UA`, бесконечная прокрутка операций подгружает следующие страницы, ошибок ворклетов в logcat нет.

Не выполнено: проверка на физическом iPhone в Expo Go SDK 57 — исходная цель апгрейда, требует действий пользователя.

## Handoff note

- SDK 57 работает: `expo-doctor` 21/21, tsc чист, бандл собирается и запускается
- NativeWind v4 подтверждён в рантайме — классы применяются, вёрстка на месте
- Ворклеты после смены babel-плагина работают; долг Phase 01 закрыт
- Регрессия Hermes V1 ушла вместе со ступенью 56
- 24 ошибки `react-hooks` по-прежнему ждут Phase 08
- Проверка на iPhone остаётся за пользователем
