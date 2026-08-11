# Skill: Refactor and Security Audit

Use when refactoring files for structure, constants, exported types, and security hardening.
Canonical checklist for the "Audit and Hardening" phase in `ai/rules/common/implementation-plans.md`.

Triggers:
- User asks for refactor, cleanup, quality improvements, or file audit
- User asks to split a screen or hook into constants/types/utils
- User asks to find magic numbers/strings and extract constants
- User asks for a security audit during refactor
- Changes touch multiple files or introduce new patterns
- Implementation plan reaches the audit and hardening phase

## Process

- Scope target files; load `ai/rules/common/patterns.md`, `ai/rules/projects/fin-app-mobile/architecture.md`, `ai/rules/common/token-economy.md`
- Audit against the maintainability rules in `ai/rules/common/patterns.md`
- Structure audit: mixed concerns in one file, long components/hooks, repeated literals, high JSX nesting
- Extract literals: move repeated numeric/string literals to named constants with units/context
- Split modules:
  - JSX in `<Component>/<Component>.tsx` — no business logic
  - Logic in the co-located `use<Component>.ts` hook
  - Pure helpers in `src/shared/utils/`
  - Constants in `src/shared/constants/`
  - Types in `*.types.ts` co-located with the implementation
- Enforce `import type` / `export type` for type-only symbols
- Fix type issues: remove `any`, add missing types, fix narrowing
- Reduce nesting and split large components/hooks per the limits in `ai/rules/common/patterns.md`
- Validate FSD boundaries per `ai/rules/projects/fin-app-mobile/architecture.md` (import direction, no `expo-router` outside `src/app/`)
- Run the security pass (see below)
- Prefer automated guardrails (ESLint, Prettier) before manual review
- After fixes: rerun `rtk yarn lint && rtk yarn tsc --noEmit`

## Security Pass (mobile-specific)

Secrets and env:
- `EXPO_PUBLIC_*` variables are bundled into the app binary and readable by anyone — they are NOT secrets
- No API keys, tokens, or credentials in `EXPO_PUBLIC_*`, source code, `app.json`, or `eas.json`
- Server-side secrets belong in EAS Secrets / GitHub Actions secrets, never in the client

Token storage:
- Auth tokens and other sensitive values go to `expo-secure-store`, never `AsyncStorage`
- Never persist tokens in Zustand state that is written to `AsyncStorage`
- Clear stored credentials on logout and on 401 re-auth flows

Logging:
- No `console.log` in committed code
- Never log tokens, Authorization headers, full API responses containing credentials, or account identifiers

Input and response handling:
- Treat every API response as untrusted: default missing fields (`data ?? []`, `amount ?? 0`) before use
- Validate user input at the screen boundary before submit — never send unvalidated amounts or IDs
- No `eval` / `new Function` / dynamic `require` on values derived from user input or API data

Deep links:
- Validate and whitelist route params coming from deep links (`scheme: finapp`) before navigating or fetching
- Never pass a deep-link value straight into a request path without checking its shape

Network:
- All HTTP goes through `src/shared/api/` — no ad-hoc `axios`/`fetch` in screens or hooks
- HTTPS only for `EXPO_PUBLIC_API_URL`; no certificate/TLS bypasses
- Requests must have a timeout

Supply chain:
- CI installs with `yarn install --frozen-lockfile`
- New dependencies must be Expo SDK 54 compatible — prefer `rtk npx expo install`
- Review `rtk yarn audit` findings before adding or upgrading packages

## Checklist

- [ ] No `any` types in changed files
- [ ] No magic numbers 2+ uses (inline 0/1/-1 OK)
- [ ] No magic strings 2+ uses (protocol/domain literals extracted)
- [ ] Functions <= 20 lines (refactor at 30)
- [ ] Components <= 150 lines, hooks <= 50 lines, JSX nesting <= 4
- [ ] Max nesting <= 3
- [ ] Business logic lives in the co-located hook, not in JSX
- [ ] FSD import direction respected; no `expo-router` outside `src/app/`
- [ ] Kopeck math correct: `/100` on display, `Math.round(*100)` on submit
- [ ] Every mutation calls `queryClient.invalidateQueries()`
- [ ] No `console.log` in committed code
- [ ] No secrets/tokens in logs, `EXPO_PUBLIC_*`, `app.json`, or `eas.json`
- [ ] Sensitive values stored via `expo-secure-store`, not `AsyncStorage`
- [ ] API responses defaulted defensively before use
- [ ] Deep-link params validated before use
- [ ] No hardcoded hex colors; no inline `style={{}}` for layout
- [ ] No array index as key in lists

## Output

- Findings grouped by severity (CRITICAL > HIGH > MEDIUM > LOW) with file paths
- Refactors applied (or proposed) and residual risks
- Validation commands and lint/typecheck results

## Related Rules

- `ai/rules/common/implementation-plans.md` — referenced for the audit phase
- `ai/rules/common/patterns.md` — code patterns and maintainability rules
- `ai/rules/projects/fin-app-mobile/architecture.md` — FSD boundaries, kopeck math
- `ai/rules/projects/fin-app-mobile/state-management.md` — API layer, cache invalidation
- `ai/rules/common/post-code-workflow.md` — required checks after fixes
