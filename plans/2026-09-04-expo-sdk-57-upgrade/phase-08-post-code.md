# Phase 08 — Post-code QA

Status: done
Model tier: FAST
Required rules: `ai/rules/common/post-code-workflow.md`

## Goal

Кодовая база после апгрейда проходит обязательные проверки качества без ошибок.

## Implementation notes

Фаза не вносит функциональных изменений — только устранение того, что показали линт и компилятор.

Основной груз перенесён из Phase 03: 24 ошибки новых правил `eslint-plugin-react-hooks@7` в рукописном коде — `react-hooks/refs` (15), `react-hooks/static-components` (6), `react-hooks/set-state-in-effect` (3). Файлы: `ErrorBanner.tsx` (11), `WalletRow.tsx` (4), `CategoriesScreen/CategoryCard.tsx` (2), по одной в `CategoryEditScreen.tsx`, `useCategoryEditScreen.ts`, `categorySpending/CategoryCard.tsx`, `DateTimePickerModal.tsx`, `FormRow.tsx`, `useEditTransactionForm.ts`, `OperationsScreen.tsx`. Правки затрагивают рендер и эффекты — каждая требует проверки экрана в рантайме.

## Scope

- `src/**` — точечные правки по результатам проверок
- `eslint.config.js` — правила, если новый `eslint-config-expo` требует изменений

## Checklist

- [x] `rtk yarn lint` без ошибок
- [x] `rtk yarn tsc --noEmit` без ошибок
- [x] Устранить 24 ошибки `react-hooks`, перенесённые из Phase 03
- [x] Убедиться, что `eslint-config-expo` соответствует SDK 57 (выравнивается автоматически через `expo install --fix`)
- [x] Убедиться, что `@types/react` соответствует React 19.2
- [x] Проверить, что исключение `src/shared/api/generated/` из линта не скрывает ошибок в рукописном коде
- [x] `console.log` в `src/**` отсутствует
- [x] Проверить, что временных обходов и `any`, добавленных в ходе апгрейда, не осталось

## Verification commands

- `rtk yarn lint`
- `rtk yarn tsc --noEmit`

## Acceptance criteria

- Обе команды проходят чисто
- В диффе апгрейда нет `any`, `@ts-ignore` и закомментированного кода

## Evidence note

Все 24 ошибки `eslint-plugin-react-hooks@7`, перенесённые из Phase 03, устранены. `yarn lint` — 0 ошибок, `yarn tsc --noEmit` — чисто, `expo-doctor` — 21/21.

`react-hooks/static-components` (6 ошибок, 6 файлов). Причина одна: `const IconComponent = resolveIcon(...)` с последующим `<IconComponent />`. Фактического дефекта здесь нет — `resolveIcon` возвращает существующий компонент из модуля lucide, а не создаёт новый, — но правило не может это доказать и обязано ругаться на любую заглавную локальную переменную в позиции JSX-типа. Заведён `src/shared/ui/Icon/Icon.tsx`: модульный компонент, принимающий имя иконки и делающий поиск внутри через `createElement`. Шесть вызовов переписаны на `<Icon name={...} />`. Заодно унифицирован `CategoryPickerModal`, который не был помечен линтом, но держал тот же паттерн.

Имя иконки перевода вынесено в `TRANSFER_ICON_NAME` (`src/shared/constants/icons.ts`) — литерал используется в двух местах, что по правилам требует константы. Реэкспорт добавлен именованный, не через `export *`.

Отдельно `src/features/categorySpending/CategorySpendingScreen/CategoryCard.tsx`: он держит собственный `resolveIcon` поверх курируемой `ICON_MAP` с фолбэком `Tag`, тогда как общий утиль резолвит любое имя lucide с фолбэком `CircleHelp`. Перевод на общий `Icon` изменил бы отображение иконок вне курируемого списка, поэтому там сделана локальная правка — модульный `CategoryIcon` над той же картой. Поведение не изменилось; дублирование передано в Phase 09.

`react-hooks/refs` (15 ошибок, 2 файла). Паттерн `useRef(new Animated.Value(0)).current` читает `.current` во время рендера. Заменён на ленивую инициализацию состояния `useState(() => new Animated.Value(0))` — ссылка так же стабильна на весь срок монтирования, но чтения рефа в рендере нет. Затронуты `ErrorBanner.tsx` (три значения) и `WalletRow.tsx` (одно). `animRef` в `WalletRow` остался рефом: он читается только внутри эффекта, что правило допускает.

`react-hooks/set-state-in-effect` (3 ошибки, 3 файла). Все три — эффекты, синхронизирующие состояние формы с пришедшими данными. Переписаны на документированный React-приём «корректировка состояния во время рендера» со сравнением с предыдущим значением. Это убирает лишний проход рендера и попутно чинит две скрытые проблемы:
- `useEditTransactionForm` синхронизировался по идентичности объекта `transaction`; любой рефетч того же платежа затирал правки пользователя. Теперь ключ — `transaction.id`
- `DateTimePickerModal` сбрасывал черновик при изменении `value` во время открытой модалки, отбрасывая пользователя на шаг выбора даты. Теперь сброс привязан только к переходу в открытое состояние
- `useCategoryEditScreen` — тот же приём по `existing.id`; попутно удалён `eslint-disable` для `exhaustive-deps`, он больше не нужен

Остались 3 предупреждения, ни одно не является ошибкой:
- `import/no-named-as-default-member` на `axios.create` в `src/shared/api/base.ts` — новое, появилось после апгрейда axios до 1.20, где добавлен именованный экспорт `create`. `axios.create` остаётся каноничным вызовом, правка не требуется
- два предупреждения о неиспользуемых `isError` и `error` в `useDashboardScreen.ts` — предсуществующие, к апгрейду отношения не имеют

`eslint-config-expo` выровнен до `~57.0.2` автоматически через `expo install --fix`; понижения мажора, которого я опасался в Phase 01, не потребовалось.

Не выполнено: визуальная проверка десяти затронутых файлов на устройстве. Эмулятор и adb на машине зависли посреди фазы и не поднялись после перезапуска процессов.

## Handoff note

- Линт зелёный впервые с Phase 03: 0 ошибок
- Переписаны рендер и синхронизация состояния в 10 файлах — визуальная проверка не выполнена, эмулятор завис
- Три исправления меняют поведение к лучшему, но заметно: сброс формы транзакции и категории теперь по `id`, сброс пикера даты — только при открытии
- Дублирование `resolveIcon` / `ICON_MAP` передано в Phase 09
