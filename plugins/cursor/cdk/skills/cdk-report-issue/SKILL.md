---
name: cdk-report-issue
description: Collects bug or feature request details and files a GitHub issue in NTTDATA-Launch/ai-dev-toolkit. Use when the user wants to report a bug, request a feature, or file an issue against the ai-dev-toolkit.
---

> **CDK** — Core Development Kit skill. Use when the user invokes the `cdk-report-issue` skill.


## Purpose

Capture actionable bug or feature context and file a GitHub issue in [NTTDATA-Launch/ai-dev-toolkit](https://github.com/NTTDATA-Launch/ai-dev-toolkit) without leaving the coding session.

**Utility skill** — no workflow stage checks.

---

## Workflow (5 steps)

### 1. Gather issue details interactively

**Required for all types:**

- Issue type: `bug`, `feature request`, `docs issue`, `workflow issue`
- Short title (5–12 words)
- Problem statement (1–2 sentences)
- Impact/severity: `low`, `medium`, `high`

**Required by type:**

| Type | Additional required fields |
| --- | --- |
| bug / workflow issue | Expected behavior, actual behavior, reproduction steps (numbered, concise) |
| feature request | Desired outcome, why current behavior is insufficient |
| docs issue | Doc/page location, what is unclear or incorrect |

**Optional:** error output, screenshot/log link, related feedback URL, suggested fix

### 2. Add triage context automatically

Collect without prompting when possible:

- Current branch: `git branch --show-current`
- Modified files: `git status --short`
- OS / environment if available
- Skill used (from conversation)
- Toolkit/plugin version if discoverable (e.g. `src/plugins/cdk/plugin.yaml` version)

### 3. Draft final issue body

**Title:** `[pilot][<type>] <short title>`

Write to **`.tmp/issue-body.md`**:

```markdown
## Problem Statement
{text}

## Type / Severity
{type} / {severity}

## Required Context
### Expected Behavior (bug/workflow)
…

### Actual Behavior (bug/workflow)
…

### Reproduction Steps (bug/workflow)
1.

## Optional Context
- Branch:
- Modified files:
- OS:
- Skill used:
- Error output:

## Suggested Labels
pilot, {type}
```

Reproduction: max ~5 steps, deterministic.

Separate required vs optional context clearly.

### 4. Confirm submission

Show title, type, severity, and summary. Require **explicit approval** before creating the issue.

### 5. Create GitHub issue

**Preferred:**

```bash
gh issue create --repo NTTDATA-Launch/ai-dev-toolkit --title "..." --body-file .tmp/issue-body.md
```

On success, remove `.tmp/issue-body.md` and return issue URL. Retry once if URL missing from output.

**Fallback:** provide copy-paste markdown and link:

https://github.com/NTTDATA-Launch/ai-dev-toolkit/issues/new/choose

Avoid interactive heredocs and inline shell-escaped multiline bodies.

---

<CHECKPOINT>

Report:

- Repository: `NTTDATA-Launch/ai-dev-toolkit`
- Title
- Type / severity
- Issue URL

Suggest `/cdk:provide-feedback` if the report arose from a pilot session.

</CHECKPOINT>
