const DATA_MODE_STORAGE_KEY = 'flight-search:data-mode';
const SUPPORTED_DATA_MODES = new Set(['mock', 'serpapi']);

export function getInitialDataMode(defaultMode = 'mock', storage = globalThis.localStorage) {
  const savedMode = safelyGetDataMode(storage);

  if (SUPPORTED_DATA_MODES.has(savedMode)) {
    return savedMode;
  }

  return SUPPORTED_DATA_MODES.has(defaultMode) ? defaultMode : 'mock';
}

export function persistDataMode(mode, storage = globalThis.localStorage) {
  if (!storage?.setItem || !SUPPORTED_DATA_MODES.has(mode)) {
    return;
  }

  storage.setItem(DATA_MODE_STORAGE_KEY, mode);
}

function safelyGetDataMode(storage) {
  try {
    return storage?.getItem?.(DATA_MODE_STORAGE_KEY);
  } catch {
    return '';
  }
}
