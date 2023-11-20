export default class CommentsModel {
  #service = null;
  #comments = null;

  constructor(service) {
    this.#service = service;
    this.#comments = this.#service.getComments();
  }

  get () {
    // this.#comments.forEach((comment) => console.log(comment));
    return this.#comments;
  }
}
