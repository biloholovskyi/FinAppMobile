# Phase 05 — Агенты: канон и адаптеры

- Status: done
- Model tier: BALANCED
- Required rules: `ai/rules/common/ai-models.md`, `ai/rules/common/agent-workflow.md`
- Prerequisites: Phase 01 (маппинг моделей), Phase 03

## Goal

10 ролей имеют один канон с матрицей полномочий в `ai/agents/` и адаптеры в обоих клиентах.

## Implementation Notes

- Тело `.claude/agents/<name>.md` переносится в `ai/agents/<name>.md`; Claude-названия инструментов заменяются нейтральными операциями матрицы
- `finapp-mobile-expert`: `@.claude/rules/post-code.md` → ссылка на `ai/rules/common/post-code-workflow.md`; путь памяти — только в Claude-адаптере
- `ai/agents/INDEX.md`: таблица «тип задачи → роль» (перенос Agent Routing из корневого и проектного `CLAUDE.md`), матрица полномочий, правило «исполнитель и проверяющий — разные запуски»
- `<example>`-блоки остаются в Claude-адаптере; в каноне — «When to use»
- Матрица — таблица ролей `design.md`, сверенная с исходными ролями: `dependency-analyst` остаётся без правок (только диагностика, установка — предложение команды); `full-package-auditor` команд не выполняет, проверочные команды предлагает основному агенту
- `code-reviewer` — единственное намеренное изменение: `tools: Read, Glob, Grep, Bash`, запись отчёта в `.claude/reviews/` убрана, findings возвращаются основному агенту по контракту review-артефактов; формат отчёта остаётся в каноне
- Проверяющие роли в каноне получают список команд без записи: `rtk yarn tsc --noEmit`, `rtk npx eslint src` без `--fix`; `rtk yarn lint` им запрещён
- Проверить, даёт ли Claude `memory: project` запись в память при ограниченных `tools`; запись в память — Claude-исключение, записывается в адаптере
- Codex-адаптер: `developer_instructions` — указатель; `sandbox_mode` — по столбцу матрицы; `model`/`model_reasoning_effort` — из Phase 01; для ролей без команд в каноне явно: shell только для чтения и поиска
- Проверить сетевой доступ `dependency-analyst` в read-only sandbox Codex; при его отсутствии канон направляет сетевые команды основному агенту

## Scope

- `ai/agents/INDEX.md`, `ai/agents/<name>.md` — 10 ролей
- `.claude/agents/<name>.md` — 10 адаптеров (frontmatter без изменений, кроме `tools` у `code-reviewer`, + указатель + путь памяти)
- `.codex/agents/<name>.toml` — 10 адаптеров

## Checklist

- [x] В `ai/agents/**` нет frontmatter, `.claude/`, имён моделей, `@`-импортов
- [x] Матрица полномочий заполнена для всех 10 ролей; в адаптере указано, что ограничено технически, а что инструкцией
- [x] Матрица, канон и оба адаптера каждой роли не противоречат друг другу
- [x] Claude-адаптеры сохраняют `name`, `description`, `tools`, `model`, `color`, `memory`; исключение — `tools` у `code-reviewer`
- [x] Ни один канон не предписывает роли инструмент, которого нет в её Claude `tools`
- [x] Ни один канон проверяющей роли не содержит `rtk yarn lint` и записи отчёта в файл
- [x] Декодированные `description` совпадают между адаптерами

## Verification Commands

- `rtk yarn agents:check`
- `rtk grep -rnE "\.claude/|haiku|sonnet|opus" ai/agents` — пусто
- `rtk grep -rn "yarn lint" ai/agents/{code-reviewer,full-package-auditor,dependency-analyst,plan-auditor,react-performance-reviewer,codebase-researcher}.md` — пусто
- Claude Code: `codebase-researcher` на пробный вопрос читает канон и не выполняет shell; `code-reviewer` на пробном diff возвращает findings и не пишет файлы; `dependency-analyst` не меняет `package.json` и `yarn.lock`
- Codex (предварительное наблюдение, не критерий `done`): `codebase-researcher` запускается, фактический `sandbox_mode` дочернего агента — read-only

## Acceptance Criteria

- Переходная проверка проходит
- Поведение Claude-агентов сохранено, кроме записанного намеренного изменения `code-reviewer`
- Окончательная проверка ролей в обоих клиентах — сценарий 6 Phase 09

## Evidence Note

Выполнено 30.09.2026.

Изменено:
- `ai/agents/INDEX.md` — таблица «задача → роль» (Agent Routing из корневого и проектного `CLAUDE.md`), разделение исполнителя и проверяющего, матрица полномочий
- `ai/agents/<name>.md` — 10 канонов: роль, When to Use, Permissions, правила, инструкции, Report; без frontmatter, `.claude/`, имён моделей, `@`-импортов
- `.claude/agents/<name>.md` — 10 адаптеров: исходный frontmatter + указатель на канон + что ограничено технически, что инструкцией + путь памяти для `memory: project`; `<example>`-блоки `finapp-mobile-expert` сохранены в теле
- `.codex/agents/<name>.toml` — 10 адаптеров: `name`, `description` (декодированно равны Claude), `sandbox_mode` по матрице, `model_reasoning_effort` по тиру (FAST `low`, BALANCED `medium`, DEEP `high`), `developer_instructions` — указатель
- `ai/rules/common/ai-models.md`: `codebase-researcher` → BALANCED — сохраняет фактическое поведение (`model: sonnet` в Claude); прежнее FAST было ошибкой старого `ai-models.md`

Намеренные изменения поведения:
- `code-reviewer`: `tools: Read, Glob, Grep, Bash`; отчёт возвращается основному агенту, запись в `.claude/reviews/` убрана
- `finapp-mobile-expert`: `description` взят в кавычки — агент впервые загружается в Claude; post-code → `ai/rules/common/post-code-workflow.md`
- `screen-designer`: `@.claude/rules/*` → `ai/rules/design/*`; `frontend-design` — «когда клиент его предоставляет»
- `dependency-analyst`: добавлен `rtk yarn info` для реестра, запрет `npm view` и повторов сетевых команд (по результату пробы)

Технические ограничения (документация Claude, 30.09.2026): `memory` автоматически добавляет Read, Write, Edit — у `code-reviewer`, `full-package-auditor`, `dependency-analyst`, `command-runner` запрет правок в Claude обеспечен только инструкцией; это записано в их адаптерах.

Проверки:
- `yarn agents:check` → `passed: 132 files scanned`, код 0
- `grep "\.claude/|haiku|sonnet|opus" ai/agents` — пусто; `---` в `finapp-mobile-expert.md` — разделитель handoff-блока, не frontmatter
- `grep "yarn lint"` по 6 проверяющим канонам — пусто
- Claude runtime (`claude -p`, новая сессия): `codebase-researcher` на вопрос о `QUERY_KEYS` → `src/shared/constants/queryKeys.ts`, канон прочитан, shell не запускался
- `code-reviewer` на пробном diff (текстом, не в дереве) → 8 findings (index key, inline style, hex, kopecks…), файлов не записал; `git status` и `.claude/reviews/` без изменений; отчёт — «возвращается вызывающему»
- `dependency-analyst` на «добавить react-native-mmkv» → вердикт native build + `runtimeVersion`, предложены `rtk npx expo install …`; `package.json`, `yarn.lock` — md5 без изменений. Нарушение: пытался `npm view` и `curl` (все отказаны) → канон ужесточён. Пробные записи памяти откатаны к HEAD
- Новая сессия видит `finapp-mobile-expert` в списке агентов
- Codex (предварительно, дополнено 30.09.2026): generic spawn принял FAST `gpt-6-luna/low`, BALANCED `gpt-6-sol/medium`, DEEP `gpt-6-astra/high`; три агента завершили диагностические задачи. Модели записаны в README и 10 TOML по тирам. Полный desktop `/model` не проверен.
- Codex, CLI расширения VS Code (30.09.2026, `codex exec`): нативная роль `Codebase Researcher` запускается из TOML; `sandbox_mode = "read-only"` не соблюдается — роль создала файл через `apply_patch`, наследуя записываемый sandbox родителя; записано пределом в TOML, `.codex/README.md`, `ai/agents/INDEX.md`
- BALANCED-проба прочитала канон и Codex-адаптер `codebase-researcher`, нашла `QUERY_KEYS` в `src/shared/constants/queryKeys.ts`; правок не делала. FAST-проба запустила `agents:check` (136 файлов, код 0). Это применение инструкций роли в generic spawn; инструмент не предоставляет выбор нативной роли TOML и унаследовал `workspace-write`. Нативный запуск и read-only запрет записи не подтверждены; пробная запись в заведомом workspace-write не выполнялась.
- DEEP-проба прочитала инструкции `dependency-analyst`, выполнила один registry-запрос через Windows-fallback `rtk proxy yarn.cmd info react-native-mmkv versions`: `error Received invalid response from npm.` после автоматических retry Yarn, exit code 0. Версии не получены; сеть read-only этим не проверена, пакет не устанавливался. `package.json` и `yarn.lock` сохранили SHA256 до/после пробы.
- Финальная синтаксическая проверка Python `tomllib` обнаружила повтор `model` в адаптерах, пропущенный `agents:check`; дубли удалены, повторный разбор всех 10 TOML успешен. Для Phase 10: проверить, нужен ли полноценный TOML-парсер в проверке согласованности; текущий проход скрипт не меняет.
- Сеть `dependency-analyst` в read-only sandbox Codex — не проверено; канон направляет сетевые команды основному агенту
- `src/` не менялся — lint/tsc не требуются
- Независимое ревью не выполнялось

## Handoff Note

- Канон ролей — `ai/agents/<name>.md`, маршрутизация и матрица — `ai/agents/INDEX.md`; Phase 07 заменяет Agent Routing в `CLAUDE.md` ссылкой туда
- Codex TOML содержат `model` и effort по подтверждённым spawn-парам; требуется проверка загрузки этих настроек нативным диспетчером ролей целевого клиента.
- `description` у 4 ролей содержит буквальные `\n<example>…` (двойное экранирование в исходном YAML) — Codex получит их как текст; кандидат на чистку в Reflect
- `memory` в Claude добавляет Write/Edit — запрет правок проверяющих ролей в Claude только инструкцией
- Headless-пробы пишут память агентов — после проб откатывать `.claude/agent-memory/`
- Codex: канон исследователя применён и ответ получен; нативная роль, её фактический read-only sandbox и сеть остаются непроверенными. Текущие generic spawn-пробы не являются доказательством enforcement TOML.
