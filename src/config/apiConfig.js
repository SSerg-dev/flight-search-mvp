export const FLIGHT_API_MODES = {
  MOCK: 'mock',
  SERPAPI: 'serpapi',
};

export function getApiConfig(env = getDefaultEnv()) {
  const productionDefaults = env.PROD
    ? {
        mode: FLIGHT_API_MODES.SERPAPI,
        proxyUrl: '/api/serpapi-flights',
      }
    : {
        mode: FLIGHT_API_MODES.MOCK,
        proxyUrl: '',
      };
  const requestedMode = normalizeMode(env.VITE_FLIGHT_API_MODE, productionDefaults.mode);
  const proxyUrl = String(env.VITE_FLIGHT_API_PROXY_URL ?? productionDefaults.proxyUrl).trim();
  const errors = {};

  if (!Object.values(FLIGHT_API_MODES).includes(requestedMode)) {
    return {
      mode: FLIGHT_API_MODES.MOCK,
      requestedMode,
      proxyUrl: '',
      isRealApiEnabled: false,
      errors: {
        mode: 'Unsupported flight API mode. Falling back to mock mode.',
      },
    };
  }

  if (isProxyMode(requestedMode) && proxyUrl.length === 0) {
    errors.proxyUrl = `Flight API proxy URL is required for ${getModeLabel(requestedMode)} mode.`;

    return {
      mode: FLIGHT_API_MODES.MOCK,
      requestedMode,
      proxyUrl: '',
      isRealApiEnabled: false,
      errors,
    };
  }

  return {
    mode: requestedMode,
    requestedMode,
    proxyUrl,
    isRealApiEnabled: isProxyMode(requestedMode),
    errors,
  };
}

function isProxyMode(mode) {
  return mode === FLIGHT_API_MODES.SERPAPI;
}

function getModeLabel(mode) {
  if (mode === FLIGHT_API_MODES.SERPAPI) {
    return 'SerpApi';
  }

  return 'Flight API';
}

function normalizeMode(value, fallbackMode = FLIGHT_API_MODES.MOCK) {
  return String(value ?? fallbackMode).trim().toLowerCase() || fallbackMode;
}

function getDefaultEnv() {
  return import.meta.env ?? {};
}
