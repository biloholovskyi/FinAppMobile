# Phase 06 — Версия 1.11.0 и CHANGELOG

- Status: done
- Model tier: FAST
- Required rules: `ai/rules/common/versioning-changelog.md`

## Goal

Версия приложения — `1.11.0`, CHANGELOG описывает эквивалент в UAH.

## Implementation Notes

- Целевая версия `1.11.0` выбрана пользователем
- `expo.runtimeVersion` не меняется — изменения только в JS
- Ветка должна называться `r-1.11.0`; при несовпадении — сообщить пользователю, ветку не создавать

## Scope

- `package.json` — `version` = `1.11.0`
- `app.json` — `expo.version` = `1.11.0`
- `CHANGELOG.md` — новая секция `[1.11.0] DD.MM.YYYY` (дата завершения) в начале файла с пунктом «Эквивалент транзакций в UAH»

## Checklist

- [x] Версия в обоих файлах равна `1.11.0`
- [x] `runtimeVersion` не тронут
- [x] Секция `1.11.0` — первая в CHANGELOG, формат заголовка `[X.Y.Z] DD.MM.YYYY`
- [x] Результат проверки ветки отражён в evidence

## Verification Commands

- `rtk yarn lint`
- `rtk git branch --list`

## Acceptance Criteria

- `grep -n '"version"' package.json app.json` показывает `1.11.0` в обоих файлах
- CHANGELOG начинается с `[1.11.0]`

## Evidence Note

Выполнено 05.10.2026.

- `package.json` `version` и `app.json` `expo.version` = `1.11.0`; `expo.runtimeVersion` остаётся `2.0.0` — изменения только в JS, OTA-совместимо
- `CHANGELOG.md` — секция `[1.11.0] 05.10.2026` первой, пункт «Эквивалент транзакций в UAH»
- Branch gate: текущая ветка `1.10.0`, ветки `r-1.11.0` нет (`rtk git branch --list`) — несоответствие сообщено пользователю, ветка не создавалась
- `rtk proxy yarn.cmd lint` — exit 0, 0 ошибок, 3 старых предупреждения

## Handoff Note

- Версия `1.11.0` в `package.json` и `app.json`, `runtimeVersion` = `2.0.0`
- CHANGELOG начинается с `[1.11.0] 05.10.2026`
- Ветка `r-1.11.0` не существует, текущая — `1.10.0`; создаёт пользователь
