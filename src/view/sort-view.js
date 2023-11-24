import AbstractView from '../framework/view/abstract-view.js';
import {SortType} from '../const.js';

function createSortContainerTemplate(currentSortType) {
  // console.log (`currentSortType: ${currentSortType}`);
  return /* html */ `
    <ul class="sort">
      <li>
        <a href="#" class="sort__button ${currentSortType === SortType.DEFAULT ? 'sort__button--active' : ''}" data-sort-type="${SortType.DEFAULT}">Sort by default</a>
      </li>
      <li>
        <a href="#" class="sort__button ${currentSortType === SortType.DATE ? 'sort__button--active' : ''}" data-sort-type="${SortType.DATE}">Sort by date</a>
      </li>
      <li>
        <a href="#" class="sort__button ${currentSortType === SortType.RATING ? 'sort__button--active' : ''}" data-sort-type="${SortType.RATING}">Sort by rating</a>
      </li>
    </ul>
  `;
}

export default class SortView extends AbstractView {
  #currentSortType = null;
  #handleSortTypeChange = null;

  // constructor({onSortTypeChange}) {
  constructor({currentSortType, onSortTypeChange}) {
    super();
    this.#currentSortType = currentSortType;
    this.#handleSortTypeChange = onSortTypeChange;

    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  }

  get template() {
    return createSortContainerTemplate(this.#currentSortType);
  }

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'A') {
      return;
    }

    evt.preventDefault();
    this.#handleSortTypeChange(evt.target.dataset.sortType);
  };
}
