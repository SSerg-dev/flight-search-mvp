import assert from 'node:assert/strict';
import test from 'node:test';

import { getApiConfig } from '../src/config/apiConfig.js';

test('uses mock mode when API mode is missing', () => {
  assert.deepEqual(getApiConfig({}), {
    mode: 'mock',
    requestedMode: 'mock',
    proxyUrl: '',
    isRealApiEnabled: false,
    errors: {},
  });
});

test('uses mock mode when API mode is explicitly mock', () => {
  assert.deepEqual(getApiConfig({ VITE_FLIGHT_API_MODE: 'mock' }), {
    mode: 'mock',
    requestedMode: 'mock',
    proxyUrl: '',
    isRealApiEnabled: false,
    errors: {},
  });
});

test('falls back to mock mode for unsupported API mode', () => {
  assert.deepEqual(getApiConfig({ VITE_FLIGHT_API_MODE: 'unknown' }), {
    mode: 'mock',
    requestedMode: 'unknown',
    proxyUrl: '',
    isRealApiEnabled: false,
    errors: {
      mode: 'Unsupported flight API mode. Falling back to mock mode.',
    },
  });
});

test('requires a proxy URL for SerpApi mode', () => {
  assert.deepEqual(getApiConfig({ VITE_FLIGHT_API_MODE: 'serpapi' }), {
    mode: 'mock',
    requestedMode: 'serpapi',
    proxyUrl: '',
    isRealApiEnabled: false,
    errors: {
      proxyUrl: 'Flight API proxy URL is required for SerpApi mode.',
    },
  });
});

test('enables real API mode when SerpApi mode has a proxy URL', () => {
  assert.deepEqual(
    getApiConfig({
      VITE_FLIGHT_API_MODE: 'serpapi',
      VITE_FLIGHT_API_PROXY_URL: 'https://example.com/api/serpapi-flights',
    }),
    {
      mode: 'serpapi',
      requestedMode: 'serpapi',
      proxyUrl: 'https://example.com/api/serpapi-flights',
      isRealApiEnabled: true,
      errors: {},
    },
  );
});
