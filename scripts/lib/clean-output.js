import { existsSync, rmSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Remove generated output for one ecosystem only.
 * Sibling targets under plugins/ are left untouched.
 */
export function cleanTargetOutput(root, target) {
  const targetOut = join(root, 'plugins', target);
  if (existsSync(targetOut)) {
    rmSync(targetOut, { recursive: true, force: true });
  }
}
