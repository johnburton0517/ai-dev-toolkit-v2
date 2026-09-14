---
name: cdk-help
description: Displays the cdk workflow overview, core steps, utility skills, and context file reference. Use when the user asks what cdk can do, how the workflow works, or wants a list of available skills.
---

> **CDK** — Core Development Kit skill. Use when the user invokes the `cdk-help` skill.


## Instructions

**Display the following help output exactly as written** (markdown tables and sections included). Do not run git checks, write files, or spawn agents — this skill is display-only.

---

## cdk (Core Development Kit)

Structured, spec-driven development workflow integrating GitHub Issues, multi-agent code review, and PR management.

Context is persisted across sessions in `.cdk/<ticket-id>/`. Issue fetch uses `gh` when available.

---

### Core Workflow

Run these skills in order for each ticket:

| Step | Skill | Description |
| ---- | ----- | ----------- |
| 1 | `/cdk:onboard` | Introduce the workflow and validate your environment (run once per project) |
| 2 | `/cdk:start-ticket <issue-number>` | Fetch GitHub Issue details, score story readiness, and create a feature branch |
| 3 | `/cdk:research` | Explore the codebase and capture findings |
| 4 | `/cdk:plan` | Create an implementation spec from research |
| 5 | `/cdk:implement` | Write code following the spec |

---

### Utility Skills

Available anytime — no workflow state required:

| Skill | Description |
| ----- | ----------- |
| `/cdk:commit` | Create a conventional commit with ticket reference |
| `/cdk:review [--scope=local\|branch\|full] [--skip=agents]` | Multi-agent code review (scope defaults to prompt) |
| `/cdk:switch-ticket <ticket-id>` | Switch the active ticket when working across multiple in-flight tickets |
| `/cdk:create-pr` | Create a pull request with full context |
| `/cdk:fix-review` | Address PR review comments |
| `/cdk:provide-feedback` | Submit structured pilot feedback |
| `/cdk:report-issue` | File a GitHub issue in ai-dev-toolkit |

---

### Context Files

Each ticket's context is stored in `.cdk/<ticket-id>/`:

| File | Written by | Contents |
| ---- | ---------- | -------- |
| `research.md` | `/cdk:research` | Codebase findings, tech stack, key files |
| `plan.md` | `/cdk:plan` | Implementation spec with tasks and acceptance criteria |
| `implementation-notes.md` | `/cdk:implement` | Summary of what was built |

Workflow state is tracked in `.cdk/workflow-state.json` as an **array** — all in-flight tickets preserved simultaneously. Use `/cdk:switch-ticket` to change the active ticket.

**Stages:** `started` → `researched` → `planned` → `implemented`

Example state:

```json
[
  { "ticket_id": "123", "branch": "feat/123-slug", "stage": "started", "active": true }
]
```

Project settings: `.cdk/settings.md` (from plugin `settings-template.md` — e.g. `base_branch`).

---

> Run `/cdk:onboard` to get started, `/cdk:start-ticket <ticket-id>` if already set up, or `/cdk:switch-ticket <ticket-id>` to resume a different in-flight ticket.
