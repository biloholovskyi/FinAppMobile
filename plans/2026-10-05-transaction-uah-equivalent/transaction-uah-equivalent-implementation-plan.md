# Эквивалент транзакций в UAH — Implementation Plan

Дата: 05.10.2026

## Goal

- Транзакции в валюте, отличной от UAH, показывают эквивалент в гривнах в ленте и на экране редактирования
- Итог дня, экран расходов по категориям и расход месяца на дашборде считаются в UAH по `amountUah` от бэкенда

## Task Profile

`feature` — 3 feature-сигнала против 0 bugfix-сигналов.

Feature-сигналы:
1. Расширение API-контракта — новые поля `currency`, `exchangeRate`, `amountUah` транзакции
2. Изменения в нескольких слоях — `entities/transaction`, `features/operations`, `features/categorySpending`
3. Новый UI-элемент в двух экранах — строка эквивалента и блок эквивалента под суммой

Bugfix-сигналы: детерминированный дефект есть (суммирование разных валют), но исправление идёт через расширение контракта, а не минимальную правку.

## Decisions Taken

- Переводы исключаются из итога дня; строка эквивалента у перевода не показывается (бэкенд отдаёт для них `amountUah = null`)
- Orval-клиент перегенерирован 05.10.2026 по запросу пользователя, до утверждения плана

- Целевая версия — `1.11.0`

- Месяц транзакции на дашборде и экране категорий определяется в локальном времени устройства

## Assumptions

- Транзакция в валюте без `amountUah` (бэкфил пропустил) не входит в UAH-суммы и показывается без эквивалента
- Редактор берёт сохранённый `exchangeRate` транзакции, иначе текущий курс `/currency-rate` — так же, как пересчитывает бэкенд
- Итог дня без учтённых транзакций скрывается
- Изменения только в JS — доставка OTA, `runtimeVersion` не меняется
- Неточные сгенерированные типы полей (`{ [key]: unknown }`) обходятся рантайм-проверкой в хелперах; правка `@ApiProperty` на бэкенде — отдельная задача

## Artifacts

- [research.md](research.md)
- [design.md](design.md)
- [history.md](history.md) — создаётся с первой завершённой фазой
- Эталон визуала: `designs/screens/transactions.html`, `designs/screens/transaction-edit.html`

## Phases

- Phase 01 (done) — Контракт транзакции и UAH-хелперы [phase-01-contract-helpers.md](phase-01-contract-helpers.md)
- Phase 02 (done) — Лента операций: эквивалент и итог дня [phase-02-operations-feed.md](phase-02-operations-feed.md)
- Phase 03 (done) — Расходы по категориям в UAH [phase-03-category-spending.md](phase-03-category-spending.md)
- Phase 04 (done) — Эквивалент на экране редактирования [phase-04-edit-screen.md](phase-04-edit-screen.md)
- Phase 05 (done) — Post-code, ревью и харденинг [phase-05-audit-hardening.md](phase-05-audit-hardening.md)
- Phase 06 (done) — Версия 1.11.0 и CHANGELOG [phase-06-changelog.md](phase-06-changelog.md)
- Phase 07 (done) — Reflect [phase-07-reflect.md](phase-07-reflect.md)
- Phase 08 (done) — Расходы на дашборде в UAH и единые границы месяца [phase-08-dashboard.md](phase-08-dashboard.md)

## Model Schedule

| Фазы | Тир | Обоснование |
|------|-----|-------------|
| 01–04, 08 | BALANCED | Реализация по известным паттернам, 2–5 файлов на фазу |
| 05 | DEEP | Независимое ревью, копеечная математика, границы FSD |
| 06–07 | FAST | CHANGELOG и ретроспектива |

## Next Actions

1. Создать ветку `r-1.11.0` — за пользователем (текущая ветка `1.10.0`)
2. Убедиться, что на проде выполнен `POST /wallets/transactions/backfill-amount-uah`
3. Проверить на устройстве ленту, итог дня, расходы по категориям и редактор с USD-кошельком (включая шрифт на iOS)
4. Отдельная задача: группировка ленты по дням в локальном времени вместо UTC
5. Отдельная задача на бэкенде: `type` в `@ApiProperty` для полей валюты транзакции

## Out of Scope

- Эквивалент для переводов и конвертация по текущему курсу на клиенте
- Сгенерированные модули `monthly-reports`, `reserve-plans`, `WalletModel.purpose`, фильтры `purpose`/`walletId`
- Правка `@ApiProperty` в бэкенде
- Тесты — тест-раннера нет
- Любые git-операции
