import create from 'common/class/utils/create';
import NodeSection from '../section/node';
import _freezeAttributes from './_freeze-attributes';

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

export default class ElementVNode {

  constructor(name, attributes, childNodes) {
    this.nodeName   = name;
    this.attributes = attributes;
    this.childNodes = childNodes || [];
  }

  freezeNode(options) {
    var node = options.nodeFactory.createElement(this.nodeName);

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
