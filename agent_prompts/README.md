# CDK Agent & Skill Prompts

Prompt library for recreating CDK plugin primitives. Each `.txt` file contains a self-contained prompt you can paste into an AI to generate a markdown file matching the existing CDK agent or skill conventions.

## Project-Level Prompt


| Prompt                                                               | Purpose                                                                                                                                                            |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `[create-project-from-scratch.txt](create-project-from-scratch.txt)` | Recreate the entire ai-dev-toolkit repository — build pipeline, config, marketplace manifests, quality gates, CDK plugin, sample plugin, and agent_prompts library |


Use this when bootstrapping the project from zero. It references the individual agent/skill prompts in Phase 3 and Phase 5. Work through its 7 phases sequentially; verify with `npm run build`, `npm run lint`, and `npm test` after each major phase.

## Quick Start

1. Open the prompt file for the primitive you want to recreate (e.g. `cdk-code-reviewer.txt`).
2. Copy the entire contents into your AI assistant.
3. Ask the AI to return **only** the markdown file content — no commentary before or after.
4. Save the output to the target path specified in the prompt (under `src/plugins/cdk/`).

Example instruction to append after pasting a prompt:

```
Return only the complete markdown file. No explanation.
```

After generating all primitives, run the build to produce ecosystem outputs:

```bash
npm run build
npm run lint
npm test
```



## Prompt Files



### Agents (9)


| Prompt                          | Output path                                       | Role                                        |
| ------------------------------- | ------------------------------------------------- | ------------------------------------------- |
| `cdk-code-architect.txt`        | `src/plugins/cdk/agents/code-architect.md`        | Produces decisive implementation blueprints |
| `cdk-code-explorer.txt`         | `src/plugins/cdk/agents/code-explorer.md`         | Deep codebase exploration                   |
| `cdk-code-reviewer.txt`         | `src/plugins/cdk/agents/code-reviewer.md`         | Guidelines compliance, bugs, quality        |
| `cdk-code-simplifier.txt`       | `src/plugins/cdk/agents/code-simplifier.md`       | Clarity and maintainability suggestions     |
| `cdk-comment-analyzer.txt`      | `src/plugins/cdk/agents/comment-analyzer.md`      | Comment accuracy and documentation quality  |
| `cdk-silent-failure-hunter.txt` | `src/plugins/cdk/agents/silent-failure-hunter.md` | Error handling and silent failure detection |
| `cdk-test-analyzer.txt`         | `src/plugins/cdk/agents/test-analyzer.md`         | Test coverage gaps and test quality         |
| `cdk-type-design-analyzer.txt`  | `src/plugins/cdk/agents/type-design-analyzer.md`  | Type design and invariant enforcement       |
| `cdk-web-researcher.txt`        | `src/plugins/cdk/agents/web-researcher.md`        | Web research with attribution               |




### Skills (13)


| Prompt                     | Output path                                            | Type          |
| -------------------------- | ------------------------------------------------------ | ------------- |
| `cdk-onboard.txt`          | `src/plugins/cdk/skills/cdk-onboard/SKILL.md`          | Core (step 1) |
| `cdk-start-ticket.txt`     | `src/plugins/cdk/skills/cdk-start-ticket/SKILL.md`     | Core (step 2) |
| `cdk-research.txt`         | `src/plugins/cdk/skills/cdk-research/SKILL.md`         | Core (step 3) |
| `cdk-plan.txt`             | `src/plugins/cdk/skills/cdk-plan/SKILL.md`             | Core (step 4) |
| `cdk-implement.txt`        | `src/plugins/cdk/skills/cdk-implement/SKILL.md`        | Core (step 5) |
| `cdk-help.txt`             | `src/plugins/cdk/skills/cdk-help/SKILL.md`             | Utility       |
| `cdk-switch-ticket.txt`    | `src/plugins/cdk/skills/cdk-switch-ticket/SKILL.md`    | Utility       |
| `cdk-commit.txt`           | `src/plugins/cdk/skills/cdk-commit/SKILL.md`           | Utility       |
| `cdk-review.txt`           | `src/plugins/cdk/skills/cdk-review/SKILL.md`           | Utility       |
| `cdk-create-pr.txt`        | `src/plugins/cdk/skills/cdk-create-pr/SKILL.md`        | Utility       |
| `cdk-fix-review.txt`       | `src/plugins/cdk/skills/cdk-fix-review/SKILL.md`       | Utility       |
| `cdk-provide-feedback.txt` | `src/plugins/cdk/skills/cdk-provide-feedback/SKILL.md` | Utility       |
| `cdk-report-issue.txt`     | `src/plugins/cdk/skills/cdk-report-issue/SKILL.md`     | Utility       |




## Dependency Map



### Core Workflow

```
cdk-onboard
    ↓
cdk-start-ticket ──→ creates .cdk/<ticket-id>/ and workflow-state.json
    ↓
cdk-research ──────→ spawns cdk-code-explorer (always)
    │                  spawns cdk-web-researcher (when external context needed)
    │                  writes .cdk/<ticket-id>/research.md
    ↓
cdk-plan ──────────→ spawns cdk-code-architect
    │                  writes .cdk/<ticket-id>/plan.md
    ↓
cdk-implement ─────→ reads plan.md, writes implementation-notes.md
```



### Review Orchestration

```
cdk-review ────────→ spawns up to 6 agents in parallel:
                       ├── cdk-code-reviewer        (--skip=code)
                       ├── cdk-code-simplifier      (--skip=simplify)
                       ├── cdk-comment-analyzer     (--skip=comments)
                       ├── cdk-test-analyzer        (--skip=tests)
                       ├── cdk-silent-failure-hunter (--skip=errors)
                       └── cdk-type-design-analyzer  (--skip=types)
```

Each review agent receives the scope, file list, and diff command from the orchestrator. Review agents are **not** user-invocable — they are spawned by `cdk-review` only.

### Utility Skills (standalone)

These skills do not spawn agents and can run at any time:


| Skill                  | Primary dependency                    |
| ---------------------- | ------------------------------------- |
| `cdk-help`             | None (display only)                   |
| `cdk-switch-ticket`    | `.cdk/workflow-state.json`            |
| `cdk-commit`           | Git working tree                      |
| `cdk-create-pr`        | GitHub CLI (`gh`), `.cdk/settings.md` |
| `cdk-fix-review`       | GitHub CLI (`gh`), active PR          |
| `cdk-provide-feedback` | GitHub CLI (`gh`), GraphQL API        |
| `cdk-report-issue`     | GitHub CLI (`gh`)                     |




## Supporting Files Reference

These files are not generated by the prompts but are referenced by multiple skills. They live at the plugin level under `src/plugins/cdk/`.


| File                   | Purpose                                                | Used by                                                          |
| ---------------------- | ------------------------------------------------------ | ---------------------------------------------------------------- |
| `plugin.yaml`          | Plugin metadata (name, version, owner, tags)           | Build pipeline                                                   |
| `settings-template.md` | Template copied to `.cdk/settings.md` in user projects | `cdk-onboard`, `cdk-create-pr`, `cdk-review`, `cdk-start-ticket` |
| `README.md`            | Plugin documentation                                   | Installers                                                       |




### Runtime Artifacts (created in user projects)

These files are created at runtime when skills execute — not committed to the plugin source:


| File                                       | Created by             | Contents                                |
| ------------------------------------------ | ---------------------- | --------------------------------------- |
| `.cdk/settings.md`                         | `cdk-onboard`          | Project config (`base_branch`, notes)   |
| `.cdk/workflow-state.json`                 | `cdk-start-ticket`     | Array of in-flight ticket states        |
| `.cdk/<ticket-id>/research.md`             | `cdk-research`         | Codebase findings, tech stack, patterns |
| `.cdk/<ticket-id>/plan.md`                 | `cdk-plan`             | Implementation spec with tasks and AC   |
| `.cdk/<ticket-id>/implementation-notes.md` | `cdk-implement`        | Summary of what was built               |
| `.tmp/feedback-body.md`                    | `cdk-provide-feedback` | Temp file for GitHub Discussion body    |
| `.tmp/issue-body.md`                       | `cdk-report-issue`     | Temp file for GitHub Issue body         |




### Workflow State Format

`.cdk/workflow-state.json` is a JSON **array** (not a single object):

```json
[
  {
    "ticket_id": "123",
    "branch": "feat/123-short-slug",
    "stage": "planned",
    "active": true
  }
]
```

Valid stages in order: `started` → `researched` → `planned` → `implemented`

## Recommended Generation Order

Generate agents before the skills that spawn them:

1. **Agents first** (no dependencies between agents):
  - `cdk-code-explorer`, `cdk-web-researcher`, `cdk-code-architect`
  - All six review agents
2. **Core skills** (in workflow order):
  - `cdk-onboard` → `cdk-start-ticket` → `cdk-research` → `cdk-plan` → `cdk-implement`
3. **Orchestrator and utilities**:
  - `cdk-review` (depends on all review agents)
  - `cdk-help`, `cdk-switch-ticket`, `cdk-commit`, `cdk-create-pr`, `cdk-fix-review`, `cdk-provide-feedback`, `cdk-report-issue`



## Conventions Reminder

All generated markdown must follow the repo schema (`config/schema.md`):

- **Frontmatter**: `name` (kebab-case, `cdk-` prefix), `description` (with trigger phrases for skills)
- **Header token**: `{{{HEADER}}}` immediately after frontmatter
- **Agents**: `copilot.user-invocable: false` (spawned, not directly invoked)
- **Conditional blocks**: `{{#copilot}}...{{/copilot}}` for ecosystem-specific content
- **Checkpoints**: `<CHECKPOINT>...</CHECKPOINT>` for user-facing completion messages
- **Governance**: `version`, `owner`, `risk`, `compliance` live in `plugin.yaml`, not in primitives



## Related Documentation

- [Create project from scratch](create-project-from-scratch.txt) — Full repository bootstrap prompt
- [Plugin README](../src/plugins/cdk/README.md) — CDK feature overview and workflow
- [Schema spec](../config/schema.md) — Frontmatter contract and Mustache tokens
- [Contributing](../contributing.md) — How to contribute plugins to this repo

