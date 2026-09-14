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

Copilot expects `plugin@marketplace` (not bare `cdk`). Local path installs work today but are deprecated.

From a local checkout:

```bash
copilot plugin marketplace add /path/to/ai-dev-toolkit-v2
copilot plugin install cdk@ai-dev-toolkit
```

From GitHub (after the repo is public):

```bash
copilot plugin marketplace add johnburton0517/ai-dev-toolkit-v2
copilot plugin install cdk@ai-dev-toolkit
```

Confirm:

```bash
copilot plugin marketplace list
copilot plugin marketplace browse ai-dev-toolkit
```

Optional local path (deprecated):

```bash
npm run build
copilot plugin install ./plugins/copilot/cdk
```
### Cursor

Add the marketplace using Cursor's plugin UI or CLI for your version, pointing at `.cursor-plugin/marketplace.json` in this repo.

Install the **cdk** plugin from the marketplace, then reload plugins if required.

## Verify

After install, invoke CDK skills (e.g. `/cdk:help` or the equivalent in your ecosystem) and run `cdk-onboard` once per project.
