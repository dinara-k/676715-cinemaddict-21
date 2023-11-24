import FilterView from '../view/filter-view.js';
import {remove, render, replace} from '../framework/render.js';
import {filter} from '../utils/filter.js';
import {FilterType, UpdateType} from '../const';

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

    return Object.values(FilterType).map((type) => ({
      type,
      count: filter[type](films).length
    }));
  }

  init() {
    this.#currentFilter = this.#filterModel.get();
    const filters = this.filters;
    const prevFilterComponent = this.#filterComponent;

    // this.#filterComponent = new FilterView({
    //   filters: this.filters,
    //   currentFilter: this.#currentFilter,
    //   onFilterTypeChange: this.#filterTypeChangeHandler
    // });

    this.#filterComponent = new FilterView({
      filters,
      currentFilter: this.#currentFilter,
      onFilterTypeChange: this.#filterTypeChangeHandler
    });

    // if (prevFilterComponent === null) {
    //   render(this.#filterComponent, this.#filterContainer);
    // } else {
    //   replace(this.#filterComponent, prevFilterComponent);
    // }
    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#filterContainer);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
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

