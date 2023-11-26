import AbstractView from '../framework/view/abstract-view.js';
import {UserRank} from '../const.js';

function createProfileRankTemplate(rank) {
  // console.log(`rank: ${rank}`);
  return /* html */ `
    <section class="header__profile profile">
      <p class="profile__rating">${rank}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>
  `;
}

function createProfileTemplate(films) {
  let profileRank;

  switch (true) {
    case films >= 1 && films <= 10:
      profileRank = UserRank.NOVICE;
      break;
    case films >= 11 && films <= 20:
      profileRank = UserRank.FAN;
      break;
    case films >= 21:
      profileRank = UserRank.MOVIEBUFF;
      break;
  }

  if (films === 0) {
    return;
  }

  return createProfileRankTemplate(profileRank);
}

export default class ProfileView extends AbstractView {
  #filmsCount = null;

  constructor({count}) {
    super();
    this.#filmsCount = count;
    // console.log(`this.#filmsCount: ${this.#filmsCount}`);
  }

  get template() {
    return createProfileTemplate(this.#filmsCount);
  }
}
