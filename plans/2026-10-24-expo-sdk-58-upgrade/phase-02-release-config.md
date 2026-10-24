# Phase 02 — runtimeVersion, CI и EAS

Status: done
Model tier: FAST — конфигурационные правки
Required rules: `ai/rules/common/deployment.md`, `ai/rules/common/versioning-changelog.md`

## Goal

OTA-апдейты SDK 58 доходят только до совместимых билдов, CI публикует на поддерживаемом Node.

## Implementation notes

- `runtimeVersion` поднимается, потому что сменился React Native.
- `node-version: 22` в setup-node резолвится в последний 22.x — удовлетворяет `^22.13`; явная фиксация `22.13`+ допустима, если требуется правилом.
- `eas config` проверяется локально, без запуска билда или апдейта.

## Scope

- `app.json` — `expo.runtimeVersion: "3.0.0"`
- `.github/workflows/deploy-expo.yml` — версия Node, только при несоответствии минимуму SDK 58
- `eas.json` — только если `eas config` сообщает о проблеме

## Checklist

- [ ] Поднять `runtimeVersion` до `3.0.0`
- [ ] Проверить версию Node в CI против минимума SDK 58
- [ ] `eas config` резолвит `sdkVersion` 58.0.0
- [ ] Узнать, есть ли нативные билды на `2.0.0`, записать в evidence

## Verification commands

- `rtk proxy npx.cmd eas config --profile production --platform android`
- `rtk proxy npx.cmd eas build:list --limit 5 --non-interactive`

## Acceptance criteria

- `runtimeVersion` = `3.0.0`
- Node в CI удовлетворяет `^22.13 || ^24.3 || >=26`
- `eas config` проходит с `sdkVersion` 58.0.0

## Evidence note

24.10.2026, done.
- `app.json`: `runtimeVersion` `2.0.0` → `3.0.0`
- `eas config --profile production --platform android`: `sdkVersion` 58.0.0, `runtimeVersion` 3.0.0
- CI: `node-version: 22` резолвится в последний 22.x (≥ 22.13) — правка workflow не нужна; `eas.json` без изменений
- `eas build:list`: билдов у `@amitil13/fin-app-mobile` нет — бамп никого не отрезает от OTA
- `eas` глобально не установлен, `npx eas` не резолвит пакет; рабочая форма — `rtk proxy npx.cmd -y eas-cli@latest …`

## Handoff note

- `runtimeVersion` 3.0.0, нативных билдов нет
- CI и `eas.json` без изменений
- Команды EAS в `tooling.md` требуют формы `eas-cli` — уточнить в Phase 05
