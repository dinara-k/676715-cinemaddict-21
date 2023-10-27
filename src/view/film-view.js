import AbstractView from '../framework/view/abstract-view.js';
import {formatStringToYear, getFilmDurationInHours, getArrayElementsInRow} from '../utils.js';

function createFilmTemplate({comments, filmInfo}) {
  const {title, totalRating, poster, release, duration, genres, description} = filmInfo;
  return /* html */ `
    <article class="film-card">
      <a class="film-card__link">
        <h3 class="film-card__title">${title}</h3>
        <p class="film-card__rating">${totalRating}</p>
        <p class="film-card__info">
          <span class="film-card__year">${formatStringToYear(release.date)}</span>
          <!--<span class="film-card__duration">${duration}</span>-->
          <span class="film-card__duration">${getFilmDurationInHours(duration)}</span>
          <!--<span class="film-card__genre">${genres}</span>-->
          <span class="film-card__genre">${getArrayElementsInRow(genres)}</span>
        </p>
        <img src="${poster}" alt="${title}" class="film-card__poster">
        <p class="film-card__description">${description}</p>
        <span class="film-card__comments">${comments.length} comments</span>
      </a>
      <div class="film-card__controls">
        <button class="film-card__controls-item film-card__controls-item--add-to-watchlist" type="button">Add to watchlist</button>
        <button class="film-card__controls-item film-card__controls-item--mark-as-watched" type="button">Mark as watched</button>
        <button class="film-card__controls-item film-card__controls-item--favorite" type="button">Mark as favorite</button>
      </div>
    </article>
  `;
}

export default class FilmView extends AbstractView {
  constructor({film}) {
    super();
    this.film = film;
  }

  get template() {
    return createFilmTemplate(this.film);
  }
}