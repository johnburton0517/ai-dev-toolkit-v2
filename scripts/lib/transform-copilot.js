export function transformMcp(mcpSource) {
  if (!mcpSource?.mcpServers) return mcpSource;

  const servers = {};
  for (const [key, server] of Object.entries(mcpSource.mcpServers)) {
    servers[key] = {
      type: 'local',
      tools: ['*'],
      ...server,
    };
  }
  return { mcpServers: servers };
}

export function transformHooks(hooksSource, config) {
  if (!hooksSource?.hooks) return hooksSource;

  const events = config.hooks?.events ?? {};
  const pluginRoot = config.hooks?.pluginRoot ?? '${COPILOT_PLUGIN_ROOT}';

  const transformed = JSON.parse(JSON.stringify(hooksSource));
  for (const hook of transformed.hooks) {
    if (hook.event && events[hook.event]) {
      hook.event = events[hook.event];
    }
    if (typeof hook.command === 'string') {
      hook.command = hook.command.replace(/\$\{PLUGIN_ROOT\}/g, pluginRoot);
    }
  }
  return transformed;
}
