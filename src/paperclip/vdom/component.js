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
    this.attributes     = componentVNode.attributes;
    this._section       = section;
    this._hydrators     = hydrators;
    this._nodeFactory   = nodeFactory;
    this.childNodes     = childNodes;
  }

  prepare() {
    this.childNodesTemplate = freeze(Fragment.create(this.childNodes));
    this._marker = this._section.createMarker();
  }

  hydrate({ view, section, bindings }) {

    var component = new this.componentVNode.componentClass({
      application        : view.context.application,
      nodeFactory        : this._nodeFactory,
      childNodesTemplate : this.childNodesTemplate
    });

    var childView = component.view = new View(component, this._marker.createSection(section.targetNode), this._hydrators, [], view);

    // fuggly, but works for now.
    bindings.push({
      update:() => {
        for (var key in this.attributes) {
          var value = this.attributes[key];

          if (typeof value === 'function') {
            value = value(view.context);
          }

          component.setAttribute(key, value);
        }
      }
    });

    bindings.push(component);
    bindings.push(childView);
  }
}

export default class ComponentVNode {

  constructor(componentClass, attributes, childNodes) {
    this.componentClass    = componentClass;
    this.attributes        = attributes;
    this.childNodes        = childNodes;
  }

  freeze(options) {
    var section;
    var hydrators = [];

    if (this.componentClass.freeze) {
      var template = freeze(this.componentClass, options.nodeFactory);
      hydrators = template.hydrators;
      section   = template.section;
    } else {
      section = FragmentSection.create();
    }

    options.hydrators.push(new ComponentHydrator(this, hydrators, section, this.childNodes, options.nodeFactory));

    return section.toFragment();
  }

  static create = create;
}
