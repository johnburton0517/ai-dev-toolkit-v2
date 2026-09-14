---
name: cdk-start-ticket
description: Fetches a GitHub Issue via gh CLI, scores story readiness, creates a feature branch, and initializes workflow state in .cdk/. Use when the user wants to start work on a ticket, begin a GitHub issue, or kick off a new feature branch.
---

{{{HEADER}}}

## Role

You kick off work on a GitHub Issue: fetch context with `gh`, score story readiness, create a feature branch, initialize `.cdk/<ticket-id>/`, update workflow state, and optionally label the issue.

---

## Workflow detection

Before reading state, **migrate legacy format silently**:

- If `.cdk/workflow-state.json` root is a **single object** (not an array), rewrite as:
  ```json
  [ { ...existingObject, "active": true } ]
  ```

Then read the array and find the entry with `"active": true`.

| Condition | Action |
| --- | --- |
| Active workflow exists | Warn which ticket/branch is active; ask user to confirm before starting a **new** ticket |
| No active workflow | Inform: "No active workflow. Ready to start new ticket." |

---

## Uncommitted changes detection

Run:

```bash
git status --porcelain
```

If the working tree is **dirty**, pause and present **three options** — wait for user choice before continuing:

1. **Stash** — `git stash push -m "WIP on <current-branch>"`
2. **WIP commit** — `git add -A && git commit -m "chore: WIP <description>"` (user supplies short description)
3. **Abort** — stay on current branch; exit skill

---

## Workflow (6 steps)

### 1. Parse ticket ID

From skill arguments, accept a GitHub issue number: `123` or `#123`. Normalize to digits only for `ticket_id` (e.g. `123`).

If invalid or missing, ask the user for the issue number. Optionally help discover issues:

```bash
gh issue list --limit 20
```

### 2. Fetch GitHub Issue

Use **GitHub CLI** to fetch:

```bash
gh issue view <number> --json number,title,body,labels,milestone,assignees,state
```

Extract:

- Summary → `title`
- Description → `body`
- Acceptance criteria (AC) → parse from body (look for an AC / Acceptance Criteria section, or checklist items)

If `gh` is unavailable or the issue cannot be fetched, prompt the user to paste summary, description, and AC manually.

### 2a. Evaluate story readiness

Score **5 checks**:

| # | Check | Pass condition |
| --- | --- | --- |
| 1 | Has description | Non-empty issue body |
| 2 | Has acceptance criteria | AC section or checklist with ≥1 criterion |
| 3 | AC is self-contained | Not solely external links |
| 4 | Has labels or milestone | At least one label or a milestone set |
| 5 | No blocking dependencies | No open blockers (e.g. "blocked by" open issues, or a `blocked` label) |

Present inline score **X/5** with a status table (pass/fail per row).

| Score | Action |
| --- | --- |
| **5/5** | Proceed automatically |
| **3–4/5** | Warn with gaps; ask whether to proceed anyway |
| **≤2/5** | Strongly recommend refining the story; ask whether to proceed anyway |

Do not proceed without user acknowledgment when score is below 5/5.

### 3. Create feature branch

Resolve **base branch** (first match wins):

1. `.cdk/settings.md` frontmatter → `base_branch`
2. Remote default: `git symbolic-ref refs/remotes/origin/HEAD 2>/dev/null | sed 's|refs/remotes/origin/||'`
3. Fallback: `main`

```bash
git checkout <base-branch>
git pull
git checkout -b feat/<ticket-id>-<summary-slug>
```

`<summary-slug>`: lowercase, hyphenated, ~3–6 words from issue title, alphanumeric only.

### 4. Create ticket directory

```bash
mkdir -p .cdk/<ticket-id>
```

### 5. Write workflow state

Read current array (or `[]`). Set **every** entry `"active": false`. Append or update the target ticket entry:

```json
[
  {
    "ticket_id": "123",
    "branch": "feat/123-slug",
    "stage": "started",
    "active": true
  }
]
```

Valid stages: `started` → `researched` → `planned` → `implemented`

Write to `.cdk/workflow-state.json` with readable formatting.

### 6. Label GitHub Issue (optional, non-blocking)

```bash
gh label create "ai-dev-toolkit:cdk" --force 2>/dev/null || true
gh issue edit <number> --add-label "ai-dev-toolkit:cdk"
```

Skip if the label is already present on the issue.

On `gh` failure: **warn only** — do not block the workflow.

---

<CHECKPOINT>

Report:

- **Ticket ID** (issue number)
- **Branch name**
- **Acceptance criteria** (bulleted summary)

**Progress:** ✅ start-ticket → ➡️ research

**Recommended next:** `/cdk:research`

</CHECKPOINT>

## Runtime artifacts

| Path | Purpose |
| --- | --- |
| `.cdk/<ticket-id>/` | Empty directory for upcoming `research.md`, `plan.md`, etc. |
| `.cdk/workflow-state.json` | Array of in-flight tickets; exactly one `active: true` |
