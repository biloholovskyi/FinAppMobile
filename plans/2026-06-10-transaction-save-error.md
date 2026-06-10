# Transaction Save Error Banner Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Показывать inline-баннер ошибки на экране создания/редактирования транзакции, когда мутация сохранения или удаления завершилась ошибкой (например, 500).

**Architecture:** Состояние ошибки живёт в `useEditTransactionActions` рядом с мутациями (`onError` у create/update/delete). Текст извлекается из ответа API утилитой `getApiErrorMessage` (новый `src/shared/api/errors.ts`), при отсутствии `message` — стандартный фолбэк. UI — локальный компонент `ErrorBanner` над кнопкой «Сохранить» с анимацией появления на встроенном `Animated` из react-native.

**Tech Stack:** React Native, NativeWind v4, TanStack Query v5, Axios, lucide-react-native, react-native `Animated` (core, не reanimated — reanimated 4.x не работает в текущей нативной сборке), TypeScript strict.

**Design:** `designs/screens/transaction-edit-error.html` (согласован)

---

## Спецификация

### Поведение

1. Ошибка мутации create / update / delete транзакции → красный баннер появляется над кнопкой «Сохранить» (внутри блока кнопок).
2. Текст баннера:
   - если в ответе API есть `message` (NestJS формат `{ statusCode, message, error }`) — показываем его;
   - `message` может быть массивом строк (class-validator) — объединяем через перенос строки;
   - иначе фолбэк: сохранение — «Не удалось сохранить. Попробуйте ещё раз», удаление — «Не удалось удалить транзакцию. Попробуйте ещё раз».
3. Баннер скрывается:
   - по нажатию на крестик;
   - автоматически при старте новой попытки сохранения/удаления.
4. Баннер не исчезает по таймеру — остаётся до действия пользователя.
5. Не-Axios ошибки (сеть, неожиданные исключения) → фолбэк-текст.
6. Появление баннера анимируется через core `Animated`: fade-in + сдвиг снизу (~280мс), затем shake по горизонтали (−4 → 4 → −3 → 2 → 0, ~60мс/шаг) как в HTML-демо. `useNativeDriver: true`.

### Внешний вид (из дизайна)

- Контейнер: фон `#FF4B6B` 10%, бордер `#FF4B6B` 35%, радиус 16px, паддинг 12×14.
- Слева иконка `CircleAlert` 14px в квадрате 26×26 (фон `#FF4B6B` 20%, радиус 8px).
- Текст: `#FF4B6B`, 13px, medium, межстрочный ~19px.
- Справа крестик `X` 14px, прозрачность 60%.

### Вне скоупа

- Ошибки первичной загрузки данных экрана (transaction/categories/wallets).
- Обработка 401 — остаётся на глобальном уровне apiClient.
- Переиспользуемый toast-механизм для других экранов.

---

## File Map

| Файл | Действие | Ответственность |
|---|---|---|
| `src/shared/api/errors.ts` | Создать | Утилита извлечения `message` из ошибки API с фолбэком |
| `src/features/operations/EditTransactionScreen/useEditTransactionActions.ts` | Изменить | Состояние `errorMessage`, `onError` у всех трёх мутаций, сброс при новой попытке, `clearError` |
| `src/features/operations/EditTransactionScreen/useEditTransactionScreen.ts` | Изменить | Пробросить `errorMessage` / `clearError` в экран |
| `src/features/operations/EditTransactionScreen/ErrorBanner.tsx` | Создать | UI баннера ошибки с анимацией появления (файл в папке экрана, как `FormRow.tsx`) |
| `src/features/operations/EditTransactionScreen/EditTransactionScreen.tsx` | Изменить | Рендер баннера над кнопкой «Сохранить» |

---

## Task 1: Утилита getApiErrorMessage

**Files:**
- Create: `src/shared/api/errors.ts`

- [ ] **Шаг 1: Создать функцию `getApiErrorMessage(error: unknown, fallback: string): string`**

  - Через `isAxiosError` из `axios` проверить, что это Axios-ошибка.
  - Достать `message` из `error.response.data` (форма NestJS `{ statusCode, message, error }`).
  - Если `message` — непустой массив строк (class-validator), вернуть их объединение через `\n`.
  - Если `message` — непустая строка, вернуть её.
  - Во всех остальных случаях (не-Axios, нет тела, пустой message) вернуть `fallback`.

- [ ] **Шаг 2: Проверить линт**

  `rtk yarn lint` — без ошибок.

---

## Task 2: Состояние ошибки в useEditTransactionActions

**Files:**
- Modify: `src/features/operations/EditTransactionScreen/useEditTransactionActions.ts`

- [ ] **Шаг 1: Добавить состояние и обработку ошибок мутаций**

  - Завести локальный `errorMessage: string | null` через `useState`.
  - Объявить две фолбэк-константы: сохранение и удаление (тексты из спеки).
  - Добавить `onError` ко всем трём мутациям (create, update, delete): вызывать `setErrorMessage(getApiErrorMessage(error, <fallback>))` — для create/update фолбэк сохранения, для delete фолбэк удаления.
  - В `handleSave` перед запуском мутации сбрасывать ошибку (`setErrorMessage(null)`).
  - Обернуть удаление в `handleDelete`, который сначала сбрасывает ошибку, затем вызывает `remove()` — внешняя сигнатура вызова `handleDelete()` на экране не меняется.
  - Добавить `clearError` (`() => setErrorMessage(null)`).
  - Вернуть из хука дополнительно `errorMessage` и `clearError` (рядом с существующими `isSaving`, `isDeleting`).

- [ ] **Шаг 2: Проверить линт**

  `rtk yarn lint` — без ошибок.

---

## Task 3: Проброс errorMessage через useEditTransactionScreen

**Files:**
- Modify: `src/features/operations/EditTransactionScreen/useEditTransactionScreen.ts`

- [ ] **Шаг 1: Пробросить новые поля**

  В возвращаемом объекте хука добавить `errorMessage: actions.errorMessage` и `clearError: actions.clearError`.

- [ ] **Шаг 2: Проверить линт**

  `rtk yarn lint` — без ошибок.

---

## Task 4: Компонент ErrorBanner с анимацией

**Files:**
- Create: `src/features/operations/EditTransactionScreen/ErrorBanner.tsx`

- [ ] **Шаг 1: Создать компонент**

  - Props: `{ message: string; onClose: () => void }`.
  - Корневой элемент — `Animated.View` из `react-native-reanimated` с `entering={FadeInDown.duration(280)}`.
  - Стили через NativeWind `className` по дизайну: контейнер `flex-row items-start`, фон/бордер `#FF4B6B` (10% / 35%), радиус 16, паддинг 12×14, gap.
  - Слева — квадрат 26×26 (фон `#FF4B6B` 20%, радиус 8) с иконкой `CircleAlert` 14px цвета `#FF4B6B`.
  - По центру — `Text` с `message`: `#FF4B6B`, 13px, medium, `leading-[19px]`, `flex-1`.
  - Справа — `TouchableOpacity` (крестик `X` 14px, opacity 60%, `accessibilityLabel="Скрыть ошибку"`), `onPress={onClose}`.

- [ ] **Шаг 2: Проверить линт**

  `rtk yarn lint` — без ошибок.

---

## Task 5: Рендер баннера в EditTransactionScreen

**Files:**
- Modify: `src/features/operations/EditTransactionScreen/EditTransactionScreen.tsx`

- [ ] **Шаг 1: Подключить баннер**

  - Импортировать `ErrorBanner` из `./ErrorBanner`.
  - Достать `errorMessage` и `clearError` из `useEditTransactionScreen()`.
  - В блоке кнопок (`<View className="px-5 pt-5 gap-2.5">`) первым дочерним элементом, до кнопки «Сохранить», условно отрендерить `{errorMessage && <ErrorBanner message={errorMessage} onClose={clearError} />}`. Отступ обеспечивает существующий `gap-2.5`.

- [ ] **Шаг 2: Проверить линт и типы**

  `rtk yarn lint` и `rtk yarn tsc --noEmit` — без ошибок.

---

## Verification (итог)

- [ ] `rtk yarn lint` — без ошибок
- [ ] `rtk yarn tsc --noEmit` — без ошибок
- [ ] Ручная проверка:
  - при недоступном бэкенде нажатие «Сохранить» показывает фолбэк-баннер с fade-in;
  - повторное нажатие сначала скрывает баннер, показывает спиннер, затем баннер снова;
  - крестик скрывает баннер;
  - ошибка 400 с `message` от API показывает текст сервера;
  - «Удалить транзакцию» при ошибке показывает фолбэк удаления.
