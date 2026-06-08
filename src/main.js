import './styles/input.css';
import { createSearchForm } from './components/searchForm.js';

const app = document.querySelector('#app');

app.innerHTML = createSearchForm();
