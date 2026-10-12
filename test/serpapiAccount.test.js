import assert from 'node:assert/strict';
import test from 'node:test';
import { createSerpApiAccountHandler } from '../api/serpapi-account.js';
import { fetchSerpApiQuota } from '../src/services/serpapiQuotaService.js';

const env = { SERPAPI_API_KEY: 'private-test-key', SERPAPI_API_BASE_URL: 'https://serpapi.test' };

test('account endpoint exposes only quota counts, supports zero, and prevents caching', async () => {
  let requestedUrl;
  const handler = createSerpApiAccountHandler({ env, fetchImpl: async (url) => {
    requestedUrl = new URL(url);
    return { ok: true, json: async () => ({ total_searches_left: 0, searches_per_month: 250,
      api_key: 'private-test-key', account_email: 'private@example.test', account_status: 'Your account has run out of searches.' }) };
  } });
  const response = await handler({ method: 'GET' });
  assert.equal(response.status, 200);
  assert.deepEqual(JSON.parse(response.body), { remaining: 0, limit: 250 });
  assert.equal(response.headers['Cache-Control'], 'no-store');
  assert.equal(requestedUrl.origin + requestedUrl.pathname, 'https://serpapi.test/account.json');
  assert.equal(requestedUrl.searchParams.get('api_key'), env.SERPAPI_API_KEY);
  assert.doesNotMatch(response.body, /private|api_key|account_email/);
});

test('account endpoint rejects unsupported methods and missing keys without fetching', async () => {
  let calls = 0;
  const fetchImpl = async () => { calls += 1; throw new Error('No request expected'); };
  assert.equal((await createSerpApiAccountHandler({ env, fetchImpl })({ method: 'POST' })).status, 405);
  assert.equal((await createSerpApiAccountHandler({ fetchImpl })({ method: 'GET' })).status, 500);
  assert.equal(calls, 0);
});

test('account endpoint fails safely for network, JSON, and provider errors', async () => {
  for (const fetchImpl of [
    async () => { throw new Error('Secret URL with api_key=private-test-key'); },
    async () => ({ ok: false, status: 401 }),
    async () => ({ ok: true, json: async () => { throw new Error('Invalid JSON'); } }),
  ]) {
    const response = await createSerpApiAccountHandler({ env, fetchImpl })({ method: 'GET' });
    assert.equal(response.status, 502);
    assert.deepEqual(JSON.parse(response.body), { error: 'SerpApi quota is unavailable.' });
  }
});

test('account endpoint never turns missing or invalid quota values into available searches', async () => {
  for (const account of [{}, { total_searches_left: null, searches_per_month: 250 },
    { total_searches_left: -1, searches_per_month: 250 }, { total_searches_left: 20, searches_per_month: 0 },
    { total_searches_left: 1.5, searches_per_month: 250 }, { total_searches_left: '250', searches_per_month: 250 }]) {
    const response = await createSerpApiAccountHandler({ env, fetchImpl: async () => ({ ok: true, json: async () => account }) })({ method: 'GET' });
    assert.equal(response.status, 502);
  }
});

test('quota client fetches fresh server counts including exhausted accounts', async () => {
  const calls = [];
  const quota = await fetchSerpApiQuota({ fetchImpl: async (url, options) => {
    calls.push({ url, options });
    return { ok: true, json: async () => ({ remaining: 0, limit: 250, api_key: 'never-return-this' }) };
  } });
  assert.deepEqual(quota, { remaining: 0, limit: 250 });
  assert.equal(calls[0].url, '/api/serpapi-account');
  assert.equal(calls[0].options.method, 'GET');
  assert.equal(calls[0].options.cache, 'no-store');
});

test('quota client rejects failed and malformed responses', async () => {
  for (const response of [{ ok: false }, { ok: true, json: async () => ({ remaining: null, limit: 250 }) },
    { ok: true, json: async () => ({ remaining: 4, limit: null }) }]) {
    await assert.rejects(fetchSerpApiQuota({ fetchImpl: async () => response }), /quota is unavailable/);
  }
});
