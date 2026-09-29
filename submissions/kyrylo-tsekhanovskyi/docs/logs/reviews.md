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
| 2026-09-29 | spec | spec-checker | gpt-6-astra / high | 0/1/5/0 | changes-requested (derived) | [report](../reviews/2026-09-29-spec-spec-checker.md) | fixed: all 6 in the spec artifacts (design D2 `seq` ordering, D3 ordered choice writes + ISO 4217 list, D4 problem schemas, D5 exact comparison scope; contract MoneyTotal + RuleViolationProblemDetails + required fields; 4 new scenarios with tasks); a re-review is the human's call |
| 2026-09-29 | be | be-checker | gpt-6-astra / high | 0/0/3/0 | approve (derived) | [report](../reviews/2026-09-29-be-be-checker.md) | fixed: #1 (the migration test asserts no pending and ≥1 applied migration via EF); fixed: #2 (DAL owns `AddBomKeeperDatabase`/`MigrateBomKeeperDatabaseAsync`, and a new architecture test forbids DbContext/`.Database` in the Api; red in `docs/evidence/phase-3-be-review-fixes-red.txt`); #3 waived by human: kept as the documented "Analyzer exceptions" list in AGENTS.md, and the be-checker/be-maker roles reference it |
| 2026-09-29 | fe | fe-checker | gpt-6-astra / high | 0/0/1/0 | approve (derived) | [report](../reviews/2026-09-29-fe-fe-checker.md) | fixed: the health fetch in the e2e global setup is bounded by `AbortSignal.timeout(remaining)` |
| 2026-09-29 | harness | harness-checker | gpt-6-astra / high | 0/0/3/0 | approve (derived) | [report](../reviews/2026-09-29-harness-harness-checker-4.md) | #1 partly: NuGet add/remove without a prompt is the human's explicit decision (2026-09-29), now stated in AGENTS.md; PowerShell `ng update` added to ask; fixed: #2 (the staleness check restores the file, `scripts/lib/generated.mjs`, red in `docs/evidence/phase-3-harness-review-fixes-red.txt`); fixed: #3 (setup exits 1 when `dotnet tool restore` fails) |
