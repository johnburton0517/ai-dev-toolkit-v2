import matter from 'gray-matter';
import Mustache from 'mustache';
import yaml from 'js-yaml';

Mustache.escape = (text) => text;

export function parseFrontmatter(content) {
  const { data, content: body } = matter(content);
  return { data, body };
}

export function validatePrimitiveFrontmatter(data, fileLabel) {
  const errors = [];
  if (!data.name || typeof data.name !== 'string') {
    errors.push(`${fileLabel}: missing frontmatter.name`);
  }
  if (!data.description || typeof data.description !== 'string') {
    errors.push(`${fileLabel}: missing frontmatter.description`);
  }
  return errors;
}

export function buildRenderContext({ target, config, frontmatter }) {
  const tools = {};
  for (const [key, value] of Object.entries(config.tools ?? {})) {
    tools[key] = value;
  }

  return {
    ...frontmatter,
    name: frontmatter.name,
    description: frontmatter.description,
    tools,
    claude: target === 'claude',
    copilot: target === 'copilot',
    cursor: target === 'cursor',
    HEADER: Mustache.render(config.HEADER ?? '', { name: frontmatter.name }),
    paths: config.paths ?? {},
  };
}

export function renderMarkdown(content, context) {
  const { data, body } = parseFrontmatter(content);
  const renderContext = {
    ...context,
    HEADER: context.HEADER,
  };

  let renderedBody = Mustache.render(body, renderContext);

  if (context.claude) {
    renderedBody = stripOtherEcosystemBlocks(renderedBody, ['copilot', 'cursor']);
  } else if (context.copilot) {
    renderedBody = stripOtherEcosystemBlocks(renderedBody, ['claude', 'cursor']);
  } else if (context.cursor) {
    renderedBody = stripOtherEcosystemBlocks(renderedBody, ['claude', 'copilot']);
  }

  const outputFrontmatter = filterFrontmatterForTarget(data, context);
  const frontmatterYaml = serializeFrontmatter(outputFrontmatter);
  return `${frontmatterYaml}${renderedBody}`;
}

function serializeFrontmatter(data) {
  const body = yaml.dump(data, { lineWidth: -1, noRefs: true }).trimEnd();
  return `---\n${body}\n---\n`;
}

function stripOtherEcosystemBlocks(body, removeTags) {
  let result = body;
  for (const tag of removeTags) {
    const re = new RegExp(`\\{\\{#${tag}\\}\\}[\\s\\S]*?\\{\\{/${tag}\\}\\}\\n?`, 'g');
    result = result.replace(re, '');
  }
  return result;
}

function filterFrontmatterForTarget(data, context) {
  const { claude, copilot, cursor, ...rest } = data;
  const out = { ...rest };

  if (context.claude && claude) out.claude = claude;
  if (context.copilot && copilot) out.copilot = copilot;
  if (context.cursor && cursor) out.cursor = cursor;

  return out;
}

export function assertNoUnresolvedTokens(content, fileLabel) {
  const errors = [];
  if (content.includes('{{{HEADER}}}')) {
    errors.push(`${fileLabel}: unresolved {{{HEADER}}}`);
  }
  if (/\{\{\{tools\.\w+\}\}\}/.test(content)) {
    errors.push(`${fileLabel}: unresolved tools token`);
  }
  if (/\{\{#(claude|copilot|cursor)\}\}/.test(content)) {
    errors.push(`${fileLabel}: unresolved ecosystem conditional`);
  }
  return errors;
}
