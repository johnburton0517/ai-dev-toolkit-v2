---
name: cdk-provide-feedback
description: Collects structured pilot feedback and publishes it as a GitHub Discussion in NTTDATA-Launch/ai-dev-toolkit under the Pilot Feedback category. Use when the user wants to submit feedback, share their experience with cdk, or report how a workflow session went.
---

> **CDK** — Core Development Kit skill. Use when the user invokes the `cdk-provide-feedback` skill.


## Purpose

Collect lightweight, actionable pilot feedback and publish it as a **GitHub Discussion** in [NTTDATA-Launch/ai-dev-toolkit](https://github.com/NTTDATA-Launch/ai-dev-toolkit) under the **Pilot Feedback** category.

**Utility skill** — no workflow stage checks.

---

## Workflow (4 steps)

### 1. Gather feedback fields interactively

Collect:

**Participant (required)**

- Name
- Team
- Date (default today)
- AI tool used (Cursor, Copilot, Claude Code, etc.)

**Session context (required)** — 1–2 sentences: task attempted, skills/workflow stages used

**Experience signals (required)** — 1–3 bullets each:

- What worked well
- What was confusing or frustrating
- Top improvement priority

**Scorecard (required)** — 1–5 for each:

- Overall usefulness
- Ease of setup/onboarding
- Output quality/reliability

**Optional:** bug/repro notes, suggested skill copy changes, anything else

### 2. Validate completeness

Require: participant info, session context, all three experience prompts, all scorecard values.

Optional sections remain optional.

Show a summary and get **explicit confirmation** before posting.

### 3. Build feedback report markdown

**Title convention:** `Pilot Feedback - YYYY-MM-DD - <team-or-initials> - <Short Topic>`

`<Short Topic>`: 3–6 words, title case.

Write body to **`.tmp/feedback-body.md`** (create `.tmp/` if missing):

```markdown
# Pilot Feedback

## Participant
- Name:
- Team:
- Date:
- AI Tool:

## Session Context
{1-2 sentences}

## What Worked Well
- bullet

## What Was Confusing or Frustrating
- bullet

## Top Improvement Priority
- bullet

## Scorecard (1-5)
| Dimension | Score |
| --- | --- |
| Overall usefulness | |
| Ease of setup/onboarding | |
| Output quality/reliability | |

## Optional Detail
{bug notes, copy suggestions, etc.}
```

### 4. Create GitHub Discussion

**Preferred:** GitHub CLI GraphQL:

1. Query repository ID and **Pilot Feedback** category ID for `NTTDATA-Launch/ai-dev-toolkit`
2. Create discussion with title and `-F body=@.tmp/feedback-body.md`
3. On success, delete `.tmp/feedback-body.md`

If category is missing: inform user and stop (do not post to wrong category).

If `gh` is unavailable: show the markdown to the user and link to manual creation:

https://github.com/NTTDATA-Launch/ai-dev-toolkit/discussions/new?category=pilot-feedback

---

<CHECKPOINT>

Report:

- Repository: `NTTDATA-Launch/ai-dev-toolkit`
- Discussion title
- Discussion URL
- Date and participant

Suggest `/cdk:report-issue` for follow-up bugs or feature requests.

</CHECKPOINT>
