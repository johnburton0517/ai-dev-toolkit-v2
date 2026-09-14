---
name: cdk-create-pr
description: Creates a GitHub pull request with a structured, review-ready body populated from git diff, recent commits, and ticket context. Use when the user asks to create a PR, open a pull request, or submit their branch for review.
---

> **CDK** — Core Development Kit skill. Use when the user invokes the `cdk-create-pr` skill.


## Role

Create a GitHub pull request with a populated, review-ready body. Requires **GitHub CLI** (`gh`).

**Utility skill** — no workflow stage checks.

---

## Workflow (7 steps)

### 1. Resolve base branch

Priority:

1. `.cdk/settings.md` YAML frontmatter → `base_branch`
2. `git symbolic-ref refs/remotes/origin/HEAD 2>/dev/null | sed 's|refs/remotes/origin/||'`
3. Fallback: `main`

Store as `BASE_BRANCH`.

### 2. Check git state

- Current branch must **not** be `$BASE_BRANCH`
- Working tree should be **clean** before PR creation (offer to commit via `/cdk:commit` if dirty)
- Push branch: `git push -u origin HEAD`

### 3. Check for existing PR

```bash
gh pr list --head "$(git rev-parse --abbrev-ref HEAD)" --json number,url,title,state
```

If a PR exists, report its URL and **do not** create a duplicate.

### 4. Detect repo PR template

Check in order:

- `.github/PULL_REQUEST_TEMPLATE.md`
- `.github/pull_request_template.md`
- `docs/pull_request_template.md`
- `.github/PULL_REQUEST_TEMPLATE/` (use first/default template)

If found: use as skeleton; fill all sections from diff, commits, and ticket context — **no unfilled placeholders**.

If not found: use default template below.

### 5. Generate PR content

- **Title:** concise summary; include ticket ID when available (from branch, workflow state, or user)
- **Body:** repo template or default

**Default PR body:**

```markdown
## Summary
- <1-3 bullets>

## Changes
- <major changes>

## Validation
- <tests/lint/build run>
- <result summary>

## Risks / Notes
- <risk or `None`>

## Follow-ups
- <follow-up or `None`>
```

Rules: keep section order; bullets over paragraphs; short bullets; use `None` for empty optional sections.

### 6. Create PR (robust, cleanup-safe)

```bash
PR_BODY_FILE="$(mktemp -t cdk-pr-body-XXXXXX.md)"
printf "%s" "$PR_BODY" > "$PR_BODY_FILE"
gh pr create --title "[TICKET-ID] Title" --body-file "$PR_BODY_FILE" --base "$BASE_BRANCH"
rm -f "$PR_BODY_FILE"
```

- Add `--draft` if user requested a draft PR
- Do not use interactive editors or multiline heredocs in the repo
- Temp file must be outside the repo (`mktemp`)

### 7. Verify and report

- Confirm PR number and URL
- Confirm clean status: `git status -sb`

---

<CHECKPOINT>

> PR created: #\<number\>
> URL: \<url\>
>
> **Next steps:**
> 1. Wait for CI to pass
> 2. Request reviewers
> 3. When comments arrive, run `/cdk:fix-review`

</CHECKPOINT>
