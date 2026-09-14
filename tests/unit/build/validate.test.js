import { describe, expect, it } from 'vitest';
import { validatePluginMeta } from '../../../scripts/lib/validate.js';

describe('validatePluginMeta', () => {
  it('accepts valid plugin metadata', () => {
    const errors = validatePluginMeta(
      {
        name: 'cdk',
        version: '2.0.0',
        description: 'Core kit',
        owner: { name: 'Test', email: 'test@example.com' },
        risk: 'low',
        compliance: ['approved'],
      },
      'cdk',
    );
    expect(errors).toEqual([]);
  });

  it('rejects invalid semver and missing compliance', () => {
    const errors = validatePluginMeta(
      {
        name: 'bad',
        version: 'not-semver',
        description: 'x',
        owner: { email: 'bad-email' },
        risk: 'extreme',
        compliance: [],
      },
      'bad',
    );
    expect(errors.length).toBeGreaterThan(0);
  });
});
