import create from 'common/class/utils/create';
import View from '../view';
import getPath from 'common/utils/node/get-path';
import getNode from 'common/utils/node/get-node';
import freeze  from '../freeze';
import Fragment from './fragment';

class ComponentHydrator {
  constructor(componentVNode, hydrators, templateNode, nodeFactory) {
    this.componentVNode = componentVNode;
    this._templateNode  = templateNode;
    this._hydrators     = hydrators;
    this._nodeFactory   = nodeFactory;
  }

  prepare() {
    for (var hydrator of this._hydrators) {
      hydrator.prepare();
    }

    this.path = getPath(this._templateNode);
  }

  hydrate({ node, context, bindings }) {

    var componentNode = getNode(node, this.path);
    var view = new View(context, componentNode, this._hydrators);

    var controller = this.componentVNode.createComponent({
      view        : view,
      nodeFactory : this._nodeFactory
    });

    bindings.push(controller);
  }
}

export default class ComponentVNode {

  constructor(controllerClass, attributes, childNodes) {
    this.controllerClass   = controllerClass;
    this.attributes        = attributes;
    this.childNodes        = childNodes;
    this.childNodesTemplate = freeze(Fragment.create(this.childNodes));
  }

  createComponent(options = {}) {
    return new this.controllerClass({
      attributes          : this.attributes,
      childNodesTemplate  : this.childNodesTemplate,
      ...options
    });
  }

  freeze(options) {
    var hydrators = [];

    var templateNode = this.controllerClass.freeze({
      hydrators: hydrators
    });

    options.hydrators.push(new ComponentHydrator(this, hydrators, templateNode, options.nodeFactory));
    return templateNode;
  }

  static create = create;
}
