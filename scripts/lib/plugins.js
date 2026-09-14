import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import yaml from 'js-yaml';

export function getRoot(importMetaUrl) {
  return join(new URL('.', importMetaUrl).pathname, '..', '..');
}

export function loadConfig(root, target) {
  const configPath = join(root, 'config', `${target}.yml`);
  if (!existsSync(configPath)) {
    throw new Error(`Missing config: ${configPath}`);
  }
  const raw = readFileSync(configPath, 'utf-8');
  return yaml.load(raw);
}

export function loadPlugins(pluginsDir) {
  if (!existsSync(pluginsDir)) {
    return [];
  }

  const plugins = [];
  for (const entry of readdirSync(pluginsDir)) {
    const pluginPath = join(pluginsDir, entry);
    if (!statSync(pluginPath).isDirectory()) continue;

    const yamlPath = join(pluginPath, 'plugin.yaml');
    if (!existsSync(yamlPath)) continue;

    const meta = yaml.load(readFileSync(yamlPath, 'utf-8'));
    const publish = meta.publish !== false;
    if (!publish) continue;

    plugins.push({
      id: entry,
      path: pluginPath,
      meta,
    });
  }

  return plugins.sort((a, b) => a.id.localeCompare(b.id));
}

export function findTemplates(dir) {
  const results = [];
  if (!existsSync(dir)) return results;

  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      results.push(...findTemplates(full));
    } else if (entry.endsWith('.md')) {
      results.push(full);
    }
  }
  return results;
}

export function findFiles(dir) {
  const results = [];
  if (!existsSync(dir)) return results;

  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      results.push(...findFiles(full));
    } else {
      results.push(full);
    }
  }
  return results;
}

export function listSkillDirs(pluginPath) {
  const skillsRoot = join(pluginPath, 'skills');
  if (!existsSync(skillsRoot)) return [];

  return readdirSync(skillsRoot)
    .filter((name) => {
      const skillDir = join(skillsRoot, name);
      return statSync(skillDir).isDirectory() && existsSync(join(skillDir, 'SKILL.md'));
    })
    .sort();
}
