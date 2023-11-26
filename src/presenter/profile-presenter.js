import ProfileView from '../view/profile-view.js';
import {remove, render, replace} from '../framework/render.js';
import {filter} from '../utils/filter.js';
// import {FilterType, UpdateType} from '../const.js';
// import {FilterType} from '../const.js';

export default class ProfilePresenter {
  #profileContainer = null;
  #filmsModel = null;

  #profileComponent = null;

  constructor({headerContainer, filmsModel}){
    // console.log(`headerContainer: ${headerContainer}`);
    // console.log(`headerContainer - Object.entries: ${headerContainer}`);
    this.#profileContainer = headerContainer;
    // console.log(`this.#profileContainer: ${this.#profileContainer}`);
    this.#filmsModel = filmsModel;

    this.#filmsModel.addObserver(this.#modelFilmHandler);
  }

  get count() {
    const films = this.#filmsModel.get();
    // const a = filter.history(films);
    // console.log(`filter.history: ${a}`);

    // const aFilms = Object.entries(a);
    // console.log(`filter.watchlist - Object.entries: ${Object.entries(aFilms)}`);

    // const aLegth = a.length;
    // console.log(`filter.watchlist - length: ${aLegth}`);

    // return filter[FilterType.WATCHLIST](films).length;
    return filter.history(films).length;
  }

  init() {
    // this.#currentFilter = this.#filterModel.get();
    const count = this.count;
    // console.log(`count: ${count}`);
    const prevProfileComponent = this.#profileComponent;

    this.#profileComponent = new ProfileView({count});

    if (prevProfileComponent === null) {
      render(this.#profileComponent, this.#profileContainer);
      return;
    }

    replace(this.#profileComponent, prevProfileComponent);
    remove(prevProfileComponent);
  }

  #modelFilmHandler = () => {
    this.init();
  };
}
