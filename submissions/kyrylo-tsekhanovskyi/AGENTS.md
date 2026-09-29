# BOMKeeper: rules for all agents

Canonical rules for Claude Code, Codex and Antigravity. Tool-specific files are thin adapters over this
file, `.agents/roles/` and `.agents/skills/`. **This file wins over any skill or adapter.**
Start every tool from this folder (`submissions/kyrylo-tsekhanovskyi/`).

## Project overview

BOMKeeper is a web application for managing DIY projects. A project usually needs many items, and they
are scattered across web stores and platforms like OLX and eBay. Some sellers allow chat and
negotiation, prices vary, and it is easy to lose track of which offers you made, which seller is not
responding, or who is a scammer. BOMKeeper moves this out of browser bookmarks and tabs.
Plan: [`docs/plan-mvp1.md`](docs/plan-mvp1.md). Decisions: [`docs/adr/`](docs/adr/). Behaviour: `openspec/specs/`.

## Tech stack

.NET 10, C# 14, ASP.NET Core controllers, EF Core 10 + Npgsql, PostgreSQL 17, .NET Aspire 13, xUnit,
Testcontainers · Angular 22 + Angular Material, TypeScript, SCSS, Vitest, ESLint, Prettier, Playwright.

## Build and test commands

| Command | What it does |
|---|---|
| `npm run setup` | once, by the human: installs the git pre-commit hook and checks prerequisites |
| `npm run check` | full gate: harness + backend + frontend (Docker must be running) |
| `npm run check:be` / `check:fe` / `check:harness` | one side; add `-- --fast` for build/lint + unit tests only |
| `npm run check:be -- --red <task-id> [--filter <expr>]` | TDD red run, saves the evidence (`check:fe` works the same) |
| `npm run review:be` / `review:fe` / `review:harness` / `review:spec` | cross-vendor checker; writes the report and the ledger row |
| `npm run skills:sync` | copies `.agents/skills` to `.claude/skills` after a skill update |
| `npm run start`, `build:fe`, `e2e` | run the app / build the UI / Playwright (from phase 3) |

## Code style

- Backend: the skills `dotnet-best-practices`, `dotnet-design-pattern-review` and `dotnet-backend-patterns`,
  plus the [C# coding conventions](https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/coding-style/coding-conventions).
- Frontend: the skills `angular-developer` and `angular-new-app`.
- **Overrides of the skills:** tests use xUnit + plain `Assert`. Not used: MSTest, FluentAssertions
  (commercial licence), Moq, ResourceManager/.resx localization, Semantic Kernel, Dapper, AutoMapper
  (DTOs are mapped by hand), Tailwind (Angular Material instead), Karma/Jest (Vitest instead).

## Architecture constraints

- Backend projects: `BOMKeeper.Entities` ← `BOMKeeper.DAL` ← `BOMKeeper.BLL` ← `BOMKeeper.Api`. Entities,
  DAL and BLL are separate DLLs. The Api is the HTTP host and composition root, and holds the
  controllers. It references the DAL only for DI registration. `BOMKeeper.AppHost` (Aspire) only
  launches. An architecture test enforces the direction.
- Controllers are thin: validation and domain rules live in the BLL, and errors map to ProblemDetails.
- Code-first database with EF Core migrations in the DAL.
- A single Angular app. Its API types are generated from the OpenAPI contract.
- The repository works equally well with Claude Code, Codex and Antigravity.

## Workflow and definition of done

1. Every change starts as an OpenSpec change (`openspec/changes/<change>/`): proposal, design, spec
   deltas with testable scenarios, `contracts/openapi.yaml`, and `tasks.md` with numbered sections
   headed `## N. Shared|Backend|Frontend: <area>`. A cross-vendor spec review (`npm run review:spec`)
   runs first, then the **human approves it before any code**.
2. Every task follows TDD: a `[checks]` task (`- [ ] 2.1 [checks] …`) comes before its implementation task.
3. Done means: `npm run check` is green, the checker reviews are logged and resolved, the docs and ADRs
   are updated, and the change is archived into `openspec/specs/`.

## Roles and models

| Role | Who | Model / effort |
|---|---|---|
| Planning, orchestration, OpenSpec proposals | main session (plan mode) | Opus 5.5 `claude-opus-5-5` / high |
| `be-maker`, `fe-maker` ([roles](.agents/roles/)) | Claude Code subagents | Opus 5.5 `claude-opus-5-5` / low |
| `be-checker`, `fe-checker`, `harness-checker`, `spec-checker` | Codex CLI, read-only | Astra 6 `gpt-6-astra` / high |

Makers write only in their own folder (`backend/` or `frontend/`). They treat `openspec/**` and this
file as read-only, apart from ticking their own tasks, and they escalate contract changes to the human.

## Boundaries

- Commits are allowed only after the tests pass and static analysis finds no issues. *Enforced by
  `.githooks/pre-commit` → `npm run check`.*
- Commits are initiated by the human after review. Agents never run `git commit` or `git push`. *Enforced
  by the deny rules in `.claude/settings.json`; in Codex and Antigravity this is a prompt rule.*
- Agents propose the commit message in `.agent-work/COMMIT_MSG.md`: a Conventional Commit with an
  extensive description of the work (what, why, evidence) and no Co-Authored-By trailer.
- Rules, skills and docs are kept up to date in the same change that makes them stale.
- Development is test-driven: for every task, the checks (tests derived from the OpenSpec scenarios)
  are written first and run red before the first line of production code, then made green, then
  refactored. The red run output is saved as evidence in the OpenSpec change
  (`openspec/changes/<change>/evidence/<task>-red.txt`). *Enforced by `check --red`; `npm run check` fails
  when a ticked `[checks]` task has no evidence.*
- Every review done by a checker agent is logged: the full report goes to `docs/reviews/`, and a row
  (date, scope, reviewer, model/effort, findings, resolution) is appended to `docs/logs/reviews.md`.
  *Done by `scripts/review.mjs`. The Resolution cell is filled in before the commit, and
  `npm run check` fails while any Resolution is empty.*
- When an agent reaches its retry limit and stops, this is logged in `docs/logs/retry-stops.md` (date,
  agent, model/effort, task, limit reached, last failure, what happened next) before any further
  action. *Limits: maker 5 attempts (role prompt), Stop hook 3 re-entries and checker 2 runs (both
  scripted). Use `node scripts/log-retry-stop.mjs`.*
- Never read or write `.env*` files (`.env.example` is fine), and never run commands that read files
  wholesale in a folder that may hold one (`grep -r`, `cat *`, `Get-Content *`). *`scripts/hooks/protect-env.mjs`
  blocks direct access by path or command (names in any case, suffixes, redirection, dotfile globs), and
  content that merely mentions `.env` is allowed. It is best effort, not a sandbox: wholesale reads are a
  prompt rule. Guard bypasses found in review are fixed when cheap; otherwise the human waives them.*

## Where things live

- `.agents/skills/`: vendored skills, canonical (read by Codex and Antigravity). Sources and hashes are
  in `skills-lock.json`. `.claude/skills/` is a synced copy. OpenSpec skills and commands are
  generated by `openspec update`.
- `.agents/roles/`: role prompts. `.claude/agents/`: Claude subagent adapters.
- Hooks: `scripts/hooks/*.mjs`, wired in `.claude/settings.json`, `.codex/hooks.json` (needs trust via
  `/hooks`) and `.agents/hooks.json` (Antigravity). The Stop check loop runs in Claude Code only, where
  the makers run.
- `docs/logs/`: review and retry-stop ledgers · `docs/reviews/`: checker reports ·
  `docs/autonomy-log.md`: course autonomy log.
