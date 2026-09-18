import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { buildClaude } from './lib/build-claude.js';
import { buildCopilot } from './lib/build-copilot.js';
import { buildCursor } from './lib/build-cursor.js';
import { cleanTargetOutput } from './lib/clean-output.js';
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

export function runBuild(root, argv = process.argv) {
  const targets = parseTargets(argv);
  const pluginsDir = join(root, 'src', 'plugins');
  const plugins = loadPlugins(pluginsDir);

  if (plugins.length === 0) {
    console.warn('No publishable plugins found in src/plugins/');
  }

  for (const target of targets) {
    cleanTargetOutput(root, target);
    const config = loadConfig(root, target);
    console.log(`Building target: ${target}`);
    if (target === 'claude') buildClaude(root, config, plugins);
    if (target === 'copilot') buildCopilot(root, config, plugins);
    if (target === 'cursor') buildCursor(root, config, plugins);
  }

  console.log('Build completed successfully.');
}

const invokedDirectly =
  Boolean(process.argv[1]) && import.meta.url === pathToFileURL(process.argv[1]).href;

if (invokedDirectly) {
  runBuild(ROOT);
}
