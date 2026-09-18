import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { runBuild } from '../../../scripts/build.js';

const REPO_ROOT = join(import.meta.dirname, '../../..');

const PLUGIN_YAML = `name: demo
version: 1.0.0
description: Fixture plugin
owner:
  email: test@example.com
risk: low
compliance:
  - approved
`;

function seedMarker(root, target) {
  const dir = join(root, 'plugins', target, 'stale-plugin');
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'marker.txt'), target, 'utf-8');
}

describe('runBuild', () => {
  it('rebuilds only the requested target and leaves sibling plugins/ trees intact', () => {
    const root = mkdtempSync(join(tmpdir(), 'adt-build-'));
    mkdirSync(join(root, 'config'), { recursive: true });
    writeFileSync(
      join(root, 'config', 'claude.yml'),
      readFileSync(join(REPO_ROOT, 'config', 'claude.yml'), 'utf-8'),
    );

    mkdirSync(join(root, 'src', 'plugins', 'demo'), { recursive: true });
    writeFileSync(join(root, 'src', 'plugins', 'demo', 'plugin.yaml'), PLUGIN_YAML, 'utf-8');

    seedMarker(root, 'claude');
    seedMarker(root, 'copilot');
    seedMarker(root, 'cursor');

    runBuild(root, ['node', 'scripts/build.js', 'claude']);

    expect(existsSync(join(root, 'plugins', 'claude', 'stale-plugin'))).toBe(false);
    expect(existsSync(join(root, 'plugins', 'claude', 'demo'))).toBe(true);
    expect(existsSync(join(root, 'plugins', 'copilot', 'stale-plugin', 'marker.txt'))).toBe(true);
    expect(existsSync(join(root, 'plugins', 'cursor', 'stale-plugin', 'marker.txt'))).toBe(true);
  });
});
