# AI System Migration Design

**Date:** 2026-04-09  
**Project:** fin-app-mobile  
**Goal:** Полная миграция AI-системы из AI_Rules_and_skills/ в структуру проекта + устранение проблем из usage report

---

## Контекст

### Текущие проблемы (из usage report, 121 сессия, 104K токенов)

- **Buggy code — 26 сессий (34%)**: Claude не запускает lint/tsc перед тем как считать задачу готовой
- **Wrong approach — 16 сессий (21%)**: Claude выбирает brainstorming вместо implementation, не знает routing table
- **Compatibility issues**: Claude не знает pinned-версии библиотек (Expo SDK 52, NativeWind v4, TanStack Query v5)
- **Tool errors — 106**: Command Failed 60%, User Rejected 24%
- **Path-gated stubs не работают**: `.claude/rules/*.md` без `paths:` frontmatter — не загружаются автоматически

### Что уже есть

- 6 агентов (finapp-mobile-expert, code-reviewer, screen-designer, codebase-researcher, plan-auditor, react-performance-reviewer)
- 7 правил в `.claude/rules/` (без path-gated frontmatter)
- 9 skill-папок в `.claude/skills/` (только `ui-ux-pro-max` имеет `SKILL.md`)
- `settings.local.json` с permissions, но без hooks

### Эталон

`AI_Rules_and_skills/` — backend-monorepo система с 12 агентами, 27 skills, `ai/rules/common/` (универсальные правила), `ai/prompts/` (playbooks), `CLAUDE.md` с routing table.

---

## Архитектура после миграции

```
fin-app-mobile/
├── CLAUDE.md                                    # НОВЫЙ: entry point + routing table + dependency constraints
├── .claude/
│   ├── AGENTS.md                                # НОВЫЙ: compiled index агентов и правил
│   ├── settings.local.json                      # ОБНОВИТЬ: добавить PostToolUse hooks
│   ├── agents/
│   │   └── finapp-mobile-expert.md              # ОБНОВИТЬ: ссылки на ai/rules/
│   ├── rules/                                   # ПРЕОБРАЗОВАТЬ: добавить paths: frontmatter
│   │   ├── api.md                               # → ai/rules/projects/fin-app-mobile/state-management.md
│   │   ├── screens.md                           # → ai/rules/common/react.md + architecture.md
│   │   ├── navigation.md                        # → ai/rules/projects/fin-app-mobile/architecture.md
│   │   ├── post-code.md                         # → ai/rules/common/post-code-workflow.md
│   │   ├── design-system.md                     # Добавить paths: designs/**/*.html (контент без изменений)
│   │   ├── charts.md                            # Добавить paths: designs/**/*.html (контент без изменений)
│   │   └── response-rules.md                    # Без изменений (глобальные правила)
│   └── skills/                                  # ДОБАВИТЬ SKILL.md в 8 пустых папок
│       ├── commit/SKILL.md
│       ├── lint/SKILL.md
│       ├── post-code/SKILL.md
│       ├── implement-plan-step/SKILL.md
│       ├── audit-plan/SKILL.md
│       ├── audit-security/SKILL.md
│       └── review-react-perf/SKILL.md
└── ai/
    ├── rules/
    │   ├── AGENTS.md                            # Compiled index всех правил
    │   ├── common/
    │   │   ├── core-rules.md                    # АДАПТИРОВАТЬ: task-to-file routing для mobile
    │   │   ├── patterns.md                      # АДАПТИРОВАТЬ: убрать backend/dual-runtime
    │   │   ├── react.md                         # АДАПТИРОВАТЬ: React Native (не web)
    │   │   ├── react-18.md                      # СКОПИРОВАТЬ as-is
    │   │   ├── git-conventions.md               # АДАПТИРОВАТЬ: убрать Jira/GitLab/stage branch
    │   │   ├── commit-message-and-crosslinks.md # АДАПТИРОВАТЬ: убрать GAINFRA trailer
    │   │   ├── post-code-workflow.md            # АДАПТИРОВАТЬ: rtk yarn lint/tsc для Expo
    │   │   ├── token-economy.md                 # СКОПИРОВАТЬ as-is
    │   │   ├── ai-models.md                     # СКОПИРОВАТЬ as-is
    │   │   ├── implementation-plans.md          # СКОПИРОВАТЬ as-is
    │   │   ├── performance/                     # СКОПИРОВАТЬ 14 файлов, адаптировать _index.md
    │   │   └── skills/
    │   │       ├── react-best-practices.md      # АДАПТИРОВАТЬ: React Native specifics
    │   │       ├── plan-audit.md                # СКОПИРОВАТЬ as-is
    │   │       ├── agent-team-quality-gates.md  # СКОПИРОВАТЬ as-is
    │   │       ├── feature-bug-phase-profiles.md # СКОПИРОВАТЬ as-is
    │   │       ├── git-branch-kickoff.md        # АДАПТИРОВАТЬ: без Jira, без GitLab
    │   │       ├── git-release-flow.md          # АДАПТИРОВАТЬ: EAS Build
    │   │       └── git-hotfix-flow.md           # АДАПТИРОВАТЬ: EAS hotfix
    │   └── projects/
    │       └── fin-app-mobile/
    │           ├── architecture.md              # НОВЫЙ: tech stack, FSD, nav, styling, constraints
    │           └── state-management.md          # НОВЫЙ: мигрировать из .claude/rules/api.md
    └── prompts/
        ├── mobile-feature.md                    # НОВЫЙ
        ├── mobile-bug.md                        # НОВЫЙ
        ├── mobile-design.md                     # НОВЫЙ
        ├── mobile-api.md                        # НОВЫЙ
        └── mobile-review.md                     # НОВЫЙ
```

---

## Детали ключевых компонентов

### 1. CLAUDE.md (корень)

Entry point для каждой сессии. Решает "Wrong approach (21%)".

**Содержимое:**
- Task routing table: задача → файл правила
- Dependency constraints с pinned-версиями
- Список skills и агентов
- Напоминание о post-code workflow
- Ссылка на `.claude/AGENTS.md` для full context

**Ключевые routing записи:**
```
Screen / component / hook → ai/rules/projects/fin-app-mobile/architecture.md
API / React Query / Zustand → ai/rules/projects/fin-app-mobile/state-management.md
Performance → ai/rules/common/performance/_index.md
Git / commit → ai/rules/common/git-conventions.md
Planning → ai/rules/common/implementation-plans.md
```

**Dependency constraints (CRITICAL):**
```
Expo SDK 52.x — ecosystem anchor
React Native 0.76.x — new architecture
NativeWind 4.x — не v2/v3 API
TanStack Query 5.x — не v4 API
Expo Router 3.x
TypeScript 5.x
```

### 2. PostToolUse Hooks (settings.local.json)

Решают "Buggy code (34%)". После каждого Edit/Write — reminder.

```json
"hooks": {
  "PostToolUse": [
    {
      "matcher": "Write|Edit|MultiEdit",
      "hooks": [
        {
          "type": "command",
          "command": "echo '[post-edit] Code changed — run /post-code before committing (rtk yarn lint && rtk yarn tsc --noEmit)'"
        }
      ]
    }
  ]
}
```

Начинаем с echo-reminder (не блокирующий). После проверки в работе — можно переключить на реальный `rtk yarn lint`.

### 3. Path-Gated Stubs (.claude/rules/)

Существующие rules-файлы получают YAML frontmatter. Claude Code автоматически подгружает их при открытии файлов по matching paths.

```yaml
---
paths:
  - "src/**/*.ts"
  - "src/**/*.tsx"
---
Source of truth: `ai/rules/projects/fin-app-mobile/state-management.md`
```

### 4. ai/rules/projects/fin-app-mobile/architecture.md (НОВЫЙ)

Главный SSoT для мобильного проекта:
- Pinned-версии всех зависимостей с notes о breaking changes
- FSD layer structure и forbidden imports
- Expo Router v3 конвенции
- NativeWind styling rules
- kopeck math rules
- Команды (expo start, lint, tsc, EAS build)

### 5. SKILL.md для 8 пустых skill-папок

Каждая папка `.claude/skills/*/SKILL.md` получает:
- Frontmatter: name, description, model
- Инструкции со ссылками на `ai/rules/`
- Адаптация к мобильному стеку (rtk yarn вместо pnpm)

### 6. ai/rules/common/ (адаптации)

| Файл | Что убрать | Что добавить |
|------|-----------|-------------|
| react.md | CSS Modules, :global(), Playwright, SSR | NativeWind className, FlatList, expo-router restrictions |
| patterns.md | Dual-runtime, Biome, Drizzle/DB | ESLint, RTK prefix, kopeck math |
| git-conventions.md | Jira, GitLab MR, stage branch | GitHub PR, develop branch, EAS Build |
| performance/_index.md | content-visibility, hydration-no-flicker | FlatList jank, Metro bundler |
| react-best-practices.md | admin-ui-architecture refs, Next.js SSR | React Native screen specifics |

---

## Фазы реализации

### Фаза 1 — Создать директории и скопировать as-is файлы
Создать `ai/rules/common/performance/`, `ai/rules/common/skills/`, `ai/rules/projects/fin-app-mobile/`, `ai/prompts/`.

Скопировать без изменений:
- `token-economy.md`, `ai-models.md`, `implementation-plans.md`, `react-18.md`
- `performance/` (14 файлов — только `_index.md` адаптируем)
- `skills/plan-audit.md`, `skills/agent-team-quality-gates.md`, `skills/feature-bug-phase-profiles.md`

### Фаза 2 — Адаптированные common-правила
Создать/адаптировать: `core-rules.md`, `patterns.md`, `react.md`, `git-conventions.md`, `commit-message-and-crosslinks.md`, `post-code-workflow.md`, `performance/_index.md`, `skills/react-best-practices.md`, `skills/git-branch-kickoff.md`, `skills/git-release-flow.md`, `skills/git-hotfix-flow.md`

### Фаза 3 — Project-specific правила (SSoT для мобильного)
Создать: `ai/rules/projects/fin-app-mobile/architecture.md`, `ai/rules/projects/fin-app-mobile/state-management.md`

### Фаза 4 — Compiled indexes и entry points
Создать: `CLAUDE.md` (корень), `.claude/AGENTS.md`, `ai/rules/AGENTS.md`

### Фаза 5 — Path-gated stubs
Преобразовать `.claude/rules/*.md` — добавить `paths:` frontmatter, упростить содержимое до redirect.

### Фаза 6 — SKILL.md для пустых skills
Создать `SKILL.md` в 8 пустых skill-папках.

### Фаза 7 — Hooks и agents update
Обновить `settings.local.json` (hooks) и `finapp-mobile-expert.md` (ссылки на ai/rules/).

### Фаза 8 — Playbooks
Создать `ai/prompts/mobile-*.md` (5 файлов).

---

## Ожидаемый эффект

| Изменение | Проблема | Снижение |
|-----------|---------|---------|
| CLAUDE.md + routing | Wrong approach (21%) | ~15-20% сессий |
| PostToolUse hooks | Buggy code (34%) | ~20-25% сессий |
| Path-gated stubs | Правила не загружаются | Автозагрузка по context |
| ai/rules/ SSoT | Дублирование правил | -30-40% токенов на загрузку |
| Dependency constraints | Compatibility loops | -50% ошибок совместимости |
| SKILL.md в skills/ | Skills без инструкций | Правильное выполнение |

**Суммарно:** ~30-40% снижение расхода токенов, success rate с 77% → 90%+

---

## Файлы для создания/изменения (итого)

**Новые файлы:** 35
- `CLAUDE.md`
- `.claude/AGENTS.md`
- `ai/rules/AGENTS.md`
- `ai/rules/common/` — 11 файлов
- `ai/rules/common/performance/` — 14 файлов (13 скопировать + 1 адаптировать)
- `ai/rules/common/skills/` — 7 файлов
- `ai/rules/projects/fin-app-mobile/` — 2 файла
- `ai/prompts/` — 5 файлов
- `.claude/skills/*/SKILL.md` — 8 файлов

**Изменённые файлы:** 9
- `.claude/settings.local.json` — добавить hooks
- `.claude/agents/finapp-mobile-expert.md` — ссылки на ai/rules/
- `.claude/rules/*.md` (7 файлов) — добавить paths: frontmatter
