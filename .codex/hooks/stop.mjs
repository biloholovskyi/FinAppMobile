/**
 * Codex Stop hook: surfaces a post-code reminder when the turn ends. Stop
 * requires JSON on stdout; without a `decision` field the turn ends normally
 * (`decision: "block"` would make Codex continue). Writes no files.
 */
const REMINDER =
  '[session-end] If code or agent configuration changed this session, run the post-code sequence ' +
  'from ai/rules/common/post-code-workflow.md.'

process.stdout.write(JSON.stringify({ systemMessage: REMINDER }))
