# Spec: валюта кошелька + вынос WalletRow

## Mission
- Отображать реальную валюту каждого кошелька вместо захардкоженного UAH.
- Вынести `WalletRow` из `WalletsCard.tsx` в отдельный компонент-сосед.

## Task profile
`hybrid` (мелкий рефактор + точечное исправление поведения). Один шаг, без многофазного цикла.

## Facts / constraints
- `Wallet.currency` (`src/entities/wallet/index.ts`) — `string`, формат ISO 4217 alpha-код («UAH», «USD», «EUR»). Подтверждено описанием поля `currency` в сгенерированной `CurrencyRateModel` («ISO 4217 alpha code vs UAH»).
- ISO alpha-код напрямую валиден для `toLocaleString(locale, { style: 'currency', currency })`.
- Соглашение папки `DashboardScreen/`: карточки лежат плоскими файлами-соседями (`ExpenseComparisonCard.tsx`, `ExpenseDynamicsCard.tsx`).
- Суммы из API в копейках → `/100` для отображения.

## Target state

### Новый файл `src/features/dashboard/DashboardScreen/WalletRow.tsx`
- Содержит вынесенный компонент `WalletRow` и тип `WalletRowProps` (без изменений сигнатуры: `wallet`, `isLast`, `refreshingId`, `onRefresh`).
- Сохраняет логику spin-анимации, цвет баланса.
- Форматирование баланса: `currency: wallet.currency` вместо `'UAH'`. Локаль `uk-UA` без изменений.
- Импортирует свои зависимости: `useRef`, `useEffect`, `react-native` примитивы, иконки `lucide-react-native`, тип `Wallet`.

### `src/features/dashboard/DashboardScreen/WalletsCard.tsx`
- Удаляет inline-определение `WalletRow` и `WalletRowProps`.
- Импортирует `WalletRow` из `./WalletRow`.
- Чистит ставшие неиспользуемыми импорты (`useRef`, `useEffect`, `TouchableOpacity`, `Animated`, иконки).
- Расчёт и форматирование `totalBalance` НЕ трогаем — остаётся захардкоженный UAH.

## Verification
- `rtk yarn lint` (через `npm run lint`) — без ошибок.
- `rtk yarn tsc --noEmit` — без ошибок.

## Out of scope
- Калькуляция/форматирование общего баланса `formattedTotal`.
- Мультивалютная агрегация total.
