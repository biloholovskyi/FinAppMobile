# History — multi-agent-rules

## 04.10.2026 — Phase 09 (done)

- Пользователь подтвердил ручную приёмку Phase 09 и поручил закрыть её после выданной инструкции по UI, хукам и девяти новым чатам расширения.
- Подтверждение записано в `acceptance.md` и evidence Phase 09; сырые ручные ответы/скриншоты не приложены. Автоматические журналы и их исторические сбои сохранены.
- Все пункты чек-листа Phase 09 отмечены; статус фазы и индекс — `done`.
- Финальный `rtk proxy yarn.cmd agents:check --strict` → exit 0, 135 файлов. Пробные файлы отсутствуют; diff для `src/`, `app.json`, `eas.json`, `yarn.lock` пустой.
- Осталась только Phase 11: финальная уборка fixture, строгая проверка и оформление завершения. Уроки, расхождения и техдолг уже записаны.
- Версия, CHANGELOG, Git и внешние публикации не менялись; коммит не является условием завершения этого плана.

## 04.10.2026 — Phase 07 (done)

- Пользователь подтвердил выполнение ранее выданных шагов только Phase 07: два новых чата Codex (корень/`src/`) и интерактивный Claude `/context`; поручил закрыть фазу.
- Подтверждение пользователя записано в evidence Phase 07; дословные ответы клиентов и скриншоты не приложены. CLI-журналы предыдущего прогона сохранены.
- Финальный `rtk proxy yarn.cmd agents:check --strict` → exit 0, 135 файлов. Старые ссылки найдены только в ранее отмеченном историческом spec.
- Phase 07 и индекс — `done`; Phase 09/11 остаются `in_progress`. Исходный fixture сохранён для девяти обязательных сценариев расширения.
- Инструкция для оставшейся Phase 09 — `manual-remaining.md`; повторять проверки Phase 07 не требуется.

## 04.10.2026 — Runtime acceptance, Phase 07/09/11 (in_progress)

- Codex CLI расширения `0.160.0`, Claude Code `2.1.288`: свежие автоматизированные сессии, лимит больше не блокирует пробы.
- Read First из корня/`src/`, 9 входов из раздела 4, передача Claude ↔ Codex, фактический `/context` и отказ недоступного обязательного MCP записаны в `runtime-report.md`, `acceptance.md`, `runtime-2026-10-04/`.
- Неуспешные первые запуски сохранены: неполная копия, ephemeral-форк аудитора, TypeScript-снимки evidence. После исправления среды повторы прошли; правила проекта не менялись.
- Обычный hook-probe получил `{}`; доверие хукам и UI ещё не подтверждены. Пошаговая инструкция — `manual-remaining.md`.
- Рабочие исходники, исходный fixture и `package.json` после финального QA проверены по SHA-256: `unchanged: true`. Временные копии удалены после снятия junctions; runner/probe удалены. Исходный fixture сохранён до интерактивной приёмки.
- Статусы 07/09/11 пока не переведены в `done`. Версия, CHANGELOG, Git и внешние публикации не менялись.
- Итоговые lint/tsc/agents PASS (`qa-final.json`); независимое ревью evidence закрыто после исправления инструкции: все 9 новых чатов расширения обязательны по текущему критерию (`review-runtime-acceptance.md`).

## 30.09.2026 — Phase 11 (in_progress)

- План реализован; открыты только ручные шаги в расширении Codex для VS Code и интерактивный `/context` в Claude — `codex-close-phase.md`
- После них: Phase 07, 09 → `done`, отметить последний пункт Phase 11, удалить `fixture-np/`
- Техдолг — раздел «Техдолг» этой фазы; ближайшее — родительские файлы монорепо и `agents:check` в CI
- Коммит изменений — пользователь; CHANGELOG и версия по решению плана не меняются

## 30.09.2026 — Phase 10 (done)

- Аудит закрыт: CRITICAL/HIGH нет, MEDIUM исправлены или приняты с записью
- `agents:check` строгий по умолчанию в `package.json`
- В Reflect: предел read-only в Codex, пути с `\`, незакреплённый `context7`, широкие `rtk yarn:*`/`rtk npx:*`, `frontend-design` условный
- Codex-сценарии Phase 09 — ручные; при расхождениях повторить гейты этой фазы

## 30.09.2026 — Phase 09 (in_progress)

- Claude-паритет подтверждён по всем сценариям; Codex — частично, остальное вручную по `codex-close-phase.md` раздел 4
- Найденные дефекты правил исправлены в этой фазе; Phase 10 перепроверяет их гейтами
- Предел Codex: read-only роли пишут файлы — только инструкция
- Fixture `fixture-np/` удалить после ручной приёмки

## 30.09.2026 — Phase 08 (done)

- Единственная команда проверки — `rtk yarn agents:check --strict`; переходный режим больше не используется
- Раскладка обоих клиентов описана в `tooling.md` «Agent Layout» — единственное место `ai/**`, где упоминаются клиентские каталоги
- Phase 09: сценарии Claude — через `claude -p`; Codex — лимит использования до 20:10, сценарии Codex вручную по `codex-close-phase.md`

## 30.09.2026 — Phase 07 (in_progress)

- Точка входа — `AGENTS.md`; `CLAUDE.md` — `@AGENTS.md` + 6 импортов + Claude-специфика; индексы: `ai/rules/INDEX.md`, `ai/agents/INDEX.md`, `.claude/INDEX.md`, `.codex/README.md`
- Claude теперь грузит 6 правил вместо 19; задачные правила — по таблице и стабам
- `core-rules.md`, `.claude/AGENTS.md`, `.claude/rules/response-rules.md` удалены
- Открыто: Codex-сессии из корня и `src/` видят `AGENTS.md` — ручной шаг
- Phase 08: `tooling.md` Agent Layout, `--strict` в `post-code`/`deploy-preflight`/`post-code-workflow.md`

## 30.09.2026 — Phase 06 (done)

- Git-политика в Codex подтверждена в runtime для прямых форм; `bash -lc`, `git -C`, `git branch <name>` — пределы, второй слой — sandbox (`.git` не пишется)
- Хуки работают из корня и `src/`, но требуют однократного одобрения пользователем в расширении
- Codex read-only роли пишут файлы — полагаться только на инструкцию; учесть в сценарии 6 Phase 09
- `.claude/settings.json`: 152 deny, read-only формы `branch`; Claude-пробы — отказ для мутаций
- Codex-лимит исчерпан до 20:10 30.09.2026 — остальные Codex-проверки ручные

## 30.09.2026 — Phase 01 (done)

- Codex = расширение VS Code; автоматические пробы — `codex exec` его CLI, интерактивные — `codex-close-phase.md`
- Маппинг тиров Codex: FAST `gpt-6-luna/low`, BALANCED `gpt-6-sol/medium`, DEEP `gpt-6-astra/high`
- Claude: FAST `haiku`, BALANCED `sonnet`, DEEP `opus` — в `CLAUDE.md` (Phase 07)
- Хуки Codex требуют однократного одобрения в интерактивной сессии; без него пропускаются молча
- Codex-роль `read-only` не изолирована технически — только инструкция
- Лимит использования Codex исчерпан 30.09.2026 до 20:10 — Codex-сценарии Phase 09 выполняются вручную

## 30.09.2026 — Codex: дополнение Phase 01/06 и предварительные пробы 04/05

- Phase 01 и 06 остаются `in_progress`: свежие desktop-сессии C1–C3, Stop UI, реальный context7 и нативный read-only sandbox не проверены. Phase 04/05 остаются `done` по своим прежним критериям; Phase 07 не запускалась.
- Установленный desktop `26.924.2738.0`, встроенный CLI `0.158.0-alpha.2.1`; CLI текущего расширения VS Code — `0.155.0-alpha.16.3`. Проект trusted, глобального override нет. Подробности и фактическая политика текущей сессии — `research.md`.
- Пробы spawn завершились для FAST `gpt-6-luna/low`, BALANCED `gpt-6-sol/medium`, DEEP `gpt-6-astra/high`; маппинг внесён в README и все 10 TOML. Нативная загрузка TOML этими пробами не подтверждена.
- Канон исследователя дал `src/shared/constants/queryKeys.ts`. Registry-запрос завершился `Received invalid response from npm.` при exit 0; сеть read-only не проверена, package/lock не изменились.
- Последовательность post-code выполнена: lint (0 ошибок, 3 предупреждения), tsc (0), agents:check (0, 136 файлов). Метаданные 14 скиллов проверены, UI `/skills` и `$name` требуют проверки.
- Текущая проба `tmp-hook-probe.txt` не доставила контекст хука; файл удалён, C3-копия не создавалась. Git-решения проверены только через execpolicy; реальные мутации D не выполнялись из-за прямого запрета задачи.
- Продолжение: ручная часть перечислена в Handoff фаз 01/06; после получения runtime evidence решить статусы. Старые записи ниже сохранены как история, более свежие факты приведены в этой записи.

## 30.09.2026 — Phase 06 (in_progress)

- Статус `in_progress`: реализация и статические пробы готовы, runtime в Codex не выполнен — это блокирует `done` по критерию фазы
- Нужна Codex-сессия пользователя (desktop-приложение) из корня, из `src/` и из копии с пробелом в пути: правка временного файла → видно ли напоминание `[post-edit]`; Stop без ошибки формата; хуки могут потребовать одобрения
- CLI `%LOCALAPPDATA%\OpenAI\Codex\bin\f1c7ee7a13db5fed\codex.exe` устарел для модели `gpt-6-astra` — `codex exec` падает с 400; `execpolicy check` и `mcp list` работают
- Не покрыты prefix-правилами: `git -C . commit`, `bash -lc "git commit …"` (офлайн), `git branch <name>` — описано в `.codex/README.md`; то же ограничение в Claude для `git -C`
- `.claude/settings.json`: 152 deny (16 подкоманд + 14 флагов веток × `git`/`rtk git` × Bash/PowerShell), `rtk git branch:*` → read-only формы
- Phase 07 может идти: точки входа не зависят от runtime Codex-хуков, но её собственный Codex-runtime тоже потребует клиента

## 30.09.2026 — Phase 05 (done)

- Канон ролей — `ai/agents/<name>.md`, маршрутизация и матрица — `ai/agents/INDEX.md`; Phase 07 заменяет Agent Routing в `CLAUDE.md` ссылкой туда
- Codex TOML без `model`: после `/model` из Phase 01 добавить `model` по тиру; `model_reasoning_effort` уже задан
- `description` у 4 ролей содержит буквальные `\n<example>…` (двойное экранирование в исходном YAML) — Codex получит их как текст; кандидат на чистку в Reflect
- `memory` в Claude добавляет Write/Edit — запрет правок проверяющих ролей в Claude только инструкцией
- Headless-пробы пишут память агентов — после проб откатывать `.claude/agent-memory/`
- Codex-наблюдения (запуск роли, фактический sandbox) не выполнены

## 30.09.2026 — Phase 04 (done)

- Канон процедур — `ai/skills/<name>/procedure.md`; адаптеры `.claude/skills/` и `.agents/skills/` — только метаданные и указатель, до 10 строк
- Аргументы: Claude — `Arguments: $ARGUMENTS` в 4 адаптерах; Codex — «из сообщения, вызвавшего скилл» (плейсхолдеров в Codex нет)
- `eas-build`, `eas-submit` — ручные: Claude `disable-model-invocation: true`, Codex `agents/openai.yaml` с `policy.allow_implicit_invocation: false`
- Контракт QA: `post-code`, `lint`, `commit`, `implement-plan-step`, `deploy-preflight` и `deployment.md` запускают `agents:check`; в `deploy-preflight` — всегда, без `--strict` до Phase 08
- Claude кэширует тела скиллов на старте сессии — runtime-проверки делать в новой сессии (`claude -p`)
- Headless `claude -p` игнорирует `permissions.allow`: проект не отмечен trusted в Claude — учесть в Phase 07 и 09
- Codex-наблюдения не выполнены: клиент недоступен из этой сессии

## 30.09.2026 — Phase 03 (done)

- `yarn agents:check` — после каждой фазы 04–08; `--strict` обязателен с Phase 08
- Phase 04: новые скиллы проверяются, как только появился канон или `.agents/skills/<name>`; Claude-адаптер обязан ссылаться на `ai/skills/<name>/procedure.md`
- Phase 05: `description` у `finapp-mobile-expert` взять в кавычки — иначе strict падает, а Claude не загружает агента
- Phase 05: `name`/`description` Claude- и Codex-адаптеров сравниваются после декодирования — `name` может быть `"Codebase Researcher"`, но одинаковым в обоих
- Phase 05: модель `codebase-researcher` в Claude — `sonnet`, в `ai-models.md` — FAST; расхождение унаследовано из прежнего `ai-models.md`
- `rtk yarn` не находит `yarn` на машине — затрагивает все команды правил; решение за пользователем (обновить rtk или PATH)
- Пробы строгого режима — Phase 08, по той же схеме на копии полного дерева

## 30.09.2026 — Phase 02 (done)

- Общий контракт — `ai/rules/common/agent-workflow.md`, git — `ai/rules/common/git-policy.md`
- `agent-workflow.md` ссылается на `ai/agents/INDEX.md` и `ai/agents/<name>.md` — появятся в Phase 05; переходный режим `agents:check` не должен считать их ошибкой до Phase 05
- `post-code-workflow.md` вызывает `rtk yarn agents:check` — скрипт и package-скрипт добавляет Phase 03
- Каталог правил — `ai/rules/INDEX.md`; `.claude/AGENTS.md` не переименован (Phase 07)
- Claude-остаток для Phase 07 перечислен в Evidence Note фазы 02
- `CLAUDE.md` не менялся и по-прежнему @-импортирует `core-rules.md` и `ai-models.md`
- Родительский `C:\Projects\FinApp\.claude\rules\mobile.md` тоже грузится в сессию: он маршрутизирует на `finapp-mobile-expert` и `/post-code mobile` — учесть в приёмке Phase 09

## 30.09.2026 — Phase 01 (in_progress)

- Claude-часть окружения и статические файлы Codex записаны в `research.md`
- Открыто: `/status`, `/model`, `context7` в Codex; оболочка хуков и сеть read-only сабагента — к Phase 05–06
