import View from './view';


export default class Template {
  constructor(node, hydrators) {
    this._node      = node;
    this._hydrators = hydrators;
  }
  
  get node() {
    return this._node;
  }

  createView(context = {}) {
    return new View(context, this._node.cloneNode(true), this._hydrators);
  }
}
