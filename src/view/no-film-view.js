import AbstractView from '../framework/view/abstract-view.js';
import {FilterType} from '../const.js';

const NoFilmsTextType = {
  [FilterType.ALL]: 'There are no movies in our database',
  [FilterType.WATCHLIST]: 'There are no movies to watch now',
  [FilterType.HISTORY]: 'There are no watched movies now',
  [FilterType.FAVORITES]: 'There are no favorite movies now'
};

function createNoFilmTemplate(filterType) {
  const noFilmsTextValue = NoFilmsTextType[filterType];

  return /* html */ `
    <h2 class="films-list__title">${noFilmsTextValue}</h2>
    <!--<h2 class="films-list__title">There are no movies in our database</h2>-->
  `;
}

export default class NoFilmView extends AbstractView {
  #filterType = null;

  constructor({filterType}) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createNoFilmTemplate(this.#filterType);
  }
}
