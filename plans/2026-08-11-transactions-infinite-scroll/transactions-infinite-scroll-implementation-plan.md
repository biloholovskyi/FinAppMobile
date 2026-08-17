# Бесконечная подгрузка транзакций — 11.08.2026

## Цель

- Экран «Транзакции» грузит первые 40 дней, дальше догружает окнами по 10 дней при скролле.
- Точный конец списка определяется по общему количеству записей из бэкенда, без ложных «конец списка» на пустых окнах.

## Профиль задачи

`feature` — 4 сигнала против 0.

Сигналы feature: новый контракт API с фильтрацией и пагинацией; изменения в трёх слоях FSD (`shared`, `entities`, `features`); новые компоненты UI; архитектурное решение по разрыву типов generated и рендер-модели.

Сигналы bugfix: детерминированного репро нет, корректирующей правкой не обходится, контракт расширяется — ни одного.

## Принятые решения (от пользователя)

| Решение | Значение |
|---|---|
| Стоп-условие | Отдельный лёгкий запрос `?page=1&limit=1` без дат даёт `pagination.total` всех записей; стоп при `loaded >= total` |
| Фильтр по типу (Все/Расходы/Доходы/Переводы) | Остаётся клиентским — бэкенд фильтра по типу не имеет |
| Разрыв типов | Рендер-тип `Transaction` остаётся в `src/entities/transaction`; из generated берутся только параметры запроса и модель пагинации |
| Целевая версия | `1.8.0` — новый пункт в начало существующей секции `[1.8.0]`, дата обновляется на 11.08.2026 |
| Бэкенд | Готов и закоммичен (`d20891e`), правок не требует |

## Допущения

- `EXPO_PUBLIC_API_URL` указывает на бэкенд с уже задеплоенными датовыми фильтрами и пагинацией.
- Порядок выдачи транзакций — по `transactionTime` убыванию (`WALLET_TRANSACTION_LIST_ORDER_BY`), окна не пересекаются.
- Изменение JS-only, OTA-совместимо, `expo.runtimeVersion` не трогаем.

## Артефакты

- [research.md](research.md) — факты по бэкенду, мобиле и дизайну
- [design.md](design.md) — целевое состояние слоя данных, кэша, UI и констант
- [history.md](history.md) — handoff-заметки по завершённым фазам
- `designs/screens/transactions.html` — макет экрана, зоны догрузки и конца списка

## Покрытие правил

- `ai/rules/projects/fin-app-mobile/state-management.md` — фазы 1, 2, 4
- `ai/rules/projects/fin-app-mobile/architecture.md` — фаза 3
- `ai/rules/common/react.md` — фаза 2
- `ai/rules/common/performance/_index.md` — фаза 3
- `ai/rules/common/skills/refactor-security-audit.md` — фаза 4
- `ai/rules/common/post-code-workflow.md` — фазы 1–4
- `ai/rules/common/versioning-changelog.md` — фаза 4
- `ai/rules/common/implementation-plans.md` — фаза 5
- `ai/rules/design/design-system.md` — фаза 3, сверка футера с макетом

## Фазы

- Phase 1 (done) — Кодогенерация Orval и слой данных [phase-01-orval-data-layer.md](phase-01-orval-data-layer.md)
- Phase 2 (done) — Хук бесконечной подгрузки [phase-02-infinite-feed-hook.md](phase-02-infinite-feed-hook.md)
- Phase 3 (done) — UI бесконечного скролла [phase-03-infinite-scroll-ui.md](phase-03-infinite-scroll-ui.md)
- Phase 4 (done) — Аудит, документация, CHANGELOG [phase-04-audit-docs-changelog.md](phase-04-audit-docs-changelog.md)
- Phase 5 (done) — Reflect [phase-05-reflect.md](phase-05-reflect.md)

## План по моделям

- BALANCED: фазы 1–3
- DEEP: фаза 4
- FAST: фаза 5

## Следующие действия

1. Все фазы выполнены. Осталась ручная проверка на устройстве и коммит — его делает пользователь.

## Вне области

- Серверная фильтрация по типу транзакции.
- Правки бэкенда и OpenAPI-схемы.
- Бесконечная подгрузка на других экранах (дашборд, статистика, категории).
- Оптимистичные обновления и виртуализация сверх штатной у `SectionList`.
- Тесты — раннера в проекте нет.
