---
name: cdk-onboard
description: Introduces the cdk workflow and validates the development environment including git, GitHub CLI, and .cdk settings. Use when the user is new to cdk, wants to set up the workflow, or asks how to get started.
---

> **CDK** — Core Development Kit skill. Invoke as `/cdk:cdk-onboard` in Claude Code.


## Role

You introduce the **cdk (Core Development Kit)** workflow and validate the user's development environment. Follow the **four-phase execution contract** below strictly — do not skip ahead.

## Execution contract (must follow in order)

1. Display the full **Phase 1** overview tables first.
2. Ask the **Phase 2** confirmation question.
3. Only after **explicit user confirmation**, run **Phase 3** environment checks.
4. **Do NOT** run environment checks before Phase 1 and Phase 2 are complete.

---

## Phase 1: Introduction

Welcome the user to cdk — a structured, spec-driven workflow from GitHub Issue to pull request, with context persisted under `.cdk/<ticket-id>/`.

### Core Workflow

Run these skills in order for each ticket:

| Step | Skill | Purpose |
| --- | --- | --- |
| 1 | `/cdk:onboard` | You are here — validate environment (once per project) |
| 2 | `/cdk:start-ticket <issue-number>` | Fetch GitHub Issue, score readiness, create branch |
| 3 | `/cdk:research` | Explore codebase; write `research.md` |
| 4 | `/cdk:plan` | Create implementation spec; write `plan.md` |
| 5 | `/cdk:implement` | Implement from spec; verify AC |

### Utility Skills

Available anytime — no workflow stage required:

| Skill | Purpose |
| --- | --- |
| `/cdk:switch-ticket <ticket-id>` | Switch active ticket when multiple are in flight |
| `/cdk:commit` | Conventional commit with optional issue reference |
| `/cdk:review` | Parallel multi-agent code review |
| `/cdk:create-pr` | GitHub PR with structured body |
| `/cdk:fix-review` | Address PR review comments |
| `/cdk:provide-feedback` | Submit pilot feedback (GitHub Discussion) |
| `/cdk:report-issue` | File issue in ai-dev-toolkit |
| `/cdk:help` | Display workflow overview |

Supporting plugin files (for your reference when explaining setup):

- **`src/plugins/cdk/settings-template.md`** — copy to `.cdk/settings.md` in the user's project (`base_branch`, branch naming notes).
- Ticket fetch uses **GitHub CLI** (`gh issue view` / `gh issue list`) — no Atlassian MCP required.

---

## Phase 2: Confirmation

Ask exactly:

> **Ready to validate your environment for cdk?**

Wait for explicit confirmation (yes / proceed / similar) before Phase 3.

---

## Phase 3: Environment Validation

<activation>

Run checks **in order**. Record each result as **PASS**, **WARNING**, or **FAIL**.

### Check 1: Git repository — required

```bash
git rev-parse --git-dir
```

| Result | Action |
| --- | --- |
| PASS | Repository detected |
| FAIL | Tell user: run `git init` (or open a git-backed project), then re-run `/cdk:onboard` |

### Check 2: GitHub CLI — recommended

```bash
gh --version
gh auth status
```

| Result | Action |
| --- | --- |
| PASS | `gh` available and authenticated — needed for `/cdk:start-ticket`, `/cdk:create-pr`, `/cdk:fix-review` |
| WARNING | Not installed or not authenticated — recommend `brew install gh` then `gh auth login` (or platform equivalent); user can paste issue details manually during start-ticket |

### Check 3: Settings file — recommended

Look for `.cdk/settings.md` in the project root.

| Result | Action |
| --- | --- |
| PASS | File exists — read `base_branch` from YAML frontmatter if present |
| WARNING | Missing — offer to create from plugin template |

If the user accepts, create `.cdk/settings.md` with content from **`settings-template.md`**:

```markdown
---
base_branch: main
---

# Project-Specific Configuration

## Git Workflow
- Base branch for PRs: main
- Branch naming: feat/<ticket>-<summary>

## Notes
Add any project-specific workflow notes here.
```

Create `.cdk/` directory if needed.

### Check 4: Gitignore entry — required for clean repos

Ensure `.gitignore` ignores workflow state:

```bash
grep -qxF '.cdk' .gitignore 2>/dev/null || printf '\n.cdk\n' >> .gitignore
```

If you appended `.gitignore`, stage and commit (only with user approval if they prefer to commit themselves):

```bash
git add .gitignore
git commit -m "chore: ignore .cdk workflow directory"
```

| Result | Action |
| --- | --- |
| PASS | `.cdk` already ignored or now ignored |
| FAIL | Could not update `.gitignore` — instruct user to add `.cdk` manually |

### Check 5: Copilot plugin files — conditional


</activation>

---

## Phase 4: Ready state

Display a summary table:

| Check | Status | Notes |
| --- | --- | --- |
| Git repository | PASS / FAIL | … |
| GitHub CLI | PASS / WARNING | … |
| Settings (`.cdk/settings.md`) | PASS / WARNING | … |
| Gitignore (`.cdk`) | PASS / FAIL | … |
| Copilot plugin files | PASS / WARNING / N/A | … |

**Overall:** **READY** if Check 1 and Check 4 are PASS (and no unrecoverable FAIL). Otherwise **NOT READY**.

---

## END STATE

<CHECKPOINT>

### If READY

> Environment is **READY** for cdk.
>
> **Next:** `/cdk:start-ticket <ISSUE-NUMBER>`
>
> **Core workflow progress:** ✅ onboard → ➡️ start-ticket → research → plan → implement
>
> **Utility skills:** switch-ticket, commit, review, create-pr, fix-review, provide-feedback, report-issue, help

### If NOT READY

> Environment is **NOT READY**. Fix the FAIL items above, then run `/cdk:onboard` again.

</CHECKPOINT>

### Runtime artifacts (when applicable)

- `.cdk/settings.md` (if user accepted creation)
- `.gitignore` entry for `.cdk` (if missing)
- `.cdk/` directory (created when settings are written)
