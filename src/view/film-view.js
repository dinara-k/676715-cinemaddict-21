import AbstractView from '../framework/view/abstract-view.js';
import {getArrayElementsInRow} from '../utils/common.js';
import {formatStringToYear, getFilmDurationInHours} from '../utils/film.js';

function createControlsTemplate({inWatchlist, alreadyWatched, isFavorite}) {
  const inWatchlistClassName = inWatchlist ? 'film-card__controls-item--active' : '';
  const alreadyWatchedClassName = alreadyWatched ? 'film-card__controls-item--active' : '';
  const favoriteClassName = isFavorite ? 'film-card__controls-item--active' : '';
  return /* html */ `
    <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${inWatchlistClassName}" type="button">Add to watchlist</button>
    <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${alreadyWatchedClassName}" type="button">Mark as watched</button>
    <button class="film-card__controls-item film-card__controls-item--favorite ${favoriteClassName}" type="button">Mark as favorite</button>
  `;
}

function createFilmTemplate({comments, filmInfo, userDetails}) {
  const {title, totalRating, poster, release, duration, genre, description} = filmInfo;
  return /* html */ `
    <article class="film-card">
      <a class="film-card__link">
        <h3 class="film-card__title">${title}</h3>
        <p class="film-card__rating">${totalRating}</p>
        <p class="film-card__info">
          <span class="film-card__year">${formatStringToYear(release.date)}</span>
          <!--<span class="film-card__duration">${duration}</span>-->
          <span class="film-card__duration">${getFilmDurationInHours(duration)}</span>
          <!--<span class="film-card__genre">${genre}</span>-->
          <span class="film-card__genre">${getArrayElementsInRow(genre)}</span>
        </p>
        <img src="${poster}" alt="${title}" class="film-card__poster">
        <p class="film-card__description">${description}</p>
        <span class="film-card__comments">${comments.length} comments</span>
      </a>
      <div class="film-card__controls">
        ${createControlsTemplate(userDetails)}
      </div>
    </article>
  `;
}

export default class FilmView extends AbstractView {
  #film = null;
  #handleCardClick = null;
  #handleInWatchlistClick = null;
  #handleAlreadyWatchedClick = null;
  #handleFavoriteClick = null;

  constructor({film, onCardClick, onInWatchlistClick, onAlreadyWatchedClick, onFavoriteClick}) {
    super();
    this.#film = film;
    // console.log(`this.#film: ${this.#film}`);
    this.#handleCardClick = onCardClick;
    this.#handleInWatchlistClick = onInWatchlistClick;
    this.#handleAlreadyWatchedClick = onAlreadyWatchedClick;
    this.#handleFavoriteClick = onFavoriteClick;

    this.element.querySelector('.film-card__link').addEventListener('click', this.#cardClickHandler);

    const cardControls = this.element.querySelector('.film-card__controls');
    cardControls.querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this.#inWatchlistClickHandler);
    cardControls.querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this.#alreadyWatchedClickHandler);
    cardControls.querySelector('.film-card__controls-item--favorite').addEventListener('click', this.#favoriteClickHandler);
  }

  get template() {
    return createFilmTemplate(this.#film);
  }

  #cardClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleCardClick();
  };

  #inWatchlistClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleInWatchlistClick();
  };

  #alreadyWatchedClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleAlreadyWatchedClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleFavoriteClick();
  };
}
