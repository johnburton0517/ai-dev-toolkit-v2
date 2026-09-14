# Contributing

## Intake before code

Open an issue using a template under `.github/ISSUE_TEMPLATE/` before submitting a pull request. See [docs/intake.md](docs/intake.md) for review criteria.

## Plugin structure

```
src/plugins/<plugin-id>/
  plugin.yaml          # Governance metadata (required)
  agents/*.md          # Spawned personas (optional)
  skills/<name>/SKILL.md
  mcp.json             # Optional MCP servers
  settings-template.md # Optional user-project template
  README.md            # End-user docs
```

## Frontmatter

Every agent and skill needs `name` and `description` in YAML frontmatter. Use `{{{HEADER}}}` after frontmatter for ecosystem headers. See [config/schema.md](config/schema.md).

## Build workflow

```bash
npm run build          # Regenerate plugins/ and marketplace manifests
npm run lint
npm test
```

Commit both `src/` and generated `plugins/` so the repo remains installable without a local build.

## Commits

Use [Conventional Commits](https://www.conventionalcommits.org/): `feat:`, `fix:`, `docs:`, `test:`, `chore:`, etc. Hooks enforce format on commit messages.
