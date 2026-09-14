# CDK — Core Development Kit

Structured development workflow from GitHub Issue to pull request. Context and progress live in **`.cdk/`** on the user's project (gitignored). The plugin supplies skills and review agents; ticket fetch uses the **GitHub CLI** (`gh`).

## Workflow overview

For each ticket, run **core skills in order**. Utility skills are available at any time.

```text
onboard (once) → start-ticket → research → plan → implement → commit / review / create-pr
```

Multi-ticket work is supported: workflow state is a **JSON array**; use **switch-ticket** to change which ticket is active without losing other contexts.

## Core workflow skills

| Step | Skill | Purpose |
| --- | --- | --- |
| 1 | `cdk-onboard` | Introduce workflow; validate git, `gh`, settings, gitignore (once per project) |
| 2 | `cdk-start-ticket` | Fetch GitHub Issue, score story readiness, create branch, init `.cdk/<ticket-id>/` |
| 3 | `cdk-research` | Orient scan + parallel exploration; write `research.md` |
| 4 | `cdk-plan` | Architect-driven spec with user review; write `plan.md` |
| 5 | `cdk-implement` | Task-by-task implementation, verification, AC check; write `implementation-notes.md` |

Invocation (after install): `/cdk:onboard`, `/cdk:start-ticket 123`, `/cdk:research`, etc.

## Utility skills

| Skill | Purpose |
| --- | --- |
| `cdk-help` | Display workflow overview and context file reference |
| `cdk-switch-ticket` | Set active ticket and checkout its branch |
| `cdk-commit` | Conventional commit with optional `[#123]` |
| `cdk-review` | Parallel six-agent code review (`--scope=local\|branch\|full`, `--skip=`) |
| `cdk-create-pr` | GitHub PR with structured body (`gh` required) |
| `cdk-fix-review` | Triage and fix PR review comments |
| `cdk-provide-feedback` | Pilot feedback → GitHub Discussion in ai-dev-toolkit |
| `cdk-report-issue` | Bug/feature report → GitHub Issue in ai-dev-toolkit |

## Agents (spawned, not user-invocable)

| Agent | Focus | Spawned by |
| --- | --- | --- |
| `cdk-code-explorer` | Codebase exploration, patterns, key files | `cdk-research` |
| `cdk-web-researcher` | External docs/API research | `cdk-research` (when needed) |
| `cdk-code-architect` | Implementation blueprint from research | `cdk-plan` |
| `cdk-code-reviewer` | Guidelines, bugs, quality | `cdk-review` |
| `cdk-code-simplifier` | Clarity and maintainability | `cdk-review` |
| `cdk-comment-analyzer` | Comments and docs accuracy | `cdk-review` |
| `cdk-test-analyzer` | Test coverage and quality | `cdk-review` |
| `cdk-silent-failure-hunter` | Error handling, silent failures | `cdk-review` |
| `cdk-type-design-analyzer` | Types and invariants | `cdk-review` |

Agent sources: `src/plugins/cdk/agents/*.md`.

## GitHub Issues (via `gh`)

No Atlassian MCP is required. Ticket integration uses the GitHub CLI:

```bash
gh issue list --limit 20
gh issue view 123 --json number,title,body,labels,milestone,assignees,state
gh issue edit 123 --add-label "ai-dev-toolkit:cdk"
```

Used by **`cdk-onboard`** (`gh` + auth check) and **`cdk-start-ticket`** (fetch + optional label). If `gh` is unavailable, users can paste issue details manually.

Ticket IDs are GitHub issue numbers (`123` or `#123`); workflow state stores digits only (e.g. `"123"`).

## `.cdk/` state model

All paths are relative to the **user's project root** (not the ai-dev-toolkit repo).

### `workflow-state.json`

JSON **array** of in-flight tickets. Exactly one entry should have `"active": true`.

```json
[
  {
    "ticket_id": "123",
    "branch": "feat/123-short-slug",
    "stage": "started",
    "active": true
  }
]
```

| Field | Description |
| --- | --- |
| `ticket_id` | GitHub issue number (digits only) |
| `branch` | Feature branch for this ticket |
| `stage` | `started` → `researched` → `planned` → `implemented` |
| `active` | Whether this ticket is the current context |

Legacy single-object files are migrated to a one-element array with `active: true`.

### Per-ticket directory: `.cdk/<ticket-id>/`

| File | Written by | Contents |
| --- | --- | --- |
| `research.md` | `cdk-research` | Tech stack, key files, patterns, AC context |
| `plan.md` | `cdk-plan` | Implementation spec (YAML frontmatter + tasks + Given/When/Then AC) |
| `implementation-notes.md` | `cdk-implement` | What was built, verification, deviations |

### `settings.md`

Copy from plugin **`settings-template.md`** to **`.cdk/settings.md`** (or create during onboard):

```yaml
---
base_branch: main
---
```

Used for branch creation, PR base, and branch-scoped review diffs.

### Gitignore

Projects should ignore **`.cdk`** in `.gitignore` so local workflow state stays out of version control. **`cdk-onboard`** can add the entry automatically.

## Plugin layout (source)

```text
src/plugins/cdk/
├── plugin.yaml
├── README.md                 ← this file
├── settings-template.md
├── agents/                   ← 9 spawned agents
└── skills/
    └── cdk-<name>/SKILL.md   ← 13 user-invocable skills
```

Built artifacts are emitted under `plugins/claude/cdk/`, `plugins/copilot/cdk/`, and `plugins/cursor/cdk/` when you run `npm run build` from the ai-dev-toolkit repository root.
