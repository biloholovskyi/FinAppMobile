# Исправление ошибки суммы с запятой (Вариант 1) — Implementation Plan

**Goal:** Принимать сумму транзакции с десятичным разделителем-запятой (`25,25`) и отправлять на бэкенд число, а не строку, устранив ошибку `amount must be a number conforming to the specified constraints`.

**Architecture:** Нормализация и парсинг суммы выполняются на границе отправки. Добавляется чистый хелпер `parseAmountInput`, который приводит ввод к числу (запятая → точка) и валидирует его. `onSave` использует хелпер, при невалидном значении показывает существующий `ErrorBanner` и не отправляет запрос. По контракту в API уходит signed `number`, а не строка.

**Tech Stack:** React Native + Expo SDK 52, TypeScript 5 (strict), TanStack Query v5, FSD.

**Scope:** Только баг с запятой. Конверсия гривны↔копейки (×100) НЕ входит в этот план — отдельная задача.

---

## Спецификация

### Проблема
- `amountStr` хранит сырую строку из `TextInput` ([useEditTransactionForm.ts:6](../src/features/operations/EditTransactionScreen/useEditTransactionForm.ts#L6)).
- На клавиатуре `decimal-pad` при локали `ru-RU`/`uk-UA` десятичный разделитель — запятая, пользователь вводит `25,25`.
- В [useEditTransactionScreen.ts:27-28](../src/features/operations/EditTransactionScreen/useEditTransactionScreen.ts#L27-L28) строка склеивается (`` `-${amountStr}` ``) и уходит как есть.
- Бэкенд (`@IsNumber()`) делает `Number("25,25")` → `NaN` → отдаёт ошибку валидации.

### Требования
1. Ввод с запятой ИЛИ точкой принимается одинаково (`25,25` ≡ `25.25`).
2. В `amount` API уходит `number` (отрицательный для расхода, положительный для дохода/перевода).
3. Пустая строка, `0`, отрицательное или нечисловое значение → запрос не отправляется, показывается `ErrorBanner` с текстом «Введите корректную сумму».
4. Поведение для дохода/перевода/расхода по знаку не меняется.

### Затрагиваемые файлы
- Создать/дополнить: `src/shared/utils/currency.ts` — хелпер `parseAmountInput(raw: string): number | null`.
- Изменить: `src/features/operations/EditTransactionScreen/useEditTransactionActions.ts` — тип payload `amountStr: string` → `amount: number`; проброс `setValidationError`.
- Изменить: `src/features/operations/EditTransactionScreen/useEditTransactionScreen.ts` — парсинг, валидация, signed-number в payload.
- Изменить (опц.): `src/shared/api/transactions.ts` — сузить тип `amount` до `number`.

### Контракт хелпера
`parseAmountInput(raw: string): number | null`
- Нормализует: trim, замена `,` → `.`.
- `Number(normalized)`.
- Возвращает `null`, если результат `NaN`, `<= 0` или не конечное число.
- Иначе возвращает положительное число (гривны с дробной частью).

### Верификация (тестов в проекте нет)
- `rtk yarn lint` — 0 ошибок.
- `rtk yarn tsc --noEmit` — 0 ошибок.
- Ручная проверка на устройстве/симуляторе (чек-лист в Task 4).

---

### Task 1: Хелпер `parseAmountInput`

**Files:**
- Modify: `src/shared/utils/currency.ts`

- [ ] **Step 1: Добавить хелпер в конец файла**

```ts
/**
 * Парсит сумму из пользовательского ввода (decimal-pad).
 * Принимает запятую и точку как десятичный разделитель.
 * Возвращает положительное число в гривнах или null, если ввод невалиден.
 */
export function parseAmountInput(raw: string): number | null {
  const normalized = raw.trim().replace(',', '.')
  if (normalized === '') return null
  const value = Number(normalized)
  if (!Number.isFinite(value) || value <= 0) return null
  return value
}
```

- [ ] **Step 2: Проверка типов**

Run: `rtk yarn tsc --noEmit`
Expected: 0 ошибок.

---

### Task 2: Обновить actions — payload в `number` + проброс ошибки валидации

**Files:**
- Modify: `src/features/operations/EditTransactionScreen/useEditTransactionActions.ts`

- [ ] **Step 1: Изменить тип `SavePayload`**

Заменить поле `amountStr: string` на `amount: number`:

```ts
type SavePayload = {
  walletId?: string
  type: WalletTransactionType
  amount: number
  description: string
  transactionTime: string
  categoryId: string | null
  subCategoryId: string | null
  targetWalletId: string | null
}
```

- [ ] **Step 2: Обновить `update` mutation**

В `mutationFn` заменить `amount: p.amountStr` на `amount: p.amount`:

```ts
    mutationFn: (p: SavePayload) =>
      updateTransaction(transactionId!, {
        type: p.type,
        amount: p.amount,
        description: p.description || undefined,
        transactionTime: p.transactionTime,
        categoryId: p.categoryId,
        subCategoryId: p.subCategoryId,
        targetWalletId: p.targetWalletId,
      }),
```

- [ ] **Step 3: Обновить `create` в `handleSave`**

Заменить `amount: payload.amountStr` на `amount: payload.amount`:

```ts
      create({
        data: {
          walletId: payload.walletId,
          type: payload.type,
          amount: payload.amount,
          description: payload.description || undefined,
          transactionTime: payload.transactionTime,
          categoryId: payload.categoryId,
          subCategoryId: payload.subCategoryId,
          targetWalletId: payload.targetWalletId,
        },
      })
```

- [ ] **Step 4: Экспортировать установку ошибки валидации**

Добавить в `return` объект хука:

```ts
    setValidationError: (message: string) => setErrorMessage(message),
```

- [ ] **Step 5: Проверка типов**

Run: `rtk yarn tsc --noEmit`
Expected: ошибки ТОЛЬКО в `useEditTransactionScreen.ts` (ещё передаёт `amountStr`) — исправляются в Task 3.

---

### Task 3: Парсинг и валидация в `onSave`

**Files:**
- Modify: `src/features/operations/EditTransactionScreen/useEditTransactionScreen.ts`

- [ ] **Step 1: Импортировать хелпер**

Добавить к импортам в начале файла:

```ts
import { parseAmountInput } from '@/shared/utils/currency'
```

- [ ] **Step 2: Заменить тело `onSave`**

Заменить блок построения `transformedAmount` и вызов `actions.handleSave` на:

```ts
  const onSave = () => {
    if (!isCreateMode && !transaction) return
    if (isCreateMode && !form.sourceWalletId) return

    const amount = parseAmountInput(form.amountStr)
    if (amount === null) {
      actions.setValidationError('Введите корректную сумму')
      return
    }
    const signedAmount = form.type === WalletTransactionType.expense ? -amount : amount

    actions.handleSave({
      walletId: form.sourceWalletId ?? undefined,
      type: form.type,
      amount: signedAmount,
      description: form.description,
      transactionTime: form.transactionTime,
      categoryId: form.categoryId,
      subCategoryId: form.subCategoryId,
      targetWalletId: form.targetWalletId,
    })
  }
```

- [ ] **Step 3: Прокинуть `setValidationError` в return (если деструктурируется выборочно)**

`useEditTransactionScreen` уже не возвращает `setValidationError` наружу — он используется только внутри `onSave`. Дополнительных изменений в `return` не требуется. Убедиться, что `actions.setValidationError` доступен (добавлен в Task 2, Step 4).

- [ ] **Step 4: Проверка типов**

Run: `rtk yarn tsc --noEmit`
Expected: 0 ошибок.

---

### Task 4: Сузить тип DTO и финальная верификация

**Files:**
- Modify: `src/shared/api/transactions.ts`

- [ ] **Step 1: Сузить тип `amount` в `UpdateTransactionDto`**

Заменить `amount?: number | string` на:

```ts
  amount?: number
```

- [ ] **Step 2: Lint**

Run: `rtk yarn lint`
Expected: 0 ошибок.

- [ ] **Step 3: Typecheck**

Run: `rtk yarn tsc --noEmit`
Expected: 0 ошибок.

- [ ] **Step 4: Ручная QA на устройстве/симуляторе**

Создание транзакции (расход):
- Сумма `25,25` → сохраняется без ошибки, в списке `−25,25 ₴`.
- Сумма `25.25` → тот же результат.
- Сумма `100` → `−100 ₴`.
- Пустая сумма → `ErrorBanner` «Введите корректную сумму», запрос не уходит.
- Сумма `0` → `ErrorBanner`, запрос не уходит.

Доход:
- Сумма `25,25` → `+25,25 ₴`.

Перевод:
- Сумма `25,25` → сохраняется, знак не добавляется.

Редактирование существующей транзакции:
- Открыть, изменить на `30,50` → сохраняется корректно.

---

## Self-Review

- Покрытие спеки: запятая ↔ точка (Task 1), number в API (Task 2), валидация + ErrorBanner (Task 1+3), знак по типу (Task 3) — все требования закрыты.
- Плейсхолдеров нет: весь код приведён целиком.
- Согласованность типов: `SavePayload.amount: number` (Task 2) совпадает с `signedAmount: number` (Task 3) и `UpdateTransactionDto.amount?: number` (Task 4); `parseAmountInput(raw: string): number | null` (Task 1) совпадает с использованием в `onSave` (Task 3, проверка `=== null`).
- Вне scope (зафиксировано): конверсия ×100 в копейки — отдельная задача.
