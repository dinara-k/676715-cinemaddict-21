import FilterModel from './model/filter-model.js';
import FilmsModel from './model/films-model.js';
import CommentsModel from './model/comments-model.js';
// import MockService from './mock-service.js';
import FilmApiService from './services/films-api-service.js';
// import CommentsApiService from './services/comments-api-service.js';

// import ProfilePresenter from './presenter/profile-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import BoardPresenter from './presenter/board-presenter.js';
import FooterStatisticsView from './view/footer-statistics-view.js';
import {render} from './framework/render.js';

const AVTORIZATION = 'Basic 87tdfk2bg57hfukfgb';
const END_POINT = 'https://21.objects.pages.academy/cinemaddict';
// const END_POINT_COMENTS = 'https://21.objects.pages.academy/cinemaddict/comments';

// нужно #bodyContainer?
const bodyContainer = document.querySelector('body');
// const headerContainer = document.querySelector('.header');
const mainContainer = document.querySelector('.main');
const footerStatisticsContainer = document.querySelector('.footer__statistics');

// const mockService = new MockService();
// const filterModel = new FilterModel();
// const filmsModel = new FilmsModel(mockService);
// const commentsModel = new CommentsModel(mockService);

const filmApiService = new FilmApiService(END_POINT, AVTORIZATION);
// const commentsApiService = new CommentsApiService(END_POINT, END_POINT_COMENTS);
const filterModel = new FilterModel();
const commentsModel = new CommentsModel(filmApiService);
const filmsModel = new FilmsModel({service: filmApiService, commentsModel});

// const profilePresenter = new ProfilePresenter({
//   headerContainer,
//   filmsModel
// });

const filterPresenter = new FilterPresenter({
  filterContainer: mainContainer,
  filmsModel,
  filterModel
});

const boardPresenter = new BoardPresenter({
  bodyContainer,
  boardContainer: mainContainer,
  filmsModel,
  commentsModel,
  filterModel
});

// profilePresenter.init();
filterPresenter.init();
boardPresenter.init();
filmsModel.init();
// profilePresenter.init();

render(new FooterStatisticsView({filmsModel}), footerStatisticsContainer);
