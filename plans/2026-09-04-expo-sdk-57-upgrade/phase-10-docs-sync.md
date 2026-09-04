# Phase 10 — Синхронизация документации

Status: done
Model tier: FAST
Required rules: `ai/rules/common/implementation-plans.md`, `ai/rules/common/commit-message-and-crosslinks.md`

## Goal

Правила проекта называют версии и команды, которые действительно установлены после апгрейда.

## Implementation notes

Владелец содержания — `ai/rules/**`. `CLAUDE.md` и `.claude/rules/*.md` только ссылаются, тела правил в них не дублируются.

## Scope

- `ai/rules/projects/fin-app-mobile/architecture.md` — таблица закреплённых версий, ограничения New Architecture, ссылка на документацию SDK
- `ai/rules/common/react-19.md` — версия React и `@types/react`
- `ai/rules/common/deployment.md` — `NODE_VERSION_CI`, вызов `eas update` с `--environment`, значение `RUNTIME_VERSION`
- `ai/rules/common/tooling.md` — версия Node в CI, упоминание удалённого `package-lock.json`
- `CLAUDE.md` (проект) — таблица Dependency Constraints
- `CLAUDE.md` (корень монорепозитория) — строка о пиннинге SDK 54 для mobile

## Checklist

- [x] Перенести финальные версии из evidence фазы 04 во все перечисленные файлы
- [x] Обновить ссылку на документацию Expo с `versions/v54.0.0` на актуальную
- [x] Убрать упоминания Legacy Architecture и `newArchEnabled` как доступной опции
- [x] Отразить обязательный edge-to-edge на Android в правилах архитектуры
- [x] Убрать из `tooling.md` пункт про удаление `package-lock.json`, если файл уже удалён
- [x] Проверить, что все внутренние ссылки в изменённых файлах резолвятся
- [x] Проверить, что ни одно правило не называет версию, отличную от `package.json`

## Verification commands

- `rtk grep -rn "54\.0\|0\.81\|19\.1\|SDK 54" ai/ CLAUDE.md .claude/`

## Acceptance criteria

- Ни одного упоминания SDK 54, RN 0.81 или React 19.1 как текущего состояния
- Направление ссылок соблюдено: `CLAUDE.md` → `ai/rules/**` → артефакты плана
- Версии в правилах совпадают с `package.json`

## Evidence note

Обновлены версии и связанные утверждения в 13 файлах.

Правила проекта (`ai/rules/**`):
- `projects/fin-app-mobile/architecture.md` — таблица закреплённых версий (SDK 57, RN 0.86.x, React 19.2.x, TypeScript 6.0.x, Expo Router 57), ссылка на документацию SDK 57, строка Runtime, строка Language, заголовок и раздел про Expo Router, требование Axios 1.20+
- `common/react-19.md` — `REACT_VERSION` и `REACT_TYPES_VERSION` на 19.2.x, вводная строка
- `common/react.md` — вводная строка и заголовок раздела навигации
- `common/patterns.md` — правило про алиасы переписано: `paths` относительно каталога конфига, `baseUrl` не задавать, TypeScript 6 отвергает его с TS5101; два упоминания SDK в разделах зависимостей и supply-chain
- `common/skills/refactor-security-audit.md`, `common/tooling.md` — совместимость пакетов с SDK 57

Точки входа:
- `CLAUDE.md` проекта — вводная строка и таблица Dependency Constraints, включая новую формулировку про Expo Router (нумерация идёт по SDK с 55-й версии) и TypeScript 6
- `CLAUDE.md` монорепозитория и `.claude/rules/mobile.md` монорепозитория
- `.claude/AGENTS.md` и четыре агента: `dependency-analyst`, `eas-deployer`, `finapp-mobile-expert`, `react-performance-reviewer`
- `.claude/agents/command-runner.md`

Формулировка про New Architecture заменена везде: «default in SDK 54» больше не соответствует действительности, Legacy Architecture удалена в SDK 55 и выбора больше нет.

`NODE_VERSION_CI` и команда `eas update --environment` синхронизированы раньше, в Phase 07, и здесь не трогались.

Направление ссылок соблюдено: тела правил живут в `ai/rules/**`, `CLAUDE.md` и `.claude/**` только ссылаются.

Контрольный скан по всему дереву документации (`CLAUDE.md`, `ai/`, `.claude/`, корень монорепозитория) на строки `SDK 54`, `0.81.`, `19.1.x`, `React 19.1`, `RN 0.81`, `Router v6` возвращает пусто.

## Handoff note

- Документация приведена к фактическому состоянию: SDK 57, RN 0.86, React 19.2, TypeScript 6, Expo Router 57
- Контрольный греп по старым версиям пуст
- Правило про `baseUrl` переписано под TypeScript 6 — это было прямое противоречие рабочему коду
- Остаётся Phase 11: целевая версия за пользователем
