export function transformMcp(mcpSource) {
  return mcpSource;
}

export function transformHooks(hooksSource, config) {
  if (!hooksSource?.hooks) return hooksSource;

  const events = config.hooks?.events ?? {};
  const pluginRoot = config.hooks?.pluginRoot ?? '${CLAUDE_PLUGIN_ROOT}';

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
