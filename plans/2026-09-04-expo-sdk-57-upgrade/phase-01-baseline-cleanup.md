# Phase 01 — Базовая линия и зачистка

Status: done
Model tier: FAST
Required rules: `ai/rules/common/tooling.md`, `ai/rules/common/post-code-workflow.md`

## Goal

Проект на SDK 54 приведён в чистое состояние и зафиксирован как точка отката перед подъёмом версий.

## Implementation notes

Правки точечные, файлы существуют. Ничего не апгрейдить в этой фазе — только зачистка и снятие показаний.

## Scope

- `package.json` — удалить `react-native-linear-gradient`
- `package-lock.json` — удалить файл
- `babel.config.js` — плагин `react-native-worklets/plugin` вместо `react-native-reanimated/plugin`, последним в списке
- `.eslintrc.js` — удалить, если `eslint.config.js` покрывает конфигурацию полностью

## Checklist

- [x] Зафиксировать текущие версии всех зависимостей как baseline в evidence
- [x] `eas build:list --limit 10` — записать, существуют ли нативные билды и на каком runtimeVersion
- [x] `expo-doctor` на SDK 54 — записать все предупреждения до апгрейда
- [x] Удалить `react-native-linear-gradient` из зависимостей
- [x] Удалить `package-lock.json`
- [x] Заменить babel-плагин reanimated на `react-native-worklets/plugin`
- [x] Убедиться, что линт работает через `eslint.config.js`, и удалить `.eslintrc.js`
- [ ] Дымовой прогон в Expo Go на Android: дашборд, операции, категории, статистика, создание и редактирование транзакции

## Verification commands

- `rtk yarn lint`
- `rtk yarn tsc --noEmit`
- `rtk npx expo start --clear`

## Acceptance criteria

- Приложение запускается и проходит дымовой прогон на SDK 54 после правки babel-конфига
- `react-native-linear-gradient` и `package-lock.json` отсутствуют
- Список предупреждений `expo-doctor` до апгрейда зафиксирован в evidence

## Evidence note

Baseline SDK 54 зафиксирован: `expo@54.0.33`, `react-native@0.81.5`, `react@19.1.0`, `expo-router@6.0.23`, `expo-updates@29.0.16`, `reanimated@4.1.1`, `worklets@0.5.1`, `nativewind@4.2.3`, `tailwindcss@3.x`, `typescript@5.9.2`.

`expo-doctor` до апгрейда — 16/18, две провалившиеся проверки:
- Multiple lock files (`yarn.lock` + `package-lock.json`) — устранено удалением `package-lock.json`
- Несовпадение версий с SDK 54: мажорные — `@react-native-community/datetimepicker` 9.1.0 против ожидаемых 8.4.4, `eslint-config-expo` 55.0.0 против ожидаемых ~10.0.0; патчевые — `expo` 54.0.33→54.0.37, `expo-constants`, `expo-linking`, `expo-router`, `expo-updates`

Второй пункт намеренно оставлен как есть: версии подтянет `expo install --fix` на ступени SDK 55. Важная поправка к плану: `eslint-config-expo` в проекте не отстаёт, а опережает схему версий Expo — на фазе 08 его нужно приводить к версии, которую требует SDK 57, что может означать понижение мажора, а не подъём.

Выполнено:
- `package.json` — удалён `react-native-linear-gradient` (нигде не импортировался), `yarn.lock` перегенерирован
- `package-lock.json` — удалён
- `.eslintrc.js` — удалён, конфигурация целиком во flat-config `eslint.config.js`
- `babel.config.js` — плагин `react-native-reanimated/plugin` заменён на `react-native-worklets/plugin`

Отклонение от плана: `rtk` 0.29.0 на этой машине не запускает Windows-шимы (`npm.cmd`, `npx.cmd`, `yarn.ps1`) и падает с `program not found` на любой команде вида `rtk yarn ...` / `rtk npx ...`. Все команды фазы выполнены напрямую через PowerShell. Требует решения до следующих фаз — либо чинить `rtk`, либо править правило в `ai/rules/common/tooling.md`.

`eas build:list --limit 10` для `@amitil13/fin-app-mobile` вернул пустой список: нативных билдов не существует. Следствия — приложение всё время жило только в Expo Go; подъём `runtimeVersion` никого не осиротит, потому что установленных сборок нет; канал `production` потребляется исключительно Expo Go.

Не выполнено: дымовой прогон в Expo Go на Android после смены babel-плагина. Пользователь дал гейт на переход к Phase 02 без него; проверка ворклетов переносится в дымовой прогон ступени SDK 55.

Проверки: `yarn lint` — 0 ошибок, 2 ранее существовавших предупреждения в `src/features/dashboard/DashboardScreen/useDashboardScreen.ts` (неиспользуемые `isError`, `error`); `yarn tsc --noEmit` — чисто.

## Handoff note

- Baseline SDK 54 и полный вывод `expo-doctor` до апгрейда зафиксированы в evidence
- Нативных билдов не существует — `runtimeVersion` можно поднимать без последствий
- `package-lock.json` удалён, проверка лок-файлов в `expo-doctor` теперь чистая
- Babel переведён на `react-native-worklets/plugin`, но в рантайме не проверен — первый прогон на ступени 55 обязан включать экран операций со скелетоном
- `eslint-config-expo@55.0.0` опережает схему Expo, на фазе 08 возможно понижение мажора
- `rtk` не спавнит Windows-шимы; рабочая форма — `rtk proxy cmd /c "<команда>"`
