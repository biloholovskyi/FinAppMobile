# Orval Codegen — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Подключить Orval для автогенерации типизированных React Query хуков из OpenAPI-спецификации бекенда.

**Architecture:** Orval читает `../fin-app-backend/docs/openapi.json` и генерирует хуки + модели в `src/shared/api/generated/`. Существующие ручные API-файлы остаются нетронутыми как legacy. Мутатором служит существующий `apiClient` из `base.ts` (реэкспортируется как `axiosInstance`).

**Tech Stack:** orval, @tanstack/react-query v5, axios

---

## Task Profile

- Profile: `feature`
- Signals: новая dev-tooling инфраструктура, изменения в правилах для AI-агентов

## Phases

- Phase 1 (todo) — Установка и конфигурация Orval [→ ниже]
- Phase 2 (todo) — Обновление `base.ts` [→ ниже]
- Phase 3 (todo) — Первая генерация [→ ниже]
- Phase 4 (todo) — Обновление правил [→ ниже]

## Model Schedule

- Phases 1–4: BALANCED

## Next Actions

1. Выполнить Phase 1
2. Выполнить Phase 2
3. Выполнить Phase 3 (зависит от 1+2)
4. Выполнить Phase 4

---

## Phase 1 — Установка и конфигурация Orval

**Status:** todo
**Model tier:** BALANCED
**Required rules:** —

**Goal:** Установить `orval`, создать `orval.config.ts`, добавить скрипты в `package.json`, добавить `generated/` в `.gitignore`.

**Scope:**

`package.json` — добавить скрипты `api:generate` и `api:generate:watch` в `scripts`; добавить `orval` в `devDependencies`.

`orval.config.ts` (создать в корне) — конфиг `finapp` с:
- `input.target`: `'../fin-app-backend/docs/openapi.json'`
- `output.mode`: `'tags-split'`
- `output.target`: `'src/shared/api/generated'`
- `output.schemas`: `'src/shared/api/generated/models'`
- `output.client`: `'react-query'`
- `output.httpClient`: `'axios'`
- `output.mock`: `false`
- `output.override.mutator.path`: `'src/shared/api/base.ts'`
- `output.override.mutator.name`: `'axiosInstance'`
- `output.override.query.useQuery`: `true`
- `output.override.query.useMutation`: `true`
- `output.override.query.signal`: `true`

`.gitignore` — добавить строку `src/shared/api/generated/`.

**Checklist:**

- [ ] Установить orval: `npm install --save-dev orval`
- [ ] Создать `orval.config.ts` в корне проекта
- [ ] Добавить скрипты `api:generate` и `api:generate:watch` в `package.json`
- [ ] Добавить `src/shared/api/generated/` в `.gitignore`

**Verification:**

```bash
rtk npm ls orval
cat orval.config.ts
grep "api:generate" package.json
grep "generated" .gitignore
```

**Acceptance:** `orval` есть в devDependencies, `orval.config.ts` существует, оба скрипта присутствуют, `.gitignore` содержит `src/shared/api/generated/`.

---

## Phase 2 — Обновление base.ts

**Status:** todo
**Model tier:** BALANCED
**Required rules:** `ai/rules/projects/fin-app-mobile/state-management.md`

**Goal:** Добавить именованный реэкспорт `axiosInstance` в `src/shared/api/base.ts`, чтобы Orval мог использовать его как мутатор.

**Scope:**

`src/shared/api/base.ts` — добавить в конец файла:
`export { apiClient as axiosInstance };`

Существующий `apiClient` и его настройки не трогать.

**Checklist:**

- [ ] Добавить `export { apiClient as axiosInstance }` в конец `src/shared/api/base.ts`

**Verification:**

```bash
rtk yarn tsc --noEmit
grep "axiosInstance" src/shared/api/base.ts
```

**Acceptance:** TypeScript не показывает ошибок, `axiosInstance` экспортируется из `base.ts`.

---

## Phase 3 — Первая генерация

**Status:** todo (зависит от Phase 1 и Phase 2)
**Model tier:** BALANCED
**Required rules:** —

**Goal:** Запустить `api:generate`, убедиться что генерация проходит успешно и файлы создаются корректно.

**Scope:**

Запустить `npm run api:generate`. Результат — папка `src/shared/api/generated/` со структурой по тегам (`wallets/`, `categories/`, `transactions/` и т.д.) и папкой `models/` с TypeScript-типами.

**Checklist:**

- [ ] Запустить `npm run api:generate`
- [ ] Проверить что `src/shared/api/generated/` создана и не пустая
- [ ] Запустить `rtk yarn tsc --noEmit` — убедиться что сгенерированный код компилируется

**Verification:**

```bash
npm run api:generate
ls src/shared/api/generated/
rtk yarn tsc --noEmit
```

**Acceptance:** Генерация завершается без ошибок. Папка `generated/` содержит подпапки по тегам и `models/`. TypeScript не показывает ошибок.

---

## Phase 4 — Обновление правил

**Status:** todo
**Model tier:** BALANCED
**Required rules:** —

**Goal:** Обновить правила в `.claude/`, `ai/` и `.cursor/` чтобы AI-агенты знали о сгенерированных хуках и правильно их использовали.

**Scope:**

`.claude/rules/api.md` — добавить секцию после Quick Rules:

```
## Generated API (Orval)
- Для новых фич: использовать хуки из `src/shared/api/generated/`
- Типы моделей: импортировать только из `src/shared/api/generated/models/`
- Ручные файлы в `src/shared/api/*.ts` — legacy, не расширять
- После изменения бекенд-контракта: запустить `npm run api:generate` перед началом работы
- Мутации из сгенерированных хуков также обязаны вызывать `queryClient.invalidateQueries()`
```

`ai/rules/projects/fin-app-mobile/state-management.md` — добавить новую секцию `## Generated API (Orval)` перед разделом `## TanStack Query v5`:
- Описание: `src/shared/api/generated/` — источник хуков и типов для новых фич
- Правило: не дублировать типы вручную — только `generated/models/`
- Правило: ручные файлы (`wallets.ts`, `transactions.ts` и т.д.) — legacy, только читать
- Правило: `npm run api:generate` запускать при изменении OpenAPI спеки
- Пример импорта: `import { useGetAllWallets } from '@/shared/api/generated/wallets/wallets'`
- Пример импорта типа: `import type { WalletModel } from '@/shared/api/generated/models'`

`.cursor/rules/api.mdc` — добавить в Quick Rules:
- `Use generated hooks from src/shared/api/generated/ for new features — legacy manual files are read-only`
- `Import models only from src/shared/api/generated/models/ — never redeclare manually`
- `Run npm run api:generate when backend contract changes`

**Checklist:**

- [ ] Обновить `.claude/rules/api.md`
- [ ] Обновить `ai/rules/projects/fin-app-mobile/state-management.md`
- [ ] Обновить `.cursor/rules/api.mdc`

**Verification:**

```bash
grep "generated" .claude/rules/api.md
grep "Generated API" ai/rules/projects/fin-app-mobile/state-management.md
grep "generated" .cursor/rules/api.mdc
```

**Acceptance:** Все три файла содержат правила об использовании Orval-сгенерированного кода.
