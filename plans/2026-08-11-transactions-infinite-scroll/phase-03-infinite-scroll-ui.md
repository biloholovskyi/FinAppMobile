# Phase 3 — UI бесконечного скролла

Статус: done
Модель: BALANCED
Правила: `ai/rules/projects/fin-app-mobile/architecture.md`, `ai/rules/common/performance/_index.md`

## Цель

Показать состояние догрузки и конца списка по дизайну и подключить `onEndReached` к фиду.

## Заметки по реализации

- `OperationsFeedFooter` и `SkeletonRow` пишутся с нуля по `designs/screens/transactions.html`.
- `OperationsScreen.tsx` патчится: добавляются `onEndReached`, `onEndReachedThreshold`, `ListFooterComponent`.
- Единственное допустимое место для `style` — анимированный стиль shimmer.

## Область

- `src/features/operations/OperationsScreen/OperationsFeedFooter/OperationsFeedFooter.tsx` — новый.
- `src/features/operations/OperationsScreen/OperationsFeedFooter/SkeletonRow.tsx` — новый.
- `src/features/operations/OperationsScreen/OperationsScreen.tsx` — `onEndReached`, футер.

## Чек-лист

- [x] `onEndReached` дергает догрузку только при `hasMore` и отсутствии активной загрузки
- [x] Короткий список не блокирует фид: автодозагрузка из фазы 2 работает и когда `onEndReached` не приходит
- [x] Футер показывает скелетоны и подпись «Загружаем ещё…» во время догрузки
- [x] Футер показывает «Это все транзакции» после исчерпания списка, и не показывает при пустом списке
- [x] Верстка на NativeWind `className`, `style` только для анимированных значений и цветов из данных
- [x] Компоненты ≤ 150 строк, вложенность JSX ≤ 4
- [x] `renderItem`, `renderSectionHeader` и футер стабилизированы, ключи по `item.id`

## Верификация

- `rtk yarn lint` && `rtk yarn tsc --noEmit`
- Ручная проверка в `rtk npx expo start`: скролл до конца, pull-to-refresh, переключение фильтров на редких данных, удаление транзакции

## Приёмка

Догрузка срабатывает без ручного дёргания списка, повторных запросов одного окна нет.

## Evidence

- Размеры: `OperationsFeedFooter` 50 строк, `SkeletonRow` 42, `TxItem` 77, `OperationsScreen` 140 — все под лимитом 150. Максимальная вложенность JSX — 4 (`SkeletonRow`).
- `style` встречается только там, где значение вычисляется: анимированная прозрачность скелетона, цвета категории и суммы из данных. Остальная вёрстка на `className`.
- Футер стабилизирован через `useMemo` с зависимостями `isLoadingMore`, `hasMore`, `grouped.length`; `renderItem` и `renderSectionHeader` остались на `useCallback`, ключи по `item.id`.
- Ветка пустого экрана сужена до `grouped.length === 0 && !hasMore`: пока фид сам догружает окна, «Транзакций нет» не мигает.
- Гейты: `rtk yarn lint` — 0 ошибок (те же 2 предупреждения в `useDashboardScreen.ts`); `rtk yarn tsc --noEmit` — зелёный.
- Ручные сценарии на устройстве не прогонялись.

## Handoff

- Отклонение от дизайна: бегущий градиент скелетона заменён пульсацией прозрачности на `useSharedValue` + `withRepeat`. Градиентный sweep в RN требует замера ширины блока в рантайме; пульсация повторяет `glowPulse` из дизайн-системы. `design.md` обновлён.
- Кольцевой спиннер заменён на `ActivityIndicator`, «дышащие» точки опущены — как и было заложено в `design.md`.
- Футер получает `isEmpty` и молчит на пустом списке: пустое состояние рисует сам экран.
- Порог `onEndReached` вынесен в `TRANSACTIONS_END_REACHED_THRESHOLD`, количество скелетон-строк — в `TRANSACTIONS_SKELETON_ROWS_COUNT`.
- Ключи скелетонов считаются один раз на уровне модуля, индекс в рендере не используется.
- Хардкод hex-цветов сохранён: в проекте нет токенов Tailwind, весь экран написан на arbitrary values. Кандидат в техдолг фазы 5.
