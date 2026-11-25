export function safeGet(source, path, fallback = '[PLACEHOLDER]') {
  if (!source || !path) return fallback;
  const keys = Array.isArray(path) ? path : String(path).split('.');
  let current = source;
  for (const key of keys) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return fallback;
    }
    current = current[key];
  }
  if (current === undefined || current === null) {
    return fallback;
  }
  if (typeof current === 'string' && current.trim() === '') {
    return fallback;
  }
  return current;
}

export function hasContent(source, path) {
  const val = safeGet(source, path, null);
  return val !== null && val !== '[PLACEHOLDER]' && val !== '';
}

