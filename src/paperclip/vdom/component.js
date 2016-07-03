import create from 'common/class/utils/create';
import View from '../view';


class ComponentHydrator {
  constructor(componentVNode, hydrators, templateNode) {
    this.componentVNode = componentVNode;
    this._templateNode  = templateNode;
    this._hydrators     = hydrators;
  }

  prepare() {
    for (var hydrator of this._hydrators) {
      hydrator.prepare();
    }
  }

  hydrate({ context, bindings }) {
    var controller = this.componentVNode.createComponent({
      _view: new View(context, this._templateNode.cloneNode(true), this._hydrators)
    });

    bindings.push(controller);
  }
}

export default class ComponentVNode {

  constructor(controllerClass, attributes, childNodes) {
    this.controllerClass = controllerClass;
    this.attributes      = attributes;
    this.childNodes      = childNodes;
  }

  createComponent() {
    return new this.controllerClass({
      attributes: this.attributes,
      childNodes: this.childNodes
    });
  }

  freeze(options) {
    var hydrators = [];
    var templateNode = this.controllerClass.freeze({
      hydrators: hydrators
    });
    options.hydrators.push(new ComponentHydrator(this, hydrators, templateNode));
    return templateNode;
  }

  static create = create;
}
