# Installing plugins

Built plugins live under `plugins/claude/`, `plugins/copilot/`, and `plugins/cursor/`. Marketplace manifests point installers at those paths.

## From this repository

Clone the repo, then add the marketplace from the repository root.

### Claude Code

```bash
/plugin marketplace add /path/to/ai-dev-toolkit-v2
/plugin install cdk@ai-dev-toolkit
```

Or use the published Git URL when available.

### GitHub Copilot

```bash
copilot plugin marketplace add /path/to/ai-dev-toolkit-v2
copilot plugin install cdk
```

Local development:

```bash
npm run build
copilot plugin install ./plugins/copilot/cdk
```

### Cursor

Add the marketplace using Cursor's plugin UI or CLI for your version, pointing at `.cursor-plugin/marketplace.json` in this repo.

Install the **cdk** plugin from the marketplace, then reload plugins if required.

## Verify

After install, invoke CDK skills (e.g. `/cdk:help` or the equivalent in your ecosystem) and run `cdk-onboard` once per project.
