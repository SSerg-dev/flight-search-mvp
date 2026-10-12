export function createSerpApiQuotaMarkup({ status = 'loading', data } = {}) {
  let text = 'Checking quota...';
  let color = 'text-slate-500 dark:text-slate-400';
  if (status === 'error') {
    text = 'Quota unavailable';
  } else if (data) {
    text = `${data.remaining} / ${data.limit} left`;
    color = data.remaining === 0 ? 'text-red-600 dark:text-red-300' : 'text-slate-700 dark:text-slate-300';
  }
  return `<span class="inline-flex min-h-9 min-w-32 items-center text-xs font-medium tabular-nums ${color}" aria-label="SerpApi searches remaining" aria-live="polite" aria-busy="${status === 'loading'}">${text}</span>`;
}
