import BoardView from '../view/board-view.js';
import SortView from '../view/sort-view.js';
import FilmsMainListView from '../view/main-list-view.js';
import FilmsMainListContainerView from '../view/main-list-films-container-view.js';
import NoFilmView from '../view/no-film-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import FilmPresenter from './film-presenter.js';
import {remove, render, RenderPosition} from '../framework/render.js';
import {updateItem} from '../utils/common.js';

const FILMS_COUNT_PER_STEP = 5;

export default class BoardPresenter {
  // нужно #bodyContainer?
  #bodyContainer = null;
  #boardContainer = null;
  #filmsModel = null;

  #boardComponent = new BoardView();
  #sortComponent = new SortView();
  #noFilmComponent = new NoFilmView();
  #filmsMainListComponent = new FilmsMainListView();
  #filmsMainListContainerComponent = new FilmsMainListContainerView();

  #filmPopupComponent = null;
  #showMoreButtonComponent = null;

  #boardFilms = [];
  #renderedFilmCount = FILMS_COUNT_PER_STEP;
  #filmPresenters = new Map();

  constructor({bodyContainer, boardContainer, filmsModel}) {
    this.#bodyContainer = bodyContainer;
    this.#boardContainer = boardContainer;
    this.#filmsModel = filmsModel;
  }

  init() {
    this.#boardFilms = [...this.#filmsModel.get()];
    // console.log(`this.boardFilms: ${this.boardFilms}`);
    // this.boardFilms.forEach((film) => console.log(film));

    this.#renderBoard();
  }

  #renderBoard() {
    render(this.#boardComponent, this.#boardContainer);

    const isEmpty = (this.#boardFilms.length === 0);
    if (isEmpty) {
      this.#renderNoFilms();
      return;
    }

    this.#renderSort();
    this.#renderFilmsMainList();
  }

  #renderSort() {
    render(this.#sortComponent, this.#boardComponent.element, RenderPosition.AFTERBEGIN);
  }

  #renderNoFilms() {
    render(this.#noFilmComponent, this.#boardComponent.element, RenderPosition.AFTERBEGIN);
  }

  #renderFilmsMainList() {
    render(this.#filmsMainListComponent, this.#boardComponent.element);
    render(this.#filmsMainListContainerComponent, this.#filmsMainListComponent.element);

    this.#renderFilms(0, Math.min(this.#boardFilms.length, FILMS_COUNT_PER_STEP));

    if (this.#boardFilms.length > FILMS_COUNT_PER_STEP) {
      this.#renderShowMoreButton();
    }
  }

  #clearFilmsMainList() {
    this.#filmPresenters.forEach((presenter) => presenter.destroy());
    this.#filmPresenters.clear();
    this.#renderedFilmCount = FILMS_COUNT_PER_STEP;
    remove(this.#showMoreButtonComponent);
  }

  #renderFilms(from, to) {
    this.#boardFilms.slice(from, to).forEach((film) => this.#renderFilm(film));
  }

  #renderFilm(film) {
    const filmPresenter = new FilmPresenter({filmsMainListContainer: this.#filmsMainListContainerComponent.element, onDataChange: this.#handleFilmChange, onModeChange: this.#handleModeChange});
    filmPresenter.init(film);
    this.#filmPresenters.set(film.id, filmPresenter);
  }

  #renderShowMoreButton() {
    this.#showMoreButtonComponent = new ShowMoreButtonView({onClick: this.#handleShowMoreButtonClick});
    render(this.#showMoreButtonComponent, this.#filmsMainListComponent.element);
  }

  #handleModeChange = () => {
    this.#filmPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleShowMoreButtonClick = () => {
    this.#renderFilms(this.#renderedFilmCount, this.#renderedFilmCount + FILMS_COUNT_PER_STEP);
    this.#renderedFilmCount += FILMS_COUNT_PER_STEP;
    if (this.#renderedFilmCount >= this.#boardFilms.length) {
      remove(this.#showMoreButtonComponent);
    }
  };

  #handleFilmChange = (updatedFilm) => {
    this.#boardFilms = updateItem(this.#boardFilms, updatedFilm);
    this.#filmPresenters.get(updatedFilm.id).init(updatedFilm);
  };
}
