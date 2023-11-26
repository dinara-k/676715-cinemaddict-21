import LoadingView from '../view/loading-view.js';
import BoardView from '../view/board-view.js';
import SortView from '../view/sort-view.js';
import FilmsMainListView from '../view/main-list-view.js';
import FilmsMainListContainerView from '../view/main-list-films-container-view.js';
import NoFilmView from '../view/no-film-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import FilmPresenter from './film-presenter.js';
import {remove, render, RenderPosition} from '../framework/render.js';
import {sortFilmDate, sortFilmRating} from '../utils/film.js';
import {filter} from '../utils/filter.js';
import {UserAction, UpdateType, FilterType, SortType} from '../const.js';

const FILMS_COUNT_PER_STEP = 5;

export default class BoardPresenter {
  // нужно #bodyContainer?
  #bodyContainer = null;
  #boardContainer = null;
  #filmsModel = null;
  #commentsModel = null;
  #filterModel = null;

  #loadingComponent = new LoadingView();
  #boardComponent = new BoardView();
  #sortComponent = null;
  // #noFilmComponent = new NoFilmView();
  #noFilmComponent = null;
  #filmsMainListComponent = new FilmsMainListView();
  #filmsMainListContainerComponent = new FilmsMainListContainerView();
  #filmPopupComponent = null;
  #showMoreButtonComponent = null;

  // #boardFilms = [];
  #renderedFilmCount = FILMS_COUNT_PER_STEP;
  #filmPresenters = new Map();
  #filterType = FilterType.ALL;
  #currentSortType = SortType.DEFAULT;
  #isLoading = true;
  #isLoadingError = false;

  constructor({bodyContainer, boardContainer, filmsModel, commentsModel, filterModel}) {
    this.#bodyContainer = bodyContainer;
    this.#boardContainer = boardContainer;
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;
    this.#filterModel = filterModel;

    this.#filmsModel.addObserver(this.#handleModelFilm);
    this.#filterModel.addObserver(this.#handleModelFilm);
  }

  get films() {
    // const filterType = this.#filterModel.get();
    this.#filterType = this.#filterModel.get();
    // -- отображаются все фильмы
    const films = this.#filmsModel.get();
    // console.log(`films: ${films}`);
    const filteredFilms = filter[this.#filterType](films);

    // -- отображаются фильмы до кнопки Shom more
    // console.log(`renderFilmsList: ${renderFilmsList}`);
    // const filteredFilms = filter[this.#filterType](this.renderFilmsList);

    switch (this.#currentSortType) {
      case SortType.DATE:
        // return [...this.#filmsModel.get()].sort(sortFilmDate);
        return filteredFilms.sort(sortFilmDate);
        // this.#boardFilms.sort(sortFilmDate);
        // break;
      case SortType.RATING:
        // return [...this.#filmsModel.get()].sort(sortFilmRating);
        return filteredFilms.sort(sortFilmRating);
        // this.#boardFilms.sort(sortFilmRating);
        // break;
      // default:
      //   this.#boardFilms = [...this.#sourcedBoardFilms];
    }
    // return this.#filmsModel.get();
    return filteredFilms;
  }

  init() {
    // this.#boardFilms = [...this.#filmsModel.get()];
    // this.#sourcedBoardFilms = [...this.#filmsModel.get()];

    this.#renderBoard();
  }

  #renderBoard() {
    render(this.#boardComponent, this.#boardContainer);
    const films = this.films;
    const filmsCount = films.length;

    if (this.#isLoading) {
      this.#renderLoading();
    } else {
      if (this.filmsCount === 0) {
        this.#renderNoFilms();
      } else {
        this.#renderSort();
        render(this.#filmsMainListComponent, this.#boardComponent.element);
        this.#renderFilmsMainListContainer();
        this.#renderFilms(films.slice(0, Math.min(filmsCount, this.#renderedFilmCount)));

        if (filmsCount > this.#renderedFilmCount) {
          this.#renderShowMoreButton();
        }
      }
    }
  }

  #renderLoading() {
    render(this.#loadingComponent, this.#filmsMainListComponent.element, RenderPosition.AFTERBEGIN);
  }

  #renderSort() {
    this.#sortComponent = new SortView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange
    });
    // this.#sortComponent = new SortView({onSortTypeChange: this.#handleSortTypeChange});
    render(this.#sortComponent, this.#boardComponent.element, RenderPosition.AFTERBEGIN);
  }

  #renderNoFilms() {
    this.#noFilmComponent = new NoFilmView({
      filterType: this.#filterType
    });
    render(this.#noFilmComponent, this.#boardComponent.element, RenderPosition.AFTERBEGIN);
  }

  #renderFilmsMainListContainer() {
    render(this.#filmsMainListContainerComponent, this.#filmsMainListComponent.element);
    // const filmsCount = this.films.length;
    // const films = this.films.slice(0, Math.min(filmsCount, FILMS_COUNT_PER_STEP));

    // render(this.#filmsMainListComponent, this.#boardComponent.element);
    // render(this.#filmsMainListContainerComponent, this.#filmsMainListComponent.element);

    // // this.#renderFilms(0, Math.min(this.#boardFilms.length, FILMS_COUNT_PER_STEP));
    // this.#renderFilms(films);

    // // if (this.#boardFilms.length > FILMS_COUNT_PER_STEP) {
    // if (filmsCount > FILMS_COUNT_PER_STEP) {
    //   this.#renderShowMoreButton();
    // }
  }
  // #renderFilmsMainList() {
  //   const filmsCount = this.films.length;
  //   const films = this.films.slice(0, Math.min(filmsCount, FILMS_COUNT_PER_STEP));

  //   render(this.#filmsMainListComponent, this.#boardComponent.element);
  //   render(this.#filmsMainListContainerComponent, this.#filmsMainListComponent.element);

  //   // this.#renderFilms(0, Math.min(this.#boardFilms.length, FILMS_COUNT_PER_STEP));
  //   this.#renderFilms(films);

  //   // if (this.#boardFilms.length > FILMS_COUNT_PER_STEP) {
  //   if (filmsCount > FILMS_COUNT_PER_STEP) {
  //     this.#renderShowMoreButton();
  //   }
  // }

  // #renderFilms(from, to) {
  //   this.#boardFilms.slice(from, to).forEach((film) => this.#renderFilm(film));
  // }

  // #renderFilmsPerPortion(films, filmsCount) {
  //   return this.#renderFilms(films.slice(0, Math.min(filmsCount, this.#renderedFilmCount)));
  // }

  #renderFilms(films) {
    // films.slice(from, to).forEach((film) => this.#renderFilm(film));
    films.forEach((film) => this.#renderFilm(film));
  }

  #renderFilm(film) {
    const filmPresenter = new FilmPresenter({
      filmsMainListContainer: this.#filmsMainListContainerComponent.element,
      filmsModel: this.#filmsModel,
      commentsModel: this.#commentsModel,
      // onDataChange: this.#handleFilmChange,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange
    });
    filmPresenter.init(film);
    this.#filmPresenters.set(film.id, filmPresenter);
  }

  #renderShowMoreButton() {
    this.#showMoreButtonComponent = new ShowMoreButtonView({onClick: this.#handleShowMoreButtonClick});
    render(this.#showMoreButtonComponent, this.#filmsMainListComponent.element);
  }

  #clearBoard({resetRenderedFilmCount = false, resetSortType = false} = {}) {
    this.#clearFilmsMainList();
    remove(this.#sortComponent);
    remove(this.#loadingComponent);

    if (this.#noFilmComponent) {
      remove(this.#noFilmComponent);
    }

    const filmCount = this.films.length;

    if (resetRenderedFilmCount) {
      this.#renderedFilmCount = FILMS_COUNT_PER_STEP;
    } else {
      this.#renderedFilmCount = Math.min(filmCount, this.#renderedFilmCount);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  }

  #clearFilmsMainList() {
    this.#filmPresenters.forEach((presenter) => presenter.destroy());
    this.#filmPresenters.clear();
    // this.#renderedFilmCount = FILMS_COUNT_PER_STEP;
    remove(this.#showMoreButtonComponent);
  }

  // #sortFilms(sortType) {
  // switch (sortType) {
  //   case SortType.DATE:
  //     this.#boardFilms.sort(sortFilmDate);
  //     break;
  //   case SortType.RATING:
  //     this.#boardFilms.sort(sortFilmRating);
  //     break;
  //   default:
  //     this.#boardFilms = [...this.#sourcedBoardFilms];
  // }
  //   this.#currentSortType = sortType;
  // }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    // this.#sortFilms(sortType);
    // this.#clearFilmsMainList();
    // this.#renderFilmsMainList();
    this.#clearBoard({resetRenderedFilmCount: true});
    this.#renderBoard();
  };

  #handleModeChange = () => {
    this.#filmPresenters.forEach((presenter) => presenter.resetView());
  };

  // #handleViewAction = async (actionType, updateType, update) => {
  #handleViewAction = (actionType, updateType, update) => {
    // включить позже
    // this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this.#filmsModel.updateFilm(updateType, update);
        // this.#pointPresenters.get(update.id).setSaving();
        // try {
        //   await this.#pointsModel.update(updateType, update);
        // } catch (err) {
        //   this.#pointPresenters.get(update.id).setAborting();
        // }
        break;
      // case UserAction.ADD_COMMENT:
      //   console.log('добавляется коммент');
      //   this.#commentsModel.addComment(updateType, update);
      //   //   this.#filmsModel.addFilm(updateType, update);
      //   //   this.#newPointPresenter.setSaving();
      //   //   try {
      //   //     await this.#pointsModel.add(updateType, update);
      //   //   } catch (err) {
      //   //     this.#newPointPresenter.setAborting();
      //   //     this.#uiBlocker.unblock();
      //   //     return Promise.reject();
      //   //   }
      //   break;
      // case UserAction.DELETE_COMMENT:
      // //   this.#filmsModel.deleteFilm(updateType, update);
      //   //   this.#pointPresenters.get(update.id).setDeleting();
      //   //   // try {
      //   this.#commentsModel.deleteComment(updateType, update);
      //   //   // } catch {
      //   //   //   this.#pointPresenters.get(update.id).setAborting();
      //   // //   // }
      //   break;
    }

    // включить позже
    // this.#uiBlocker.unblock();
  };

  // #handleFilmChange = (updatedFilm) => {
  //   // this.#boardFilms = updateItem(this.#boardFilms, updatedFilm);
  //   // this.#sourcedBoardFilms = updateItem(this.#sourcedBoardFilms, updatedFilm);
  //   this.#filmPresenters.get(updatedFilm.id).init(updatedFilm);
  // };

  #handleModelFilm = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#filmPresenters.get(data.id)?.init(data);
        // this.#clearBoard();
        // this.#renderBoard();
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetRenderedFilmCount: true, resetSortType: true});
        this.#renderBoard();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        this.#isLoadingError = data.isError;
        remove(this.#loadingComponent);
        this.#clearBoard();
        this.#renderBoard();
        break;
    }
  };

  #handleShowMoreButtonClick = () => {
    const filmsCount = this.films.length;
    const newRenderedFilmsCount = Math.min(filmsCount, this.#renderedFilmCount + FILMS_COUNT_PER_STEP);
    const films = this.films.slice(this.#renderedFilmCount, newRenderedFilmsCount);

    // this.#renderFilms(this.#renderedFilmCount, this.#renderedFilmCount + FILMS_COUNT_PER_STEP);
    // this.#renderedFilmCount += FILMS_COUNT_PER_STEP;

    this.#renderFilms(films);
    this.#renderedFilmCount = newRenderedFilmsCount;

    // if (this.#renderedFilmCount >= this.#boardFilms.length) {
    if (this.#renderedFilmCount >= filmsCount) {
      remove(this.#showMoreButtonComponent);
    }
  };
}
