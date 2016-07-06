import create from 'common/class/utils/create';
import _freezeAttributes from './_freeze-attributes';
import View from '../view';
import Template from '../template';
import freeze  from '../freeze';
import Fragment from './fragment';
import FragmentSection from '../section/fragment';
import NodeSection from '../section/node';

class ComponentHydrator {
  constructor(componentClass, attributes, hydrators, attributeHydrators, section, childNodes, nodeFactory) {
    this.componentClass = componentClass;
    this.attributes     = attributes;
    this._section       = section;
    this._hydrators     = hydrators;
    this._attributeHydrators = attributeHydrators;
    this._nodeFactory   = nodeFactory;
    this.childNodes     = childNodes;
  }

  prepare() {
    this.childNodesTemplate = freeze(Fragment.create(this.childNodes));

    this._marker = this._section.createMarker();

    for (var hydrator of this._attributeHydrators) {
      hydrator.prepare();
    }
  }

  hydrate({ view, section, bindings }) {

    var component = new this.componentClass({
      application        : view.application,
      attributes         : this.attributes,
      nodeFactory        : this._nodeFactory,
      childNodesTemplate : this.childNodesTemplate
    });

    var childView = component.view = new View({
      context: component,
      section: this._marker.createSection(section.targetNode),
      hydrators: this._hydrators,
      parent: view
    });

    for (var hydrator of this._attributeHydrators) {
      hydrator.hydrate({ view, bindings, ref: component });
    }

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

  freezeNode(options) {
    var section;
    var hydrators = [];

    if (this.componentClass.freezeNode) {
      var template = freeze(this.componentClass, options.nodeFactory);
      hydrators = template.hydrators;
      section   = template.section;
    } else {
      section = FragmentSection.create();
    }

    var { staticAttributes, attributeHydrators } = _freezeAttributes(this.attributes, options);
    options.hydrators.push(new ComponentHydrator(this.componentClass, staticAttributes, hydrators, attributeHydrators, section, this.childNodes, options.nodeFactory));
    return section.toFragment();
  }

  static create = create;
}
