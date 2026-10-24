# Phase 06 — Версия и CHANGELOG

Status: done
Model tier: FAST — механическая правка по правилу
Required rules: `ai/rules/common/versioning-changelog.md`

## Goal

Версия `1.13.1` согласована во всех version-файлах и CHANGELOG.

## Implementation notes

- Branch gate: ожидаемая ветка `r-1.13.1`; при несовпадении — отчёт, ветку создаёт пользователь.
- Новая секция `[1.13.1] DD.MM.YYYY` с датой дня выполнения — сверху файла.
- Бамп `runtimeVersion` в CHANGELOG не упоминается.

## Scope

- `package.json` — `version: "1.13.1"`
- `app.json` — `expo.version: "1.13.1"`
- `CHANGELOG.md` — секция `[1.13.1]` с пунктом `- Expo SDK 58 upgrade`

## Checklist

- [ ] Version gate
- [ ] Branch gate
- [ ] Version-file gate
- [ ] Changelog gate

## Verification commands

- `rtk git branch`
- `rtk grep -n "\"version\"" package.json app.json`
- `rtk head -5 CHANGELOG.md`

## Acceptance criteria

- Оба version-файла содержат `1.13.1`
- CHANGELOG начинается с `[1.13.1] <дата>` и пункта `- Expo SDK 58 upgrade`
- Результат branch gate записан в evidence

## Evidence note

24.10.2026, done.
- Version gate: `1.13.1` задана пользователем
- Branch gate: текущая ветка `r-1.13.1` — совпадает
- Version-file gate: `package.json` и `app.json` — `1.13.1`
- Changelog gate: секция `[1.13.1] 24.10.2026` с пунктом `- Expo SDK 58 upgrade` сверху файла

## Handoff note

- Версия 1.13.1 согласована во всех файлах, ветка верная
