# Schema — frontmatter and build contract

Authoritative contract for `src/plugins/` primitives and the build pipeline.

## plugin.yaml

Each plugin directory must include `plugin.yaml`:

| Field | Required | Description |
| --- | --- | --- |
| `name` | yes | Plugin id (directory name) |
| `version` | yes | Semver |
| `description` | yes | Short summary |
| `owner` | yes | String or `{ name, email }` |
| `risk` | yes | `low`, `medium`, or `high` |
| `compliance` | yes | Non-empty array (e.g. `approved`) |
| `tags` | no | Discovery tags |
| `goals` | no | Governance goals |
| `publish` | no | Default `true`; `false` skips build |

## Primitive frontmatter (agents and skills)

YAML frontmatter on every `agents/*.md` and `skills/**/SKILL.md`:

| Field | Required | Description |
| --- | --- | --- |
| `name` | yes | Kebab-case id (skills/agents often `cdk-*`) |
| `description` | yes | Trigger-oriented description for skills |
| `deprecated` | no | Deprecation notice |
| `supersededBy` | no | Replacement primitive |
| `claude` | no | Claude-specific block (e.g. `allowed-tools`, `model`) |
| `copilot` | no | Copilot-specific block (e.g. `user-invocable`, `model`) |
| `cursor` | no | Cursor-specific block |

Ecosystem blocks are stripped or preserved per target during build.

## Mustache tokens

Body content is rendered with Mustache after frontmatter is parsed:

| Token | Escaping | Purpose |
| --- | --- | --- |
| `{{{HEADER}}}` | Unescaped | Replaced from config `HEADER` (may include `{{name}}`) |
| `{{{tools.read_file}}}` | Unescaped | Tool invocation hint from config `tools` map |
| `{{#claude}}...{{/claude}}` | Conditional | Included only in Claude build |
| `{{#copilot}}...{{/copilot}}` | Conditional | Included only in Copilot build |
| `{{#cursor}}...{{/cursor}}` | Conditional | Included only in Cursor build |

Built artifacts must not contain unresolved `{{{HEADER}}}` or `{{{tools.*}}}` tokens.

## Skills layout

```
skills/<skill-dir>/
  SKILL.md          # Required entry point
  scripts/          # Optional
  references/       # Optional
  assets/           # Optional
```

Non-markdown files under skills are copied unchanged.

## Agents layout

```
agents/<file>.md    # Source filename; output name from frontmatter `name`
```

## Hooks and MCP

- Common hooks: `hooks/hooks.json` (optional)
- MCP: `mcp.json` at plugin root
- Build transforms emit ecosystem-specific paths and filenames (see `scripts/lib/transform-*.js`)
