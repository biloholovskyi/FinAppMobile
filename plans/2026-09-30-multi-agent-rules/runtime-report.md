# Runtime acceptance — 04.10.2026

## Scope and environment

Executed the automated acceptance permitted by the user's request, using fresh sessions of the CLI bundled with the VS Code extension. Codex extension: `openai.chatgpt-26.930.41038-win32-x64`; CLI: `0.160.0`; Claude Code: `2.1.288`. Codex parent runs used BALANCED/medium. Claude's `sonnet` resolved to `claude-sonnet-5-5` in the returned metadata.

Each `runtime-2026-10-04/<id>.prompt.txt` records the input; `<id>.jsonl` and `<id>.stderr.txt` record client output; `<id>.summary.json` records commands, exit codes, final messages and observed file changes. Changed artifacts are retained under `runtime-2026-10-04/artifacts/<id>/`; source snapshots use a `.txt` suffix.

Mutating scenarios ran in independent copies beneath the workspace. Dependencies were junctions to the existing `node_modules`, with no package installation. Copies had no independent Git metadata. The later preflight/commit probes used the actual checkout to remove that limitation. No trust bypass, Git mutation, commit, build, update or submission was authorized for the probes.

## Results (automated observations before user confirmation)

- Instructions, root and `src/` — PASS: `agents-root`, `agents-src`. Both fresh sessions returned the five Read First paths and `rtk yarn agents:check --strict`, without tool calls. During `agents-root`, the separately logged hook probe created a temporary file concurrently; the read-only session itself executed no tools.
- Small rename — PASS: `rename`. Exactly three source files changed; no plan was created; lint then TypeScript passed. The working project's source was untouched.
- Feature planning — PASS for the acceptance behavior: `feature-plan-repeat`. Research, design, index, phase files, history and an independent Plan Auditor report were created; implementation stopped at user approval. Product code, dependencies, version and CHANGELOG did not change. Auditor findings were applied to the temporary plan; no independent post-correction review was claimed.
- `np` — PASS: `np`. Both fixture phases became `done`, evidence/history/index were written, and the two output lines were verified in order. The response explicitly reported that no incomplete phases remained.
- Client handoff — PASS in both directions: `handoff-claude-codex-*`, `handoff-codex-claude-*`. Both verification JSON files contain `phase01Unchanged: true` and the exact two output lines. Claude retried a command denied by its allowed-tools filter and subsequently completed its actual verification.
- Skill argument from `src/` — PASS: `start-task-src`. The input preserved `PROBE-4711 rename constant FOO_MS to BAR_MS in one file`; the canonical procedure was read and no plan was required. The placeholder constant does not exist, so source files were not changed.
- Roles — PASS for discovery and the requested reviewer behavior: `roles`, `roles-review`. All ten project roles were listed. Code Reviewer was launched, returned no findings and wrote no files. Technical read-only isolation remains the already documented limitation.
- Review artifact — PASS: `review-artifact`. The main agent saved `plans/reviews/2026-10-04-icons-constants-review.md` in the copy and named it in the response. The report is retained as acceptance evidence, not as an active product review.
- Post-code failure — PASS for stop-on-failure: `post-code-error`. Because the prompt forbade fixes, the agent used ESLint without `--fix`: `rtk proxy npx.cmd --no-install eslint src` → 0 errors / 3 warnings / exit 0. Then `rtk proxy yarn.cmd tsc --noEmit` failed with `src/shared/constants/icons.ts(4,14): error TS2322: Type 'string' is not assignable to type 'number'.` No source was corrected and `agents:check` did not run.
- Preflight — PASS for routing, QA sequence and the user decision gate: `preflight-root-repeat`. Lint, TypeScript and strict agent checks passed. The session requested the target version and did not claim merge readiness or check the remaining release gates. Saved report: `review-preflight-root-repeat.md`.
- Commit preparation — PASS for procedure selection and the user gate: `commit-prep-root-repeat`. Checks passed; target version was requested; no files or Git state were changed. This was an acceptance input, not a new release/version decision for the tooling plan.
- Claude context — PASS for actual context content: `claude-context`. The native `/context` command returned `local_command: context`, zero model turns and zero API tokens. Project `CLAUDE.md`, `AGENTS.md` and six imports each appear once; `architecture.md` does not appear. Its model-visible skill list contains twelve project skills, excluding the two explicit-only EAS skills. The interactive command menu remains a UI check.
- Missing required MCP — PASS for explicit degradation: `missing-mcp`. A nonexistent MCP command was set only by per-run arguments; the client exited 1 with `required MCP servers failed to initialize: acceptance_missing: program not found`. No agent turn or file change occurred.
- Ordinary hooks — PENDING persisted trust / interactive validation: `hook-probe`. File edit succeeded, but the agent reported only `{}` and no additional context. The file was removed. A normal trusted run and Stop behavior have not been confirmed in the extension.
- Models / `$` menu / Claude `/` menu — NOT RUN in UI. Static inventory contains fourteen project Codex skill adapters. Runtime role discovery and Claude `/context` were checked, but picker/menu display was not observed.

## Failed attempts and corrections to the harness

1. The first nested CLI could not initialize within the outer workspace sandbox: its user-level SQLite/log state was read-only. Authorized escalated invocations retained the child sandbox; they enabled the CLI's own service writes and network access.
2. `preflight` and `commit-prep` correctly stopped at strict-check failure: the original copies excluded the local settings file and CI workflow. Subsequent copies included the workflow and a secret-free empty local settings file to preserve its referenced path. Both repeated copies passed all three gates. Project rules were unchanged.
3. `feature-plan` could not fork the Plan Auditor from an ephemeral session: stderr contains `no rollout found for thread id`. The agent reported the independent audit as unavailable. `feature-plan-repeat` used normal session persistence; the independent Plan Auditor completed. Persistent hook trust was not changed.
4. Initial source evidence was stored with `.ts/.tsx` extensions inside `plans/`, covered by the project's TypeScript include pattern. `preflight-root` and `commit-prep-root` correctly failed TypeScript on those copies. The snapshots were renamed to `.txt`; the repeated real-checkout probes passed. The original failure report remains historical evidence.

## Working-tree preservation and cleanup

The baseline working tree already contained the tooling migration. `src/` was clean before and after baseline lint. `protected-before.json` and `protected-after.json` cover working source, original fixture and `package.json`; `protected-verification.json` records their comparison. Scratch copies are removed only after their client sessions finish and their dependency junctions are unlinked. The original `fixture-np/` is retained until final interactive acceptance, as required by the plan.

Cleanup completed: all owned scratch copies were removed after their client sessions ended, dependency junctions were unlinked first, `tmp-hook-probe.txt` was removed, and the protected-file comparison returned `unchanged: true`. The temporary runner is removed after execution; prompts, logs, summaries and documentary snapshots remain as evidence.

Final QA after cleanup was executed sequentially by Command Runner: `rtk proxy yarn.cmd lint` → exit 0, three existing warnings; `rtk proxy yarn.cmd tsc --noEmit` → exit 0; `rtk proxy yarn.cmd agents:check --strict` → exit 0, 135 files scanned. Record: `runtime-2026-10-04/qa-final.json`. Later changes only clarify plan/evidence Markdown; source and agent configuration are unchanged.

## Remaining gate

Phase 07 is `done`: on 04.10.2026 the user confirmed the two fresh extension instruction checks (root and `src/`) and interactive Claude `/context`, and requested closure. This is user-confirmed evidence; no verbatim client output or screenshots were attached. The closure strict check passed (exit 0, 135 files). See `phase-07-entry-points.md` and `history.md`.

Phase 09 is also `done`: on 04.10.2026 the user confirmed manual acceptance and requested closure after the UI/hooks/nine-scenario instructions. This is user-confirmed evidence; no verbatim outputs or screenshots were attached. The automated results above remain historical automated observations, including the earlier missing hook context. Closure strict check: exit 0, 135 files. Working source/config diff is empty and owned probe files are absent.

The nine extension scenarios were mandatory under the unchanged criterion; their completion and the other outstanding interactive checks are now accepted on the user's confirmation, rather than substituted by CLI runs. Only Phase 11 remains `in_progress`: remove the original fixture, perform the final strict check and record plan completion. No further interactive acceptance is pending.

Version and CHANGELOG remain unchanged under the plan's existing decision. Release decisions requested by the probes are not questions that must be answered to complete this tooling acceptance.
