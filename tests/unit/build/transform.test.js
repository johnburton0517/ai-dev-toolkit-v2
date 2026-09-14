import { describe, expect, it } from 'vitest';
import { transformMcp as transformCopilotMcp } from '../../../scripts/lib/transform-copilot.js';
import { transformHooks as transformClaudeHooks } from '../../../scripts/lib/transform-claude.js';

describe('transform-copilot MCP', () => {
  it('adds local defaults to servers', () => {
    const out = transformCopilotMcp({
      mcpServers: {
        example: { command: 'npx', args: ['mcp-remote'] },
      },
    });
    expect(out.mcpServers.example.type).toBe('local');
    expect(out.mcpServers.example.tools).toEqual(['*']);
  });
});

describe('transform-claude hooks', () => {
  it('maps hook events and plugin root', () => {
    const out = transformClaudeHooks(
      {
        hooks: [{ event: 'pre-tool-use', command: 'echo ${PLUGIN_ROOT}' }],
      },
      {
        hooks: {
          events: { 'pre-tool-use': 'PreToolUse' },
          pluginRoot: '${CLAUDE_PLUGIN_ROOT}',
        },
      },
    );
    expect(out.hooks[0].event).toBe('PreToolUse');
    expect(out.hooks[0].command).toContain('CLAUDE_PLUGIN_ROOT');
  });
});
