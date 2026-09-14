const SEMVER =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const RISK_LEVELS = new Set(['low', 'medium', 'high']);

export function validatePluginMeta(meta, pluginId) {
  const errors = [];
  const label = `plugin ${pluginId}`;

  if (!meta.name) errors.push(`${label}: missing name`);
  if (!meta.version || !SEMVER.test(String(meta.version))) {
    errors.push(`${label}: invalid semver version`);
  }
  if (!meta.description) errors.push(`${label}: missing description`);

  const ownerEmail = resolveOwnerEmail(meta.owner);
  if (!ownerEmail || !EMAIL.test(ownerEmail)) {
    errors.push(`${label}: owner must include valid email`);
  }

  if (!meta.risk || !RISK_LEVELS.has(meta.risk)) {
    errors.push(`${label}: risk must be low, medium, or high`);
  }

  if (!Array.isArray(meta.compliance) || meta.compliance.length === 0) {
    errors.push(`${label}: compliance must be a non-empty array`);
  }

  return errors;
}

function resolveOwnerEmail(owner) {
  if (!owner) return null;
  if (typeof owner === 'string') {
    return EMAIL.test(owner) ? owner : null;
  }
  if (typeof owner === 'object' && owner.email) {
    return owner.email;
  }
  return null;
}

export function validateMarketplaceOwner(owner) {
  const errors = [];
  if (!owner?.name) errors.push('marketplace: missing owner.name');
  if (!owner?.email || !EMAIL.test(owner.email)) {
    errors.push('marketplace: missing valid owner.email');
  }
  return errors;
}
