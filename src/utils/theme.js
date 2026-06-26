const THEME_STORAGE_KEY = 'theme';
const DARK_THEME = 'dark';
const LIGHT_THEME = 'light';

export function getInitialTheme(storage = globalThis.localStorage) {
  const savedTheme = safelyGetTheme(storage);

  return isSupportedTheme(savedTheme) ? savedTheme : LIGHT_THEME;
}

export function getNextTheme(theme) {
  return theme === DARK_THEME ? LIGHT_THEME : DARK_THEME;
}

export function applyTheme(theme, { documentElement = globalThis.document?.documentElement } = {}) {
  if (!documentElement?.classList) {
    return;
  }

  if (theme === DARK_THEME) {
    documentElement.classList.add(DARK_THEME);
    return;
  }

  documentElement.classList.remove(DARK_THEME);
}

export function persistTheme(theme, storage = globalThis.localStorage) {
  if (!storage?.setItem || !isSupportedTheme(theme)) {
    return;
  }

  storage.setItem(THEME_STORAGE_KEY, theme);
}

function safelyGetTheme(storage) {
  try {
    return storage?.getItem?.(THEME_STORAGE_KEY);
  } catch {
    return '';
  }
}

function isSupportedTheme(theme) {
  return theme === DARK_THEME || theme === LIGHT_THEME;
}
