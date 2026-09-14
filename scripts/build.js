import { rmSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildClaude } from './lib/build-claude.js';
import { buildCopilot } from './lib/build-copilot.js';
import { buildCursor } from './lib/build-cursor.js';
import { loadConfig, loadPlugins } from './lib/plugins.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const TARGETS = ['claude', 'copilot', 'cursor'];

function parseTargets(argv) {
  const arg = argv[2];
  if (!arg) return TARGETS;
  if (!TARGETS.includes(arg)) {
    throw new Error(`Unknown target "${arg}". Use: claude, copilot, cursor`);
  }
  return [arg];
}

function main() {
  const targets = parseTargets(process.argv);
  const pluginsDir = join(ROOT, 'src', 'plugins');
  const plugins = loadPlugins(pluginsDir);

  if (plugins.length === 0) {
    console.warn('No publishable plugins found in src/plugins/');
  }

  const pluginsOut = join(ROOT, 'plugins');
  if (existsSync(pluginsOut)) {
    rmSync(pluginsOut, { recursive: true, force: true });
  }

  for (const target of targets) {
    const config = loadConfig(ROOT, target);
    console.log(`Building target: ${target}`);
    if (target === 'claude') buildClaude(ROOT, config, plugins);
    if (target === 'copilot') buildCopilot(ROOT, config, plugins);
    if (target === 'cursor') buildCursor(ROOT, config, plugins);
  }

  console.log('Build completed successfully.');
}

main();
