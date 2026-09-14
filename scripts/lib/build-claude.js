import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { buildPluginsForTarget } from './build-target.js';
import { transformHooks, transformMcp } from './transform-claude.js';
import { validateMarketplaceOwner } from './validate.js';

export function buildClaude(root, config, plugins) {
  const built = buildPluginsForTarget({
    root,
    target: 'claude',
    config,
    plugins,
    transformMcp,
    transformHooks,
    agentFileName: (name) => `${name}.md`,
    manifestPath: '.claude-plugin/plugin.json',
    mcpFileName: '.mcp.json',
  });

  writeMarketplace(root, config, built);
  return built;
}

function writeMarketplace(root, config, built) {
  const marketplaceDir = join(root, config.marketplaceDir);
  mkdirSync(marketplaceDir, { recursive: true });

  const owner = config.marketplace.owner;
  const errors = validateMarketplaceOwner(owner);
  if (errors.length > 0) {
    throw new Error(errors.join('\n'));
  }

  const marketplace = {
    name: config.marketplace.name,
    owner: {
      name: owner.name,
      email: owner.email,
    },
    metadata: {
      description: config.marketplace.description,
      version: config.marketplace.version,
    },
    plugins: built.map((p) => ({
      name: p.meta.name,
      description: p.meta.description,
      version: String(p.meta.version),
      source: p.relativeSource,
    })),
  };

  writeFileSync(
    join(marketplaceDir, 'marketplace.json'),
    `${JSON.stringify(marketplace, null, 2)}\n`,
    'utf-8',
  );
}
