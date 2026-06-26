export function createSearchStatus({ isLoading = false, serviceError = '' } = {}) {
  if (serviceError) {
    return `
      <section class="mx-auto mt-6 max-w-5xl rounded border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-100" aria-live="assertive" role="alert">
        ${escapeHtml(serviceError)}
      </section>
    `;
  }

  if (!isLoading) {
    return '';
  }

  return `
    <section class="mx-auto mt-6 max-w-5xl rounded border border-sky-200 bg-sky-50 p-4 text-sm font-medium text-sky-900 dark:border-sky-800 dark:bg-sky-950 dark:text-sky-100" aria-live="polite" role="status">
      Searching mock flight offers...
    </section>
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
