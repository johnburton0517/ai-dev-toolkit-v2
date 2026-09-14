# AI Dev Toolkit

Enterprise plugin marketplace for **Claude Code**, **GitHub Copilot**, and **Cursor**. Author agents and skills once in `src/plugins/`, then build installable artifacts under `plugins/`.

## Quick start

```bash
npm install
npm run build
npm test
```

## Available plugins

| Plugin | Purpose | Agents | Skills |
| --- | --- | ---: | ---: |
| [cdk](src/plugins/cdk/) | Core dev workflow — GitHub Issues, commits, PRs, multi-agent review | 9 | 13 |
| [sample-plugin](src/plugins/sample-plugin/) | Reference plugin for contributors | 1 | 1 |

## Install

See [docs/installing.md](docs/installing.md) for per-ecosystem marketplace setup.

## Contribute

Intake and review criteria: [docs/intake.md](docs/intake.md). Process: [contributing.md](contributing.md).

## Repository layout

```
src/plugins/           # Source of truth (plugin.yaml, agents, skills)
config/                # Per-ecosystem build config (claude, copilot, cursor)
scripts/build.js       # Wipes plugins/ and rebuilds all targets
plugins/               # Committed build output (marketplace payloads)
.claude-plugin/        # Claude marketplace manifest
.github/plugin/        # Copilot marketplace manifest
.cursor-plugin/        # Cursor marketplace manifest
agent_prompts/         # Prompt library to regenerate CDK primitives
```

## Documentation

- [Prerequisites](docs/prerequisites.md)
- [Installing plugins](docs/installing.md)
- [Intake process](docs/intake.md)
- [Schema contract](config/schema.md)
- [CLAUDE.md](CLAUDE.md) — guide for AI assistants working in this repo
