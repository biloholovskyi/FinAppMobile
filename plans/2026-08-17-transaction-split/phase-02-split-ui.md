# Phase 02 — UI разделения

Status: done
Model tier: BALANCED
Required rules: `ai/rules/projects/fin-app-mobile/architecture.md`, `ai/rules/common/react.md`, `ai/rules/design/design-system.md`

## Goal

Экран редактирования показывает кнопку «Разделить платёж», карточку нового платежа и read-only остаток в поле «Сумма».

## Implementation notes

Компоненты карточки и кнопки пишутся с нуля. `EditTransactionScreen.tsx` патчится точечно: подключение хука разделения, новые узлы и режим read-only у поля суммы. Строки категории и подкатегории переиспользуют `FormRow`, выбор — существующий `CategoryPickerModal`. Визуальная модель — `designs/screens/transaction-edit.html`.

## Scope

- `src/features/operations/EditTransactionScreen/SplitPaymentCard/SplitPaymentCard.tsx` — карточка нового платежа
- `src/features/operations/EditTransactionScreen/SplitPaymentCard/SplitButton.tsx` — кнопка включения разделения
- `src/features/operations/EditTransactionScreen/EditTransactionScreen.tsx` — рендер новых узлов и read-only поля суммы
- `src/features/operations/EditTransactionScreen/useEditTransactionScreen.ts` — проброс состояния разделения в экран

## Checklist

- [x] Кнопка «Разделить платёж» видна только при типе `expense` в режиме редактирования и скрыта при активном разделении
- [x] Карточка разделения содержит строку категории, строку подкатегории (только при наличии подкатегорий), поле суммы и кнопку удаления
- [x] Поле «Сумма» при активном разделении нередактируемо, показывает остаток и подпись «Остаток после разделения»
- [x] Кнопка удаления возвращает поле «Сумма» к базовому значению и редактируемости
- [x] Смена типа на `income` или `transfer` скрывает и сбрасывает разделение
- [x] Выбор категории новой части сбрасывает её подкатегорию
- [x] Модалки выбора категории и подкатегории новой части не конфликтуют с модалками основной транзакции
- [ ] Стилизация только через `className`; инлайн `style` — только для динамического цвета акцента — см. отклонение 3 в evidence
- [x] Нет хардкода цветов вне уже принятой на экране палитры

## Verification commands

- `rtk yarn lint`
- `rtk yarn tsc --noEmit`

## Acceptance criteria

- `EditTransactionScreen.tsx` остаётся в пределах лимита компонента; при превышении часть разметки вынесена в подкомпонент
- Бизнес-логика в JSX отсутствует — расчёты живут в хуках
- Экран прокручивается, кнопки «Сохранить» и «Удалить транзакцию» доступны при открытой карточке разделения

## Evidence note

Создано:
- `SplitPaymentCard/SplitButton.tsx` — outline-кнопка «Разделить платёж» с иконкой `Split`
- `SplitPaymentCard/SplitPaymentCard.tsx` (117 строк) — заголовок «Новый платёж», строки категории и подкатегории на `FormRow`, поле суммы, кнопка удаления, две собственные `CategoryPickerModal`
- `SplitPaymentCard/useSplitPaymentCard.ts` — состояние модалок карточки и производные категории

Изменено:
- `useEditTransactionScreen.ts` — подключён `useTransactionSplit`, обёртка `changeType` сбрасывает разделение при уходе с расхода, наружу отданы `amountValue`, `isAmountReadOnly`, `amountHint`, `split`
- `EditTransactionScreen.tsx` — кнопка и карточка разделения, поле суммы через `AmountField`; компонент сокращён с 193 до 147 строк
- `src/shared/constants/transactionSplit.ts` — добавлен ключ `remainderHint`

Гейты: `yarn lint` — 0 ошибок (2 прежних предупреждения в `useDashboardScreen.ts`); `yarn tsc --noEmit` — чисто.

Отклонение 1: добавлен co-located хук `useSplitPaymentCard.ts` сверх scope — по конвенции проекта состояние модалок карточки не должно жить в JSX.

Отклонение 2: чтобы выполнить acceptance-критерий по лимиту компонента, из экрана вынесены `TypeSegment.tsx`, `AmountField.tsx`, `DescriptionRow.tsx`, `ActionButtons.tsx`. Константы `TYPE_COLOR` и `TYPE_SIGN` переехали в `TypeSegment.tsx` и реэкспортируются оттуда.

Отклонение 3: инлайн `style` используется не только для цвета акцента, но и для типографики (`fontSize`, `fontWeight`, `letterSpacing`) и минимальной ширины поля ввода. Это перенос существующего паттерна экрана (`CreditedAmountRow`, старый блок суммы), а не новое решение. Кандидат на унификацию в аудите фазы 04.

## Handoff note

- Экран рендерит `amountValue` — фаза 03 не должна брать сумму из `form.amountStr`, для запроса нужен `split.remainderKopecks`
- Сброс разделения при смене типа уже сделан в `changeType` внутри `useEditTransactionScreen.ts`
- Категория новой части и подкатегория лежат в `split.splitCategoryId` / `split.splitSubCategoryId`, сумма — в `split.splitAmountKopecks`
- Тексты для валидации фазы 03 уже готовы в `TRANSACTION_SPLIT_MESSAGES`
- Незакрытое поведение: до фазы 03 сохранение при активном разделении отправляет один запрос с базовой суммой — разделение ещё не участвует в сохранении
- Хук `useEditTransactionScreen` вырос до ~105 строк при лимите 50 — нарушение существовало до фазы, теперь усилилось; вынести в фазе 04
