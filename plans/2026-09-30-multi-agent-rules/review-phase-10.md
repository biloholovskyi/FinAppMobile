# Review — Phase 10 (audit and hardening)

Дата: 30.09.2026. Проверяющие — отдельные запуски: `plan-auditor` (полнота переноса, дубли, смешение слоёв, дрейф плана) и `code-reviewer` (`scripts/check-agent-config.mjs`, хуки, git-запреты, `.codex/config.toml`). Роли файлов не писали; отчёт сохранён основным агентом по `ai/rules/common/agent-workflow.md`.

## Plan Auditor — 0 CRITICAL, 0 HIGH, 4 MEDIUM, 7 LOW

- M1, исправлено: `command-runner` и `eas-deployer` незаписанно расширили git-границу до «чтение разрешено» — восстановлены исходные «Never run git commands» и «No git operations, ever»
- M2, исправлено: из `ai-models.md` выпали нейтральные правила (repro и логи до эскалации, чанки логов, механические правки, загрузка только нужных секций, чувствительность продакшн-трафика, анти-паттерн о различии доступности моделей) — возвращены; Claude-практики (`sonnet` по умолчанию, `opus` при застревании, `haiku` для извлечения, `[1m]`, закреплённые имена, снимки и ревизия раз в 30 дней) — в `CLAUDE.md` Model Tiers
- M3, исправлено: клиент-специфика в `ai/**` вне Agent Layout — `paths`-frontmatter в `ai/rules/design/{design-system,charts}.md` удалён (гейтинг — стабы `.claude/rules/`); фраза о пробелах клиентов в `ai/agents/INDEX.md` удалена (есть в `CLAUDE.md` и `.codex/README.md`); `implementation-plans.md` и `commit-message-and-crosslinks.md` ссылаются на Agent Layout вместо путей клиентов
- M4, исправлено: напоминания хуков Claude и Codex приведены к контракту QA (`agents:check --strict`); `package.json` `agents:check` — строгий по умолчанию
- L1, исправлено: `rtk proxy git` — в Claude запрещены только мутации (чтение проходит, проверено), в Codex добавлено правило флагов веток через `rtk proxy`; `git-policy.md` упоминает `rtk proxy` и read-формы `branch -a`, `branch -v`
- L2, исправлено: устаревшие счётчики в evidence фаз 06/07 — поправка в их Evidence Note
- L3, исправлено: матрица `dependency-analyst` дополнена `yarn info`
- L4, исправлено: процедура `commit` ссылается на `git-policy.md` вместо списка из 4 команд
- L5, принято: `frontend-design` — «когда клиент его предоставляет» — намеренно, по правилу отсутствующей возможности `agent-workflow.md`; в Codex такого навыка нет
- L6, исправлено: `.gitignore` — `ai/skills/**/__pycache__/`
- L7, исправлено: `.codex/README.md` ссылается на Technical Limits `git-policy.md`; процедура `post-code` ссылается на чек-лист `post-code-workflow.md`

## Code Reviewer — 1 HIGH, 3 MEDIUM, 3 LOW

- HIGH, исправлено: пустой `>`-блок во frontmatter ронял проверку (`reduce` без начального значения, `TypeError` мимо `UnsupportedSyntaxError`) — теперь нарушение `empty block scalar`; проверено пробой на копии дерева (код 1, сообщение о дефекте), baseline — код 0
- MEDIUM, исправлено: `PENDING_TARGETS` сравнивались без нормализации слэша; толерантность ко всему `.codex/` сужена до `.codex/agents/` и `.codex/README.md`. Переходный режим больше не используется — строгий по умолчанию
- MEDIUM, принято как предел: `sandbox_mode = "workspace-write"` в `.codex/config.toml` делает read-only роли Codex изолированными только инструкцией — записано в `.codex/README.md`; более строгий дефолт ломает роли-исполнители
- LOW, в Reflect: пути с `\` в документации разрешаются по-разному на Windows и Linux
- LOW, в Reflect: `npx -y @upstash/context7-mcp` без закреплённой версии (так же в `.mcp.json`)
- LOW, в Reflect: широкие `rtk yarn:*`/`rtk npx:*` в allow — будущий package-скрипт с git обойдёт deny
- Без замечаний: хуки (нет записи файлов, секретов, инъекции; формат вывода соответствует документации Codex); совпадение git-запретов в `git-policy.md`, `git.rules`, `settings.json`