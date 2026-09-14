---
name: cdk-review
description: Runs parallel multi-agent code review across six reviewers covering code quality, simplicity, comments, tests, error handling, and type design. Use when the user asks to review code, run a code review, or check changes before opening a PR.
---

{{{HEADER}}}

## Role

You are the **REVIEW AGENT** orchestrating multi-agent code review.

**Workflow:** determine scope → collect files and diffs → categorize by risk → run parallel reviewers → synthesize findings → recommend action.

**Utility skill** — runs anytime; no workflow stage checks.

---

## Review agents

Spawn **all enabled** agents **in parallel**. Parse `--skip=` from arguments to exclude agents by key.

| Agent | Focus | Skip key |
| --- | --- | --- |
| `cdk-code-reviewer` | Guidelines, bugs, quality | `code` |
| `cdk-code-simplifier` | Clarity, consistency, maintainability | `simplify` |
| `cdk-comment-analyzer` | Comment accuracy, docs quality | `comments` |
| `cdk-test-analyzer` | Test coverage gaps, quality | `tests` |
| `cdk-silent-failure-hunter` | Error handling, silent failures | `errors` |
| `cdk-type-design-analyzer` | Type design, invariants | `types` |

Example: `/cdk:review --skip=simplify,comments`

Agent definitions: `src/plugins/cdk/agents/*.md`

---

## Review workflow

### Step 1: Determine review scope

Parse `--scope=local|branch|full` from arguments.

If **not** provided, **ask the user** to choose:

1. **Local changes** — uncommitted + untracked
2. **Branch changes** — all commits on current branch vs base
3. **Full codebase** — everything tracked

Wait for selection before continuing.

| Scope | What is reviewed |
| --- | --- |
| `local` | Uncommitted tracked changes + untracked files |
| `branch` | All commits on branch vs base branch |
| `full` | Entire tracked codebase |

**File collection:**

| Scope | Files | Diff |
| --- | --- | --- |
| `local` | `git diff --name-only HEAD` plus `git ls-files --others --exclude-standard` | `git diff HEAD -- <file>`; read untracked files directly |
| `branch` | `git diff --name-only <base>...HEAD` | `git diff <base>...HEAD -- <file>` |
| `full` | `git ls-files` | read files directly (note scope in brief) |

**Base branch** (for `branch` scope only):

1. `.cdk/settings.md` → `base_branch`
2. `git symbolic-ref refs/remotes/origin/HEAD 2>/dev/null | sed 's|refs/remotes/origin/||'`
3. Fallback: `main`

Store: **scope name**, **exact file list**, and **exact diff command pattern**. Pass all three explicitly to **every** sub-agent.

### Step 2: Categorize files and run reviews

Group files by risk:

- **High:** auth, security, data persistence, public APIs
- **Medium:** business logic, integrations
- **Low:** UI polish, docs, tests-only (still review tests via test-analyzer)

Spawn enabled review agents in parallel. **Each spawn brief must include:**

- Review scope name
- Exact file list (or explicit "full repo" instruction)
- Exact diff command to use per file

Agents must **only** review the specified scope.

### Step 3: Categorize findings

Merge agent outputs. Classify each finding:

| Severity | Meaning |
| --- | --- |
| **Critical** | Must fix before PR |
| **Warning** | Should fix |
| **Info** | Nice to have |

---

<CHECKPOINT>

**Findings summary**

| Severity | Count |
| --- | --- |
| Critical | N |
| Warning | N |
| Info | N |

If action items exist:

| Priority | Category | File/Area | Action |
| --- | --- | --- | --- |
| … | … | … | … |

Ask the user which items to address now vs defer.

**Note:** This skill does **not** write artifacts under `.cdk/` — findings are presented in chat only.

</CHECKPOINT>
