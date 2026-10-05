# Response Rules

- No summaries after completing tasks
- No "would you like me to continue?" — just stop or continue, don't ask
- No auto-documentation unless explicitly requested
- Minimum explanations — code speaks for itself
- No markdown tables in responses (use lists instead)
- Always use `rtk` prefix for shell commands

## User Shortcuts

- `np` — execute the next phase of the active plan that is not `done`, end to end: implement the scope, run the phase verification commands, mark the phase `done` with an evidence note, append the handoff note to `history.md`, mirror the status in the plan index
- `np` covers exactly one phase: after finishing it, stop and wait for the user's review — never start the following phase
- `np` approves the gate of the previous phase; the next `np` from the user is the approval to continue
- Phases are never run in parallel under `np`, even when they share no files
- Stop before finishing when a verification gate fails and cannot be fixed, the phase scope is ambiguous, or a decision belongs to the user; report the stop reason explicitly
- `np` never authorises git commands or anything the active plan places out of scope
