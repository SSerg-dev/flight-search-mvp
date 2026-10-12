export async function fetchSerpApiQuota({ fetchImpl = globalThis.fetch } = {}) {
  const response = await fetchImpl('/api/serpapi-account', {
    method: 'GET', cache: 'no-store', signal: AbortSignal.timeout(10000),
  });
  if (!response?.ok) throw new Error('SerpApi quota is unavailable.');
  const quota = await response.json();
  if (!Number.isSafeInteger(quota?.remaining) || quota.remaining < 0 ||
      !Number.isSafeInteger(quota?.limit) || quota.limit < 1) {
    throw new Error('SerpApi quota is unavailable.');
  }
  return { remaining: quota.remaining, limit: quota.limit };
}
