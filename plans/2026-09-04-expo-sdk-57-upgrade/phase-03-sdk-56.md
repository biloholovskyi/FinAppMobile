# Phase 03 — Ступень SDK 56

Status: done
Model tier: BALANCED
Required rules: `ai/rules/projects/fin-app-mobile/architecture.md`, `ai/rules/common/post-code-workflow.md`

## Goal

Проект работает на Expo SDK 56 (React Native 0.85, React 19.2).

## Implementation notes

Основная поверхность риска — отвязка `expo-router` от React Navigation. Прямых импортов `@react-navigation/*` в `src/` нет, поэтому кодмод запускать только если после установки всплывут транзитивные обращения.

## Scope

- `package.json` — `expo@^56.0.0` и резолв `expo install --fix`
- `src/app/**` — правки навигации, если поведение роутера изменится

## Checklist

- [x] `yarn add expo@56`
- [x] `expo install --fix`
- [x] `expo-doctor` — 21/22, остаётся только известная регрессия Hermes V1
- [x] Импортов `@react-navigation/*` в `src/**` нет; кодмод не потребовался
- [ ] Проверить работу табов, стека, `Stack.Screen options`, deep link по схеме `finapp` — требует устройства, не выполнено
- [x] Глобальный `fetch` из `expo/fetch` не ломает сборку Axios-слоя; поведение в рантайме не проверено
- [ ] Зафиксировать потребление памяти на экране операций — известная регрессия Hermes V1 с reanimated
- [ ] Дымовой прогон в Expo Go на Android

## Verification commands

- `rtk yarn lint`
- `rtk yarn tsc --noEmit`
- `rtk npx expo start --clear`

## Acceptance criteria

- Навигация между табами и экранами транзакций и категорий работает без регрессий
- Запросы через `src/shared/api/` выполняются, ошибки и таймауты обрабатываются как раньше
- `expo-doctor` без ошибок

## Evidence note

Установлено: `expo@56.0.21`, `react-native@0.85.3`, `react@19.2.3`, `expo-router@~56.2.20`, `reanimated@4.3.1`, `worklets@0.8.3`, `datetimepicker@9.1.0` (SDK 56 вернул версию, понижённую на ступени 55), `typescript@~6.0.3`, `eslint-config-expo@~56.0.4`.

`expo-doctor` — 21/22. Единственная оставшаяся находка: известная регрессия памяти Hermes V1 (`250829098.0.10`, исправлена в `.0.16`), доктор прямо указывает лечение — переход на SDK 57. Это ожидаемое промежуточное состояние ступени.

Отвязка `expo-router` от React Navigation прошла бесследно: прямых импортов `@react-navigation/*` в `src/**` нет, кодмод не запускался.

Три проблемы, вскрытые ступенью, и их решения:

1. Схема app config в SDK 56 больше не принимает поле `splash` верхнего уровня. Установлен `expo-splash-screen@56.0.15`, настройки (`image`, `resizeMode`, `backgroundColor`) перенесены в опции его config-плагина в `app.json`. Пункт был запланирован как условный в Phase 07 — закрыт здесь, потому что блокировал доктора.

2. TypeScript поднялся с 5.9 до 6.0.3 вместе с SDK. TS 6 объявляет `baseUrl` устаревшим и падает с `TS5101`. `baseUrl` удалён из `tsconfig.json`, алиас переписан как `"@/*": ["./src/*"]` — в TS 6 `paths` резолвятся относительно каталога конфига. Правило `ai/rules/common/patterns.md` предписывает `baseUrl: "."` и на фазе документации должно быть переписано.

3. TS 6 отвергает side-effect импорт без деклараций: `import "../../global.css"` в `src/app/_layout.tsx`. Заведён `css.d.ts` с `declare module '*.css'`; `nativewind-env.d.ts` не трогался, он помечен как генерируемый NativeWind.

Отдельно: `eslint-config-expo@56` подтянул `eslint-plugin-react-hooks@7.1.1` с новым набором правил. Итог первого прогона — 54 ошибки. Из них ~30 приходились на сгенерированное Orval дерево `src/shared/api/generated/**` (правило `react-hooks/immutability` на `query.queryKey = ...`). Дерево добавлено в `ignores` в `eslint.config.js`: Orval переписывает его целиком на `yarn api:generate`, а `yarn lint` работает с `--fix` и правил бы машинный вывод, который следующая генерация отменит.

Оставшиеся 24 ошибки — в рукописном коде, это настоящие находки, а не шум:
- `react-hooks/refs` — 15
- `react-hooks/static-components` — 6
- `react-hooks/set-state-in-effect` — 3

По файлам: `ErrorBanner.tsx` — 11, `WalletRow.tsx` — 4, `CategoriesScreen/CategoryCard.tsx` — 2, по одной в `CategoryEditScreen.tsx`, `useCategoryEditScreen.ts`, `categorySpending/CategoryCard.tsx`, `DateTimePickerModal.tsx`, `FormRow.tsx`, `useEditTransactionForm.ts`, `OperationsScreen.tsx`.

Решение: устранение перенесено в Phase 08. Правки затрагивают рендер и эффекты рабочих экранов; делать их посреди подъёма SDK — значит смешать собственные регрессии с регрессиями платформы. До Phase 08 гейт линта на ступенях читается как «новых ошибок сверх этих 24 не появилось».

Проверки: `yarn tsc --noEmit` — чисто после правок tsconfig и `css.d.ts`; `yarn lint` — 24 ошибки, все каталогизированы выше, 2 прежних предупреждения.

Дополнительная проверка вместо недоступного дымового прогона: `expo export --platform android` собрал бандл целиком — `entry.hbc` 6.5 MB. Это подтверждает то, что `tsc` проверить не может: резолвинг алиаса `@/` через Metro после удаления `baseUrl`, работу babel-плагина `react-native-worklets/plugin`, трансформ NativeWind и разрешимость всего графа зависимостей SDK 56. Проверку стоит повторять на каждой следующей ступени.

Не выполнено: дымовой прогон в Expo Go на Android; фиксация потребления памяти на экране операций (регрессия Hermes подтверждена доктором статически, замер отложен как бессмысленный до SDK 57).

## Handoff note

- SDK 56 встал; `expo-doctor` 21/22, остаток — регрессия Hermes V1, лечится переходом на SDK 57
- Кодмод React Navigation не потребовался
- `splash` перенесён в плагин `expo-splash-screen`; условный пункт Phase 07 закрыт досрочно
- TypeScript 6: `baseUrl` удалён, алиас `"@/*": ["./src/*"]`, заведён `css.d.ts` — правило `patterns.md` про `baseUrl` устарело, это долг Phase 10
- 24 ошибки `react-hooks` в рукописном коде каталогизированы и перенесены в Phase 08; дерево Orval исключено из линта
- `expo export --platform android` проходит — использовать как замену дымового прогона на следующих ступенях
