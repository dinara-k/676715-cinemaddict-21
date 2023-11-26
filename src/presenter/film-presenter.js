import FilmView from '../view/film-view.js';
import FilmPopupView from '../view/film-popup-view.js';
import {remove, render, replace} from '../framework/render.js';
import {Mode, UserAction, UpdateType} from '../const.js';

// let form;

export default class FilmPresenter {
  #filmsMainListContainer = null;
  // нужно #filmsModel?
  #filmsModel = null;
  #commentsModel = null;
  #handleDataChange = null;
  #handleModeChange = null;
  #filmComponent = null;
  #filmPopupComponent = null;
  #film = null;
  #mode = Mode.DEFAULT;

  constructor({filmsMainListContainer, filmsModel, commentsModel, onDataChange, onModeChange}) {
    this.#filmsMainListContainer = filmsMainListContainer;
    this.#filmsModel = filmsModel;
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
      onFavoriteClick: this.#handleFavoriteClick,
      onDeleteComment: this.#handleCommentDelete,
      onSubmitComment: this.#handleCommentSubmit
    });

    if (prevFilmComponent === null || prevFilmPopupComponent === null) {
      render(this.#filmComponent, this.#filmsMainListContainer);
      return;
    }

    // if (this.#mode === Mode.DEFAULT) {
    replace(this.#filmComponent, prevFilmComponent);
    // }

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
      // this.#filmPopupComponent.reset(this.#film);
      this.#filmPopupComponent.reset(this.#film);
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

    // const section = document.querySelector('.film-details');
    // form = section.querySelector('.film-details__new-comment');
    // console.log(`form сохранена: ${form}`);
  }

  #closePopup() {
    remove(this.#filmPopupComponent);
    // replace(this.#filmPopupComponent, prevFilmPopupComponent);
    document.body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
    // form.reset();
  }

  #handleCardClick = () => {
    this.#openPopup();
  };

  #handleCloseClick = (film) => {
    this.#handleDataChange(film);
    this.#closePopup();
  };

  #handleInWatchlistClick = () => {
    // this.#handleDataChange({
    //   ...this.#film,
    //   userDetails: {...this.#film.userDetails, inWatchlist: !this.#film.userDetails.inWatchlist}
    // });

    this.#handleDataChange(
      UserAction.UPDATE_FILM,
      // UpdateType.MINOR,
      UpdateType.PATCH,
      {...this.#film, userDetails: {...this.#film.userDetails, inWatchlist: !this.#film.userDetails.inWatchlist}}
    );
    // this.#openPopup();
  };

  #handleAlreadyWatchedClick = () => {
    // this.#handleDataChange({
    //   ...this.#film,
    //   userDetails: {...this.#film.userDetails, alreadyWatched: !this.#film.userDetails.alreadyWatched}
    // });

    this.#handleDataChange(
      UserAction.UPDATE_FILM,
      // UpdateType.MAJOR,
      UpdateType.PATCH,
      {...this.#film, userDetails: {...this.#film.userDetails, alreadyWatched: !this.#film.userDetails.alreadyWatched}}
    );
    // this.#openPopup();
  };

  #handleFavoriteClick = () => {
    // this.#handleDataChange({
    //   ...this.#film,
    //   userDetails: {...this.#film.userDetails, isFavorite: !this.#film.userDetails.isFavorite}
    // });
    this.#handleDataChange(
      UserAction.UPDATE_FILM,
      UpdateType.PATCH,
      {...this.#film, userDetails: {...this.#film.userDetails, isFavorite: !this.#film.userDetails.isFavorite}}
    );
    // this.#openPopup();
  };

  // #handleCommentDelete = (commentId, film) => {
  #handleCommentDelete = (commentId, film) => {
    // this.#filmsModel.deleteComment(commentId, film);
    // this.#commentsModel.deleteComment(commentId, film);
    const newComments = this.#commentsModel.deleteComment(commentId, film);
    // console.log
    this.#handleDataChange(
      UserAction.UPDATE_FILM,
      UpdateType.PATCH,
      {...this.#film, comments: newComments}
    );
    // console.log(`film ${film}`);
    // this.#film = film;
    // дописать !

    // this.#handleDataChange(
    //   UserAction.DELETE_COMMENT,
    //   UpdateType.PATCH,
    //   // film
    //   commentId
    // );
    // this.init(this.#film);
    // this.#handleDataChange(
    //   UserAction.UPDATE_FILM,
    //   // UpdateType.MAJOR,
    //   UpdateType.PATCH,
    //   {...this.#film}
    // );
  };

  #handleCommentSubmit = (newCommentPart, film) => {
  // #handleCommentSubmit = (newCommentPart) => {
    const newComments = this.#commentsModel.addComment(newCommentPart, film);
    // this.#handleDataChange(
    //   UserAction.ADD_COMMENT,
    //   UpdateType.PATCH,
    //   update
    // );
    this.#handleDataChange(
      UserAction.UPDATE_FILM,
      UpdateType.PATCH,
      {...this.#film, comments: newComments}
    );
    // this.#openPopup();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      // this.#filmPopupComponent.resetForm();
      this.#filmPopupComponent.reset(this.#film);
      // this.#filmPopupComponent.reset();
      this.#closePopup();
      // document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  };
}
