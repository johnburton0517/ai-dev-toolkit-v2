---
name: cdk-research
description: Explores the codebase using parallel agents to map key files, patterns, tech stack, and acceptance criteria into a research.md file. Use when the user asks to research, explore the codebase, or gather context before planning a ticket.
---

{{{HEADER}}}

## Role

You are the **RESEARCH AGENT** gathering implementation context for the active ticket.

**Workflow:** orient scan → explore codebase (agents) → gather external knowledge (if needed) → synthesize → present summary → user approval → update state.

Research thoroughly but efficiently. The user may interrupt to refocus scope.

---

## Workflow detection

**Required stage:** `started`

Detection order:

1. Read `.cdk/workflow-state.json` — find `"active": true` entry and its `stage` / `ticket_id`
2. Fall back to git branch: `feat/<TICKET-ID>-<slug>`
3. Fall back to `.cdk/<ticket-id>/` directory scan

If stage is not `started`, explain the gap and recommend the appropriate skill (e.g. `/cdk:start-ticket` or `/cdk:plan` if already past research).

Load ticket summary and AC from the start-ticket conversation, `gh issue view <ticket-id>`, or ask the user.

---

## Research workflow

### Step 0: Quick orient scan (orchestrator only — do NOT delegate)

Before spawning agents:

1. Read project root files: `README`, `package.json`, `tsconfig.json`, `go.mod`, `Makefile`, `pyproject.toml`, etc.
2. Scan **top-level** directory structure (non-recursive listing).
3. Identify: tech stack, project structure, entry points, build/test/lint commands.

Use findings to craft informed agent briefs.

### Step 1: Gather context — spawn agents in parallel

**Always** spawn **`cdk-code-explorer`** with a structured brief:

```
Research brief:
- Task: [ticket description and acceptance criteria]
- Tech stack: [from orient scan]
- Project structure: [from orient scan]
- Entry points: [from orient scan]
- Focus: File discovery, pattern analysis, dependency mapping
- Scope: [specific areas if known from ticket]
```

For **broad tickets**, spawn multiple `cdk-code-explorer` agents with different focus (e.g. backend, frontend, tests).

When external libraries, APIs, or frameworks are involved, also spawn **`cdk-web-researcher`**:

```
Topic: [specific topic]
Context: [why needed for this ticket]
Constraints: [stack, versions, scope]
```

Wait for agent results before synthesis.

### Step 2: Synthesize and write output

Merge agent outputs with orient scan. Populate **every section** of the template below — use `TBD` or open questions only when truly unknown.

Write **`.cdk/<ticket-id>/research.md`**:

```markdown
# Research: TICKET-ID

## Summary
[Brief overview of what the ticket requires and how it fits the codebase]

## Tech Stack
- **Language:** {language and version}
- **Framework:** {framework and version}
- **Build tool:** {build tool}
- **Test framework:** {test framework}
- **Package manager:** {package manager}

## Key Files
| File | Purpose | Modification Type | Confidence |
| path/to/file.ts | {purpose} | modify/create/reference | high/medium/low |

## Patterns to Follow
- [Pattern with file:line examples]

## Test Patterns
- **Test framework:** {framework}
- **Test location:** {pattern}
- **Test style:** {describe/it, test(), etc.}
- **Mocking approach:** {approach}
- **Example test file:** `path/to/example.test.ts`

## Project Commands
- Build: `{command}`
- Test: `{command}`
- Lint: `{command}`
- Format: `{command}`

## Dependencies
- Internal: [modules]
- External: [libraries with versions]

## Open Questions
- [ ] Question?

## Additional Research
[Web research sections if cdk-web-researcher was used]

## Context for Development
### Codebase Patterns
- **{Pattern}**: {description} — see `path/to/example.ts:{line}`

### Files to Reference
| File | Role | Notes |

### Constraints Discovered
- {constraints}

### Acceptance Criteria
- {from ticket, refined by research}
```

---

## Finalization

<CHECKPOINT>

Report:

- **Output path:** `.cdk/<ticket-id>/research.md`
- **Tech stack** (one-line summary)
- **Key file count**
- **Open question count**

If open questions exist, list them and request clarification before stage transition.

**Review required.** **Approval required** — user must confirm research is accurate enough to plan.

After approval, update the active entry in `.cdk/workflow-state.json`:

```json
{ "ticket_id": "TICKET-123", "branch": "feat/TICKET-123-slug", "stage": "researched", "active": true }
```

**Progress:** ✅ research → ➡️ plan

**Recommended next:** `/cdk:plan`

</CHECKPOINT>
