import AbstractView from '../framework/view/abstract-view.js';
import {capitalizeFirstLetter} from '../utils/film.js';
import {FilterType} from '../const.js';

function createMoviesCount(count) {
  return /* html */ `
    <span class="main-navigation__item-count">${count}</span>
  `;
}

// function createFilterItemTemplate(filter, isChecked) {
function createFilterItemTemplate(filter, currentFilter) {
  console.log(`filter: ${Object.entries(filter)}`);
  console.log(`currentFilter: ${currentFilter}`);
  const {type, count} = filter;

  return /* html */ `
    <a href="#${type}" class="main-navigation__item ${type === currentFilter ? 'main-navigation__item--active' : ''}">
    ${type === 'all' ? 'All movies' : capitalizeFirstLetter(type)}
    ${type === 'all' ? '' : createMoviesCount(count)}</a>
  `;
}

function createFilterTemplate({filters, currentFilter}) {
  // console.log(`filterItems: ${filterItems}`);
  // const filterItemsTemplate = filterItems.map((filter, index) => createFilterItemTemplate(filter, index === 0)).join('');
  const filterItemsTemplate = filters.map((filter) => createFilterItemTemplate(filter, currentFilter)).join('');
  return /* html */ `
    <nav class="main-navigation">
      ${filterItemsTemplate}
    </nav>
  `;
}

export default class FilterView extends AbstractView {
  #filters = null;
  #currentFilter = null;
  #handleFilterTypeChange = null;

  constructor({filters, currentFilter, onFilterTypeChange}) {
    super();

    this.#filters = filters;
    this.#currentFilter = currentFilter;
    this.#handleFilterTypeChange = onFilterTypeChange;

    this.element.addEventListener('click', this.#filterTypeChangeHandler);
  }

  get template() {
    // console.log(`template this.#filters: ${this.#filters}, this.#currentFilter: ${this.#currentFilter}`);
    return createFilterTemplate({
      filters: this.#filters,
      currentFilter: this.#currentFilter
    });
  }

  // #filterTypeChangeHandler = (evt) => {
  //   // evt.preventDefault();
  //   console.log(`evt.target: ${evt.target}`);
  //   console.log(`evt.currentTarget: ${evt.currentTarget}`);
  //   // console.log(`evt.target.value: ${evt.target.href}`);
  //   this.#handleFilterTypeChange(evt.target);
  // };

  #filterTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'A') {
      return;
    }

    evt.preventDefault();
    this.#handleFilterTypeChange(evt.target.dataset.filterType);
  };
}
