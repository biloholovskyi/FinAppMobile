# Phase 04: post-code and hardening

- Status: `todo`
- Model tier: DEEP — independent behavior, architecture, and security review.
- Required rules: [post-code](../../ai/rules/common/post-code-workflow.md), [audit](../../ai/rules/common/skills/refactor-security-audit.md), [workflow](../../ai/rules/common/agent-workflow.md).

## Goal

Verify the implemented feature and resolve review findings.

## Implementation notes

The implementer runs gates. An independent reviewer returns findings; the main agent saves `review-display-currency.md` in this plan folder. Rerun gates after fixes.

## Scope

- Changed `src/**` files listed in Phases 02–03.
- `plans/2026-10-04-display-currency-settings/review-display-currency.md`.

## Checklist

- [ ] Run lint, then type check; stop on the first failure.
- [ ] Review FSD boundaries, persistence validation, rate failures, and currency math.
- [ ] Confirm transfer rate semantics and category-spending UAH formatting remain intact.
- [ ] Save reviewer findings and address blocking issues.
- [ ] Rerun lint and type check after fixes.

## Verification commands

- `rtk yarn lint`
- `rtk yarn tsc --noEmit`

## Acceptance criteria

- Both gates pass with recorded output, and the saved review has no unresolved blocking finding.

## Evidence note

Pending.

## Handoff note

Pass verified behavior and native impact to Phase 05.
