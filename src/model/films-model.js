export default class FilmsModel {
  #service = null;
  #films = null;

  constructor(service) {
    this.#service = service;
    this.#films = this.#service.getFilms();
  }

  get () {
    // this.films.forEach((film) => console.log(film));
    return this.#films;
  }
}

