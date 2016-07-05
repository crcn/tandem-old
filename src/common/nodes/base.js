import CoreObject from 'common/object';

export default class Node extends CoreObject {

  get nextSibling() {
    return this.parentNode ? this.parentNode.childNodes[this.parentNode.indexOf(this) + 1] : void 0;
  }

  get previousSibling() {
    return this.parentNode ? this.parentNode.childNodes[this.parentNode.indexOf(this) - 1] : void 0;
  }
}
