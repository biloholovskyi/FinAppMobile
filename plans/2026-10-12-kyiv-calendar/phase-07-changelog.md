# Phase 07 — Версия и CHANGELOG 1.12.0

- Status: done
- Model tier: FAST — подготовка файлов по правилу
- Required rules: `ai/rules/common/versioning-changelog.md`

## Goal

Версия `1.12.0` согласована в файлах версий и `CHANGELOG.md` с записью этой задачи.

## Implementation Notes

- Целевая версия `1.12.0` подтверждена пользователем 12.10.2026; ветка `r-1.12.0`
- Запись задачи — не длиннее 5 слов, в стиле соседних записей: `- Kyiv calendar unification`
- Отложенная запись плана `2026-10-10-spending-transactions-sheet` (фаза 06) в этой фазе не добавляется — решение пользователя
- `runtimeVersion` не меняется — только JS

## Scope

- `package.json` — `version` `1.12.0`
- `app.json` — `expo.version` `1.12.0`
- `CHANGELOG.md` — секция `[1.12.0] DD.MM.YYYY` (дата выполнения фазы) в начале файла

## Checklist

- [x] Перечитан «Изменения design» в backend `history.md`; новые записи — план обновлён, пользователь уведомлён
- [x] Четыре гейта `versioning-changelog.md`: версия, ветка, файлы версий, CHANGELOG
- [x] Запись наверху списка версии

## Verification Commands

- `rtk git rev-parse --abbrev-ref HEAD`
- `rg -n "\"version\"" package.json app.json`
- `rg -n "^\[1\.12\.0\]" -A3 CHANGELOG.md`

## Acceptance Criteria

- Ветка `r-1.12.0`; `package.json` и `app.json` — `1.12.0`
- В `CHANGELOG.md` секция `1.12.0` с сегодняшней датой и записью задачи

## Evidence Note

- Backend «Изменения design» перечитан 12.10.2026 — новых записей нет
- Гейт версии: `1.12.0` подтверждена пользователем
- Гейт ветки: `rev-parse --abbrev-ref HEAD` — `r-1.12.0`
- Гейт файлов: `package.json` и `app.json` — `1.11.0` → `1.12.0`; `runtimeVersion` (`2.0.0`) не менялся — только JS, OTA
- Гейт CHANGELOG: новая секция `[1.12.0] 12.10.2026` в начале файла, запись `- Kyiv calendar unification` (по просьбе пользователя CHANGELOG переведён на английский: 5 русских записей 1.8.0–1.12.0; исторические записи с тикет-ссылками без изменений)
- Запись отложенной фазы 06 плана `2026-10-10-spending-transactions-sheet` не добавлялась — решение пользователя
- `package.json` изменён → lint exit 0 (3 warnings вне scope), tsc exit 0

## Handoff Note

- Секция `1.12.0` содержит только эту задачу; запись шторки транзакций пользователь добавит или поручит отдельно
- Фаза 08: `reflect.md` со списком файлов и свежим прогоном сценариев
