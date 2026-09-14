import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const ROOT = join(import.meta.dirname, '../../..');

describe('build output (sample-plugin)', () => {
  it('has copilot agent suffix and resolved HEADER in skills', () => {
    const skillPath = join(ROOT, 'plugins/copilot/sample-plugin/skills/sample-greet/SKILL.md');
    expect(existsSync(skillPath)).toBe(true);
    const content = readFileSync(skillPath, 'utf-8');
    expect(content).not.toContain('{{{HEADER}}}');
    expect(content).toContain('sample-greet');
  });

  it('writes marketplace manifests', () => {
    for (const manifest of [
      '.claude-plugin/marketplace.json',
      '.github/plugin/marketplace.json',
      '.cursor-plugin/marketplace.json',
    ]) {
      const path = join(ROOT, manifest);
      expect(existsSync(path)).toBe(true);
      const json = JSON.parse(readFileSync(path, 'utf-8'));
      expect(json.plugins.some((p) => p.name === 'sample-plugin')).toBe(true);
    }
  });

  it('emits claude .mcp.json path convention for plugins without mcp', () => {
    const agentPath = join(ROOT, 'plugins/copilot/sample-plugin/agents/sample-helper.agent.md');
    expect(existsSync(agentPath)).toBe(true);
  });

  it('builds cdk with 9 agents, 13 skills, and MCP per target', () => {
    const claudeAgents = join(ROOT, 'plugins/claude/cdk/agents');
    const copilotAgents = join(ROOT, 'plugins/copilot/cdk/agents');
    const skills = join(ROOT, 'plugins/claude/cdk/skills');
    expect(existsSync(join(ROOT, 'plugins/claude/cdk/.mcp.json'))).toBe(true);
    expect(existsSync(join(ROOT, 'plugins/copilot/cdk/mcp.json'))).toBe(true);
    expect(existsSync(join(ROOT, 'plugins/cursor/cdk/mcp.json'))).toBe(true);
    expect(existsSync(join(claudeAgents, 'cdk-code-reviewer.md'))).toBe(true);
    expect(existsSync(join(copilotAgents, 'cdk-code-reviewer.agent.md'))).toBe(true);
    expect(existsSync(join(skills, 'cdk-onboard/SKILL.md'))).toBe(true);
    expect(existsSync(join(skills, 'cdk-review/SKILL.md'))).toBe(true);
  });
});
