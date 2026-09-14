# Intake process

## Before you open a PR

1. Open an issue using the appropriate template:
   - **new-plugin** — new plugin proposal
   - **plugin-update** — changes to an existing plugin
   - **new-mcp** — MCP server additions
   - **new-ecosystem** — new build target or ecosystem support
   - **other** — everything else

2. Wait for maintainer acknowledgment on governance (owner, risk, compliance tags).

## Review criteria

- `plugin.yaml` includes valid semver, owner email, risk, and compliance
- Primitives follow [config/schema.md](../config/schema.md)
- `npm run build`, `npm run lint`, and `npm test` pass
- Generated `plugins/` output is committed and matches source
- User-facing README updated for behavior changes
- No secrets or environment-specific credentials in source

## CDK changes

- Skills that spawn agents must keep orchestrator contracts (scope, file list, diff commands for review)
- Workflow stage gates must stay consistent with `.cdk/workflow-state.json` documentation
