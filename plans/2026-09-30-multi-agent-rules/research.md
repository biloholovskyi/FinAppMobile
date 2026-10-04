# Research — правила для нескольких агентов (Claude Code + Codex)

Дата: 30.09.2026. Только факты, без решений.

## Инвентарь проекта

- `CLAUDE.md` (134 строки) — единственная точка входа; @-импортирует 5 always-loaded правил (`core-rules`, `response-rules`, `patterns`, `token-economy`, `implementation-plans` — вместе 27 026 байт)
- `CLAUDE.md` содержит Claude-only блоки: приоритет инструкций над харнессом, правила плагина superpowers, список `/skills`, список агентов, ссылку на `.claude/settings.json`
- `CLAUDE.md` дублирует таблицу версий из `ai/rules/projects/fin-app-mobile/architecture.md` и таблицу загрузки правил из `ai/rules/common/core-rules.md`
- `ai/rules/` — 43 файла правил; `ai/rules/AGENTS.md` — каталог правил (имя совпадает с файлом инструкций Codex)
- Claude-специфика внутри `ai/rules/` — 67 вхождений в 12 файлах; основная масса в `ai-models.md` (33: алиасы `haiku`/`sonnet`/`opus`, frontmatter `model:`) и `tooling.md` (13: раздел «Claude Layout»)
- `.claude/rules/*.md` — 14 тонких стабов с `paths`-frontmatter, указывают на `ai/rules/**`
- `.claude/skills/` — 14 скиллов; 13 собственных (30–73 строки), `ui-ux-pro-max` — сторонний (377 строк + `data/*.csv` + `scripts/*.py`)
- Во frontmatter скиллов: `model:` (Claude-only); в теле — `$ARGUMENTS` (Claude-only) в 4 скиллах
- `.claude/agents/` — 10 агентов (20–146 строк); frontmatter `tools`, `model`, `color`, `memory: project`; тела содержат роль, маршрутизацию правил и `<example>`-блоки
- `finapp-mobile-expert.md` ссылается на `@.claude/rules/post-code.md` и на абсолютный путь памяти агента
- `.claude/agent-memory/` — память 6 агентов (механизм `memory: project` есть только в Claude Code)
- `.claude/AGENTS.md` — индекс агентов, скиллов и правил (второе имя-двойник файла инструкций)
- `.claude/settings.json` — allow/deny по командам (запрет мутирующих git-команд), плагины, `enabledMcpjsonServers`, хуки `PostToolUse` и `Stop` (echo-напоминания о `/post-code`)
- `.mcp.json` — MCP `context7`
- `.claude/reviews/app-skeleton-spec-review.md` — разовый артефакт ревью
- `.codex/`, `.agents/`, корневой `AGENTS.md` в проекте отсутствуют
- Проект — отдельный git-репозиторий; родитель `C:\Projects\FinApp` не является git-репо, но содержит свои `CLAUDE.md`, `AGENTS.md` и `.claude/`

## Claude Code (официальная документация)

- Проектные инструкции: `./CLAUDE.md` или `./.claude/CLAUDE.md`; загружаются также `CLAUDE.md` всех родительских каталогов
- `AGENTS.md` читается нативно (v2.1.277+) только если нет `CLAUDE.md`/`CLAUDE.local.md` на пути; при наличии `CLAUDE.md` рекомендуемый паттерн — первая строка `@AGENTS.md`, ниже Claude-специфика; повторного чтения не будет
- `@path`-импорты рекурсивны до 4 уровней; пути относительно файла-импортёра; импорты в код-спанах не раскрываются
- Symlink `CLAUDE.md → AGENTS.md` на Windows не рекомендован документацией (git без `core.symlinks` кладёт текстовый файл)
- Рекомендованный размер `CLAUDE.md` — до 200 строк; импорты не экономят контекст
- `.claude/rules/*.md` — единственное поле frontmatter `paths`
- Скиллы: только `.claude/skills/<name>/SKILL.md` (плюс личные/enterprise); `.agents/` Claude Code не читает
- Сабагенты: `.claude/agents/*.md`; поддерживается `memory`
- Жёсткий запрет действий — только через `permissions.deny` или хуки, не через текст инструкций

## Codex (официальная документация)

- Инструкции: `AGENTS.md`; порядок — `~/.codex` (global), затем каждый каталог от git-root до cwd; в каждом каталоге `AGENTS.override.md` → `AGENTS.md` → `project_doc_fallback_filenames`
- Суммарный лимит `project_doc_max_bytes` — 32 KiB по умолчанию; после лимита файлы не добавляются
- `@`-импортов нет: файлы конкатенируются как есть, остальное агент читает сам по указанию
- Скиллы: `.agents/skills/<name>/SKILL.md` от cwd вверх до корня репо, `$HOME/.agents/skills`; frontmatter `name` + `description`; опционально `agents/openai.yaml` (`allow_implicit_invocation`, зависимости MCP); явный вызов — `$skill` или `/skills`
- Прогрессивная загрузка: список скиллов — до 2% контекста, тело `SKILL.md` грузится при выборе
- Сабагенты: `.codex/agents/*.toml`; обязательные `name`, `description`, `developer_instructions`; опциональные ключи `config.toml` (`model`, `model_reasoning_effort`, `sandbox_mode`, `mcp_servers`, `skills.config`)
- Проектный конфиг: `.codex/config.toml` (`[mcp_servers.<id>]`, `project_doc_fallback_filenames`, sandbox/approval)
- Правила исполнения команд: `.codex/rules/*.rules` (Starlark `prefix_rule(pattern, decision = allow|prompt|forbidden, justification, match, not_match)`); при нескольких совпадениях побеждает самое строгое
- Хуки: `.codex/hooks.json` или `[hooks]` в `.codex/config.toml`; события `PreToolUse`, `PostToolUse`, `Stop`
- Все проектные слои `.codex/` (config, hooks, rules) грузятся только в доверенном (trusted) проекте

## Общие практики из сети

- `AGENTS.md` — кросс-инструментальный стандарт; одна SSoT-точка входа, инструмент-специфика — в тонком слое сверху
- Держать `AGENTS.md` коротким (ориентир — до 150 строк): каждый токен грузится в каждый ход
- Конкретные команды и проверяемые правила вместо общих пожеланий
- Процедуры и длинные чек-листы — в скиллы и файлы по требованию, не в точку входа
- Формат `SKILL.md` (`name` + `description` + тело) совместим между Claude Code и Codex; различаются только каталоги обнаружения и дополнительные поля

## Уточнения после ревью Codex (проверено 30.09.2026)

- Codex `PostToolUse`: обычный stdout игнорируется; контекст передаётся JSON `hookSpecificOutput.additionalContext` или `systemMessage`; правки через `apply_patch` матчатся значениями `apply_patch`, `Edit`, `Write`
- Codex `Stop`: при exit 0 ожидается JSON; обычный текст — недопустимый результат; `decision: "block"` продолжает работу агента
- Codex rules управляют запуском команд вне sandbox: `allow` — запуск вне sandbox без вопроса, `prompt`, `forbidden`; совпадение — точный префикс аргументов (`git -C x commit` не совпадает с `["git", "commit"]`); `bash -lc`/`sh -c` разбиваются на команды только для простых скриптов; проверка — `codex execpolicy check --pretty --rules <file> -- <command>` (анализ без выполнения)
- `allow_implicit_invocation: false` в Codex отключает выбор скилла по обычному запросу; явный `$skill` остаётся; аналог в Claude — `disable-model-invocation: true`
- Сабагенты Codex наследуют часть настроек родителя; runtime-настройки родителя могут перекрывать значения роли
- `.claude/settings.json`: разрешён `Bash(rtk git branch:*)` (включает создание и удаление веток); в deny нет `switch`; для PowerShell запрещены только `commit`, `push`, `add`
- Установленный Claude Code — `2.1.251`: нативного чтения `AGENTS.md` (нужна `2.1.277+`) нет, импорт `@AGENTS.md` обязателен
- Codex CLI отсутствует в `PATH` Git Bash на машине исполнителя; способ запуска Codex фиксируется в Phase 01
- Claude загружает `CLAUDE.md` всех родительских каталогов: `C:\Projects\FinApp\CLAUDE.md` (180 строк, таблица Agent Routing) попадает в каждую сессию мобильного проекта
- `C:\Projects\FinApp\AGENTS.md` устарел: Expo SDK 52, React 18.3, Expo Router v3; Codex, запущенный из git-root мобильного проекта, его не читает, но запуск из `C:\Projects\FinApp` — прочитает

## Окружение (Phase 01)

Первичная проверка — 30.09.2026 из Claude Code. Ниже учтены дополнительные пробы из текущей Codex-сессии той же даты. Проверки интерфейса и свежих desktop-сессий остаются за пользователем.

Версии и запуск:
- Claude Code — `2.1.251`, запуск через VS Code extension; оболочки — PowerShell 5.1 и Git Bash
- Установленный desktop-пакет `OpenAI.Codex` — `26.924.2738.0` по `Get-AppxPackage`; его `app/resources/codex.exe --version` → `codex-cli 0.158.0-alpha.2.1`. Значение `BROWSER_USE_CODEX_APP_VERSION` из старого конфига не использовалось как версия установленного приложения.
- CLI в PATH и путь процесса текущего Codex относятся к расширению VS Code `openai.chatgpt-26.917.62051-win32-x64`; `codex --version` → `codex-cli 0.155.0-alpha.16.3`. Версии получены с кодом 0, с предупреждением об отказе доступа при обслуживании временных alias/arg0-каталогов. Это не проверка desktop `/status`.
- Текущая сессия: cwd `C:\Projects\FinApp\fin-app-mobile`, PowerShell, `workspace-write`, сеть restricted, approval reviewer `auto_review` — из контекста исполнения. Проектный `approval_policy = "on-request"` описывает конфигурацию, а не фактическую политику этой управляемой сессии. Текущая модель в desktop `/status` не проверена.

cwd и git-root:
- git-root — `C:/Projects/FinApp/fin-app-mobile`; из `src/` git-root тот же; `C:\Projects\FinApp` — не git-репо
- В `src/` нет `CLAUDE.md`, `AGENTS.md`, `AGENTS.override.md`
- Claude из `src/`: грузит `CLAUDE.md` по цепочке вверх — проектный и родительский `C:\Projects\FinApp\CLAUDE.md`
- Codex из `src/`: по документации читает `AGENTS.md` от git-root до cwd — проектный корень и `src/`; родительский `C:\Projects\FinApp\AGENTS.md` (163 строки, устаревший) не читается. Фактическое поведение — не проверено

Загруженные инструкции Claude (по системному контексту сессии; `/context` недоступен из агента):
- Родительский `C:\Projects\FinApp\CLAUDE.md` (180 строк, таблица Agent Routing на агентов, которых в проекте нет: `finapp-backend-expert`, `project-manager`, `page-designer`)
- Проектный `CLAUDE.md`; раскрываются ВСЕ `@ai/...`-пути, включая таблицу «Load Rules By Task» — 19 файлов, 104 689 байт, а не 5 always-loaded
- `.claude/rules/response-rules.md` — единственный стаб без `paths`, грузится всегда
- Пользовательского `CLAUDE.md` нет; модель по умолчанию в пользовательских настройках — `opus`
- Агенты и скиллы берутся только из проектного `.claude/`: родительские `.claude/agents` (`finapp-backend-expert`, `project-manager` и др.) и `.claude/skills` (`build`, `db-migrate`, `test`) в сессии отсутствуют
- Из 10 проектных агентов в сессии доступны 9: `finapp-mobile-expert` не загружается — в его `description` без кавычек стоит `fin-app-mobile: new`, что делает YAML-frontmatter невалидным

Загруженные инструкции Codex:
- Глобальный `~/.codex/AGENTS.md` есть — 179 строк, инструкции RTK (префикс `rtk`, в примерах — `rtk git add/commit/push`)
- `AGENTS.override.md` в проекте и в `src/` нет; проверка существования глобального `~/.codex/AGENTS.override.md` → `False`.
- В текущих инструкциях присутствует RTK-текст глобального `AGENTS.md`; проектного корневого `AGENTS.md` пока нет. Точный список файлов, автоматически прочитанных загрузчиком, и его поведение в новой сессии из `src/` — не проверено; ручное чтение файлов не является таким доказательством.

Плагины и внешние навыки:
- Claude (`.claude/settings.json`): `superpowers`, `context7`, `skill-creator` из `claude-plugins-official`
- Codex (`~/.codex/config.toml`): `superpowers`, `context7`, `skill-creator` из `claude-plugins-official`; `documents`, `spreadsheets`, `presentations`, `pdf`, `browser` от OpenAI; хук `session_start` плагина superpowers отмечен trusted
- Личные навыки Codex в `~/.codex/skills` — состав не проверен; `~/.agents/skills` отсутствует

Модели и тиры:
- Claude (фактически доступны в аккаунте): Haiku 4.5, Sonnet 5, Opus 5.5, Fable 5.1
- Маппинг Claude: FAST — `haiku` (Haiku 4.5), BALANCED — `sonnet` (Sonnet 5), DEEP — `opus` (Opus 5.5)
- `ai/rules/common/ai-models.md` указывает Sonnet 4.6 и Opus 4.8 — снимок устарел
- Codex: инструмент запуска принял три пары и соответствующие сабагенты завершили реальные диагностические задачи: FAST — `gpt-6-luna` / `low`, BALANCED — `gpt-6-sol` / `medium`, DEEP — `gpt-6-astra` / `high`. Маппинг записан в `.codex/README.md` и все 10 TOML ролей. Это проверка доступных параметров запуска в текущей сессии; полный список desktop `/model` и применение TOML нативным диспетчером ролей не проверены.

Trust и MCP:
- Codex: `C:\Projects\FinApp\fin-app-mobile` — `trust_level = "trusted"`; родитель `C:\Projects\FinApp` в списке trusted отсутствует
- Claude: MCP `context7` из `.mcp.json` (`npx -y @upstash/context7-mcp`), включён через `enabledMcpjsonServers`; в сессии также доступен как плагинный MCP
- Codex: проектный `[mcp_servers.context7]` уже добавлен в Phase 06; `rtk proxy codex mcp list` → `context7 … enabled`, Auth `Unsupported`. В наборе callable tools текущей сессии context7 отсутствует; реальный запрос документации `expo-router` не выполнен. Нужна новая сессия с доступным MCP, наличие записи в CLI не доказывает работоспособность.
- Codex на Windows: `[windows] sandbox = "unelevated"`

Хуки и сабагенты Codex:
- Оболочка исполнения hook-команд и cwd хука при сессии из `src/` — не проверено: нужен пробный хук в trusted-сессии (Phase 06)
- Сеть у дочернего агента с `sandbox_mode = "read-only"` — не проверено. Доступный `collaboration.spawn_agent` не выбирает нативную роль из TOML и не принимает sandbox; пробные агенты унаследовали `workspace-write`. Попытка записи в таком агенте не проверяла бы запрет read-only, поэтому не выполнялась.
- Проба реестра в унаследованном sandbox: `rtk yarn info react-native-mmkv versions` не нашёл программу; Windows-fallback `rtk proxy yarn.cmd info react-native-mmkv versions` завершился с `error Received invalid response from npm.` после автоматических retry Yarn, хотя exit code — 0. Данных версий нет; причина не установлена, доступность сети read-only этим не подтверждена. `package.json` и `yarn.lock` не менялись относительно снимка до пробы.

Предварительные скиллы и уборка:
- В каталоге текущей сессии доступны 12 проектных скиллов, включая `post-code` и `start-task`, и плагины superpowers/skill-creator. На диске — 14 адаптеров; `eas-build` и `eas-submit` имеют `allow_implicit_invocation: false`. Видимость всех 14 в desktop `/skills` требует отдельной проверки.
- Прочитаны адаптер и канон `post-code`; последовательно выполнены `rtk proxy yarn.cmd lint` (0 ошибок, 3 предупреждения), `rtk proxy yarn.cmd tsc --noEmit` (код 0), `rtk proxy yarn.cmd agents:check` (136 файлов, код 0). Для пробного brief PROBE-4711 применено правило `start-task`: однофайловое переименование не требует плана; фактическая передача через UI `$start-task` не проверена.
- `tmp-hook-probe.txt` создан инструментом правки и удалён. В существующей сессии дополнительный контекст хука не поступил; это не свежая C1 и не доказательство неисправности хука. C2/C3 не выполнялись, копия C3 не создавалась. `git status` не показывает изменений `src/`; пробных артефактов не осталось.

Runtime Codex через CLI расширения VS Code (`~/.vscode/extensions/openai.chatgpt-26.917.62051-win32-x64/bin/windows-x86_64/codex.exe`, `0.155.0-alpha.16.3`, `codex exec`), 30.09.2026 — целевой клиент Codex для этого проекта; desktop-приложение не используется:
- Хуки проекта без сохранённого доверия пропускаются молча: в обычном `exec` напоминание не пришло. С разовым `--dangerously-bypass-hook-trust` (скрипты проверены, доверие не сохраняется) напоминание `[post-edit] …` дословно дошло из корня и из `src/`; ход завершился кодом 0, `Stop` не вызвал продолжения и ошибки формата
- Копия в пути с пробелом (`%TEMP%\…\fin app probe`, затем `C:\Temp\fin app probe`, trust через `-c`): `apply_patch` → `Failed to write file` — sandbox не пишет в ненастроенный каталог, хук не срабатывает без успешной правки. Команда хука в пути с пробелом проверена локально (bash, PowerShell, cmd)
- Git-правила в runtime (безвредные формы): `git commit --dry-run -m probe`, `rtk git switch zz-probe-nonexistent`, `git branch -D zz-probe-nonexistent` → BLOCKED с текстом `justification`; `git status --short` → выполнено; `bash -lc "git commit --dry-run …"` → выполнено, bash не стартовал (Win32 error 5); `git -C . commit --dry-run …` → выполнено, sandbox отказал в `.git/index.lock`. HEAD не изменился
- `$start-task PROBE-4711 …` → скилл `start-task`, прочитан `ai/skills/start-task/procedure.md`, аргумент дошёл дословно, «план не нужен»
- Обычный запрос «запусти production EAS build» → `eas-build` не выбран неявно; агент предложил делегировать `eas-deployer`
- Нативная роль `Codebase Researcher` запускается из TOML. Её `sandbox_mode = "read-only"` не соблюдается: `tmp-ro-probe.txt` создан через `apply_patch` и с `-s workspace-write`, и без `-s` — роль наследует записываемый sandbox родителя. Поиск `QUERY_KEYS` дочерней ролью вернул пустой вывод (причина не установлена)
- MCP `context7`: `resolve-library-id` вернул `/websites/expo_dev`, `/expo/expo` и др.; запрос документации завершился; затем аккаунт Codex упёрся в лимит использования («try again at 8:10 PM») — дальнейшие Codex-пробы в этот день невозможны
- Загрузчик инструкций Codex: модель отказывается раскрывать пути файлов инструкций («AGENTS.md instruction block without a file path») — список загруженных `AGENTS.md` проверяется только косвенно, по поведению

## Источники (дата проверки 30.09.2026)

- Claude Code memory и AGENTS.md — https://code.claude.com/docs/en/memory
- Claude Code skills — https://code.claude.com/docs/en/skills
- Codex AGENTS.md — https://learn.chatgpt.com/docs/agent-configuration/agents-md
- Codex skills — https://learn.chatgpt.com/docs/build-skills
- Codex subagents — https://learn.chatgpt.com/docs/agent-configuration/subagents
- Codex advanced config — https://learn.chatgpt.com/docs/config-file/config-advanced
- Codex hooks — https://learn.chatgpt.com/docs/hooks
- Codex rules — https://learn.chatgpt.com/docs/agent-configuration/rules
- Механизмы меняются между версиями клиентов: факты действительны для версий, зафиксированных в Phase 01

## Runtime дополнение — 04.10.2026

- Актуальное расширение: `openai.chatgpt-26.930.41038-win32-x64`; встроенный Codex CLI `0.160.0`; Claude Code `2.1.288`. Старый CLI-путь из записи 30.09.2026 заменён в новой инструкции `manual-remaining.md`.
- Свежие Codex-сессии видят все 10 проектных ролей; Code Reviewer реально запущен без изменения файлов; независимый Plan Auditor выполнил аудит временного плана после повтора без `--ephemeral`.
- Физически присутствуют 14 `.agents/skills/*/SKILL.md`. Модельный список `/context` Claude содержит 12 проектных скиллов, без двух explicit-only EAS-сценариев. Отображение `$` и полного меню ручных команд не наблюдалось.
- Нативная команда Claude `/context` доступна через `claude -p`: восемь проектных memory-файлов (две точки входа + шесть импортов), по одному разу; заранее нет `architecture.md`. Доказательство: `runtime-2026-10-04/claude-context.jsonl`.
- Обычный hook-probe Codex без обхода доверия получил `{}`; дополнительное напоминание не доставлено, файл удалён. Постоянное доверие и picker моделей — интерактивные пункты.
- Claude CLI продолжает сообщать, что проект не trusted и локальные allow-правила игнорируются; в пробах разрешения задавались для конкретного запуска. Постоянный trust не изменялся.
- Автоматизированные результаты, реальные сбои и повторы — `runtime-report.md`; меню/окна расширения не выдаются за проверенные CLI-функции.

## Ручное подтверждение — 04.10.2026

Ручное подтверждение окружения 04.10.2026: после инструкции по трём моделям, 14 проектным скиллам, ручным EAS-командам Claude и хукам пользователь подтвердил ручную проверку Phase 09 и поручил закрыть её. Это подтверждение пользователя, без приложенных снимков интерфейса, перечисления уровней рассуждений или дословного вывода. Предыдущие автоматические наблюдения сохранены как история; UI-проверки исполнителем не заявляются. Phase 09 — `done`, остаётся финальное оформление Phase 11.

## Ограничения

- Мутирующие git-команды выполняет только пользователь; в Claude запрет обеспечен `settings.json`
- Тест-раннера нет; гейты — `rtk yarn lint`, `rtk yarn tsc --noEmit`
- Пакетный менеджер — `yarn`; команды с префиксом `rtk`
- Изменения не затрагивают `src/`, `app.json`, `eas.json` — нативной сборки не требуют

## Открытые вопросы (закрываются в фазах)

- Версии клиентов, доступные модели, trust, фактически загруженные инструкции — Phase 01
- Разрешение относительных путей в `ui-ux-pro-max` (`scripts/*.py`, `data/*.csv`) после переноса — Phase 04
- Поддерживает ли тело `SKILL.md` Codex аргументы вызова — Phase 04
- Формат JSON для Codex `Stop`, не вызывающий продолжения, — Phase 06
