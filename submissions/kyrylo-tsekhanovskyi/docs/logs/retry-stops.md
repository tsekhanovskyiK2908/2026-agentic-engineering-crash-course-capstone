# Retry-limit stop ledger

Append-only. One row each time an agent hits a retry limit and stops, written **before any further action**
by `node scripts/log-retry-stop.mjs` (the Stop hook calls it itself). Each row is also mirrored as a
"Зниження" / "Підвищення" line in the [autonomy log](../autonomy-log.md).

Limits: maker (5 failed attempts at the scoped check) · Stop hook (3 re-entries) · checker run (fails twice).

The `_none yet_` row means that no stop has happened so far.

| Date | Agent | Model / effort | Task | Limit reached | Last failure | What happened next |
|---|---|---|---|---|---|---|
| _none yet_ | | | | | | |
