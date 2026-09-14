---
name: cdk-switch-ticket
description: Switches the active ticket context by updating .cdk/workflow-state.json and checking out the target branch, preserving all other in-flight ticket contexts. Use when the user wants to switch tickets, change the active story, or resume work on a different branch.
---

> **CDK** — Core Development Kit skill. Invoke as `/cdk:cdk-switch-ticket` in Claude Code.


## Role

Switch the **active** ticket without losing other in-flight contexts. Updates git branch and `active` flags in workflow state. Per-ticket files under `.cdk/<ticket-id>/` are preserved.

**Utility skill** — no workflow stage gate.

---

## Workflow (6 steps)

### 1. Read current state

Read `.cdk/workflow-state.json`.

| Condition | Action |
| --- | --- |
| Missing or empty | Inform: no tickets tracked; exit |
| Root is object (legacy) | Migrate silently to `[ { ...existingObject, "active": true } ]` and save |

### 2. Show available tickets

Display table:

| Ticket | Branch | Stage | Active |
| --- | --- | --- | --- |
| … | … | … | yes/no |

### 3. Resolve target ticket

- Use `<ticket-id>` from arguments if provided
- If target is **already active**: inform user; exit (no changes)
- If no argument: ask which ticket to activate
- If ticket not in array: suggest `/cdk:start-ticket <ticket-id>`

### 4. Handle uncommitted changes

```bash
git status --porcelain
```

If dirty, pause with **three options** (wait for user choice):

1. **Stash** — `git stash push -m "WIP on <current-branch>"`
2. **WIP commit** — `git add -A && git commit -m "chore: WIP <description>"`
3. **Abort** — stay on current ticket; exit

### 5. Switch git branch

```bash
git checkout <target-branch>
```

Use `branch` from the target workflow entry.

### 6. Update workflow state

Set all entries `"active": false`. Set target entry `"active": true`. Write JSON array back to `.cdk/workflow-state.json`.

Example:

```json
[
  { "ticket_id": "123", "branch": "feat/123-slug", "stage": "implemented", "active": false },
  { "ticket_id": "456", "branch": "feat/456-slug", "stage": "planned", "active": true }
]
```

---

<CHECKPOINT>

**Switched to:** `<ticket-id>` on branch `<branch>` (stage: `<stage>`)

**All tracked tickets:**

| Ticket | Branch | Stage | Active |
| --- | --- | --- | --- |

**Recommended next skill by stage:**

| Stage | Next skill |
| --- | --- |
| `started` | `/cdk:research` |
| `researched` | `/cdk:plan` |
| `planned` | `/cdk:implement` |
| `implemented` | `/cdk:commit`, `/cdk:review`, or `/cdk:create-pr` |

</CHECKPOINT>

## Preserved context

Switching does **not** delete or merge:

- `.cdk/<ticket-id>/research.md`
- `.cdk/<ticket-id>/plan.md`
- `.cdk/<ticket-id>/implementation-notes.md`

Only the **active** flag and current git branch change.
