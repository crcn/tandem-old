import View from './view';


export default class Template {
  constructor(templateNode, hydrators) {
    this._templateNode = templateNode;
    this._hydrators    = hydrators;
  }

  createView(context = {}) {
    return new View(context, this._templateNode.cloneNode(true), this._hydrators);
  }
}
