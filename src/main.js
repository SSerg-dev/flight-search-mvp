import './styles/input.css';
import { createSearchForm, createSearchQueryFromFormData, searchFormDefaults } from './components/searchForm.js';
import { createSearchResultsMarkup } from './components/searchResults.js';
import { createSearchStatus } from './components/searchStatus.js';
import { searchFlightOffers } from './services/flightService.js';
import { getServiceErrorMessage } from './utils/serviceErrorMessage.js';
import { applyTheme, getInitialTheme, getNextTheme, persistTheme } from './utils/theme.js';
import { validateSearchQuery } from './utils/validation.js';

const app = document.querySelector('#app');
const initialTheme = getInitialTheme();

applyTheme(initialTheme);

const appState = {
  theme: initialTheme,
  values: searchFormDefaults,
  errors: {},
  results: undefined,
  lastQuery: undefined,
  isLoading: false,
  serviceError: '',
  sortBy: 'price',
};

renderApp();

function renderApp() {
  app.innerHTML =
    createSearchForm({
      theme: appState.theme,
      values: appState.values,
      errors: appState.errors,
      isLoading: appState.isLoading,
    }) +
    createSearchStatus({
      isLoading: appState.isLoading,
      serviceError: appState.serviceError,
    }) +
    createSearchResultsMarkup(appState.results, {
      sortBy: appState.sortBy,
      query: appState.lastQuery,
    });
  const form = app.querySelector('form');
  const themeToggle = app.querySelector('#theme-toggle');

  form.addEventListener('submit', handleSearchSubmit);
  themeToggle.addEventListener('click', handleThemeToggle);
  form.querySelectorAll('input[name="tripType"]').forEach((input) => {
    input.addEventListener('change', handleTripTypeChange);
  });
  app.querySelectorAll('select[name="sortBy"]').forEach((select) => {
    select.addEventListener('change', handleSortChange);
  });
}

async function handleSearchSubmit(event) {
  event.preventDefault();

  const query = createSearchQueryFromFormData(new FormData(event.currentTarget));
  const result = validateSearchQuery(query);

  if (!result.isValid) {
    appState.values = query;
    appState.errors = result.errors;
    appState.results = undefined;
    appState.lastQuery = undefined;
    appState.isLoading = false;
    appState.serviceError = '';
    renderApp();

    return;
  }

  appState.values = query;
  appState.errors = {};
  appState.results = undefined;
  appState.lastQuery = query;
  appState.isLoading = true;
  appState.serviceError = '';
  renderApp();

  try {
    appState.results = await searchFlightOffers(query);
  } catch (error) {
    appState.results = undefined;
    appState.serviceError = getServiceErrorMessage(error);
  } finally {
    appState.isLoading = false;
    renderApp();
  }
}

function handleSortChange(event) {
  appState.sortBy = event.currentTarget.value;
  renderApp();
}

function handleTripTypeChange(event) {
  const query = createSearchQueryFromFormData(new FormData(event.currentTarget.form));

  appState.values = query;
  appState.errors = {};
  appState.results = undefined;
  appState.lastQuery = undefined;
  appState.serviceError = '';
  renderApp();
}

function handleThemeToggle() {
  appState.theme = getNextTheme(appState.theme);
  applyTheme(appState.theme);
  persistTheme(appState.theme);
  renderApp();
}
