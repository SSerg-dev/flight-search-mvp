export function createSearchStatus({ isLoading = false } = {}) {
  if (!isLoading) {
    return '';
  }

  return `
    <section class="mx-auto mt-6 max-w-5xl rounded border border-sky-200 bg-sky-50 p-4 text-sm font-medium text-sky-900" aria-live="polite" role="status">
      Searching mock flight offers...
    </section>
  `;
}
