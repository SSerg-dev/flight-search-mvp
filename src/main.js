import './styles/input.css';
import { createSearchForm, createSearchQueryFromFormData, searchFormDefaults } from './components/searchForm.js';
import { createResultsList } from './components/resultsList.js';
import { createSearchStatus } from './components/searchStatus.js';
import { searchFlightOffers } from './services/flightService.js';
import { validateSearchQuery } from './utils/validation.js';

const app = document.querySelector('#app');

const appState = {
  values: searchFormDefaults,
  errors: {},
  results: undefined,
  isLoading: false,
};

renderApp();

function renderApp() {
  app.innerHTML =
    createSearchForm({
      values: appState.values,
      errors: appState.errors,
      isLoading: appState.isLoading,
    }) +
    createSearchStatus({ isLoading: appState.isLoading }) +
    createResultsMarkup(appState.results);
  app.querySelector('form').addEventListener('submit', handleSearchSubmit);
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
    renderApp();

    return;
  }

  appState.values = query;
  appState.errors = {};
  appState.results = undefined;
  appState.isLoading = true;
  renderApp();

  appState.results = await searchFlightOffers(query);
  appState.isLoading = false;
  renderApp();
}

function createResultsMarkup(results) {
  if (!Array.isArray(results)) {
    return '';
  }

  return createResultsList(results);
}
