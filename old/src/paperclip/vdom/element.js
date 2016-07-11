import create from 'common/utils/class/create';
import NodeSection from '../section/node';
import _freezeAttributes from './_freeze-attributes';
import ComponentVNode from './component';

class AttributesHydrator {
  constructor(section, hydrators) {
    this.section   = section;
    this.hydrators = hydrators;
  }

  prepare() {
    this._marker = this.section.createMarker();
  }

  hydrate(options) {
    var ref = this._marker.getNode(options.section.targetNode);
    for (var hydrator of this.hydrators) {
      hydrator.hydrate({ ref, ...options });
    }
  }
}

var NAMESPACES = {};

['svg', 'rect'].forEach(function(el) {
  NAMESPACES[el] = 'http://www.w3.org/2000/svg';
});

export default class ElementVNode {

  constructor(name, attributes, childNodes) {
    this.nodeName   = name;
    this.attributes = attributes;
    this.childNodes = childNodes || [];
  }

  freezeNode(options) {

    const { componentFactories, nodeFactory } = options;

    if (componentFactories && componentFactories[this.nodeName]) {
      var componentFactory = componentFactories[this.nodeName];
      var componentVNode   = ComponentVNode.create(componentFactory, this.attributes, this.childNodes);
      return componentVNode.freezeNode(options);
    }

    var ns = NAMESPACES[this.nodeName];

    if (ns) {
      var node = options.nodeFactory.createElementNS(ns, this.nodeName);
    } else {
      var node = options.nodeFactory.createElement(this.nodeName);
    }

    var { staticAttributes, attributeHydrators } = _freezeAttributes(this.attributes, options);

    for (var key in staticAttributes) {
      node.setAttribute(key, staticAttributes[key]);
    }

    if (attributeHydrators) {
      options.hydrators.push(new AttributesHydrator(NodeSection.create(node), attributeHydrators));
    }

    for (var childNode of this.childNodes) {
      node.appendChild(childNode.freezeNode(options));
    }

    return node;
  }

  static create = create;
}
