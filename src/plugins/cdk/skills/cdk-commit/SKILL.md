---
name: cdk-commit
description: Stages and creates a conventional commit (feat, fix, docs, style, refactor, test, chore) with optional GitHub issue reference. Use when the user asks to commit, create a git commit, or save their changes.
---

{{{HEADER}}}

## Commit format

```
type: short description [TICKET-ID optional]

Optional longer description (wrap ~72 chars).
```

### Types

| Type | When to use | Example |
| --- | --- | --- |
| feat | New feature or user-visible behavior | `feat: add ticket readiness score [#123]` |
| fix | Bug fix | `fix: handle empty AC section [#123]` |
| docs | Documentation only | `docs: document workflow state array [#123]` |
| style | Formatting, no logic change | `style: normalize plan headings [#123]` |
| refactor | Code change without feature/fix | `refactor: extract branch resolver [#123]` |
| test | Tests only | `test: cover readiness scoring [#123]` |
| chore | Maintenance, deps, tooling | `chore: update lockfile [#123]` |
| perf | Performance improvement | `perf: cache orient scan results [#123]` |
| ci | CI/CD changes | `ci: add build step for cdk plugin [#123]` |
| build | Build system or artifacts | `build: emit cursor skills [#123]` |

Omit `[#123]` entirely when no ticket applies (do not use empty brackets).

### Quick checks

- **Ticket?** Append `[TICKET-ID]` from active `.cdk/workflow-state.json` entry or branch name; omit brackets if none
- **Breaking?** Use `type!:` (e.g. `feat!: …`) and explain in body
- **Subject:** imperative, concise, no trailing period; ≤50 characters when practical
- **Body:** wrap ~72 characters; explain why when helpful
- **AI-assisted:** append `Co-Authored-By:` trailer after body when appropriate

---

## Workflow

Gather git context (run in parallel when possible):

```
- Current git status: !`git status`
- Current git diff (staged and unstaged changes): !`git diff HEAD`
- Current branch: !`git branch --show-current`
- Recent commits: !`git log --oneline -10`
```

Then:

1. Propose a **single** conventional commit message matching the diff.
2. Stage all intended files and create **one** commit.
3. In the **same response** as staging/committing, use tool calls only — do not send explanatory prose alongside the commit tool calls (message can be shown in CHECKPOINT after success).

Align with repo commitlint rules (`CLAUDE.md` / husky).

**Utility skill** — no workflow stage checks.

---

<CHECKPOINT>

> Commit created: `<hash>`
> Message: `<message>`

</CHECKPOINT>
