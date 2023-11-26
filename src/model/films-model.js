import Observable from '../framework/observable.js';
import {updateItem} from '../utils/common.js';
import {UpdateType} from '../const.js';

export default class FilmsModel extends Observable {
  #service = null;
  #commentsModel = null;
  // #films = null;
  #films = [];

  constructor({service, commentsModel}) {
    super();
    this.#service = service;
    this.#commentsModel = commentsModel;
    // this.#films = this.#service.getFilms();
  }

  get() {
    // this.films.forEach((film) => console.log(film));
    return this.#films;
  }

  async init() {
    try {
      await Promise.all([
        this.#commentsModel.init()
      ]);
      const films = await this.#service.films;
      this.#films = films.map(this.#adaptToClient);
      console.log(this.#films);
      // this._notify(UpdateType.INIT);
      this._notify(UpdateType.INIT, {isError: false});
    } catch(err) {
      this.#films = [];
      console.log(err);
      // this._notify(UpdateType.INIT);
      this._notify(UpdateType.INIT, {isError: true});
    }
  }

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

  #adaptToClient(film) {
    const adaptedRelease = (unAdaptedRelease) => {
      const release = {
        ...unAdaptedRelease,
        date: unAdaptedRelease['date'] !== null ? new Date(unAdaptedRelease['date']) : unAdaptedRelease['date'],
        releaseCountry: unAdaptedRelease['release_country']
      };

      delete release['release_country'];

      return release;
    };

    const adaptedFilmInfo = (unAdaptedFilmInfo) => {
      const filmInfo = {
        ...unAdaptedFilmInfo,
        altTitle: unAdaptedFilmInfo['alternative_title'],
        totalRating: unAdaptedFilmInfo['total_rating'],
        ageRating: unAdaptedFilmInfo['age_rating'],
        release: adaptedRelease(unAdaptedFilmInfo.release)
      };

      delete filmInfo['alternative_title'];
      delete filmInfo['total_rating'];
      delete filmInfo['age_rating'];

      return filmInfo;
    };

    const adaptedUserDetails = (unAdaptedUserDetails) => {
      const userDetails = {
        ...unAdaptedUserDetails,
        inWatchlist: unAdaptedUserDetails['watchlist'],
        alreadyWatched: unAdaptedUserDetails['already_watched'],
        watchingDate: unAdaptedUserDetails['watching_date'] !== null ? new Date(unAdaptedUserDetails['watching_date']) : unAdaptedUserDetails['watching_date'],
        isFavorite: unAdaptedUserDetails['favorite']
      };

      delete userDetails['watchlist'];
      delete userDetails['already_watched'];
      delete userDetails['watching_date'];
      delete userDetails['favorite'];

      return userDetails;
    };

    const adaptedFilm = {
      ...film,
      filmInfo: adaptedFilmInfo(film['film_info']),
      userDetails: adaptedUserDetails(film['user_details'])
    };

    delete adaptedFilm['film_info'];
    delete adaptedFilm['user_details'];

    return adaptedFilm;
  }
}

