export const FLIGHT_API_MODES = {
  MOCK: 'mock',
  AMADEUS: 'amadeus',
  DUFFEL: 'duffel',
};

export function getApiConfig(env = getDefaultEnv()) {
  const requestedMode = normalizeMode(env.VITE_FLIGHT_API_MODE);
  const proxyUrl = String(env.VITE_FLIGHT_API_PROXY_URL ?? '').trim();
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
  return mode === FLIGHT_API_MODES.AMADEUS || mode === FLIGHT_API_MODES.DUFFEL;
}

function getModeLabel(mode) {
  if (mode === FLIGHT_API_MODES.DUFFEL) {
    return 'Duffel';
  }

  return 'Amadeus';
}

function normalizeMode(value) {
  return String(value ?? FLIGHT_API_MODES.MOCK).trim().toLowerCase() || FLIGHT_API_MODES.MOCK;
}

function getDefaultEnv() {
  return import.meta.env ?? {};
}
