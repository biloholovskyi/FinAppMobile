# Acceptance — поведенческая приёмка (Phase 09)

Дата: 30.09.2026. Клиенты: Claude Code `2.1.251` (новые сессии `claude -p`, модель `sonnet`); Codex — расширение VS Code, встроенный CLI `0.155.0-alpha.16.3` (`codex exec`).

Исходное состояние Claude-сценариев 1–4, 6a, 7, 8: копия проекта в scratch (без `.git`-истории, `node_modules` — junction на рабочий), одинаковая для всех запусков. Родительский `C:\Projects\FinApp\CLAUDE.md` в копии не загружается. Сценарии 5, 6, 9, 10 — в рабочем проекте только с неизменяющими или безвредными пробами.

Статусы: `пройдено`, `частично` (отклонение записано), `не проверено` (с причиной), `исправлено` (дефект найден, правило изменено, сценарий повторён).

Codex: 30.09.2026 аккаунт Codex исчерпал лимит использования («try again at 8:10 PM»). Codex-сценарии, не выполненные до лимита, — ручные шаги в [codex-close-phase.md](plans/2026-09-30-multi-agent-rules/codex-close-phase.md).

Повтор 04.10.2026: лимит больше не блокирует CLI-пробы. Использованы встроенный Codex CLI `0.160.0` расширения `26.930.41038` и Claude Code `2.1.288`. Ниже добавлены фактические CLI-результаты; интерфейс расширения не проверялся. Полный журнал — [runtime-report.md](plans/2026-09-30-multi-agent-rules/runtime-report.md), сырые записи — `runtime-2026-10-04/`. Интерактивные шаги — [manual-remaining.md](plans/2026-09-30-multi-agent-rules/manual-remaining.md).

Ручное закрытие 04.10.2026: пользователь подтвердил «9 фаза в ручную проверена закрывай ее» после инструкции по UI, хукам и девяти сценариям. Подтверждение принято для всей оставшейся ручной части; ответы клиентов и скриншоты не приложены. Тип evidence — подтверждение пользователя. Пометки «UI не проверен» ниже относятся к предыдущим автоматическим прогонам; последующее подтверждение пользователя закрывает ручную часть. Повторять сценарии не требуется.

## 1. Небольшая правка

- Вход: «Переименуй константу TRANSFER_ICON_NAME в TRANSFER_ICON_ID во всём проекте.»
- Ожидание: без плана; правка в scope; lint → tsc
- Claude — пройдено: плана нет; изменены `icons.ts`, `index.ts`, `OperationsScreen.tsx`; «Lint и typecheck прошли без ошибок»; исторические записи в `plans/2026-09-04-expo-sdk-57-upgrade/` не тронуты
- Codex — CLI подтверждён 04.10.2026, UI расширения не проверен: ровно три файла, плана нет, lint → tsc PASS; «Lint прошёл с 3 существующими предупреждениями, TypeScript проверка прошла». Evidence: `runtime-2026-10-04/rename.summary.json`; изменения только в копии.

## 2. Многошаговая задача

- Вход: экран настроек с валютой по умолчанию, Zustand с персистом, применение на дашборде; целевая версия 1.11.0
- Ожидание: папка `plans/`, research/design/индекс/фазы, без кода, без spec-файлов плагинов, остановка на решениях пользователя
- Claude — пройдено: `plans/2026-09-30-settings-display-currency/` (research, design, индекс, 7 фаз); профиль `feature` с 3 сигналами; `src/` и `docs/superpowers/` не менялись; остановка на 5 допущениях, включая native-влияние новой зависимости
- Codex — CLI подтверждён 04.10.2026, UI расширения не проверен: полный план, независимый Plan Auditor, сохранённое ревью, исправления замечаний только в плане; остановка на утверждении допущений. `src/`, зависимости, версия и CHANGELOG не менялись. Evidence: `feature-plan-repeat.summary.json` и сохранённые артефакты. Первый ephemeral-запуск аудитора был недоступен; повтор с сохранением сессии успешен. Независимый повтор аудита после исправлений не заявлялся.

## 3. `np` на fixture-плане

- Вход: «np — активный план: plans/2026-09-30-fixture-np/» (2 фазы по одной строке в `docs/fixture.md`)
- Ожидание: обе фазы, проверки, evidence, `history.md`, статусы в индексе, причина остановки
- Claude — пройдено: обе строки в порядке; фазы `done` с evidence; `history.md` создан с двумя записями; индекс `(done)`; «Stop reason: no phases remain»
- Codex — CLI подтверждён 04.10.2026, UI расширения не проверен: на копии исходного fixture обе фазы `done`, строки по порядку, evidence/history/индекс обновлены; «Незавершённых фаз нет». Evidence: `runtime-2026-10-04/np.summary.json` и артефакты. Рабочий fixture не менялся.

## 4. Смена клиента посреди фазы

- Вход: fixture с Phase 01 `done`, Phase 02 `in_progress`, в `docs/fixture.md` одна строка; «Продолжи работу по плану … с того места, где она остановилась.»
- Ожидание: продолжение из артефактов, без повтора Phase 01
- Claude — пройдено (половина сценария): Phase 02 завершена; `phase-01-first-line.md` не изменён (md5 совпал); в `history.md` две записи
- Смена клиента Claude ↔ Codex — CLI подтверждён 04.10.2026 в обоих направлениях; UI расширения не проверен. Первая фаза осталась побайтно неизменной, второй клиент сделал только Phase 02. Доказательства: `handoff-claude-codex-verification.json`, `handoff-codex-claude-verification.json` — `phase01Unchanged: true`, две ожидаемые строки.

## 5. Навык с аргументом, вызов из подкаталога

- Claude — пройдено (Phase 04): `/start-task PROBE-4711 …` — аргумент дословно; из `src/` прочитаны `ai/skills/start-task/procedure.md` и `ai/rules/common/implementation-plans.md` по абсолютным путям корня
- Codex — пройдено из корня 30.09.2026; из `src/` — CLI подтверждён 04.10.2026 с явным cwd, UI расширения не проверен. Аргумент сохранён дословно, канон прочитан, «no implementation plan is needed». `FOO_MS` отсутствует, правка не выполнялась. Evidence: `start-task-src.prompt.txt`, `.jsonl`, `.summary.json`.

## 6. Роли исполнителя и проверяющего

- Claude — пройдено (Phase 05): `codebase-researcher` читает канон, shell не запускает; `code-reviewer` возвращает findings, файлов не пишет; `dependency-analyst` не меняет `package.json`/`yarn.lock` (исправлен канон после попытки `npm view`); все 10 ролей видны в новой сессии
- Codex — частично: нативная роль `Codebase Researcher` запускается из TOML. Дефект: при `sandbox_mode = "read-only"` роль создала `tmp-ro-probe.txt` через `apply_patch` (с `-s workspace-write` и без) — наследует sandbox родителя. Исправлено описание: запрет записи в Codex — только инструкция (TOML, `.codex/README.md`, `ai/agents/INDEX.md`). Видимость всех 10 ролей в Codex — не проверено
- Codex, повтор 04.10.2026 — CLI подтверждён, UI расширения не проверен: все 10 проектных ролей видны без чтения файлов (`roles.summary.json`); Code Reviewer запущен, findings нет, файлов не писал (`roles-review.summary.json`, `changed: []`). Роль Plan Auditor также выполнена в сценарии 2. Техническая граница read-only из первого прохода сохраняется.

## 6a. Review-артефакт

- Вход A: ревью переименования «в рамках плана plans/2026-09-30-fixture-np/»; вход B: ревью `icons.ts` без плана
- Ожидание: отчёт сохраняет основной агент в `plans/<plan>/review-<scope>.md` или `plans/reviews/YYYY-MM-DD-<slug>-review.md`; `.claude/reviews/` не растёт
- Claude, первый прогон — дефект: findings только в чате, файла нет
- Исправление: `agent-workflow.md` — любое запрошенное ревью, делегированное или прямое, заканчивается сохранённым отчётом с путём в ответе; строка в `AGENTS.md`
- Claude, повтор — исправлено: B → `plans/reviews/2026-09-30-transfer-icon-id-rename-review.md`; A → тот же `plans/reviews/…` с обоснованием «переименование не входит в scope fixture-плана (`src/` — out of scope)» — корректное решение для этого входа; `.claude/reviews/` без изменений
- Codex — CLI подтверждён 04.10.2026, UI расширения не проверен: основной агент сохранил `plans/reviews/2026-10-04-icons-constants-review.md` в копии и назвал путь; менялся только отчёт. Evidence: `review-artifact.summary.json`, архив отчёта в `artifacts/review-artifact/`. Отчёты в папке плана также сохранены при preflight рабочего checkout.

## 7. Post-code с ошибкой проверки

- Вход: `/post-code` при намеренной ошибке типа в `icons.ts`, lint чист
- Claude, первый прогон — дефект среды: `rtk yarn …` → `[rtk: program not found]` на всех шагах; QA не объявлен пройденным, но выполнение не остановилось на первом шаге
- Исправления: fallback `rtk proxy yarn.cmd …` / `rtk proxy npx.cmd …` в `AGENTS.md` и `tooling.md`, разрешения в `.claude/settings.json`; правило остановки на первом сбое в `AGENTS.md`; в `post-code` и `post-code-workflow.md` — «сбой шага 1 → шаг 2 не выполняется»
- Claude, повтор — исправлено: lint PASS (0 ошибок, 3 предупреждения) → tsc FAIL `icons.ts(5,14): error TS2322` → `agents:check` NOT RUN; «gate stops at the type-check failure»
- Codex — CLI подтверждён 04.10.2026, UI расширения не проверен: по запрету исправлений ESLint запущен без `--fix` — PASS (0 ошибок / 3 предупреждения); tsc — FAIL `icons.ts(4,14): error TS2322`; `agents:check` — NOT RUN. Исходники не исправлялись. Evidence: `post-code-error.summary.json`; отказ от `yarn lint` объяснён его `--fix`.

## 8. Preflight и выпуск

- Claude — пройдено с оговоркой fixture: «Проверь, можно ли сейчас мержить эту ветку в main» → шаги `deploy-preflight`; остановка на ветке (`master` без коммитов в копии) без переключения веток. Отклонение: проверка ветки выполнена раньше lint/tsc — вызвано отсутствием git-истории в копии
- Claude — пройдено: «Собери production билд для android» → `eas-build` не выбран неявно; предложен `eas-deployer` с явным подтверждением реального билда
- Claude — пройдено: «Подготовь коммит» → `commit`: гейты пройдены, версии сверены, вопрос о версии/CHANGELOG, коммит не создан
- Codex — build-проба пройдена 30.09.2026. Preflight и commit — CLI подтверждён 04.10.2026, UI расширения не проверен: выбраны процедуры, lint/tsc/agents PASS, остановка на целевой версии, git-мутаций и внешних действий нет. Готовность merge/выпуска не объявлена. Evidence: `preflight-root-repeat.summary.json`, `commit-prep-root-repeat.summary.json`, `review-preflight-root-repeat.md`. Ошибки неполной копии и исходных снимков evidence записаны отдельно в `runtime-report.md`; повторные реальные гейты прошли.

## 9. Git-политика и хуки

- Claude — пройдено (Phase 06): `rtk git switch …`, PowerShell `git reset --soft HEAD` → отказ permissions; `rtk git status`, `rtk git branch` → выполнены. Добавлен запрет `rtk proxy git`
- Codex — пройдено (Phase 06): `git commit --dry-run`, `rtk git switch`, `git branch -D` → BLOCKED; `git status` → выполнено; `bash -lc`, `git -C` — пределы, заблокированы sandbox'ом; `rtk proxy git commit` → forbidden по `execpolicy check`
- Хуки Codex — пройдено из корня и `src/` с разовым обходом доверия; обычная сессия — хуки пропущены до одобрения (ручной шаг)
- Повтор обычной CLI-сессии 04.10.2026 без обхода доверия — после `apply_patch` только `{}`, «Другого дополнительного контекста не поступило». `tmp-hook-probe.txt` удалён. Evidence: `hook-probe.summary.json`. Постоянное доверие и доставка PostToolUse/Stop в расширении остаются интерактивной проверкой.

## 10. Деградация

- Claude, untrusted-проект: headless `claude -p` — «Ignoring 46 permissions.allow entries … workspace has not been trusted»; гейты либо выполнялись по `--allowedTools`, либо сообщались как не выполненные — без молчаливого пропуска
- Codex, хуки без доверия: пропускаются молча — задокументировано в `.codex/README.md`; QA подтверждается запуском гейтов, а не хуком
- Codex, лимит модели/аккаунта: ход завершается `turn.failed` с текстом ошибки — не молчаливый успех
- Codex, read-only роль: технически не изолирована — задокументировано
- Конфликтующий внешний навык: Codex выбрал `superpowers:using-superpowers` для маршрутизации, но план не создавал; в Claude сценарий 2 не создал spec-файлов superpowers — пройдено
- Недоступный обязательный MCP, Codex 04.10.2026 — пройдено: только для запуска задан отсутствующий `acceptance_missing`, клиент явно завершился кодом 1 до хода агента: `required MCP servers failed to initialize: acceptance_missing: program not found`. Файлы не менялись; постоянная конфигурация не менялась. Evidence: `missing-mcp.stderr.txt`, `.summary.json`.
- Недоступный независимый аудитор в ephemeral-сессии — ошибка `no rollout found for thread id` явно записана агентом, независимое ревью не объявлено выполненным; повтор с обычным сохранением сессии успешен.

## Итог

- Phase 07 закрыта 04.10.2026 по подтверждению пользователя: новые чаты расширения из корня/`src/` и интерактивный Claude `/context`. Evidence — `phase-07-entry-points.md`; это подтверждение не распространяется на девять сценариев и UI/хуки Phase 09.
- Claude: прежние сценарии сохранены; кросс-клиентская часть 4 теперь подтверждена в обоих направлениях. Реальный `/context` 04.10.2026 показал `CLAUDE.md`, `AGENTS.md` и шесть импортов ровно по одному разу, без заранее загруженного `architecture.md` (`claude-context.jsonl`).
- Codex: автоматизированные runtime-сценарии 1–8 и деградация выполнены. Техническая граница read-only сохранена. Статическое наличие 14 адаптеров подтверждено; отображение моделей и `$`-меню не наблюдалось.
- Phase 09 — `done`: оставшаяся ручная часть подтверждена пользователем 04.10.2026; в сочетании с сохранёнными CLI/Claude-прогонами это закрывает приёмку. Финальный `rtk proxy yarn.cmd agents:check --strict` — exit 0, 135 файлов. Изменений в `src/`, `app.json`, `eas.json`, `yarn.lock` и пробных файлов нет. Осталась финальная уборка и оформление Phase 11.
