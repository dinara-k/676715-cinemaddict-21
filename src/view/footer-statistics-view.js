import AbstractView from '../framework/view/abstract-view.js';

function createFooterStatisticsTemplate(count) {
  return /* html */ `
    <p>${count} movies inside</p>
  `;
}

export default class FooterStatisticsView extends AbstractView {
  #filmCount = null;

  constructor({filmsModel}) {
    super();
    this.#filmCount = filmsModel.get().length;
  }

  get template() {
    return createFooterStatisticsTemplate(this.#filmCount);
  }
}
