import {getMockFilms, getMockComments} from './mocks/index.js';
// import dayjs from 'dayjs';
// import {formatStringToDateTime} from '../utils/film.js';
// import {formatStringToDateTime} from './utils/film.js';

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

  updateFilm(updatedFilm) {
    return updatedFilm;
  }

  addComment(data) {
    // console.log(`new Date(): ${new Date()}`);
    // console.log(`formatStringToDateTime new Date(): ${formatStringToDateTime(new Date())}`);
    return {
      ...data,
      id: crypto.randomUUID(),
      author: 'Test Testovich',
      date: new Date()
    };
  }

  // deleteComment(comment) {
  //   console.log('Коммент удален');
  //   return comment;
  // }
  deleteComment() {
    // console.log('Коммент удален');
  }
}
