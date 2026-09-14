import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import {
  assertNoUnresolvedTokens,
  buildRenderContext,
  parseFrontmatter,
  renderMarkdown,
  validatePrimitiveFrontmatter,
} from './render.js';
import { findFiles, listSkillDirs } from './plugins.js';
import { validatePluginMeta } from './validate.js';

function copyFile(src, dest) {
  mkdirSync(dirname(dest), { recursive: true });
  cpSync(src, dest);
}

function copyNonTemplateFiles(srcDir, destDir, skipRelative) {
  if (!existsSync(srcDir)) return;

  for (const file of findFiles(srcDir)) {
    const rel = relative(srcDir, file);
    if (skipRelative.some((s) => rel.startsWith(s))) continue;
    if (file.endsWith('.md') && (rel.startsWith('agents') || rel.includes('SKILL.md'))) {
      continue;
    }
    const dest = join(destDir, rel);
    copyFile(file, dest);
  }
}

export function buildPluginsForTarget({
  root,
  target,
  config,
  plugins,
  transformMcp,
  transformHooks,
  agentFileName,
  manifestPath,
  mcpFileName,
}) {
  const pluginsDir = join(root, config.pluginsDir);
  mkdirSync(pluginsDir, { recursive: true });

  const built = [];
  const errors = [];

  for (const plugin of plugins) {
    const errorsMeta = validatePluginMeta(plugin.meta, plugin.id);
    errors.push(...errorsMeta);
    if (errorsMeta.length > 0) continue;

    const outDir = join(pluginsDir, plugin.id);
    mkdirSync(outDir, { recursive: true });

    const agentsSrc = join(plugin.path, 'agents');
    const agentsOut = join(outDir, 'agents');
    if (existsSync(agentsSrc)) {
      mkdirSync(agentsOut, { recursive: true });
      for (const file of readdirSync(agentsSrc)) {
        if (!file.endsWith('.md')) continue;
        const srcPath = join(agentsSrc, file);
        const raw = readFileSync(srcPath, 'utf-8');
        const { data } = parseFrontmatter(raw);
        const fmErrors = validatePrimitiveFrontmatter(data, `${plugin.id}/${file}`);
        errors.push(...fmErrors);
        if (fmErrors.length > 0) continue;

        const context = buildRenderContext({ target, config, frontmatter: data });
        const rendered = renderMarkdown(raw, context);
        const tokenErrors = assertNoUnresolvedTokens(rendered, `${plugin.id}/${file}`);
        errors.push(...tokenErrors);

        const outName = agentFileName(data.name);
        writeFileSync(join(agentsOut, outName), rendered, 'utf-8');
      }
    }

    const skillsSrc = join(plugin.path, 'skills');
    const skillsOut = join(outDir, 'skills');
    if (existsSync(skillsSrc)) {
      for (const skillDir of listSkillDirs(plugin.path)) {
        const skillSrc = join(skillsSrc, skillDir);
        const skillDest = join(skillsOut, skillDir);
        mkdirSync(skillDest, { recursive: true });

        const skillMd = join(skillSrc, 'SKILL.md');
        const raw = readFileSync(skillMd, 'utf-8');
        const { data } = parseFrontmatter(raw);
        const fmErrors = validatePrimitiveFrontmatter(data, `${plugin.id}/skills/${skillDir}`);
        errors.push(...fmErrors);
        if (fmErrors.length > 0) continue;

        const context = buildRenderContext({ target, config, frontmatter: data });
        const rendered = renderMarkdown(raw, context);
        const tokenErrors = assertNoUnresolvedTokens(
          rendered,
          `${plugin.id}/skills/${skillDir}/SKILL.md`,
        );
        errors.push(...tokenErrors);
        writeFileSync(join(skillDest, 'SKILL.md'), rendered, 'utf-8');

        for (const file of findFiles(skillSrc)) {
          const rel = relative(skillSrc, file);
          if (rel === 'SKILL.md') continue;
          copyFile(file, join(skillDest, rel));
        }
      }
    }

    for (const extra of ['settings-template.md', 'README.md']) {
      const src = join(plugin.path, extra);
      if (existsSync(src)) copyFile(src, join(outDir, extra));
    }

    copyNonTemplateFiles(plugin.path, outDir, ['agents', 'skills', 'mcp.json', 'hooks']);

    const mcpSrc = join(plugin.path, 'mcp.json');
    if (existsSync(mcpSrc)) {
      const mcpRaw = JSON.parse(readFileSync(mcpSrc, 'utf-8'));
      const mcpOut = transformMcp(mcpRaw);
      writeFileSync(join(outDir, mcpFileName), `${JSON.stringify(mcpOut, null, 2)}\n`, 'utf-8');
    }

    const hooksSrc = join(plugin.path, 'hooks', 'hooks.json');
    if (existsSync(hooksSrc)) {
      const hooksRaw = JSON.parse(readFileSync(hooksSrc, 'utf-8'));
      const hooksOut = transformHooks(hooksRaw, config);
      mkdirSync(join(outDir, 'hooks'), { recursive: true });
      writeFileSync(
        join(outDir, 'hooks', 'hooks.json'),
        `${JSON.stringify(hooksOut, null, 2)}\n`,
        'utf-8',
      );
    }

    const skillDirs = listSkillDirs(plugin.path);
    const manifest = {
      name: plugin.meta.name,
      description: plugin.meta.description,
      version: String(plugin.meta.version),
      ...(plugin.meta.license ? { license: plugin.meta.license } : {}),
      ...(plugin.meta.keywords ? { keywords: plugin.meta.keywords } : {}),
      skills: skillDirs.length > 0 ? skillDirs.map((d) => `skills/${d}`) : ['skills/'],
    };

    const manifestFullPath = join(outDir, manifestPath);
    mkdirSync(dirname(manifestFullPath), { recursive: true });
    writeFileSync(manifestFullPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf-8');

    built.push({
      id: plugin.id,
      meta: plugin.meta,
      outDir,
      relativeSource: `./${config.pluginsDir}/${plugin.id}`,
    });
  }

  if (errors.length > 0) {
    throw new Error(`Build failed for ${target}:\n${errors.map((e) => `  - ${e}`).join('\n')}`);
  }

  return built;
}
