# CLAUDE.md — AI assistant guide

## Commands

```bash
npm run build          # Rebuild claude + copilot + cursor (wipes each plugins/<target>/)
npm run build -- claude   # Rebuild Claude only; leave copilot/cursor output intact
npm run lint           # ESLint + yaml-lint
npm test               # Vitest unit tests (tests/unit/build/)
npm run format         # Prettier on scripts and config
```

## Architecture

- **Source:** `src/plugins/<id>/` with `plugin.yaml`, templated markdown (`{{{HEADER}}}`, `{{#copilot}}` blocks)
- **Build:** `scripts/build.js` + `scripts/lib/*`
- **Output:** `plugins/{claude,copilot,cursor}/<id>/` plus root marketplace JSON

Do not edit `plugins/` directly — change `src/` and run `npm run build`.

## Naming

- Agents: frontmatter `name` drives output filename (`cdk-code-reviewer` → `cdk-code-reviewer.md` or `.agent.md` for Copilot)
- Skills: `skills/<skill-dir>/SKILL.md`; skill dir often matches skill name (e.g. `cdk-onboard`)

## Tokens

See [config/schema.md](config/schema.md). Built output must not contain raw `{{{HEADER}}}` or unresolved conditionals.

## Regenerating CDK primitives

Use prompts in [agent_prompts/](agent_prompts/) — see [agent_prompts/README.md](agent_prompts/README.md) for generation order.
