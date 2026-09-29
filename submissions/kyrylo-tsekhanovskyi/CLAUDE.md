@AGENTS.md

## Claude Code only

- OpenSpec proposals (`/opsx:propose`, `/opsx:update`) and orchestration: use plan mode and high effort.
- Implementation goes through the `be-maker` / `fe-maker` subagents (`.claude/agents/`). For
  contract-first parallel work, dispatch both in the background, then run `npm run check`,
  `npm run review:be` and `npm run review:fe` at the sync point.
- If a maker stops at its attempt limit: check that the stop is in `docs/logs/retry-stops.md`, then
  retry that task once at high effort and record the level change in `docs/autonomy-log.md`.
- Running the app: start `npm run start` with the Bash tool's background mode, and always finish with
  `npm run stop`. Stopping only the background task leaves Aspire's `dcp` processes holding the ports.
- The Stop / SubagentStop hook runs `check --fast` on changed sides and hands failures back to the agent,
  for at most 3 re-entries.
