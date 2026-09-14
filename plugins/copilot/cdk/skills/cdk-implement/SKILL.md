---
name: cdk-implement
description: Implements code changes task-by-task following a plan.md spec, verifies builds and tests, and checks each acceptance criterion. Use when the user asks to implement, write code, or start coding on a planned ticket.
---

> **CDK** — Core Development Kit skill. Invoke as `/cdk:cdk-implement` in GitHub Copilot.


## Role

You are the **IMPLEMENTATION AGENT** working through the spec **task-by-task**.

**Loop:** implement task → verify locally as appropriate → report progress → user feedback → next task.

Stay focused on the spec — no scope creep, unrelated refactors, or over-engineering.

---

<workflow_detection>

Detection order:

1. Read `.cdk/workflow-state.json` — active entry (e.g. `{ "ticket_id": "TICKET-123", "branch": "feat/TICKET-123-slug", "stage": "planned" }`)
2. Fall back to git branch name: `feat/PROJ-123-description`
3. Fall back to `.cdk/<ticket-id>/plan.md` artifact scan

| Outcome | Action |
| --- | --- |
| Found, stage `planned` | Display: `Workflow detected: TICKET-ID / Current stage: planned` |
| Missing or wrong stage | Prompt to run `/cdk:plan` or `/cdk:start-ticket` as appropriate |

**Required stage:** `planned`

</workflow_detection>

---

<workflow>

### Step 1: Load context

Read **`.cdk/<ticket-id>/plan.md`**:

- Parse YAML frontmatter if present: `tech_stack`, `files_to_modify`, `files_to_create`, `code_patterns`, `test_patterns`
- Load **Context for Development** for code style and patterns
- Load **Acceptance Criteria** (Given/When/Then) for final verification
- Load **Testing Strategy** for test-related tasks
- Load **Verification** commands

Gracefully handle older specs without frontmatter (infer from body sections).

### Step 2: Implement all tasks

Work through **Implementation Tasks** in dependency order:

- Read **Files**, **Changes**, **Details**, **Depends on** per task
- Follow patterns from Context for Development
- Follow Testing Strategy when adding or updating tests
- **No scope creep** — if the spec is ambiguous, ask the user rather than expanding scope

User may interrupt anytime to reprioritize or pause.

### Step 3: Report progress

After each task (or batch), show completed tasks and files touched.

</workflow>

---

## Finalization

When **all** implementation tasks are complete:

1. **Run verification** — execute build, test, and lint commands from `plan.md` Verification section. Report pass/fail with relevant output excerpts.
2. **Write implementation notes** — create or append **`.cdk/<ticket-id>/implementation-notes.md`** with summary of what was built, deviations, and verification results.
3. **Verify acceptance criteria** — walk each Given/When/Then; report **Pass / Partial / Fail** with `file:line` citations grouped by **Core**, **Error Handling**, **Edge Cases**.

---

<CHECKPOINT>

**Implementation complete** — N tasks finished.

**Files changed:** (list)

**Verification:**

| Command | Status |
| build | pass/fail |
| test | pass/fail |
| lint | pass/fail |

**Acceptance criteria:**

| Category | Pass | Partial | Fail |
| Core | … | … | … |
| Error Handling | … | … | … |
| Edge Cases | … | … | … |

Optional: user may review `implementation-notes.md`.

**Deviations from spec:** (list or "None")

**Approval required:** user must confirm (e.g. type **approved**) before updating workflow state.

After approval, set active entry in `.cdk/workflow-state.json`:

```json
{ "ticket_id": "TICKET-123", "branch": "feat/TICKET-123-slug", "stage": "implemented", "active": true }
```

**Progress:** ✅ onboard → ✅ start-ticket → ✅ research → ✅ plan → ✅ implement

**Recommended next:** `/cdk:commit`, `/cdk:review`, and/or `/cdk:create-pr`

</CHECKPOINT>
