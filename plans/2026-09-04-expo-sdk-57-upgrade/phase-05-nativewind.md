# Phase 05 — Миграция NativeWind на v5 (условная)

Status: deferred
Model tier: DEEP
Required rules: `ai/rules/projects/fin-app-mobile/architecture.md`, `ai/rules/common/react.md`

## Goal

Стилизация NativeWind работает на React Native 0.86 — на v4, если она совместима, иначе на v5.

## Implementation notes

Фаза выполняется только по триггеру из `design.md`. Если после фазы 04 NativeWind v4 работает, фаза закрывается как `deferred` с записью проверки. Кастомной темы в проекте нет, в `src/` только дефолтные утилиты Tailwind — миграция ограничивается конфигами.

## Scope

- `package.json` — `nativewind` 5.x, `tailwindcss` 4.1+
- `babel.config.js` — убрать пресет `nativewind/babel` и `jsxImportSource`
- `metro.config.js` — `withNativeWind` без второго аргумента
- `global.css` — импорты Tailwind v4 и `nativewind/theme` вместо трёх директив `@tailwind`
- `postcss.config.mjs` — новый файл с плагином `@tailwindcss/postcss`
- `tailwind.config.js` — судьба файла определяется требованиями Tailwind v4
- `nativewind-env.d.ts` — привести к виду, который требует v5

## Checklist

- [x] Зафиксировать в evidence, сработал ли триггер, и почему
- [ ] Поднять `nativewind` и `tailwindcss` до требуемых версий
- [ ] Перевести babel, metro, postcss и CSS-вход на схему v5
- [ ] Проверить, что классы `shadow-*` и `elevation*` в коде не появились — при появлении учесть переименования v5
- [ ] Убедиться, что `vars()`, `cssInterop`, `remapProps` не используются
- [ ] Прогнать все экраны и сверить вёрстку с `designs/screens/*.html`

## Verification commands

- `rtk yarn lint`
- `rtk yarn tsc --noEmit`
- `rtk npx expo start --clear`

## Acceptance criteria

- Классы применяются на обеих платформах, вёрстка совпадает с состоянием до апгрейда
- Инлайновых `style={{}}` для лейаута не добавлено
- Хардкод-цветов не добавлено

## Evidence note

Триггер не сработал. На SDK 57 (`react-native@0.86.3`) NativeWind v4.2.3 остаётся рабочим: `expo export --platform android` собирает бандл, Metro-трансформ `withNativeWind` отрабатывает, импорт `global.css` разрешается, `expo-doctor` не сообщает о несовместимости. Ни одно из трёх условий запуска фазы из `design.md` не выполнено.

Остаточный риск: применение классов в рантайме проверяется только прогоном на устройстве. Если на дымовом прогоне вёрстка окажется без стилей, фазу нужно переоткрыть — стоимость миграции оценена в `research.md` как низкая (кастомной темы нет, классов `shadow-*` и `elevation*` в коде нет, `vars()` / `cssInterop` не используются).

## Handoff note

—
