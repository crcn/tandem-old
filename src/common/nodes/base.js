import create from 'common/class/utils/create';

export default class Node {

  get nextSibling() {
    return this.parentNode ? this.parentNode.childNodes[this.parentNode.indexOf(this) + 1] : void 0;
  }

  get previousSibling() {
    return this.parentNode ? this.parentNode.childNodes[this.parentNode.indexOf(this) - 1] : void 0;
  }

  static create = create;
}
