import FilterView from '../view/filter-view.js';
import {render, replace} from '../framework/render.js';
import {filter} from '../utils/filter.js';
import {UpdateType} from '../const';

export default class FilterPresenter {
  #filterContainer = null;
  #filmsModel = null;
  #filterModel = null;

  #filterComponent = null;
  #currentFilter = null;

  constructor({filterContainer, filmsModel, filterModel}){
    this.#filterContainer = filterContainer;
    this.#filmsModel = filmsModel;
    this.#filterModel = filterModel;

    this.#filmsModel.addObserver(this.#modelFilmHandler);
    this.#filterModel.addObserver(this.#modelFilmHandler);
  }

  get filters() {
    const films = this.#filmsModel.get();

    return Object.entries(filter).map(([filterType, filterfilms]) => ({type: filterType, hasfilms: filterfilms(films).length > 0}));
  }

  init() {
    this.#currentFilter = this.#filterModel.get();
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FilterView({
      filters: this.filters,
      currentFilter: this.#currentFilter,
      onFilterTypeChange: this.#filterTypeChangeHandler
    });

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#filterContainer);
    } else {
      replace(this.#filterComponent, prevFilterComponent);
    }
  }

  #modelFilmHandler = () => {
    this.init();
  };

  #filterTypeChangeHandler = (filterType) => {
    if (this.#filterModel.get() === filterType) {
      return;
    }
    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };
}

