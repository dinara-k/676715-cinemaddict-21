import ApiService from '../framework/api-service.js';

const Metod = {
  GET: 'GET',
  PUT: 'PUT'
};

export default class FilmApiService extends ApiService {
  get films() {
    return this._load({url: 'movies'}).then(ApiService.parseResponse);
  }

  // get comments() {
  //   return this._load({url: 'comments'}).then(ApiService.parseResponse);
  // }

  async updateFilm(film) {
    const response = await this._load({
      url: `movies/${film.id}`,
      method: Metod.PUT,
      body: JSON.stringify(this.#adaptToServer(film)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);
    return parsedResponse;
  }

  // async addComment(comment) {
  //   const response = await this._load({
  //     url: 'comments',
  //     method: Metod.POST,
  //     body: JSON.stringify(this.#adaptToServer(comment)),
  //     headers: new Headers({'Content-Type': 'application/json'}),
  //   });
  //   const parsedResponse = await ApiService.parseResponse(response);

  //   return parsedResponse;
  // }

  // async deleteComment(comment) {
  //   const response = await this._load({
  //     url: `comments/${comment.id}`,
  //     method: Metod.DELETE
  //   });

  //   return response;
  // }

  #adaptToServer(film) {
    const adaptedRelease = (unAdaptedRelease) => {
      const release = {
        ...unAdaptedRelease,
        'date': unAdaptedRelease.date.toISOString(),
        'release_country': unAdaptedRelease.releaseCountry
      };

      delete release.releaseCountry;

      return release;
    };

    const adaptedFilmInfo = (unAdaptedFilmInfo) => {
      const filmInfo = {
        ...unAdaptedFilmInfo,
        'alternative_title': unAdaptedFilmInfo.altTitle,
        'total_rating': unAdaptedFilmInfo.totalRating,
        'age_rating': unAdaptedFilmInfo.ageRating,
        'release': adaptedRelease(unAdaptedFilmInfo.release)
      };

      delete filmInfo.altTitle;
      delete filmInfo.totalRating;
      delete filmInfo.ageRating;

      return filmInfo;
    };

    const adaptedUserDetails = (unAdaptedUserDetails) => {
      const userDetails = {
        ...unAdaptedUserDetails,
        'watchlist': unAdaptedUserDetails.inWatchlist,
        'already_watched': unAdaptedUserDetails.alreadyWatched,
        'watching_date': unAdaptedUserDetails.watchingDate instanceof Date ? unAdaptedUserDetails.watchingDate.toISOString() : null,
        'favorite': unAdaptedUserDetails.isFavorite
      };

      delete userDetails.inWatchlist;
      delete userDetails.alreadyWatched;
      delete userDetails.isFavorite;

      return userDetails;
    };

    const adaptedFilm = {
      ...film,
      'film_info': adaptedFilmInfo(film.filmInfo),
      'user_details': adaptedUserDetails(film.userDetails)
    };

    delete adaptedFilm.filmInfo;
    delete adaptedFilm.userDetails;

    return adaptedFilm;
  }
}
