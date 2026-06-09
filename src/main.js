import './styles/input.css';
import { createSearchForm, createSearchQueryFromFormData } from './components/searchForm.js';
import { createResultsList } from './components/resultsList.js';
import { mockFlights } from './data/mockFlights.js';
import { searchFlights } from './utils/searchFlights.js';
import { validateSearchQuery } from './utils/validation.js';

const app = document.querySelector('#app');

renderSearchForm();

function renderSearchForm(options) {
  app.innerHTML = createSearchForm(options) + createResultsMarkup(options?.results);
  app.querySelector('form').addEventListener('submit', handleSearchSubmit);
}

function handleSearchSubmit(event) {
  event.preventDefault();

  const query = createSearchQueryFromFormData(new FormData(event.currentTarget));
  const result = validateSearchQuery(query);

  if (!result.isValid) {
    renderSearchForm({
      values: query,
      errors: result.errors,
    });

    return;
  }

  renderSearchForm({
    values: query,
    errors: {},
    results: searchFlights(query, mockFlights),
  });
}

function createResultsMarkup(results) {
  if (!Array.isArray(results)) {
    return '';
  }

  return createResultsList(results);
}
