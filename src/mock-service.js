import {getMockFilms, getMockComments} from './mocks/index.js';

export default class MockService {
  #films = [];
  #comments = [];

  constructor() {
    this.#films = getMockFilms();
    this.#comments = getMockComments();
  }

  getFilms() {
    return this.#films;
  }

  getComments() {
    return this.#comments;
  }
}
