// import AbstractView from '../framework/view/abstract-view.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {capitalizeFirstLetter} from '../utils/film.js';
import {FilterType} from '../const.js';

// let alreadyWatchedFilms;

function createMoviesCount(count) {
  return /* html */ `
    <span class="main-navigation__item-count">${count}</span>
  `;
}

// function createFilterItemTemplate(filter, isChecked) {
function createFilterItemTemplate(filter, currentFilter) {
  // console.log(`Const - FilterType: ${Object.entries(FilterType)}`);
  // console.log(`filter: ${Object.entries(filter)}`);
  // console.log(`currentFilter: ${currentFilter}`);
  const {type, count} = filter;
  const inUpperCaseType = type.toUpperCase();

  // просмотренные фильмы для UserRank
  // if (type === 'history') {
  //   alreadyWatchedFilms = count;
  //   console.log(`alreadyWatchedFilms: ${alreadyWatchedFilms}`);
  // }
  // console.log(`inUpperCaseType: ${inUpperCaseType}`);
  // console.log(`FilterType.inUpperCaseType: ${FilterType[inUpperCaseType]}`);

  return /* html */ `
    <a href="#${type}" class="main-navigation__item ${type === currentFilter ? 'main-navigation__item--active' : ''}" data-filter-type="${FilterType[inUpperCaseType]}">
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

export default class FilterView extends AbstractStatefulView {
  #filters = null;
  #currentFilter = null;
  #handleFilterTypeChange = null;

  constructor({filters, currentFilter, onFilterTypeChange}) {
    super();

    this.#filters = filters;
    this.#currentFilter = currentFilter;
    this.#handleFilterTypeChange = onFilterTypeChange;

    this._restoreHandlers();
  }

  get template() {
    // console.log(`template this.#filters: ${this.#filters}, this.#currentFilter: ${this.#currentFilter}`);
    // console.log(`this.#filters: ${Object.entries(this.#filters)}`);
    return createFilterTemplate({
      filters: this.#filters,
      currentFilter: this.#currentFilter
    });
  }

  _restoreHandlers() {
    this.element.addEventListener('click', this.#filterTypeChangeHandler);
  }

  // #filterTypeChangeHandler = (evt) => {
  //   // evt.preventDefault();
  //   console.log(`evt.target: ${evt.target}`);
  //   console.log(`evt.currentTarget: ${evt.currentTarget}`);
  //   // console.log(`evt.target.value: ${evt.target.href}`);
  //   this.#handleFilterTypeChange(evt.target);
  // };

  #filterTypeChangeHandler = (evt) => {
    if (evt.target.tagName === 'A') {
      evt.preventDefault();
      this.#handleFilterTypeChange(evt.target.dataset.filterType);
    } else if (evt.target.tagName === 'SPAN') {
      this.#handleFilterTypeChange(evt.target.parentNode.getAttribute('data-filter-type'));
    }
  };
}

// export {alreadyWatchedFilms};
