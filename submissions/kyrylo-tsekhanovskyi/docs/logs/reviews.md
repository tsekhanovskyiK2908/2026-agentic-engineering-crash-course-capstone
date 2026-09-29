# Review ledger

Append-only. One row per checker run, written by `scripts/review.mjs` (`npm run review:<scope>`).
A re-review after fixes gets its own row. The full report is in [`docs/reviews/`](../reviews/).

**Resolution** is filled in by the orchestrator or the human **before the commit**:
`fixed` · `waived by human: <reason>` · `won't fix: <reason>`. A commit with an empty Resolution is not allowed.

Findings use the Codex priority scale: P0 blocker · P1 must fix · P2 should fix · P3 nit.

| Date | Scope | Reviewer | Model / effort | Findings P0/P1/P2/P3 | Verdict | Report | Resolution |
|---|---|---|---|---|---|---|---|
| 2026-09-29 | harness | harness-checker | gpt-6-astra / high | 0/2/5/0 | unparsed | [report](../reviews/2026-09-29-harness-harness-checker.md) | fixed: all 7 (red → green in `docs/evidence/phase-1-review-fixes-red.txt`; guard scoping fixed before its test, human-approved); re-reviewed in the next row |
| 2026-09-29 | harness | harness-checker | gpt-6-astra / high | 0/2/3/0 | changes-requested (derived) | [report](../reviews/2026-09-29-harness-harness-checker-2.md) | fixed: all 5 (red → green in `docs/evidence/phase-1-review-fixes-2-red.txt`; push deny + setup exit code without unit tests); a 3rd review is the human's call |
| 2026-09-29 | harness | harness-checker | gpt-6-astra / high | 0/1/1/0 | changes-requested (derived) | [report](../reviews/2026-09-29-harness-harness-checker-3.md) | fixed: both (red → green in `docs/evidence/phase-1-review-fixes-3-red.txt`); the guard's limits (wholesale reads) are documented in AGENTS.md as best effort, not a sandbox. Review triggered by the human |
