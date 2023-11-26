
// import {UpdateType} from '../const.js';

// --- вариант с Observable
// import Observable from '../framework/observable.js';
// export default class CommentsModel extends Observable {
//   #service = null;
//   #comments = null;

//   constructor(service) {
//     super();
//     this.#service = service;
//     this.#comments = this.#service.getComments();
//   }

//   get () {
//     // this.#comments.forEach((comment) => console.log(comment));
//     return this.#comments;
//   }
// ----

export default class CommentsModel {
  #service = null;
  // #comments = null;
  #comments = [];

  constructor(service) {
    this.#service = service;
    // this.#comments = this.#service.getComments();
  }

  async init() {
    this.#comments = await this.#service.comments;
    return this.#comments;
  }

  get () {
    // this.#comments.forEach((comment) => console.log(comment));
    return this.#comments;
  }

  deleteComment(commentId, film) {
    // const index = this.#comments.findIndex((comment) => comment.id === update.id);

    // if (index === -1) {
    //   throw new Error('Can\'t delete unexisting comment');
    // }

    // this.#comments = [
    //   ...this.#comments.slice(0, index),
    //   ...this.#comments.slice(index + 1),
    // ];

    // this._notify(updateType);
    // console.log(`deleteComment - film: ${Object.entries(film)}`);
    // console.log(`deleteComment - film.comments: ${Object.entries(film.comments)}`);
    const index = film.comments.findIndex((id) => id === commentId);
    // console.log(`filmComments до удаления: ${Object.entries(film.comments)}`);

    const filmComments = [
      ...film.comments.slice(0, index),
      ...film.comments.slice(index + 1),
    ];
    // console.log(`filmComments после удаления: ${Object.entries(filmComments)}`);
    // this.#service.deleteComment(commentId);
    // // this.#comments = this.#comments.filter((commentItem) => commentItem.id !== comment.id);
    // const newComments = film.comments.filter((commentItem) => commentItem.id !== commentId);
    // // film.comments = this.#comments;
    // console.log(`deleteComment - film.comments: ${Object.entries(newComments)}`);
    // this._notify(updateType, film);
    return filmComments;
  }

  // addComment(updateType, comment) {
  addComment(comment, film) {
    // console.log(`addComment - film.comments: ${Object.entries(film.comments)}`);
    // this.#comments = [
    //   update,
    //   ...this.#comments,
    // ];

    // this._notify(updateType, update);
    // console.log(`addComment - this.#comments перед добавлением: ${Object.entries(this.#comments)}`);

    const addedComment = this.#service.addComment(comment);

    // console.log(`addedComment: ${Object.entries(addedComment)}`);

    this.#comments = [
      ...this.#comments,
      addedComment
    ];

    // console.log(`addComment - this.#comments после добавления: ${Object.entries(this.#comments)}`);
    const filmComments = [
      ...film.comments,
      addedComment.id
    ];
    // const filmComments = {...film.comments}.push(addedComment);
    // this._notify(updateType, addedComment);
    // this._notify(updateType, this.#comments);
    // console.log(`filmComments после добавления: ${Object.entries(filmComments)}`);
    return filmComments;
  }
}


// старый вариант без Observable
// export default class CommentsModel {
//   #service = null;
//   #comments = null;

//   constructor(service) {
//     this.#service = service;
//     this.#comments = this.#service.getComments();
//   }

//   get () {
//     // this.#comments.forEach((comment) => console.log(comment));
//     return this.#comments;
//   }

//   addComment(updateType, comment) {
//     // this.#comments = [
//     //   update,
//     //   ...this.#comments,
//     // ];

//     // this._notify(updateType, update);
//     const addedComment = this.#service.addComment(comment);
//     this.#comments.push(addedComment);
//     this._notify(updateType, addedComment);
//   }

//   deleteComment(updateType, commentId) {
//     // const index = this.#comments.findIndex((comment) => comment.id === update.id);

//     // if (index === -1) {
//     //   throw new Error('Can\'t delete unexisting comment');
//     // }

//     // this.#comments = [
//     //   ...this.#comments.slice(0, index),
//     //   ...this.#comments.slice(index + 1),
//     // ];

//     // this._notify(updateType);
//     this.#service.deleteComment(commentId);
//     // this.#comments = this.#comments.filter((commentItem) => commentItem.id !== comment.id);
//     this.#comments = this.#comments.filter((commentItem) => commentItem.id !== commentId);
//     this._notify(updateType);

//   }
// }

