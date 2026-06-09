import './styles/input.css';
import { createSearchForm, createSearchQueryFromFormData } from './components/searchForm.js';
import { validateSearchQuery } from './utils/validation.js';

const app = document.querySelector('#app');

renderSearchForm();

function renderSearchForm(options) {
  app.innerHTML = createSearchForm(options);
  app.querySelector('form').addEventListener('submit', handleSearchSubmit);
}

function handleSearchSubmit(event) {
  event.preventDefault();

  const query = createSearchQueryFromFormData(new FormData(event.currentTarget));
  const result = validateSearchQuery(query);

  renderSearchForm({
    values: query,
    errors: result.errors,
  });
}
