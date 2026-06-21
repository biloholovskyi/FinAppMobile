# План: перевод fin-app-mobile на Claude-only AI-конфигурацию

Дата: 2026-06-20
Эталон: `fin-app-frontend/` (Claude-only, `CLAUDE.md` — единственная точка входа, `ai/rules/**` — SSoT, `.claude/**` — Claude-ассеты)

## Цель

1. Удалить все настройки не-Claude инструментов (Cursor, Codex, общий `AGENTS.md`).
2. `ai/` остаётся единственным источником истины (SSoT) для контента правил.
3. Всё, что относится только к Claude, живёт в `.claude/` (agents, skills, rules-стабы, settings, memory).
4. Агенты запускаются автоматически (через явное разрешение в `CLAUDE.md`, как во фронте).
5. Правила применяются автоматически по `paths`-стабам `.claude/rules/`.
6. Разрешён конфликт планирования: локальные `implementation-plans` vs `superpowers:writing-plans/executing-plans`.

## Принятые решения (от пользователя)

- `ai/prompts/` — **удалить полностью** (контент покрыт `ai/rules/` + скиллами).
- `.claude/rules/` стабы — **зеркалить именование фронта** (по именам файлов правил), но **сохранить нужные mobile-специфичные** стабы (`screens`, `navigation`).
- Хуки-напоминалки в `.claude/settings.json` — **удалить** (во фронте committed-хуков нет).

---

## Фаза 1 — Удаление не-Claude конфигураций

Удалить целиком:
- `.cursor/` — commands, hooks (`*.sh`, `hooks.json`), rules (`*.mdc`).
- `.codex/` — agents (`*.toml`), `hooks.json`.
- `.agents/` — дубль `skills/` (canonical-копия живёт в `.claude/skills/`).
- `AGENTS.md` (корень проекта) — «Entry point for every Codex session», ссылается на `.Codex/`.
- `ai/prompts/` целиком (5 плейбуков: mobile-feature, mobile-bug, mobile-api, mobile-design, mobile-review).

Проверки после удаления:
- `grep -rinE 'cursor|codex|\.mdc|\.Codex|windsurf|copilot'` по `ai/`, `.claude/`, `CLAUDE.md` — не должно остаться ссылок.
- `ai/rules/common/ai-models.md` и `ai/rules/design/design-system.md` содержат слова cursor/codex — проверить контекст, при необходимости переформулировать на Claude-нейтральный/Claude-only язык.
- `.gitignore` — убедиться, что нет записей под удалённые папки; ничего не сломалось.

## Фаза 2 — SSoT: довести `ai/rules/` до полноты

Цель: `ai/rules/**` — единственный источник контента; `.claude/rules/` только указывает на него.

- Перенести контент `response-rules` в SSoT: создать `ai/rules/common/response-rules.md`
  (сейчас контент живёт только в `.claude/rules/response-rules.md` — это нарушает SSoT).
  Источник контента — текущий `.claude/rules/response-rules.md`.
- Проверить, что для каждого будущего `.claude/rules`-стаба существует целевой файл в `ai/rules/`:
  - `architecture.md` → `ai/rules/projects/fin-app-mobile/architecture.md`
  - `state-management.md` / `api` → `ai/rules/projects/fin-app-mobile/state-management.md`
  - `react.md` → `ai/rules/common/react.md` (+ `react-18.md`)
  - `patterns.md` → `ai/rules/common/patterns.md`
  - `performance` → `ai/rules/common/performance/_index.md`
  - `post-code` → `ai/rules/common/post-code-workflow.md`
  - `response-rules` → `ai/rules/common/response-rules.md` (создаётся в этой фазе)
  - `design-system` / `charts` → `ai/rules/design/design-system.md`, `ai/rules/design/charts.md`
- (Опционально) Создать `ai/rules/common/tooling.md` (rtk/shell) по аналогии с фронтом, если нужно вынести RTK-правила из `CLAUDE.md`.

## Фаза 3 — `.claude/rules/` — тонкие path-scoped стабы (зеркало фронта)

Формат стаба (как во фронте) — без дублирования тела правила:
```
---
paths:
  - "<glob>"
---
Source of truth:
- ai/rules/<путь к SSoT>
```

Привести существующие стабы к тонкому формату (убрать дублирующийся текст вроде «Quick Rules» из `screens.md`):
- `screens.md` → paths `src/**/*.tsx`, `src/**/*.jsx` → architecture.md (сохраняем)
- `navigation.md` → paths `src/app/**` → architecture.md (сохраняем, mobile-специфика expo-router)
- `api.md` → paths `src/shared/api/**` → state-management.md
- `post-code.md` → paths `src/**/*.ts`, `src/**/*.tsx` → post-code-workflow.md
- `response-rules.md` → pointer на `ai/rules/common/response-rules.md` (+ пометка «always-loaded via @-import в CLAUDE.md»)

Добавить недостающие стабы-зеркала (которые есть во фронте):
- `architecture.md` → paths `src/**` → architecture.md
- `react.md` → paths `src/**/*.tsx`, `src/**/*.jsx` → react.md
- `patterns.md` → paths `src/**/*.ts`, `src/**/*.tsx` → patterns.md
- `performance.md` → paths `src/**` → performance/_index.md
- `design-system.md` → paths `designs/**/*.html` → design/design-system.md (закрывает битую ссылку в `.claude/AGENTS.md`)
- `charts.md` → paths `designs/**/*.html` → design/charts.md (закрывает битую ссылку)

Результат: больше нет битых ссылок из `.claude/AGENTS.md`, все стабы — тонкие указатели.

## Фаза 4 — `CLAUDE.md` (mobile) по образцу фронта

Переписать `CLAUDE.md`, добавив блоки из фронтового `CLAUDE.md`:

1. **Instruction Precedence (ABSOLUTE)** — мои правила выше дефолтов харнесса/тулзов/скиллов.
2. **Агенты — автозапуск:** явно указать, что таблица роутинга агентов = постоянное разрешение делегировать (override дефолта «не спавнить агентов без явной просьбы»). Это закрывает требование «агенты запускаются как надо автоматически».
3. **Planning & Superpowers (разрешение конфликта):**
   - Планы — только по `@ai/rules/common/implementation-plans.md`, формат `plans/` в корне проекта.
   - НЕ использовать `superpowers:writing-plans` / `superpowers:executing-plans`.
   - `superpowers:brainstorming` разрешён (до плана); по завершении — сразу план в `plans/`, без spec-файлов superpowers.
   - superpowers разрешён для остального (debugging, code review on request).
4. **Source of Truth** — `ai/rules/**` контент; `.claude/**` — Claude-ассеты; `.claude/rules/*` — тонкие стабы.
5. **Always-loaded rules (@-import)** — перечислить через `@ai/rules/...`:
   - core-rules, response-rules, patterns, token-economy, implementation-plans (+ tooling, если создан в Фазе 2).
6. **Load Rules By Task** — таблица задача → SSoT-файл (как во фронте, под mobile).
7. **Skills / Agents** — списки из `.claude/skills/` и `.claude/agents/`.
8. Сохранить mobile-специфику: pinned-версии (Expo 52, React 18.3, Expo Router v3, NativeWind v4, RQ v5), kopeck-math, FSD-направление, `uk-UA`/`UAH`.

## Фаза 5 — `.claude/AGENTS.md` и settings

- `.claude/AGENTS.md`: оставить как детальный индекс, но
  - убрать упоминания Codex/`.Codex/`,
  - убедиться, что все ссылки на стабы валидны (после Фазы 3 — да),
  - (опционально) свернуть в `CLAUDE.md` для полного соответствия фронту, где отдельного `.claude/AGENTS.md` нет. По умолчанию — оставляем индекс, чистим формулировки.
- `.claude/settings.json`: **удалить блок `hooks`** (PostToolUse/Stop echo). Оставить только то, что нужно Claude.
- `.claude/settings.local.json`: оставить (локальные permissions, не коммитится по сути).
- Проверить `__pycache__/*.pyc` в `.claude/skills/ui-ux-pro-max/scripts/` — добавить в `.gitignore` (как во фронте), мусор сборки не коммитим.

## Фаза 6 — Superpowers и согласованность с root

- (Опционально) Синхронизировать `.superpowers/` с фронтом, если требуется локально (во фронте папка есть). Сам конфликт планирования решается текстом в `CLAUDE.md` (Фаза 4), не папкой.
- Проверить root `C:\Projects\FinApp\.claude\rules\mobile.md` и root `CLAUDE.md`: ссылки на `fin-app-mobile/ai/rules/...` остаются валидными (state-management.md, architecture.md и т.д.) — править не требуется, только сверить.

## Фаза 7 — Верификация

- Грепы: ни одного `cursor|codex|\.mdc|\.Codex` в репозитории mobile.
- Каждый `.claude/rules/*.md` указывает на существующий `ai/rules/*` (нет битых путей).
- `CLAUDE.md` содержит блоки Precedence, Agents-autostart, Planning&Superpowers, Always-loaded, SSoT.
- Дерево `.claude/` совпадает по смыслу с фронтом: `agents/`, `skills/`, `rules/` (тонкие стабы), `settings*.json`, `agent-memory/`, `memory/` (опц.).
- `rtk yarn lint` / `rtk yarn tsc --noEmit` — конфиг не трогает код, но прогнать как sanity-check не требуется (нет изменений в `src/`).

---

## Итоговое целевое дерево (ключевое)

Удалено: `.cursor/`, `.codex/`, `.agents/`, корневой `AGENTS.md`, `ai/prompts/`.

```
ai/rules/                      # SSoT (контент)
  common/ ... response-rules.md (новый), tooling.md (опц.)
  projects/fin-app-mobile/
  design/
.claude/
  agents/                      # как есть
  skills/                      # как есть (без .agents-дубля)
  rules/                       # тонкие path-scoped стабы → ai/rules
  settings.json                # без hooks
  settings.local.json
  agent-memory/
  AGENTS.md                    # индекс, без Codex (опц. свернуть в CLAUDE.md)
CLAUDE.md                      # единственная точка входа (+ Precedence/Planning/Agents)
```

## Открытые вопросы

- `.claude/AGENTS.md`: оставить как индекс или свернуть в `CLAUDE.md`? (по умолчанию — оставить, почистить).
- `ai/rules/common/tooling.md`: создавать ли отдельный файл под RTK/shell? (по умолчанию — нет, RTK остаётся в `CLAUDE.md`).
