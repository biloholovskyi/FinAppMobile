# Design — транзакции подкатегории на экране расходов

## Листовые элементы

Лист — элемент списка расходов, у которого нет вложенных строк. Ключ листа совпадает с id строки `flattenSpendingRows`.

| Элемент | Ключ листа | Транзакции листа |
|---------|-----------|------------------|
| Карточка категории без подкатегорий за месяц | `cat:<categoryId>` / `cat:uncategorized` | все расходы категории (`categoryId === null` для `uncategorized`) |
| Строка подкатегории в раскрытой карточке | `sub:<subCategoryId>` | расходы с этим `subCategoryId` |
| Строка плоского режима | `row.id` (`cat:`, `sub:`, `rest:`) | по префиксу; `rest:<categoryId>` — расходы категории без `subCategoryId` |

- Карточка категории с подкатегориями по нажатию раскрывается; в раскрытом списке после подкатегорий стоит строка остатка (`UNCATEGORIZED_SUB_LABEL`, без бюджета, лист `rest:<categoryId>`) при положительной сумме расходов вне подкатегорий
- Фильтр месяца и расходов тот же, что у агрегатора: тип `expense`, локальный месяц, `getTransactionAmountUah !== null` — сумма листа всегда равна сумме строки
- Логика — чистые функции `src/features/categorySpending/lib/spendingLeaf.ts`: `parseSpendingLeafKey`, `filterLeafTransactions`, `findLeafRow` (строка листа среди `flattenSpendingRows`)
- Расходы фильтра месяца выносятся из агрегатора в общий хелпер `selectMonthExpenses`, его используют агрегатор и `filterLeafTransactions`

## Навигация

- Шторка — маршрут `src/app/spending/[leafKey].tsx`, `presentation: 'formSheet'`, `sheetAllowedDetents: [0.85]`, `sheetGrabberVisible: true`, без заголовка
- Параметры: `leafKey`, `month` (`monthStr`)
- `statistics.tsx` передаёт в `CategorySpendingScreen` проп `onOpenLeaf(leafKey, monthStr)` → `router.push`
- Шторка получает пропсы `leafKey`, `monthStr`, `onEditTransaction(id)` → `router.push('/transaction/<id>')`, `onClose` → `router.back()`
- Экран редактирования открывается поверх шторки; «назад» возвращает в шторку
- Если `formSheet` на Android ведёт себя некорректно — запасной вариант `presentation: 'transparentModal'` с собственной шторкой на Reanimated; решение фиксируется в evidence фазы

## Шторка транзакций

- Фича `src/features/categorySpending/SpendingTransactionsSheet/`
- Данные: `useSpendingData(monthStr, selectedMonth)` + `flattenSpendingRows` → строка листа (имя, родитель, иконка, цвет, бюджет, сумма); транзакции — `filterLeafTransactions` по тому же кэшу `QUERY_KEYS.transactions.all`
- Шапка: иконка в цвете категории, имя, подзаголовок (родитель или «Категория без подкатегорий»), месяц `toLocaleDateString('uk-UA', { month: 'long', year: 'numeric' })`
- Сводка: потрачено, число операций, прогресс бюджета (`BudgetProgress`, `BudgetMetaRow`) или «бюджет не установлен»
- Список: `SectionList` по дням (локальная дата), заголовок дня + сумма дня в UAH, новые сверху, `stickySectionHeadersEnabled`
- Строка транзакции: описание, время, кошелёк, сумма в валюте транзакции, `TransactionAmountUah` для валютных; кнопки карандаш и корзина как в ленте операций; нажатие на строку — редактирование
- Пустое состояние: иконка и «Операций нет» — лист без транзакций (например, после удаления последней)
- Загрузка и ошибка — как на экране расходов

## Удаление

- Общая модалка подтверждения в `src/entities/transaction/ui/DeleteTransactionModal/` (UI + хук отображения), мутация — `src/entities/transaction/lib/useDeleteTransaction.ts`
- `useDeleteTransaction`: `deleteTransaction`, при успехе инвалидирует `QUERY_KEYS.transactions.all` и `QUERY_KEYS.wallets.all`; ошибка возвращается вызывающему (`getApiErrorMessage`)
- Подтверждение показывается везде: лента операций, шторка транзакций, экран редактирования
- Экран редактирования: «Удалить транзакцию» открывает модалку; подтверждение удаляет и возвращает назад; ошибка — в `ErrorBanner`
- Ошибка удаления в ленте и шторке — `Alert` с сообщением API, модалка остаётся открытой
- После удаления в шторке список и сводка пересчитываются из кэша; экран расходов под шторкой — тоже

## Согласованность данных

- Сохранение и удаление инвалидируют `QUERY_KEYS.transactions.all` — экран расходов, шторка и лента обновляются из одного запроса
- Транзакция, перенесённая в другую категорию или месяц, исчезает из шторки после рефетча
- Новых query-ключей нет
