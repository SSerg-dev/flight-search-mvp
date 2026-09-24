export function createSearchStatus({ isLoading = false, serviceError = '', apiMode = 'mock' } = {}) {
  if (serviceError) {
    const canSwitchToDemo = apiMode === 'serpapi' && /rate limit|run out of searches/i.test(serviceError);

    return `
      <section class="mx-auto mt-6 max-w-5xl rounded border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-100" aria-live="assertive" role="alert">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <span>${escapeHtml(serviceError)}</span>
          ${canSwitchToDemo ? createSwitchToDemoButton() : ''}
        </div>
      </section>
    `;
  }

  if (!isLoading) {
    return '';
  }

  return `
    <section class="mx-auto mt-6 max-w-5xl rounded border border-sky-200 bg-sky-50 p-4 text-sm font-medium text-sky-900 dark:border-sky-800 dark:bg-sky-950 dark:text-sky-100" aria-live="polite" role="status">
      Searching flight offers...
    </section>
  `;
}

function createSwitchToDemoButton() {
  return `
          <button
            class="w-fit rounded border border-red-300 bg-white px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-300 dark:border-red-700 dark:bg-red-950 dark:text-red-100 dark:hover:bg-red-900"
            id="switch-to-demo"
            type="button"
          >
            Switch to Demo
          </button>
  `;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}
