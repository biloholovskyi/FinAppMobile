# Phase 06 — Codex-конфигурация, git-политика и хуки

- Status: done
- Model tier: BALANCED
- Required rules: `ai/rules/common/git-policy.md`, `ai/rules/common/tooling.md`, `ai/rules/common/deployment.md`
- Prerequisites: Phase 01 (trusted-проект, доступный клиент), Phase 02, Phase 05

## Goal

Codex в trusted-проекте исполняет общую git-политику, получает MCP и корректно доставляет напоминания; Claude-запреты доведены до той же политики.

## Implementation Notes

- Синтаксис сверяется с документацией Codex на дату фазы (rules, hooks, config)
- `git.rules`: `forbidden` для каждой запрещённой подкоманды `git-policy.md` в формах `["git", …]` и `["rtk", "git", …]`, с `justification`, `match`, `not_match`; правил `allow` нет
- Хуки: `.codex/hooks/post-edit.mjs` печатает JSON с `hookSpecificOutput.additionalContext`; `.codex/hooks/stop.mjs` печатает валидный JSON без `decision: "block"`, текст — в `systemMessage`; хуки не пишут файлы и не выполняют внешних действий
- Команда хука находит скрипт от git-root (`git rev-parse --show-toplevel`), а не от cwd сессии; без абсолютных путей машины; кавычки выдерживают пробел в пути; форма команды — под оболочку исполнения хуков Codex на Windows из Phase 01. Если одна форма не работает во всех поддерживаемых оболочках — отдельная Windows-команда
- Префикс `rtk` к hook-командам не применяется (конфигурация клиента, а не shell-команда агента); исключение описано в `.codex/README.md`
- Claude-паритет в `.claude/settings.json`: `switch` и PowerShell-формы всех запрещённых подкоманд добавлены в `deny`; `rtk git branch:*` в `allow` заменён read-only формами
- Пределы технического запрета (`git -C`, обёртки) описываются в `.codex/README.md` и `git-policy.md`, а не выдаются за полное покрытие

## Scope

- `.codex/config.toml` — `[mcp_servers.context7]`, sandbox и approval по умолчанию
- `.codex/rules/git.rules`, `.codex/hooks.json`, `.codex/hooks/post-edit.mjs`, `.codex/hooks/stop.mjs`
- `.codex/README.md` — маппинг тиров, вызов скиллов (`$name`, `/skills`), trust, ограничения запретов, асимметрия «Read first»
- `.claude/settings.json` — `permissions` по `git-policy.md`

## Checklist

- [x] Запрещённые подкоманды совпадают в `git-policy.md`, `git.rules`, `.claude/settings.json`
- [x] Каждое `prefix_rule` содержит `match`-примеры
- [x] Хуки проверены на временном файле, не на файлах проекта
- [x] Путь скрипта хука не зависит от cwd; абсолютных путей машины в `hooks.json` нет

## Verification Commands

- `rtk yarn agents:check`
- `codex execpolicy check --pretty --rules .codex/rules/git.rules -- git commit -m x` → forbidden; то же для `rtk git commit`, `git switch main`, `git branch -D x`; `git status`, `git diff` → не forbidden
- `codex execpolicy check` для `git -C . commit` и `bash -lc "git commit -m x"` — результат записан как есть
- Codex, свежие сессии из корня проекта, из `src/` и из временной копии с пробелом в пути: правка временного файла — напоминание фактически видно агенту, ошибок запуска хука нет; `Stop` завершается без ошибки формата и без продолжения
- Codex: `/mcp` показывает `context7`
- Claude: пробы решений `permissions` для `rtk git switch`, PowerShell `git reset` — отказ; `rtk git status` — разрешено. Реальные мутации не выполняются

## Acceptance Criteria

- Все пробы дают ожидаемые решения либо непокрытые формы задокументированы как пределы
- Недоступный Codex-клиент — фаза не закрывается как `done`, runtime-пункты помечаются «не проверено»

## Evidence Note

Первый проход, 30.09.2026 (runtime Codex — в разделе «Закрытие» ниже).

Изменено:
- `.codex/config.toml` — `approval_policy = "on-request"`, `sandbox_mode = "workspace-write"`, `[mcp_servers.context7]`
- `.codex/rules/git.rules` — 4 `prefix_rule` с `decision = "forbidden"`, `justification`, `match`, `not_match`: 16 подкоманд и 14 флагов изменения веток, для `git` и `rtk git`; правил `allow` нет
- `.codex/hooks.json`, `.codex/hooks/post-edit.mjs` (`hookSpecificOutput.additionalContext`), `.codex/hooks/stop.mjs` (`systemMessage` без `decision`); скрипты не пишут файлов
- `.codex/README.md` — trust, асимметрия «Read first», вызов скиллов, sandbox ролей, тиры (только effort), пределы запретов, хуки, MCP
- `.claude/settings.json` — deny: `switch` и флаги веток; PowerShell-формы всех 16 подкоманд для `git` и `rtk git` (152 записи); allow: `rtk git branch:*` → `branch`, `branch --list:*`, `branch -a`, `branch -v`, + `rev-parse:*`
- `ai/rules/common/git-policy.md` — предел: `git branch <name>` не отличим от чтения по префиксу

Синтаксис сверен с документацией (30.09.2026): https://learn.chatgpt.com/docs/agent-configuration/rules, https://learn.chatgpt.com/docs/hooks. Stop без продолжения — JSON без поля `decision` (закрывает открытый вопрос `research.md`); для PostToolUse обычный stdout игнорируется.

Проверки:
- `yarn agents:check` → `passed: 136 files scanned`, код 0; `npx eslint .codex/hooks/*.mjs` — чисто
- Списки запрещённых подкоманд в `git-policy.md`, `git.rules`, `settings.json` совпадают — по 16
- `codex execpolicy check --pretty --rules .codex/rules/git.rules`: `git commit -m x`, `rtk git commit -m x`, `git switch main`, `git branch -D x` → `forbidden`; `git status`, `git diff`, `git branch` → `matchedRules: []`; файл правил загрузился — примеры `match`/`not_match` валидны
- Как есть: `git -C . commit -m x`, `bash -lc 'git commit -m x'`, `git branch newbranch` → `matchedRules: []` — записаны пределами в `.codex/README.md` и `git-policy.md`
- `codex mcp list` из корня → `context7  npx  -y @upstash/context7-mcp  enabled`
- Hook-команда локально: bash из корня, из `src/`, из scratch-репозитория с пробелом в пути (`with space/repo/sub dir`); PowerShell из `src/`; `cmd /c` из `src/` (код 0) — во всех случаях валидный JSON
- Claude: `rtk git switch zz-probe-nonexistent-branch` → отказ `permissions`; PowerShell `git reset --soft HEAD` → отказ; `rtk git status`, `rtk git branch` → выполнены
- Не проверено — Codex runtime: `codex exec` падает с `400 … 'gpt-6-astra' model requires a newer version of Codex` — CLI из `%LOCALAPPDATA%\OpenAI\Codex\bin\f1c7ee7a13db5fed\` старее desktop-приложения. Видимость напоминания агенту, Stop без ошибки формата, сессии из `src/` и из пути с пробелом — за пользователем
- Не проверено: оболочка исполнения хуков Codex на Windows (Phase 01) — команда подобрана работать в cmd, PowerShell и bash
- Независимое ревью не выполнялось

### Дополнение из Codex — 30.09.2026

- Установленный desktop `26.924.2738.0` содержит CLI `0.158.0-alpha.2.1`; текущий PATH/process относится к расширению VS Code с CLI `0.155.0-alpha.16.3`. Старый CLI из предыдущей проверки не является единственным доступным бинарём. Запуск нового CLI не заменяет требуемые свежие desktop-сессии.
- C: в текущей существующей сессии через `apply_patch` создан и затем удалён `tmp-hook-probe.txt` со словом `probe`. Ответ инструмента — `{}`, дополнительного контекста `[post-edit]` агент не получил. Запрос одобрения хуков агенту не поступал; состояние UI неизвестно. Это предварительное наблюдение, не C1. C2/C3, UI Stop и реальная оболочка hook runner — не проверены: управление desktop-сессиями и их UI здесь недоступно.
- D: выполнен только безопасный `rtk proxy codex execpolicy check --pretty --rules .codex/rules/git.rules -- <проверяемая команда>`. `git commit -m probe`, `rtk git switch zz-probe-nonexistent`, `git branch -D zz-probe-nonexistent` → `"decision": "forbidden"`; `git status`, `bash -lc 'git commit -m probe'`, `git -C . commit -m probe` → `"matchedRules": []`. Реальный `rtk git status --short` выполнен, код 0. Это решения статического анализатора, не отказы runtime.
- Блок D в `codex-close-phase.md` содержит конфликт с общим условием «Мутирующие git-команды не выполнять»: особенно пункты 5/6 могут сделать настоящий commit. Их не запускали. Для runtime-проверки требуется поддерживаемая клиентом проверка решения без выполнения либо отдельно согласованный одноразовый репозиторий; не исполнять эти команды в рабочем проекте ради диагностики.
- B: README и 10 TOML теперь содержат модели, подтверждённые пробами spawn (FAST `gpt-6-luna/low`, BALANCED `gpt-6-sol/medium`, DEEP `gpt-6-astra/high`). Нативная загрузка ролей пока не проверена.
- F: временный файл удалён; C3-копия не создавалась; сабагенты файлов не записывали. `src/` без изменений по `git status`, package/lock без изменений относительно снимка до проб. `rtk proxy yarn.cmd agents:check` → 136 файлов, код 0.

### Закрытие — 30.09.2026, Codex runtime через CLI расширения VS Code

- C1 (корень): без сохранённого доверия хуки пропущены молча. С разовым `--dangerously-bypass-hook-trust` (оба скрипта проверены, доверие не сохраняется) агент дословно процитировал `[post-edit] Files changed. Before reporting the work as done, run the sequence from ai/rules/common/post-code-workflow.md: …`; ход завершился кодом 0, без продолжения и ошибки формата `Stop`
- C2 (`-C src`): файл создан в `src/`, напоминание получено (пересказано моделью); ошибок хука нет
- C3 (путь с пробелом, trust через `-c`): `apply_patch` → `Failed to write file` в `%TEMP%` и в `C:\Temp` — sandbox Codex не пишет в ненастроенные каталоги, без правки хук не вызывается. Путь с пробелом покрыт локальным запуском команды хука в bash, PowerShell, cmd. Копия удалена
- D runtime (безвредные формы): `git commit --dry-run -m probe` → BLOCKED «Git mutations belong to the user (ai/rules/common/git-policy.md). Report the needed change and stop.»; `rtk git switch zz-probe-nonexistent` → BLOCKED, тот же текст; `git branch -D zz-probe-nonexistent` → BLOCKED «Creating, renaming or deleting branches is a user action …»; `git status --short` → EXECUTED 0; `bash -lc "git commit --dry-run -m probe"` → EXECUTED 1 (bash: Win32 error 5); `git -C . commit --dry-run -m probe` → EXECUTED 1 (`.git/index.lock`: Permission denied). HEAD не изменился; пределы записаны в `.codex/README.md`
- MCP: `context7` вызван из Codex-сессии, `resolve-library-id` вернул библиотеки Expo
- Найдено: роль с `sandbox_mode = "read-only"` создала `tmp-ro-probe.txt` (с `-s workspace-write` и без) — наследует sandbox родителя. Исправлены формулировки в 6 read-only TOML, `.codex/README.md`, `ai/agents/INDEX.md`: запрет записи — только инструкция
- Одобрение хуков в интерактивной сессии расширения — однократное действие пользователя, вынесено в `codex-close-phase.md`
- Временные файлы удалены; `src/`, `package.json`, `yarn.lock` не изменены; `yarn agents:check` — 136 файлов, код 0

Поправка Phase 10: после Phase 09/10 в `.claude/settings.json` 228 deny (добавлены 16 мутаций и 14 флагов веток через `rtk proxy git` для Bash и PowerShell), в `.codex/rules/git.rules` — 6 `prefix_rule` (добавлены `rtk proxy git` мутации и флаги веток); счётчики «152» и «4» выше относятся к состоянию на конец фазы 06

## Handoff Note

- Git-политика в Codex подтверждена в runtime для прямых форм; `bash -lc`, `git -C`, `git branch <name>` — пределы, второй слой — sandbox (`.git` не пишется)
- Хуки работают из корня и `src/`, но требуют однократного одобрения пользователем в расширении
- Codex read-only роли пишут файлы — полагаться только на инструкцию; учесть в сценарии 6 Phase 09
- `.claude/settings.json`: 152 deny, read-only формы `branch`; Claude-пробы — отказ для мутаций
- Codex-лимит исчерпан до 20:10 30.09.2026 — остальные Codex-проверки ручные

## Обычная CLI-проба — 04.10.2026 (до ручного подтверждения)

Последующая ручная проверка: пользователь подтвердил всю Phase 09 после инструкции по доверенным хукам из корня и `src/`, PostToolUse и Stop и поручил закрыть Phase 09. Это принято как подтверждение ручной части; место одобрения и дословный контекст хуков не приложены, исполнителем UI не наблюдался. Предыдущая CLI-проба ниже остаётся историческим фактом. Evidence закрытия — `phase-09-behavior-acceptance.md`, `acceptance.md`. Новых изменений конфигурации или trust исполнителем не выполнялось.

Codex CLI `0.160.0`, без обхода доверия: `apply_patch` создал `tmp-hook-probe.txt`, агент ответил «После правки инструмент вернул дословно: `{}`. Другого дополнительного контекста не поступило». Evidence: `runtime-2026-10-04/hook-probe.jsonl`, `.summary.json`. Пробный файл удалён. Это подтверждает отсутствие доставки в текущей обычной сессии; постоянное доверие и PostToolUse/Stop в расширении ещё должен проверить пользователь по `manual-remaining.md`. Доверие автоматически не записывалось.
