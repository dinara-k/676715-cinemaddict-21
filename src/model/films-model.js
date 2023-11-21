import Observable from '../framework/observable.js';

export default class FilmsModel extends Observable {
  #service = null;
  #films = null;

  constructor(service) {
    super();
    this.#service = service;
    this.#films = this.#service.getFilms();
  }

  get () {
    // this.films.forEach((film) => console.log(film));
    return this.#films;
  }

  updateFilm(updateType, update) {
    const index = this.#films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    this.#films = [
      ...this.#films.slice(0, index),
      update,
      ...this.#films.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  // addFilm(updateType, update) {
  //   this.#films = [
  //     update,
  //     ...this.#films,
  //   ];

  //   this._notify(updateType, update);
  // }

  // deleteFilm(updateType, update) {
  //   const index = this.#films.findIndex((film) => film.id === update.id);

  //   if (index === -1) {
  //     throw new Error('Can\'t delete unexisting film');
  //   }

  //   this.#films = [
  //     ...this.#films.slice(0, index),
  //     ...this.#films.slice(index + 1),
  //   ];

  //   this._notify(updateType);
  // }
}

