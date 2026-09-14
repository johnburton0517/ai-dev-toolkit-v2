import { describe, expect, it } from 'vitest';
import {
  buildRenderContext,
  renderMarkdown,
  assertNoUnresolvedTokens,
} from '../../../scripts/lib/render.js';

const baseConfig = {
  HEADER: '> Skill {{name}}',
  tools: {
    read_file: 'Read tool',
    run_command: 'Shell tool',
  },
  paths: { configDir: '.cursor' },
};

describe('renderMarkdown', () => {
  it('replaces HEADER and tools tokens', () => {
    const raw = `---
name: cdk-help
description: Help skill
---

{{{HEADER}}}

Use {{{tools.read_file}}} to inspect files.
`;

    const context = buildRenderContext({
      target: 'cursor',
      config: baseConfig,
      frontmatter: { name: 'cdk-help', description: 'Help skill' },
    });

    const out = renderMarkdown(raw, context);
    expect(out).toContain('> Skill cdk-help');
    expect(out).toContain('Read tool');
    expect(out).not.toContain('{{{HEADER}}}');
  });

  it('includes only copilot conditional blocks for copilot target', () => {
    const raw = `---
name: cdk-onboard
description: Onboard
---

{{#copilot}}copilot-only{{/copilot}}
{{#cursor}}cursor-only{{/cursor}}
`;

    const context = buildRenderContext({
      target: 'copilot',
      config: baseConfig,
      frontmatter: { name: 'cdk-onboard', description: 'Onboard' },
    });

    const out = renderMarkdown(raw, context);
    expect(out).toContain('copilot-only');
    expect(out).not.toContain('cursor-only');
    expect(assertNoUnresolvedTokens(out, 'test')).toEqual([]);
  });
});
