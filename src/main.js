import FilmsModel from './model/films-model.js';
import CommentsModel from './model/comments-model.js';
import MockService from './mock-service.js';

import ProfileView from './view/profile-view.js';
import FilterView from './view/filter-view.js';
import BoardPresenter from './presenter/board-presenter.js';
import FooterStatisticsView from './view/footer-statistics-view.js';
import {render} from './framework/render.js';
import {generateFilters} from './mocks/filter.js';

const mockService = new MockService();
// const filmsModel = new FilmsModel(); - старый вариант без mock-service
const filmsModel = new FilmsModel(mockService);
const commentsModel = new CommentsModel(mockService);

// нужно #bodyContainer?
const bodyContainer = document.querySelector('body');
const headerContainer = document.querySelector('.header');
const mainContainer = document.querySelector('.main');
const footerStatisticsContainer = document.querySelector('.footer__statistics');
// const boardPresenter = new BoardPresenter({boardContainer: mainContainer, filmsModel});
// const boardPresenter = new BoardPresenter({bodyContainer: bodyContainer, boardContainer: mainContainer, filmsModel});
const boardPresenter = new BoardPresenter({bodyContainer, boardContainer: mainContainer, filmsModel, commentsModel});

const filters = generateFilters(filmsModel.get());
// filters.forEach((item) => {
//   console.log(`item: ${Object.entries(item)}`);
// });
// console.log(`filters: ${filters}`);

render(new ProfileView(), headerContainer);
render(new FilterView(filters), mainContainer);

boardPresenter.init();

render(new FooterStatisticsView(), footerStatisticsContainer);
