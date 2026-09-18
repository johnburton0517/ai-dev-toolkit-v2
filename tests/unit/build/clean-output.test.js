import { existsSync, mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { cleanTargetOutput } from '../../../scripts/lib/clean-output.js';

function fixtureRoot() {
  const root = mkdtempSync(join(tmpdir(), 'adt-clean-'));
  for (const target of ['claude', 'copilot', 'cursor']) {
    const dir = join(root, 'plugins', target, 'sample-plugin');
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, 'marker.txt'), target, 'utf-8');
  }
  return root;
}

describe('cleanTargetOutput', () => {
  it('removes only the selected target under plugins/', () => {
    const root = fixtureRoot();

    cleanTargetOutput(root, 'claude');

    expect(existsSync(join(root, 'plugins', 'claude'))).toBe(false);
    expect(existsSync(join(root, 'plugins', 'copilot', 'sample-plugin', 'marker.txt'))).toBe(true);
    expect(existsSync(join(root, 'plugins', 'cursor', 'sample-plugin', 'marker.txt'))).toBe(true);
  });

  it('is a no-op when the target directory does not exist', () => {
    const root = mkdtempSync(join(tmpdir(), 'adt-clean-empty-'));
    expect(() => cleanTargetOutput(root, 'claude')).not.toThrow();
    expect(existsSync(join(root, 'plugins'))).toBe(false);
  });
});
