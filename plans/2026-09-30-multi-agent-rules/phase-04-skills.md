# Phase 04 — Скиллы: канон и адаптеры

- Status: done
- Model tier: BALANCED
- Required rules: `ai/rules/common/ai-models.md`, `ai/rules/common/agent-workflow.md`
- Prerequisites: Phase 03

## Goal

14 скиллов имеют одну процедуру в `ai/skills/` и одинаковую политику вызова в обоих клиентах.

## Implementation Notes

- Тело `.claude/skills/<name>/SKILL.md` переносится в `ai/skills/<name>/procedure.md` без frontmatter; `$ARGUMENTS` → словесное описание аргумента; `/skill-name` → имя скилла
- Пути в процедурах — от корня репозитория; поведение при вызове из подкаталога проверяется на `start-task`
- `ui-ux-pro-max`: `data/` и `scripts/` переезжают в `ai/skills/ui-ux-pro-max/`; вызовы `scripts/search.py` — по пути от корня
- Передача аргументов в тело `SKILL.md` Codex сверяется с документацией; формулировка Codex-адаптера — по результату
- Политика вызова — таблица классов `design.md`: `eas-build`, `eas-submit` ручные в обоих клиентах; процедуры этих двух скиллов сохраняют отдельное подтверждение внешнего действия
- Процедура `post-code` пишется по контракту QA из `design.md` и ссылается на `ai/rules/common/post-code-workflow.md` как на источник последовательности: lint → tsc безусловно после изменений кода, затем `agents:check` при изменениях агентских файлов; условие «if suspected» из исходного скилла не переносится
- `deploy-preflight` выполняет `rtk yarn agents:check` всегда; `lint` и `typecheck` согласуются с тем же контрактом

## Scope

- `ai/skills/<name>/procedure.md` — 14 процедур; `ai/skills/ui-ux-pro-max/{data,scripts}/**`
- `.claude/skills/<name>/SKILL.md` — 14 адаптеров; `disable-model-invocation: true` у `eas-build`, `eas-submit`
- `.agents/skills/<name>/SKILL.md` — 14 адаптеров; `.agents/skills/{eas-build,eas-submit}/agents/openai.yaml` — `allow_implicit_invocation: false`

## Checklist

- [x] В `ai/skills/**/procedure.md` нет `model:`, `$ARGUMENTS`, имён моделей, slash-команд
- [x] Адаптер — только метаданные и указатель на одноимённый канон, до 15 строк
- [x] `.claude/skills/ui-ux-pro-max/` без `data/` и `scripts/`; поиск через `search.py` отрабатывает из корня
- [x] `deploy-preflight` и `commit` остаются доступными к неявному вызову
- [x] Процедура `post-code` и `post-code-workflow.md` задают одну последовательность, без условного tsc

## Verification Commands

- `rtk yarn agents:check`
- `rtk grep -rnE "\$ARGUMENTS|model:" ai/skills --include=procedure.md` — пусто. Без `--include` совпадает сторонний CSV `ai/skills/ui-ux-pro-max/data/stacks/nuxt-ui.csv` (`v-model:`) — данные, не конфигурация
- Claude Code: `/post-code` и `/start-task <brief>` читают свои процедуры; аргумент дошёл
- Codex (предварительное наблюдение, не критерий `done`): `$post-code` виден в `/skills`; `$start-task <brief>` получает аргумент

## Acceptance Criteria

- Переходная проверка проходит
- Claude выполняет `post-code` как lint → tsc без оценки «есть ли подозрения» и останавливается на первой ошибке
- Наблюдения в Codex записаны в evidence как предварительные; окончательная эквивалентность — сценарии 5 и 7 Phase 09

## Evidence Note

Выполнено 30.09.2026.

Изменено:
- `ai/skills/<name>/procedure.md` — 14 процедур из тел `.claude/skills/*/SKILL.md`; `$ARGUMENTS` → словесное описание; `/deploy-preflight`, `/eas-submit`, `/post-code` → имена скиллов
- `post-code`, `lint` переписаны по контракту QA; в `commit`, `implement-plan-step`, `deploy-preflight` добавлен `rtk yarn agents:check`; `implement-plan-step` читает `agent-workflow.md`, `implementation-plans.md`, `response-rules.md` перед планом
- `ai/rules/common/deployment.md` — шаг `rtk yarn agents:check` в Pre-Release Gates, чтобы порядок совпадал с `deploy-preflight`
- `ui-ux-pro-max`: `data/`, `scripts/` перенесены в `ai/skills/ui-ux-pro-max/`; вызовы — `python3 ai/skills/ui-ux-pro-max/scripts/search.py`; `DATA_DIR` в `core.py` считается от `__file__`, правки скрипта не нужны
- 14 адаптеров `.claude/skills/<name>/SKILL.md` (7–10 строк) и 14 `.agents/skills/<name>/SKILL.md`; `.agents/skills/{eas-build,eas-submit}/agents/openai.yaml`
- Формат `openai.yaml` и отсутствие плейсхолдеров аргументов сверены с https://learn.chatgpt.com/docs/build-skills (30.09.2026)

Проверки:
- `yarn agents:check` → `passed: 111 files scanned`, код 0
- `grep "\$ARGUMENTS|model:|/[a-z]|haiku|sonnet|opus|.claude/"` по `procedure.md` — пусто
- `search.py "fintech dashboard" --domain color` из корня и из `src/` (путь `../ai/...`) — код 0, результаты из `colors.csv`
- Claude runtime (`claude -p`, haiku, только Read/Glob/Grep/Skill): `post-code` получил «Read and follow `ai/skills/post-code/procedure.md`…», шаг 1 — `rtk yarn lint` и `rtk yarn tsc --noEmit`, tsc безусловен
- `/start-task PROBE-4711 rename constant…` → аргумент дошёл дословно; процедура прочитана; «план не нужен» — по правилу процедуры
- `/start-task` из `src/` → прочитаны `C:\Projects\FinAppin-app-mobilei\skills\start-task\procedure.md` и `…i
ules\common\implementation-plans.md`
- После сохранения адаптеров список скиллов текущей Claude-сессии обновился без `eas-build`, `eas-submit` — неявный вызов отключён
- Текущая сессия отдаёт старое тело `post-code` (кэш на старте) — поэтому проверки через новую сессию
- Codex (предварительно, дополнено 30.09.2026): в каталоге текущей сессии доступны 12 проектных скиллов, включая `post-code`, `start-task`; на диске 14 адаптеров, у `eas-build`/`eas-submit` проверено `allow_implicit_invocation: false`. Вызовы через desktop `/skills` и `$name` не проверены.
- Codex, CLI расширения VS Code (30.09.2026, `codex exec`): `$start-task PROBE-4711 …` → процедура `ai/skills/start-task/procedure.md`, аргумент дословно, «план не нужен»; обычный запрос на EAS build → `eas-build` не выбран неявно. Список `$` в интерфейсе и вызов из `src/` — ручные шаги `codex-close-phase.md`
- Codex: прочитаны адаптер и канон `post-code`, затем последовательно выполнены `rtk proxy yarn.cmd lint` → код 0, 3 предупреждения (два unused vars в `useDashboardScreen.ts`, `import/no-named-as-default-member` в `base.ts`); `rtk proxy yarn.cmd tsc --noEmit` → код 0; `agents:check` → код 0, 136 файлов. `rtk yarn` в этой Windows-сессии не находит программу; использован `yarn.cmd` через RTK proxy.
- Codex: прочитан канон `start-task`; семантическая проба brief `PROBE-4711 rename constant FOO_MS to BAR_MS in one file` → план не нужен (однофайловое атомарное изменение). Это не проверка передачи аргумента через UI. Реальное переименование и EAS build не выполнялись; неявное поведение EAS в новом запросе остаётся непроверенным.
- `src/` не менялся — lint/tsc не требуются
- Независимое ревью не выполнялось

## Handoff Note

- Канон процедур — `ai/skills/<name>/procedure.md`; адаптеры `.claude/skills/` и `.agents/skills/` — только метаданные и указатель, до 10 строк
- Аргументы: Claude — `Arguments: $ARGUMENTS` в 4 адаптерах; Codex — «из сообщения, вызвавшего скилл» (плейсхолдеров в Codex нет)
- `eas-build`, `eas-submit` — ручные: Claude `disable-model-invocation: true`, Codex `agents/openai.yaml` с `policy.allow_implicit_invocation: false`
- Контракт QA: `post-code`, `lint`, `commit`, `implement-plan-step`, `deploy-preflight` и `deployment.md` запускают `agents:check`; в `deploy-preflight` — всегда, без `--strict` до Phase 08
- Claude кэширует тела скиллов на старте сессии — runtime-проверки делать в новой сессии (`claude -p`)
- Headless `claude -p` игнорирует `permissions.allow`: проект не отмечен trusted в Claude — учесть в Phase 07 и 09
- Codex: последовательность QA выполнена, метаданные и канон прочитаны; UI-вызовы, доставка аргументов и отдельный сценарий неявного EAS ещё требуют проверки. Итоговая эквивалентность — Phase 09.
