import create from 'common/utils/class/create';

export default class FragmentVNode {

  constructor(childNodes) {
    this.childNodes = childNodes || [];
  }

  freezeNode(options) {
    var fragment = options.nodeFactory.createDocumentFragment();

    for (var child of this.childNodes) {
      fragment.appendChild(child.freezeNode(options));
    }

    return fragment;
  }

  static create(childNodes) {
    return childNodes.length === 1 ? childNodes[0] : new FragmentVNode(childNodes);
  };
}
