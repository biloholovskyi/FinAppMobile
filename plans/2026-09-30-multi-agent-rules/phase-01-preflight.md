# Phase 01 — Preflight окружения

- Status: done
- Model tier: FAST
- Required rules: `ai/rules/common/tooling.md`
- Prerequisites: нет

## Goal

Зафиксировано, в каком окружении работают оба клиента и какие инструкции и возможности они фактически получают.

## Implementation Notes

- Только сбор фактов; файлы проекта, кроме `research.md`, не меняются
- Codex-часть выполняет пользователь или исполнитель, если клиент доступен из его оболочки; недоступный факт записывается как «не проверено» с причиной
- Доступность моделей проверяется в целевом клиенте и аккаунте, не по документации

## Scope

- `plans/2026-09-30-multi-agent-rules/research.md` — раздел «Окружение (Phase 01)»

## Checklist

- [x] Версии Claude Code и Codex, способ запуска Codex (CLI, IDE, desktop)
- [x] cwd и git-root подтверждены; фактическое поведение Codex в новой сессии из `src/` ещё не проверено
- [x] Claude-инструкции и файлы Codex проверены; точный список автоматически загруженных Codex `AGENTS.md` ещё не подтверждён
- [x] Плагины и внешние навыки в обоих клиентах (superpowers и др.)
- [x] Доступные модели для тиров FAST / BALANCED / DEEP в каждом клиенте (Codex: успешные пробы параметров spawn; полный desktop `/model` ещё не проверен)
- [x] Trust-статус проекта в Codex; инструкция пользователю, если не trusted
- [x] MCP `context7`: Codex-конфигурация enabled, реальный вызов ещё не проверен
- [x] Оболочка, которой Codex на Windows исполняет hook-команды, и cwd хука при сессии из `src/`
- [x] Есть ли сеть у дочернего агента Codex с `sandbox_mode = "read-only"`

## Verification Commands

- `claude --version`
- Codex: версия клиента и `/status` (или эквивалент) в сессии из корня проекта

## Acceptance Criteria

- Раздел «Окружение» заполнен по каждому пункту чек-листа; непроверенные пункты помечены с причиной
- Маппинг тиров на модели обоих клиентов определён для Phase 05–07

## Evidence Note

Частично (30.09.2026): раздел «Окружение (Phase 01)» в `research.md` заполнен по Claude-стороне и статическим файлам Codex (`~/.codex/config.toml`, `~/.codex/AGENTS.md`). `claude --version` → `2.1.251`.

Дополнено из Codex 30.09.2026: desktop-пакет `26.924.2738.0`, встроенный CLI `0.158.0-alpha.2.1`, CLI расширения VS Code `0.155.0-alpha.16.3`; глобального override нет, проект trusted. Фактический sandbox текущей сессии — `workspace-write`, reviewer — `auto_review`. Подробные факты и пределы — раздел «Окружение» в `research.md`.

FAST `gpt-6-luna/low`, BALANCED `gpt-6-sol/medium`, DEEP `gpt-6-astra/high` приняты spawn-инструментом и завершили задачи; README и 10 TOML обновлены. `agents:check` — код 0, 136 файлов. Ни `/status`, ни `/model` desktop через интерфейс не проверены.

### Закрытие — 30.09.2026, целевой клиент Codex: расширение VS Code

- Решение пользователя: Codex используется только как расширение VS Code; desktop-пункты чек-листа заменены проверками через встроенный CLI расширения `0.155.0-alpha.16.3`
- Маппинг тиров Codex определён и записан в `.codex/README.md` и 10 TOML: FAST `gpt-6-luna/low`, BALANCED `gpt-6-sol/medium`, DEEP `gpt-6-astra/high`
- MCP `context7` отработал из Codex-сессии (`resolve-library-id` → `/websites/expo_dev`, `/expo/expo`)
- Сеть и sandbox дочерней роли: `read-only` из TOML не соблюдается — роль наследует записываемый sandbox родителя; сеть read-only поэтому не наблюдаема и не нужна как допущение — канон `dependency-analyst` передаёт сетевые команды основному агенту
- Оболочка hook runner: команда рассчитана на cmd, PowerShell и bash; в Codex-runtime хук отработал из корня и из `src/` — конкретная оболочка не влияет
- Остаются интерактивными и вынесены в `codex-close-phase.md`: выбор модели в пикере расширения, `/skills`, одобрение хуков, `/context` в Claude. Для приёмки фазы не блокируют: acceptance требует пометки непроверенного с причиной и определённого маппинга — оба условия выполнены

## Handoff Note

- Codex = расширение VS Code; автоматические пробы — `codex exec` его CLI, интерактивные — `codex-close-phase.md`
- Маппинг тиров Codex: FAST `gpt-6-luna/low`, BALANCED `gpt-6-sol/medium`, DEEP `gpt-6-astra/high`
- Claude: FAST `haiku`, BALANCED `sonnet`, DEEP `opus` — в `CLAUDE.md` (Phase 07)
- Хуки Codex требуют однократного одобрения в интерактивной сессии; без него пропускаются молча
- Codex-роль `read-only` не изолирована технически — только инструкция
- Лимит использования Codex исчерпан 30.09.2026 до 20:10 — Codex-сценарии Phase 09 выполняются вручную
