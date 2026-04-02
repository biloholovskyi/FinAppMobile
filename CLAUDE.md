# fin-app-mobile

React Native + Expo SDK 52. Expo Router (file-based). NativeWind v4. FSD.
Backend: fin-app-backend REST API. Currency: UAH (uk-UA locale).

## Quick Commands (always prefix with rtk)

- `rtk npx expo start`              — dev server
- `rtk npx expo start --clear`      — dev server (clear cache)
- `rtk yarn lint`                   — ESLint auto-fix
- `rtk yarn tsc --noEmit`           — TypeScript check (no emit)
- `rtk eas build --platform all`    — production build via EAS

## Load Rules by Task

| Task | Rule file |
|------|-----------|
| New screen / component / hook / style | @.claude/rules/screens.md |
| REST API call / React Query / Zustand | @.claude/rules/api.md |
| Navigation / routing / deep links / layout | @.claude/rules/navigation.md |
| After any code change (always) | @.claude/rules/post-code.md |

## Agents

- `finapp-mobile-expert` — all development (screens, API, navigation, styling, bugs)
- `code-reviewer` — code review after implementation

## Environment Variables

- `EXPO_PUBLIC_API_URL` — REST API base URL (fin-app-backend)
