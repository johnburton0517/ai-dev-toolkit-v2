---
name: cdk-fix-review
description: Fetches PR review comments, categorizes them as blocking, suggestions, or questions, and applies fixes. Use when the user asks to address review comments, fix PR feedback, or respond to code review.
---

{{{HEADER}}}

**Utility skill** — runs anytime; no workflow status checks.

Requires **GitHub CLI** (`gh`) and an open PR for the current branch (unless PR number is provided).

---

## Workflow (5 steps)

### 1. Get PR number

- Use PR number from skill arguments if provided
- Else: `gh pr view` (current branch) to resolve number and URL

### 2. Fetch review comments

```bash
gh pr view <pr-number> --json reviews,comments
```

Also fetch review thread comments if needed (`gh api` for inline review comments when actionable fixes are inline).

### 3. Categorize and present comments

| Category | Meaning |
| --- | --- |
| **Blocking** | Required changes before merge |
| **Suggestions** | Nice to have |
| **Questions** | May need a reply only, not a code change |

Present grouped lists with file/line references when available. Ask user to confirm scope (all blocking, or include suggestions).

### 4. Address comments

- Fix **blocking** items first
- Apply code changes; track file list and rationale per comment
- User may interrupt to adjust approach or defer items with justification

For **questions**, draft concise PR replies when requested.

### 5. Commit and push

After fixes:

```bash
git add -A
git commit -m "fix: address review comments [TICKET-ID]"
git push
```

Use ticket ID from workflow state or branch when available; omit brackets if none.

Align commit style with `/cdk:commit`.

---

<CHECKPOINT>

> Review fixes applied.
>
> **Addressed:** N comments
> **Deferred:** M comments (with justification)
>
> **Next:** Re-request review from team members.
>
> When the PR is merged, start the next core workflow with `/cdk:start-ticket`.

</CHECKPOINT>
