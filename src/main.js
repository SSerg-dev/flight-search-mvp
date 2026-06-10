import './styles/input.css';
import { createSearchForm, createSearchQueryFromFormData, searchFormDefaults } from './components/searchForm.js';
import { createResultsList } from './components/resultsList.js';
import { createSearchStatus } from './components/searchStatus.js';
import { searchFlightOffers } from './services/flightService.js';
import { sortFlights } from './utils/sortFlights.js';
import { validateSearchQuery } from './utils/validation.js';

const app = document.querySelector('#app');

const appState = {
  values: searchFormDefaults,
  errors: {},
  results: undefined,
  isLoading: false,
  serviceError: '',
  sortBy: 'price',
};

renderApp();

function renderApp() {
  app.innerHTML =
    createSearchForm({
      values: appState.values,
      errors: appState.errors,
      isLoading: appState.isLoading,
    }) +
    createSearchStatus({
      isLoading: appState.isLoading,
      serviceError: appState.serviceError,
    }) +
    createResultsMarkup(appState.results, appState.sortBy);
  app.querySelector('form').addEventListener('submit', handleSearchSubmit);
  app.querySelector('#sortBy')?.addEventListener('change', handleSortChange);
}

async function handleSearchSubmit(event) {
  event.preventDefault();

  const query = createSearchQueryFromFormData(new FormData(event.currentTarget));
  const result = validateSearchQuery(query);

  if (!result.isValid) {
    appState.values = query;
    appState.errors = result.errors;
    appState.results = undefined;
    appState.isLoading = false;
    appState.serviceError = '';
    renderApp();

    return;
  }

  appState.values = query;
  appState.errors = {};
  appState.results = undefined;
  appState.isLoading = true;
  appState.serviceError = '';
  renderApp();

  try {
    appState.results = await searchFlightOffers(query);
  } catch {
    appState.results = undefined;
    appState.serviceError = 'We could not load flight results. Please try again.';
  } finally {
    appState.isLoading = false;
    renderApp();
  }
}

function handleSortChange(event) {
  appState.sortBy = event.currentTarget.value;
  renderApp();
}

function createResultsMarkup(results, sortBy) {
  if (!Array.isArray(results)) {
    return '';
  }

  return createResultsList(sortFlights(results, sortBy), { sortBy });
}
