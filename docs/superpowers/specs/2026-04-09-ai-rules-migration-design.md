# AI Rules Migration Design

**Date:** 2026-04-09
**Scope:** fin-app-mobile
**Goal:** Перенести и адаптировать AI rules/skills/agents из AI_Rules_and_skills в рабочую структуру проекта, удалить .claude/rules/ и .claude/commands/, создать единый SSoT в ai/rules/.

---

## Целевая структура

```
fin-app-mobile/
├── ai/rules/
│   ├── common/
│   │   ├── implementation-plans.md        # адаптировано из AI_Rules_and_skills
│   │   ├── feature-bug-phase-profiles.md  # адаптировано из AI_Rules_and_skills
│   │   ├── git-conventions.md             # адаптировано (FAM-XXX, GitHub, main)
│   │   └── performance/                   # 14 файлов из AI_Rules_and_skills
│   │       ├── _index.md
│   │       ├── _sections.md
│   │       ├── _template.md
│   │       ├── async-suspense-boundaries.md
│   │       ├── async-waterfalls.md
│   │       ├── bundle-strategy.md
│   │       ├── client-swr-dedup.md
│   │       ├── js-early-exit.md
│   │       ├── js-set-map-lookups.md
│   │       ├── rendering-conditional-render.md
│   │       ├── rendering-content-visibility.md
│   │       ├── rendering-hoist-jsx.md
│   │       ├── rendering-hydration-no-flicker.md
│   │       ├── rerender-derived-state.md
│   │       └── rerender-strategy.md
│   └── mobile/
│       ├── screens.md       # перенос из .claude/rules/screens.md
│       ├── api.md           # перенос из .claude/rules/api.md
│       ├── navigation.md    # перенос из .claude/rules/navigation.md
│       ├── post-code.md     # перенос из .claude/rules/post-code.md
│       ├── response-rules.md
│       ├── charts.md
│       └── design-system.md
│
├── .claude/
│   ├── skills/
│   │   ├── commit/SKILL.md               # новый
│   │   ├── post-code/SKILL.md            # новый
│   │   ├── implement-plan-step/SKILL.md  # новый
│   │   ├── audit-plan/SKILL.md           # новый
│   │   ├── audit-security/SKILL.md       # новый
│   │   ├── review-react-perf/SKILL.md    # новый
│   │   └── lint/SKILL.md                 # новый
│   ├── agents/
│   │   ├── code-reviewer.md              # существующий
│   │   ├── finapp-mobile-expert.md       # существующий
│   │   ├── screen-designer.md            # существующий
│   │   ├── codebase-researcher.md        # новый
│   │   ├── react-performance-reviewer.md # новый
│   │   └── plan-auditor.md               # новый
│   ├── rules/    → УДАЛИТЬ
│   └── commands/ → УДАЛИТЬ
│
└── CLAUDE.md  # обновить
```

---

## Фазы реализации

### Фаза 1 — ai/rules/mobile/ (перенос существующих правил)
Переместить все файлы из `.claude/rules/` в `ai/rules/mobile/`. Содержимое не менять.

### Фаза 2 — ai/rules/common/ (перенос из AI_Rules_and_skills с адаптацией)

**implementation-plans.md** — убрать:
- `PLAN_FOLDER_LAYOUT = docs/plans/` → `plans/`
- DB migration section (atlas.sum, CRLF guard)
- Jira setup phase
- non-restrict-proxy ссылки в cross-references

**git-conventions.md** — изменить:
- Branch roles: убрать `stage`, MR routing под GitHub (main + r-X.X.X)
- `GAINFRA-XXXX` → `FAM-XXX`
- GitLab MR → GitHub PR
- "Do not use Co-authored-by trailers" — оставить

**feature-bug-phase-profiles.md** — убрать только ссылки на `non-restrict-proxy/architecture.md`

**performance/** — все 14 файлов копируются без изменений

### Фаза 3 — .claude/skills/ (новые skills)

Все skills ссылаются на `@ai/rules/common/...` и `@ai/rules/mobile/...`.

Адаптации команд в каждом skill:
- `pnpm --filter <pkg> run lint` → `rtk yarn lint`
- `pnpm --filter <pkg> run typecheck` → `rtk yarn tsc --noEmit`
- `pnpm --filter <pkg> run test` → нет тестов пока, пропустить
- scope = название фичи/экрана (не package name)
- FAM-XXX вместо GAINFRA-XXXX

**commit/SKILL.md** — генерирует conventional commit, без Co-authored-by, с FAM-XXX в footer

**post-code/SKILL.md** — запускает lint → tsc, стоп на ошибках

**start-task/SKILL.md** — создаёт ветку от `main` (не stage), тип + FAM-XXX + slug

**implement-plan-step/SKILL.md** — выполняет одну фазу плана из `plans/`, требует апрув

**audit-plan/SKILL.md** — аудит плана из `plans/`

**audit-security/SKILL.md** — аудит кода по `ai/rules/common/...`

**review-react-perf/SKILL.md** — ревью React Native перформанса

**lint/SKILL.md** — запускает `rtk yarn lint`, при ошибках фиксит

### Фаза 4 — .claude/agents/ (новые агенты)

**codebase-researcher.md** — read-only, только Read/Glob/Grep, sonnet

**react-performance-reviewer.md** — read-only, фокус на RN (не web), opus

**plan-auditor.md** — читает `plans/` (не `docs/plans/`), opus

### Фаза 5 — CLAUDE.md (обновление)

Изменения:
1. Добавить секцию `## Co-authored-by` с явным запретом
2. Обновить все `@.claude/rules/` → `@ai/rules/mobile/`
3. Добавить строки в Load Rules by Task: Planning, Feature/bug profile, Git, React perf
4. Добавить секцию `## Skills` с перечнем
5. Обновить секцию `## Agents` (добавить 3 новых)

### Фаза 6 — Cleanup
Удалить `.claude/rules/` и `.claude/commands/`

---

## Адаптации Co-authored-by

Глобальный `~/.claude/CLAUDE.md` (system prompt) добавляет Co-Authored-By. Переопределяем явным правилом в проектном CLAUDE.md:

```
## Co-authored-by
Do NOT include Co-authored-by trailers in commit messages for this project.
```

Это rule precedence: project CLAUDE.md > system default.

---

## Экономия токенов (оценка)

| Сценарий | До | После | Экономия |
|---|---|---|---|
| Многофазная реализация | Весь план в контексте | Только index + активная фаза | ~50% |
| Code review | Inline в main context | Изолированный agent | ~30% |
| Git задачи | Ручной формат, объяснения | /commit, /start-task skills | ~60% |
| Performance review | Inline объяснения | review-react-perf + agent | ~40% |
| Исследование кодобазы | Read/Grep в main context | codebase-researcher agent | ~35% |
| Post-code workflow | Ручные шаги | /post-code skill | ~50% |

**Суммарная оценка: -35-50% токенов на типичную рабочую сессию.**
