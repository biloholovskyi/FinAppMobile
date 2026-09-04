# Phase 02 — Ступень SDK 55

Status: done
Model tier: BALANCED
Required rules: `ai/rules/projects/fin-app-mobile/architecture.md`, `ai/rules/common/post-code-workflow.md`

## Goal

Проект работает на Expo SDK 55 (React Native 0.83, React 19.2).

## Implementation notes

Версии Expo-пакетов подбирает `expo install --fix` — вручную номера не проставлять. Сторонние библиотеки вне набора Expo поднимать отдельно, только если ломаются.

## Scope

- `package.json` — `expo@^55.0.0` и весь резолв `expo install --fix`
- `app.json` — удалить поля, выпавшие из схемы app config, если `expo-doctor` их укажет
- `src/**` — правки под удалённые и переименованные API, если всплывут

## Checklist

- [x] `yarn add expo@55` — каретка `^` съедается cmd, диапазон задан без неё
- [x] `expo install --fix`
- [x] `expo-doctor` — 20/20, предупреждений нет
- [x] Опций `newArchEnabled` / `edgeToEdgeEnabled` в `app.json` нет
- [x] Вызовов `removeSubscription` в `src/**` нет
- [x] Сторонние пакеты проверены: `react-native-svg` и `datetimepicker` выровнены самим Expo, `gifted-charts@1.4.76` и `lucide-react-native@1.7.0` резолвятся
- [ ] Дымовой прогон в Expo Go на Android по всем табам и экранам транзакций — не выполнен, пользователь дал гейт на переход к Phase 03

## Verification commands

- `rtk yarn lint`
- `rtk yarn tsc --noEmit`
- `rtk npx expo start --clear`

## Acceptance criteria

- `expo-doctor` не выдаёт ошибок; оставшиеся предупреждения объяснены в evidence
- Все экраны открываются, списки скроллятся, транзакция создаётся и редактируется
- Ни один пакет не остался на версии, несовместимой с SDK 55

## Evidence note

Установлено: `expo@55.0.31`, `react-native@0.83.10`, `react@19.2.0`, `react-native-reanimated@4.2.1`, `react-native-worklets@0.7.4`, `react-native-svg@15.15.3`, `react-native-screens@~4.23.0`.

`expo-doctor` — 20/20, ни одного предупреждения. Для сравнения: до апгрейда было 16/18.

Главное открытие ступени: SDK 55 унифицировал нумерацию Expo-пакетов по номеру SDK. `expo-router` теперь `~55.0.18` вместо `6.x`, `expo-constants` `~55.0.17`, `expo-linking` `~55.0.17`, `expo-status-bar` `~55.0.6`, `expo-updates` `~55.0.30`, `expo-linear-gradient` `~55.0.18`. Отсюда следует, что `eslint-config-expo@55.0.0` из Phase 01 не опережал схему, а уже был на новой нумерации — предупреждение `expo-doctor` про ожидаемые `~10.0.0` было артефактом старой схемы SDK 54. Поправка к handoff Phase 01: на фазе 08 понижение мажора не требуется, пакет выровнен до `~55.0.1` автоматически.

`@react-native-community/datetimepicker` понижен с 9.1.0 до 8.6.0 — версии, закреплённой SDK 55; `expo install --fix` дополнительно прописал его config-плагин в `app.json`. Компонент `src/features/operations/EditTransactionScreen/DateTimePickerModal/DateTimePickerModal.tsx` использует только `DateTimePicker` и тип `DateTimePickerEvent`, оба доступны в 8.x — типы сходятся.

Поле `expo` в `package.json` после `yarn add expo@55` осталось литеральным диапазоном `"55"`; приведено к `~55.0.31` в соответствии с оформлением остальных Expo-зависимостей.

Ручные проверки: `newArchEnabled` и `edgeToEdgeEnabled` в `app.json` отсутствуют, вызовов `removeSubscription` в `src/**` нет.

Проверки: `yarn tsc --noEmit` — чисто; `yarn lint` — 0 ошибок, те же 2 ранее существовавших предупреждения в `useDashboardScreen.ts`.

Команды выполнены в форме `rtk proxy cmd /c "<команда>"` — единственной рабочей на этой машине.

Не выполнено: дымовой прогон в Expo Go на Android.

## Handoff note

- SDK 55 встал чисто: `expo-doctor` 20/20, lint и tsc проходят
- Нумерация Expo-пакетов теперь идёт по номеру SDK — `expo-router` перестал быть `6.x`; фаза документации должна переписать таблицы закреплённых версий с учётом этого
- `datetimepicker` понижен до 8.6.0 и получил config-плагин в `app.json`; поведение пикера в рантайме не проверено
- Ворклеты после смены babel-плагина в рантайме по-прежнему не проверены — долг тянется с Phase 01
- Рабочая форма команд: `rtk proxy cmd /c "<команда>"`, для гейтов `rtk err cmd /c "<команда>"`
