import Observable from '../framework/observable.js';
import {updateItem} from '../utils/common.js';

export default class FilmsModel extends Observable {
  #service = null;
  #films = null;

  constructor(service) {
    super();
    this.#service = service;
    this.#films = this.#service.getFilms();
  }

  get() {
    // this.films.forEach((film) => console.log(film));
    return this.#films;
  }

  // get filmsPerPortion() {
  //   // this.films.forEach((film) => console.log(film));
  //   return this.#films;
  // }

  updateFilm(updateType, film) {
    // const index = this.#films.findIndex((film) => film.id === update.id);

    // if (index === -1) {
    //   throw new Error('Can\'t update unexisting film');
    // }

    // this.#films = [
    //   ...this.#films.slice(0, index),
    //   update,
    //   ...this.#films.slice(index + 1),
    // ];

    // this._notify(updateType, update);

    const updatedFilm = this.#service.updateFilm(film);
    this.#films = updateItem(this.#films, updatedFilm);
    this._notify(updateType, updatedFilm);
  }
}

