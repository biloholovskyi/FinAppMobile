# План: консолидация Claude Code конфигурации fin-app-mobile

Дата: 2026-08-05
Источники: `fin-app-backend/`, `fin-app-frontend/`, `PDB/pdbs/`
Профиль задачи: `feature` (новые правила/агенты/скиллы + контрактные изменения в CLAUDE.md, мульти-контекст)

## Цель

1. Перенести и адаптировать под mobile недостающие агенты, скиллы и правила из трёх эталонных проектов.
2. Выбросить всё, что не применимо к React Native / Expo.
3. Устранить рассинхрон правил с реальным стеком и битые кросс-ссылки.

## Решения пользователя

- Тестовый контур — **не переносить** (нет jest в проекте; QA = lint + tsc).
- Деплой — **адаптировать под EAS** (preflight + build + submit + правило deployment).
- Отчётность (`report-writer`, `/plan-report`, `report-generation.md`) — **не переносить**.
- Версионирование — **перенести** `versioning-changelog.md`, с явной фиксацией запрета на git-операции.
- Коммиты (уточнено 2026-08-05) — текст коммитов пишет пользователь, конвенция формата не фиксируется. `git-conventions.md` из плана **исключён**.
- CHANGELOG (уточнено 2026-08-05) — формат `[Версия] ДД.ММ.ГГГГ` + список кратких описаний задач, без ссылок на трекер. Версию всегда уточнять у пользователя.

## Принятые допущения

- Жёсткий `deny` на git (как в `fin-app-frontend/.claude/settings.local.json`) **не ставим** — иначе перестанет работать `/commit`. Запрет самостоятельных git-операций фиксируем текстом в `git-conventions.md` (нужен явный запрос пользователя).
- `react-18.md` переименовывается в `react-19.md` — в проекте React 19.1.0.
- Хуки-напоминалки переезжают из `settings.local.json` в committed `settings.json` (как в backend/pdbs), чтобы работали на любой машине.

---

## Фаза 1 — Синхронизация правил с реальным стеком (CRITICAL) — done

Правила описывают несуществующий стек. Реальность из `package.json`:
Expo **54**, React **19.1.0**, React Native **0.81.5**, Expo Router **6**, Zustand **5**, NativeWind 4.2, TanStack Query 5.96, TypeScript 5.9.

Целевое состояние — во всех файлах ниже таблицы версий и текстовые упоминания совпадают с `package.json`:
- `CLAUDE.md` (mobile) — блок Dependency Constraints
- `ai/rules/projects/fin-app-mobile/architecture.md` — таблица версий, разделы Expo Router и Zustand
- `ai/rules/projects/fin-app-mobile/state-management.md` — Zustand v5
- `ai/rules/common/react.md` — порядок загрузки правил
- `ai/rules/common/react-18.md` → `ai/rules/common/react-19.md` — переписать под React 19 (Actions, `useActionState`, `use`, ref как проп, отсутствие `forwardRef`-обвязки)
- `../CLAUDE.md` (корень монорепо) — секция Mobile
- `../.claude/rules/mobile.md` — блок Critical Rules

Чистка мусора из чужих проектов:
- `ai/rules/common/implementation-plans.md` — убрать `docs/plans/`, `apps/db-migrate/`, `pnpm -w`, `@gis-tunnel/db-migrate`, весь раздел DB Migration Phases. Путь планов = `plans/` в корне проекта, именование `YYYY-MM-DD-slug.md` (как фактически используется).
- `ai/rules/common/token-economy.md` — убрать ссылки на `ai/rules/projects/non-restrict-proxy/**`, заменить на mobile-пути.
- `ai/rules/common/patterns.md` — раздел Testing: убрать «Framework: Jest», заменить на «тестов в проекте нет; при добавлении — jest-expo».

Битые ссылки (файлы не существуют) — либо создать, либо снять ссылку:
- `ai/rules/common/skills/refactor-security-audit.md` — **создать** (Фаза 2), нужен `/audit-security`
- `ai/rules/common/build-and-test.md`, `ai/rules/common/docs.md`, `ai/rules/common/infrastructure.md`, `ai/rules/common/package.md`, `ai/rules/common/skills/test-coverage-audit.md` — **снять ссылки**

Проверка: `rtk grep -rn "SDK 52|React 18|Router v3|Zustand v4|non-restrict-proxy|db-migrate|docs/plans" ai .claude CLAUDE.md` → пусто.

### Evidence (2026-08-05)

- Версии обновлены: `CLAUDE.md`, `ai/rules/projects/fin-app-mobile/architecture.md` (+ `state-management.md`), `ai/rules/common/react.md`, `../CLAUDE.md`, `../.claude/rules/mobile.md`, агенты `finapp-mobile-expert`, `react-performance-reviewer`, индексы `ai/rules/AGENTS.md` и `.claude/AGENTS.md`
- `react-18.md` удалён, создан `ai/rules/common/react-19.md` (Actions, `use`, ref-as-prop, cleanup у ref-callback, React Compiler выключен)
- `implementation-plans.md` переписан: PLAN_ROOT = `plans/`, single-file формат по умолчанию, удалён раздел DB Migration Phases, SoT-карта переписана под `ai/rules` / `.claude` / `plans` / `designs`
- `token-economy.md`, `ai-models.md`, `plan-audit.md`, `agent-team-quality-gates.md`, `feature-bug-phase-profiles.md` — убраны ссылки на non-restrict-proxy, K8s/Docker/CI, test-coverage-audit, `docs.md`, `build-and-test.md`; чеклисты переписаны под release-контур (`app.json`, `eas.json`, CHANGELOG, OTA vs native)
- `patterns.md` — раздел Testing: зафиксировано отсутствие раннера, гейты = lint + tsc
- Дополнительно (сверх плана): FSD-дерево приведено к реальным роутам и папкам `shared/`, путь `shared/lib/platform.ts` → `shared/utils/platform.ts` в 6 файлах, отмечено отсутствие `src/shared/stores/`
- Проверка ссылок: все `ai/rules/**` пути из `ai/`, `.claude/`, `CLAUDE.md` резолвятся, кроме двух forward-ссылок на файлы Фазы 2 — `skills/refactor-security-audit.md`, `versioning-changelog.md`
- Исторические файлы (`plans/*`, `docs/superpowers/*`) намеренно не правились
- lint/tsc не запускались: изменены только markdown-файлы, исходники не тронуты

## Фаза 2 — Недостающие common-правила — done

Создать в `ai/rules/common/` (адаптированные, без backend-специфики):

- `tooling.md` — из `fin-app-backend/ai/rules/common/tooling.md`.
  Отличия: PACKAGE_MANAGER = `yarn`, команды `rtk yarn lint`, `rtk yarn tsc --noEmit`, `rtk npx expo start`, `rtk yarn api:generate`, `rtk npx eas ...`. Раздел Claude Layout — как есть.
  Отдельный пункт: в проекте лежат и `yarn.lock`, и `package-lock.json` — зафиксировать yarn как единственный менеджер, `package-lock.json` пометить к удалению.
- `versioning-changelog.md` — из `PDB/pdbs/.claude/rules/versioning-changelog.md`. Адаптации:
  - CHANGELOG_VERSION_HEADER = `[X.Y.Z] DD.MM.YYYY` (плоская строка, без `#`)
  - CHANGELOG_ENTRY_FORMAT = `- <краткое описание задачи>`, без ссылок на трекер
  - VERSION_FILES = `package.json` (`version`) **и** `app.json` (`expo.version`); `expo.runtimeVersion` — отдельный гейт
  - VERSION_BRANCH_PREFIX = `r-` (совпадает с текущей веткой `r-1.7.0`)
  - Целевую версию всегда запрашивать у пользователя
- `skills/refactor-security-audit.md` — из backend, адаптировать под RN: секреты в `EXPO_PUBLIC_*`, хранение токенов (SecureStore vs AsyncStorage), валидация ответов API, логирование без токенов, deep links, отсутствие серверных/SQL-разделов.
- `deployment.md` — новое, по мотивам `PDB/pdbs/.claude/rules/deployment.md`, но под EAS: профили `eas.json`, каналы, `runtimeVersion` и OTA-обновления `expo-updates`, требования preflight, соответствие `version` в `package.json`/`app.json`.

### Evidence (2026-08-05)

- Созданы: `ai/rules/common/tooling.md`, `versioning-changelog.md`, `deployment.md`, `skills/refactor-security-audit.md`
- `git-conventions.md` **не создавался** — по уточнению пользователя формат коммитов не фиксируется
- `commit-message-and-crosslinks.md` переписан: секция про формат коммитов заменена на явное «commit messages — не твоя зона», остались только правила кросс-ссылок
- `.claude/skills/commit/SKILL.md` перепрофилирован в commit-prep: гейты + синхронизация версии + запись в CHANGELOG, без единой git-операции и без сочинения текста коммита
- `deployment.md` построен на фактическом контуре, найденном в репозитории: `.github/workflows/deploy-expo.yml` публикует OTA (`eas update --branch production`) на каждый push в `main`, прогоняя только `yarn tsc --noEmit` без lint; секреты `EXPO_TOKEN` и `EXPO_PUBLIC_API_URL`; зафиксирована развилка OTA vs native build и ловушка рассинхрона `runtimeVersion`
- `tooling.md` фиксирует yarn как единственный менеджер: `yarn.lock` свежее (20.04) чем `package-lock.json` (06.04), CI ставит `yarn install --frozen-lockfile`
- Проверка ссылок: все `ai/rules/**` пути из `ai/`, `.claude/`, `CLAUDE.md` резолвятся, forward-ссылок не осталось
- Индексы (`core-rules.md`, `AGENTS.md`, `CLAUDE.md`) новые правила пока не перечисляют — это Фаза 7

## Фаза 3 — Агенты — done

Перенести и адаптировать в `.claude/agents/`:

- `command-runner.md` (backend) — команды заменить на `rtk yarn lint`, `rtk yarn tsc --noEmit`, `rtk npx expo start`, `rtk yarn api:generate`, `rtk npx eas build/submit`. Убрать Prisma и Jest.
- `dependency-analyst.md` (backend) — вместо NestJS/Prisma проверять: совместимость с Expo SDK 54 (`expo install --check`), выравнивание `react`/`react-dom`/`@types/react`, `react-native` vs Expo SDK, дубли yarn/npm lock-файлов, неиспользуемые зависимости.
- `full-package-auditor.md` (backend) — убрать измерение test coverage; оставить package.json/скрипты, качество кода, безопасность; добавить проверку соответствия FSD и kopeck-математики.
- `eas-deployer.md` — по мотивам `railway-deployer.md` (pdbs), но под EAS: статус сборок, каналы, OTA, работа только по правилу `deployment.md`, read-only по коду.

Не переносим (обосновано): `test-writer`, `test-coverage-auditor`, `parallel-tester` (нет тестов), `report-writer` (решение пользователя), `railway-deployer`, `pdb-backend-expert`, `finapp-backend-expert`, `frontend-react-expert`, `page-designer` (есть `screen-designer`).

Для каждого нового агента — `model:` во frontmatter по `ai/rules/common/ai-models.md`: command-runner → haiku, dependency-analyst → sonnet, eas-deployer → sonnet, full-package-auditor → opus.

### Evidence (2026-08-05)

- Созданы: `.claude/agents/command-runner.md` (haiku), `dependency-analyst.md` (sonnet), `full-package-auditor.md` (opus), `eas-deployer.md` (sonnet)
- `command-runner`: команды переведены на yarn/expo, явные запреты — не выдумывать `test`-скрипт, не запускать `eas build/update/submit`, не трогать git, не ставить пакеты через npm/pnpm
- `dependency-analyst`: главный критерий — совместимость с Expo SDK 54 (`expo install --check` как авторитетный источник), выравнивание react/react-native с тем, что тянет SDK, проверка `reanimated` v4 + `react-native-worklets`, дрейф `yarn.lock`, запрет правок `package-lock.json`. Для каждой зависимости обязан указать native-vs-OTA последствие
- `full-package-auditor`: тестовое измерение выброшено, добавлены FSD-конформность, kopeck-математика, инвалидация кэша, Zustand v5 селекторы, release readiness (`runtimeVersion`, CHANGELOG, синхронность версий)
- `eas-deployer`: заменил railway-deployer. Главная ответственность — решение OTA vs нативная сборка и последствия для `runtimeVersion`. Жёсткие границы: `eas build/update/submit` только по явному запросу (стоят денег, доходят до пользователей, откату не подлежат), никаких git-операций, `src/` не трогает
- `ai-models.md` — таблица назначения моделей дополнена новыми агентами
- Все ссылки на `ai/rules/**` из новых агентов резолвятся
- Forward-ссылка: агенты ссылаются на `.claude/agent-memory/README.md` и свои `MEMORY.md` — создаются в Фазе 6

## Фаза 4 — Скиллы — done

Создать в `.claude/skills/<name>/SKILL.md`:

- `start-task` (backend) — классификация задачи + инициализация плана. Путь планов = `plans/`, а не `docs/plans/`.
- `typecheck` (backend) — `rtk yarn tsc --noEmit`.
- `deploy-preflight` (pdbs → EAS) — по порядку: `rtk yarn lint`, `rtk yarn tsc --noEmit`, синхронность `version` в `package.json` / `app.json`, наличие секции текущей версии в `CHANGELOG.md`, соответствие ветки `r-<version>`, валидность `eas.json`, наличие `EXPO_PUBLIC_API_URL`. Стоп на первой ошибке. Без git-операций.
- `eas-build` — `rtk npx eas build --profile production --platform all`, разбор ошибок, ссылка на билд.
- `eas-submit` — `rtk npx eas submit --platform ios|android`; перед запуском требует пройденного `/deploy-preflight`.
- `eas-status` — `rtk npx eas build:list --limit 5` + текущий канал/`runtimeVersion`.

Не переносим: `/test`, `/write-tests`, `/build` (nest), `/db-migrate`, `/plan-report`, `/deploy-status`, `/deploy-logs` (Railway-специфика).

### Evidence (2026-08-05)

- Созданы: `.claude/skills/start-task`, `typecheck`, `deploy-preflight`, `eas-build`, `eas-submit`, `eas-status` — всего в проекте 14 скиллов
- `start-task` адаптирован под реальность: планы в `plans/` одним файлом, версия запрашивается у пользователя, self-audit через `plan-audit.md`, явные запреты на git-шаги и тестовые фазы
- `deploy-preflight` восемь шагов; ключевой — шаг 7 (OTA vs нативная сборка) с явным вердиктом в отчёте. Шаг 1 (lint) обоснован тем, что CI ESLint не запускает вообще
- `eas-build` / `eas-submit` требуют явного подтверждения конкретного действия: платформа, профиль, build ID. `eas-submit` дополнительно фиксирует, что отправленную сборку отозвать нельзя
- `eas-status` — read-only, отдельно проверяет расхождение `runtimeVersion` между последними сборками и текущим `app.json`
- Расхождение, найденное при проверке: `ai-models.md` перечислял тиры, не совпадающие с полем `model:` в самих скиллах (`review-react-perf`, `audit-plan`, `audit-security`, `implement-plan-step`, `ui-ux-pro-max`). Правило приведено к фактам; смена реальных моделей не делалась — вынесено как открытый вопрос по `review-react-perf`
- Все ссылки на `ai/rules/**` из скиллов резолвятся

## Фаза 5 — Инфраструктура Claude — done

- Создать `.mcp.json` в корне mobile с сервером `context7` (копия из backend).
- `.claude/settings.json` — привести к виду backend/pdbs:
  - `enabledPlugins`: `superpowers@claude-plugins-official`, `context7@claude-plugins-official`, `skill-creator@claude-plugins-official`
  - `extraKnownMarketplaces`: `claude-plugins-official` → github `anthropics/claude-plugins-official`
  - `enabledMcpjsonServers`: `["context7"]`
  - `permissions.allow`: обобщить одноразовые записи из `settings.local.json` до паттернов (`Bash(rtk yarn:*)`, `Bash(rtk npx:*)`, `Bash(rtk grep:*)`, `Bash(rtk ls:*)`, `Bash(rtk read:*)`, `Bash(rtk err:*)`, `Bash(npx expo:*)`, `Bash(npx eslint:*)`, `Bash(npx tsc:*)`)
  - хуки `PostToolUse` (Edit|Write|MultiEdit) и `Stop` — перенести сюда из `settings.local.json`
- `.claude/settings.local.json` — почистить: убрать мусорные разовые записи (`mkdir -p ...` под уже созданные папки, конкретные пути к python-скриптам, `python3.exe -c "print('hello')"`), оставить локальные/машинно-зависимые.
- Удалить из репозитория `.claude/skills/ui-ux-pro-max/scripts/__pycache__/` и добавить в `.gitignore`.
- ~~Удалить пустые `docs/superpowers/plans` и `docs/superpowers/specs`~~ — пункт был основан на неверном допущении, см. Evidence.

### Evidence (2026-08-05)

- Создан `.mcp.json` с сервером `context7`; подтверждено — сервер поднялся, инструменты `mcp__context7__*` стали доступны в сессии
- `.claude/settings.json`: 25 обобщённых allow-правил вместо разовых записей, `enabledPlugins` (superpowers, context7, skill-creator), `extraKnownMarketplaces`, `enabledMcpjsonServers`, хуки `PostToolUse`/`Stop` перенесены из локальных настроек в committed
- По решению пользователя добавлен `deny` (36 правил) на мутирующие git-команды — `commit`, `push`, `add`, `checkout`, `reset`, `rebase`, `merge`, `revert`, `cherry-pick`, `stash`, `clean`, `restore`, `rm`, `mv`, `tag`, в вариантах `git`, `rtk git` и PowerShell. Чтение (`status`, `diff`, `log`, `show`, `branch`, `ls-files`) осталось разрешённым
- `.claude/settings.local.json` сокращён до машинно-зависимого: убраны `mkdir -p` под уже созданные папки, `python3.exe -c "print('hello')"`, разовые вызовы `search.py` с длинными аргументами, дубли того, что переехало в `settings.json`
- Все три JSON провалидированы через `node -e JSON.parse`
- `__pycache__` удалён из рабочего дерева. Важно: он **отслеживался git** несмотря на запись в `.gitignore` — gitignore не действует на уже добавленные файлы. Отдельная команда `git rm --cached` не нужна: удаление с диска попадёт в следующий коммит пользователя
- Ошибка в плане: пункт про `docs/superpowers/` исходил из того, что папки пустые. По факту там 8 отслеживаемых документов (~94 КБ) — апрельские планы и спеки. По решению пользователя оставлены нетронутыми; grep по устаревшему стеку будет на них срабатывать, это ожидаемо

## Фаза 6 — Память агентов — done

- Создать `.claude/agent-memory/README.md` (по образцу backend/pdbs).
- Создать `MEMORY.md` для новых агентов: `command-runner`, `dependency-analyst`, `full-package-auditor`, `eas-deployer`.
- Проверить, что существующие `code-reviewer/MEMORY.md` и `finapp-mobile-expert/MEMORY.md` не содержат утверждений о старом стеке (SDK 52 / React 18).

### Evidence (2026-08-05)

- Создан `.claude/agent-memory/README.md` с mobile-специфичным «не хранить»: версии пакетов (читать `package.json`), структура кода (читать `src/`), всё что уже записано в `ai/rules/**`, токены `EXPO_TOKEN`
- Созданы индексы для `command-runner`, `dependency-analyst`, `full-package-auditor`, `eas-deployer`
- Существующие `code-reviewer/MEMORY.md` и `finapp-mobile-expert/MEMORY.md` проверены — утверждений о старом стеке нет (файлы были пустыми); приведены к единому формату с секциями User / Feedback / Project / Reference
- **Найден скрытый дефект:** у `code-reviewer` и `finapp-mobile-expert` существовали папки памяти, но сами агенты не объявляли `memory: project` — их индексы, скорее всего, никогда не загружались. Поле добавлено обоим, а также `command-runner`
- Проверка соответствия: 6 агентов объявляют `memory: project`, 6 папок, 6 индексов — списки совпадают ровно

## Фаза 7 — Индексы и path-стабы — done

Обновить, чтобы ни одна ссылка не была битой:
- `ai/rules/AGENTS.md` — добавить `tooling`, `git-conventions`, `versioning-changelog`, `deployment`, `skills/refactor-security-audit`, `react-19` (вместо `react-18`)
- `ai/rules/common/core-rules.md` — строки маршрутизации для новых правил
- `.claude/AGENTS.md` — новые агенты и скиллы в таблицах
- `CLAUDE.md` (mobile) — списки Skills и Agents, ссылки на новые правила в таблице Load Rules By Task
- `../CLAUDE.md` (корень) — Agent Routing и Skills для mobile
- Новые path-стабы в `.claude/rules/`: `versioning-changelog.md` (paths: `CHANGELOG.md`, `package.json`, `app.json`), `deployment.md` (paths: `eas.json`, `app.json`), `tooling.md`

### Evidence (2026-08-05)

- Созданы три стаба: `.claude/rules/tooling.md`, `versioning-changelog.md`, `deployment.md`. Стаб `git-conventions.md` не создавался — правило исключено в Фазе 2
- `ai/rules/common/core-rules.md`: добавлены строки маршрутизации для tooling / versioning-changelog / deployment / refactor-security-audit, строка «Git commit» заменена на «Crosslink style» с явной пометкой, что текст коммитов пишет пользователь; Quick Reference дополнен yarn-only и отсутствием тест-раннера
- `ai/rules/AGENTS.md`: добавлены tooling, versioning-changelog, deployment, refactor-security-audit, response-rules; добавлена секция Design (design-system, charts — раньше не были перечислены нигде)
- `.claude/AGENTS.md`: 4 новых агента, 14 скиллов (было 7 перечислено из 8 существующих), 3 новых стаба, новые секции Agent Memory и Claude Config
- `CLAUDE.md` (mobile): таблица Load Rules By Task дополнена, списки Skills и Agents приведены к факту, добавлена секция Git с фиксацией deny и владения коммитами
- `../CLAUDE.md` (корень): Agent Routing дополнен mobile-агентами, Skills — mobile-секцией, таблица mobile-правил дополнена; в Critical Constraints исправлен устаревший стек (SDK 52 → 54, React 18 → 19.1, Router v3 → v6) и добавлены yarn-only, отсутствие тестов, авто-OTA на push в `main`, deny на git
- Проверки: все ссылки `ai/rules/**` резолвятся; все 14 стабов указывают на существующие файлы; ни один агент и ни один скилл не остались неперечисленными в `.claude/AGENTS.md`; орфанных правил нет (`ai/rules/AGENTS.md` ссылается из `tooling.md` и `commit-message-and-crosslinks.md`)

## Фаза 8 — Верификация — done

- Все `@`-импорты и markdown-ссылки в `CLAUDE.md`, `ai/rules/**`, `.claude/**` указывают на существующие файлы (скрипт-проверка ссылок или grep + `test -f`).
- `rtk grep -rn "SDK 52|React 18\.|Expo Router v3|Zustand v4"` по репозиторию → пусто.
- `rtk grep -rn "non-restrict-proxy|gis-tunnel|db-migrate|pnpm -w|Railway"` по `ai/`, `.claude/` → пусто.
- `rtk yarn lint` и `rtk yarn tsc --noEmit` — зелёные (изменения только в конфигах, регресса быть не должно).
- Ручная проверка: `/post-code`, `/typecheck`, `/start-task`, `/deploy-preflight` запускаются и читают существующие правила.
- CHANGELOG: добавить запись о задаче в секцию текущей версии (без git-операций).

### Evidence (2026-08-05)

Все проверки пройдены:

1. `yarn lint` — 0 ошибок, 2 предупреждения (`useDashboardScreen.ts`, неиспользуемые `isError`/`error`) — существовали до задачи, `src/` не менялся
2. `yarn tsc --noEmit` — чисто, 8.9 с
3. Устаревший стек в живом конфиге (`ai/`, `.claude/`, `CLAUDE.md`) — пусто
4. Ссылки на чужие проекты (non-restrict-proxy, gis-tunnel, db-migrate, Railway, K8s, Dockerfile, atlas) — пусто
5. `docs/plans` — только три формулировки запрета, реальных ссылок нет
6. Версии в правилах против `package.json` — совпадают все 9 (expo 54, react 19.1, RN 0.81, router 6, nativewind 4, zustand 5, RQ 5, reanimated 4, TS 5.9)
7. Frontmatter всех 10 агентов и 14 скиллов корректен; имя каждого скилла совпадает с именем папки
8. Все 19 `@`-импортов в `CLAUDE.md` резолвятся; все 14 стабов указывают на существующие файлы

Релизная подготовка (версия 1.8.0 выбрана пользователем):
- `CHANGELOG.md` — добавлена секция `[1.8.0] 05.08.2026` наверх файла
- `package.json` и `app.json` — версия поднята до 1.8.0, синхронность подтверждена
- `expo.runtimeVersion` оставлен `1.0.0`: изменения только в markdown и конфигах Claude, нативной части не касаются, OTA-совместимость сохраняется

Расхождение к сведению пользователя:
- Текущая ветка `r-1.7.0` не соответствует целевой версии — по правилу нужна `r-1.8.0`. Ветку не переключал: это git-операция, теперь ещё и запрещённая в `settings.json`

Итоговый инвентарь: 38 файлов правил, 10 агентов, 14 скиллов, 14 path-стабов, 6 индексов памяти.

Окружение: `rtk yarn` не работает в Bash — `yarn` есть только в PATH PowerShell. Совпадает с `SHELL = PowerShell` в `ai/rules/common/tooling.md`; yarn-команды запускать из PowerShell.

---

## Порядок и модели

- Фаза 1 — opus (контрактные изменения правил, риск рассинхрона)
- Фазы 2, 5 — sonnet
- Фазы 3, 4 — sonnet
- Фазы 6, 7 — haiku
- Фаза 8 — sonnet

Одна фаза за цикл, после каждой — отчёт и подтверждение пользователя перед следующей.

## Явно вне объёма

- Установка jest / написание тестов
- HTML-отчётность по завершению планов
- Railway / Docker / серверный CI
- Любые git-операции (commit, branch, push)
