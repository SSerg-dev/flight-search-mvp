import './styles/input.css';
import { createSearchForm, createSearchQueryFromFormData, searchFormDefaults } from './components/searchForm.js';
import { createSearchResultsMarkup } from './components/searchResults.js';
import { createSearchStatus } from './components/searchStatus.js';
import { searchFlightOffers } from './services/flightService.js';
import { formatRouteLocationOptionValue, searchRouteLocations } from './services/airportMetadataService.js';
import { getServiceErrorMessage } from './utils/serviceErrorMessage.js';
import { clearSavedSearches, getSavedSearches, saveSearch } from './utils/savedSearches.js';
import { applyTheme, getInitialTheme, getNextTheme, persistTheme } from './utils/theme.js';
import { validateSearchQuery } from './utils/validation.js';
import {
  filterFlightResultsByConnection,
  getAvailableConnectionOptions,
} from './utils/flightConnections.js';

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
  savedSearches: getSavedSearches(),
  routeOptions: [],
  routeOptionsStatus: 'idle',
  routeDiscoverySignature: '',
  routeDiscoveryResults: undefined,
};

renderApp();

function renderApp() {
  app.innerHTML =
    createSearchForm({
      theme: appState.theme,
      values: appState.values,
      errors: appState.errors,
      isLoading: appState.isLoading,
      savedSearches: appState.savedSearches,
      routeOptions: appState.routeOptions,
      routeOptionsStatus: appState.routeOptionsStatus,
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
  form.addEventListener('change', handleSearchCriteriaChange);
  initializeAirportComboboxes(form);
  themeToggle.addEventListener('click', handleThemeToggle);
  app.querySelectorAll('[data-saved-search-id]').forEach((button) => {
    button.addEventListener('click', handleSavedSearchSelect);
  });
  app.querySelector('#clear-saved-searches')?.addEventListener('click', handleClearSavedSearches);
  form.querySelectorAll('input[name="tripType"]').forEach((input) => {
    input.addEventListener('change', handleTripTypeChange);
  });
  app.querySelectorAll('select[name="sortBy"]').forEach((select) => {
    select.addEventListener('change', handleSortChange);
  });

}

function initializeAirportComboboxes(form) {
  form.querySelectorAll('[data-airport-combobox]').forEach((root) => {
    const input = root.querySelector('[role="combobox"]');
    const hiddenInput = root.querySelector('input[type="hidden"]');
    const listbox = root.querySelector('[role="listbox"]');
    let results = [];
    let activeIndex = -1;

    input.addEventListener('input', () => {
      hiddenInput.value = '';
      updateResults();
    });
    input.addEventListener('focus', () => {
      input.select();
      updateResults();
    });
    input.addEventListener('blur', () => {
      window.setTimeout(closeListbox, 100);
    });
    input.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        moveActiveOption(event.key === 'ArrowDown' ? 1 : -1);
      } else if (event.key === 'Enter' && activeIndex >= 0) {
        event.preventDefault();
        selectAirport(results[activeIndex]);
      } else if (event.key === 'Escape') {
        closeListbox();
      }
    });

    function updateResults() {
      results = searchRouteLocations(input.value, { limit: 8 });
      activeIndex = results.length > 0 ? 0 : -1;
      renderOptions();
    }

    function renderOptions() {
      listbox.replaceChildren();

      if (!input.value.trim()) {
        closeListbox();
        return;
      }

      if (results.length === 0) {
        const emptyMessage = document.createElement('p');
        emptyMessage.className = 'px-3 py-2 text-sm font-normal text-slate-500 dark:text-slate-400';
        emptyMessage.textContent = 'No passenger airports found';
        listbox.append(emptyMessage);
      } else {
        results.forEach((airport, index) => {
          const option = document.createElement('button');
          const code = document.createElement('span');
          const details = document.createElement('span');
          const airportName = document.createElement('span');
          const location = document.createElement('span');

          option.type = 'button';
          option.id = `${input.id}-option-${index}`;
          option.className = getAirportOptionClass(index === activeIndex);
          option.setAttribute('role', 'option');
          option.setAttribute('aria-selected', String(index === activeIndex));
          code.className = 'rounded bg-sky-50 px-2 py-1 text-xs font-bold text-sky-700 dark:bg-sky-400/10 dark:text-sky-300';
          code.textContent = airport.kind === 'city' ? 'CITY' : airport.iata;
          details.className = 'min-w-0';
          airportName.className = 'block truncate font-semibold text-slate-900 dark:text-slate-100';
          airportName.textContent = airport.kind === 'city' ? `${airport.city} — All airports` : airport.name;
          location.className = 'block truncate text-xs font-normal text-slate-500 dark:text-slate-400';
          location.textContent = airport.kind === 'city'
            ? `${airport.iataCodes.join(', ')} · ${airport.country}`
            : `${airport.city}, ${airport.country}`;
          details.append(airportName, location);
          option.append(code, details);
          option.addEventListener('mousedown', (event) => event.preventDefault());
          option.addEventListener('click', () => selectAirport(airport));
          listbox.append(option);
        });
      }

      listbox.classList.remove('hidden');
      input.setAttribute('aria-expanded', 'true');
      updateActiveDescendant();
    }

    function moveActiveOption(direction) {
      if (results.length === 0) {
        updateResults();
        return;
      }

      activeIndex = (activeIndex + direction + results.length) % results.length;
      renderOptions();
      listbox.querySelector(`#${input.id}-option-${activeIndex}`)?.scrollIntoView({ block: 'nearest' });
    }

    function selectAirport(airport) {
      hiddenInput.value = airport.id;
      input.value = formatRouteLocationOptionValue(airport);
      closeListbox();
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }

    function closeListbox() {
      listbox.classList.add('hidden');
      input.setAttribute('aria-expanded', 'false');
      input.removeAttribute('aria-activedescendant');
    }

    function updateActiveDescendant() {
      if (activeIndex < 0) {
        input.removeAttribute('aria-activedescendant');
        return;
      }

      input.setAttribute('aria-activedescendant', `${input.id}-option-${activeIndex}`);
    }
  });
}

function getAirportOptionClass(isActive) {
  const base = 'grid w-full grid-cols-[auto_1fr] items-center gap-3 rounded px-2 py-2 text-left text-sm';

  return isActive
    ? `${base} bg-sky-50 dark:bg-sky-400/10`
    : `${base} hover:bg-slate-50 dark:hover:bg-slate-800`;
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

  const discoverySignature = createRouteDiscoverySignature(query);
  const hasCachedDiscovery =
    discoverySignature === appState.routeDiscoverySignature && appState.routeDiscoveryResults;

  appState.values = query;
  appState.errors = {};
  appState.results = undefined;
  appState.lastQuery = query;
  appState.isLoading = true;
  appState.serviceError = '';
  appState.savedSearches = saveSearch(query);
  appState.routeOptionsStatus = hasCachedDiscovery ? 'loaded' : 'loading';
  renderApp();

  try {
    if (hasCachedDiscovery) {
      appState.results = filterFlightResultsByConnection(appState.routeDiscoveryResults, query);
    } else {
      const discoveryResults = await searchFlightOffers(createDiscoveryQuery(query));

      appState.routeDiscoverySignature = discoverySignature;
      appState.routeDiscoveryResults = discoveryResults;
      appState.routeOptions = getAvailableConnectionOptions(discoveryResults);
      appState.routeOptionsStatus = 'loaded';
      appState.results = filterFlightResultsByConnection(discoveryResults, query);
    }
  } catch (error) {
    appState.results = undefined;
    appState.serviceError = getServiceErrorMessage(error);
    appState.routeOptions = [];
    appState.routeOptionsStatus = 'error';
    appState.routeDiscoverySignature = '';
    appState.routeDiscoveryResults = undefined;
  } finally {
    appState.isLoading = false;
    renderApp();
  }
}

function handleSearchCriteriaChange(event) {
  const fieldName = event.target?.name;

  if (event.target?.type === 'date' && !event.target.validity.valid) {
    return;
  }

  if (fieldName === 'viaRoute' || fieldName === 'tripType') {
    if (fieldName === 'viaRoute') {
      const query = createSearchQueryFromFormData(new FormData(event.currentTarget));
      appState.values = query;
      appState.errors = {};

      if (appState.routeDiscoveryResults) {
        appState.results = filterFlightResultsByConnection(appState.routeDiscoveryResults, query);
        appState.lastQuery = query;
      }

      renderApp();
    }

    return;
  }

  appState.values = createSearchQueryFromFormData(new FormData(event.currentTarget));
  appState.errors = {};
  appState.results = undefined;
  appState.lastQuery = undefined;
  appState.serviceError = '';
  appState.routeOptions = [];
  appState.routeOptionsStatus = 'idle';
  appState.routeDiscoverySignature = '';
  appState.routeDiscoveryResults = undefined;
  renderApp();
}

function createDiscoveryQuery(query) {
  return {
    ...query,
    viaAirportId: '',
    via: '',
    connectionPreference: 'all',
  };
}

function createRouteDiscoverySignature(query) {
  return JSON.stringify({
    tripType: query.tripType,
    fromAirportId: query.fromAirportId,
    toAirportId: query.toAirportId,
    dateRange: query.dateRange,
    returnDateRange: query.returnDateRange,
    adults: query.adults,
    minLayover: query.minLayover,
    maxLayover: query.maxLayover,
  });
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
  appState.routeOptions = [];
  appState.routeOptionsStatus = 'idle';
  appState.routeDiscoverySignature = '';
  appState.routeDiscoveryResults = undefined;
  renderApp();
}

function handleSavedSearchSelect(event) {
  const savedSearchId = event.currentTarget.dataset.savedSearchId;
  const savedSearch = appState.savedSearches.find((search) => search.id === savedSearchId);

  if (!savedSearch) {
    return;
  }

  appState.values = savedSearch.query;
  appState.errors = {};
  appState.results = undefined;
  appState.lastQuery = undefined;
  appState.serviceError = '';
  appState.routeOptions = [];
  appState.routeOptionsStatus = 'idle';
  appState.routeDiscoverySignature = '';
  appState.routeDiscoveryResults = undefined;
  renderApp();
}

function handleClearSavedSearches() {
  clearSavedSearches();
  appState.savedSearches = [];
  renderApp();
}

function handleThemeToggle() {
  appState.theme = getNextTheme(appState.theme);
  applyTheme(appState.theme);
  persistTheme(appState.theme);
  renderApp();
}
