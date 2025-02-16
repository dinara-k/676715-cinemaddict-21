import AbstractView from '../framework/view/abstract-view.js';

function createFilmsMainListTemplate() {
  return /* html */ `
    <section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
    </section>
  `;
}

export default class FilmsMainListView extends AbstractView {
  get template() {
    return createFilmsMainListTemplate();
  }
}
