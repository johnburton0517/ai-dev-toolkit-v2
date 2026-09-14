import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { describe, expect, it } from 'vitest';
import { loadPlugins } from '../../../scripts/lib/plugins.js';

describe('loadPlugins', () => {
  it('discovers plugins with plugin.yaml and skips publish false', () => {
    const root = mkdtempSync(join(tmpdir(), 'adt-plugins-'));
    const pluginsDir = join(root, 'src', 'plugins');
    mkdirSync(join(pluginsDir, 'visible'), { recursive: true });
    mkdirSync(join(pluginsDir, 'hidden'), { recursive: true });

    writeFileSync(
      join(pluginsDir, 'visible', 'plugin.yaml'),
      `name: visible
version: 1.0.0
description: visible plugin
owner:
  email: test@example.com
risk: low
compliance:
  - approved
`,
      'utf-8',
    );

    writeFileSync(
      join(pluginsDir, 'hidden', 'plugin.yaml'),
      `name: hidden
version: 1.0.0
description: hidden plugin
owner:
  email: test@example.com
risk: low
compliance:
  - approved
publish: false
`,
      'utf-8',
    );

    const plugins = loadPlugins(pluginsDir);
    expect(plugins.map((p) => p.id)).toEqual(['visible']);
  });
});
