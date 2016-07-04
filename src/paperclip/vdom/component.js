import create from 'common/class/utils/create';
import View from '../view';
import Template from '../template';
import freeze  from '../freeze';
import Fragment from './fragment';
import FragmentSection from '../section/fragment';
import NodeSection from '../section/node';

class ComponentHydrator {
  constructor(componentVNode, hydrators, section, childNodes, nodeFactory) {
    this.componentVNode = componentVNode;
    this._section       = section;
    this._hydrators     = hydrators;
    this._nodeFactory   = nodeFactory;
    this.childNodes     = childNodes;
  }

  prepare() {
    for (var hydrator of this._hydrators) {
      hydrator.prepare();
    }

    this.childNodesTemplate = freeze(Fragment.create(this.childNodes));
    this._marker = this._section.createMarker();
  }

  hydrate({ node, context, bindings }) {

    var section = this._marker.createSection(node);
    var view = new View(context, section, this._hydrators);

    var controller = this.componentVNode.createComponent({
      view        : view,
      nodeFactory : this._nodeFactory,
      childNodesTemplate : this.childNodesTemplate
    });

    bindings.push(controller);
  }
}

export default class ComponentVNode {

  constructor(controllerClass, attributes, childNodes) {
    this.controllerClass   = controllerClass;
    this.attributes        = attributes;
    this.childNodes        = childNodes;
  }

  createComponent(options = {}) {
    return new this.controllerClass({
      attributes          : this.attributes,
      ...options
    });
  }

  freeze(options) {
    var hydrators = [];
    var section;

    if (this.controllerClass.freeze) {
      section = NodeSection.create(this.controllerClass.freeze({
        hydrators   : hydrators,
        nodeFactory : options.nodeFactory
      }));
    } else {
      section = FragmentSection.create();
    }

    options.hydrators.push(new ComponentHydrator(this, hydrators, section, this.childNodes, options.nodeFactory));

    return section.toFragment();
  }

  static create = create;
}
