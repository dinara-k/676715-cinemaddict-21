import FilmView from '../view/film-view.js';
import FilmPopupView from '../view/film-popup-view.js';
import {remove, render, replace} from '../framework/render.js';
import {Mode} from '../const.js';

export default class FilmPresenter {
  #filmsMainListContainer = null;
  #commentsModel = null;
  #handleDataChange = null;
  #handleModeChange = null;
  #filmComponent = null;
  #filmPopupComponent = null;
  #film = null;
  #mode = Mode.DEFAULT;

  constructor({filmsMainListContainer, commentsModel, onDataChange, onModeChange}) {
    this.#filmsMainListContainer = filmsMainListContainer;
    this.#commentsModel = commentsModel;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
  }

  init(film) {
    this.#film = film;

    // const allComments = this.#commentsModel.get();
    // allComments.forEach((comment) => {
    //   console.log(`item: ${Object.entries(comment)}`);
    // });
    // console.log(`comments: ${this.#commentsModel.get()}`);

    const prevFilmComponent = this.#filmComponent;
    const prevFilmPopupComponent = this.#filmPopupComponent;

    this.#filmComponent = new FilmView({
      film: this.#film,
      onCardClick: this.#handleCardClick,
      onInWatchlistClick: this.#handleInWatchlistClick,
      onAlreadyWatchedClick: this.#handleAlreadyWatchedClick,
      onFavoriteClick: this.#handleFavoriteClick
    });

    this.#filmPopupComponent = new FilmPopupView ({
      film: this.#film,
      allComments: this.#commentsModel.get(),
      onCloseClick: this.#handleCloseClick,
      onInWatchlistClick: this.#handleInWatchlistClick,
      onAlreadyWatchedClick: this.#handleAlreadyWatchedClick,
      onFavoriteClick: this.#handleFavoriteClick
    });

    if (prevFilmComponent === null || prevFilmPopupComponent === null) {
      render(this.#filmComponent, this.#filmsMainListContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#filmComponent, prevFilmComponent);
    }

    if (this.#mode === Mode.POPUP) {
      replace(this.#filmPopupComponent, prevFilmPopupComponent);
    }

    // if (this.#filmsMainListContainer.contains(prevFilmComponent.element)) {
    //   replace(this.#filmComponent, prevFilmComponent);
    // }

    // if (this.#filmsMainListContainer.contains(prevFilmPopupComponent.element)) {
    //   replace(this.#filmPopupComponent, prevFilmPopupComponent);
    // }

    // remove(prevFilmComponent);
    // remove(prevFilmPopupComponent);
  }

  destroy() {
    remove(this.#filmComponent);
    remove(this.#filmPopupComponent);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#closePopup();
    }
  }

  #openPopup() {
    render(this.#filmPopupComponent, document.body);
    document.body.classList.add('hide-overflow');
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#handleModeChange();
    // this.#filmPopupComponent.(); - дергать навешивание обработчиков после перерисовки
    this.#mode = Mode.POPUP;
  }

  #closePopup() {
    remove(this.#filmPopupComponent);
    document.body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  }

  #handleCardClick = () => {
    this.#openPopup();
  };

  #handleCloseClick = (film) => {
    this.#handleDataChange(film);
    this.#closePopup();
  };

  #handleInWatchlistClick = () => {
    this.#handleDataChange({
      ...this.#film,
      userDetails: {...this.#film.userDetails, inWatchlist: !this.#film.userDetails.inWatchlist}
    });
  };

  #handleAlreadyWatchedClick = () => {
    this.#handleDataChange({
      ...this.#film,
      userDetails: {...this.#film.userDetails, alreadyWatched: !this.#film.userDetails.alreadyWatched}
    });
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange({
      ...this.#film,
      userDetails: {...this.#film.userDetails, isFavorite: !this.#film.userDetails.isFavorite}
    });
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#closePopup();
      // document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  };
}
