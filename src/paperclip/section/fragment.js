import create from 'common/class/utils/create';
import getPath from 'common/utils/node/get-path';
import getNode from 'common/utils/node/get-node';


/**
 */

class Marker {
  constructor(startPath, endPath, nodeFactory) {
    this._startPath   = startPath;
    this._endPath     = endPath;
    this._nodeFactory = nodeFactory;
  }

  createSection(rootNode) {
    return new FragmentSection(
      getNode(rootNode, this._startPath),
      getNode(rootNode, this._endPath),
      this._nodeFactory
    );
  }
}


/**
 * a section is a group of nodes contained within a
 */

export default class FragmentSection {

  constructor(start, end, nodeFactory = document) {

    this._start       = start || nodeFactory.createTextNode('');
    this._end         = end   || nodeFactory.createTextNode('');
    this._nodeFactory = nodeFactory;

    if (!this._start.parentNode) {
      this.remove();
    }
  }

  appendChild(child) {
    if (this._hiddenChildren) return this._hiddenChildren.push(child);
    this._end.parentNode.insertBefore(child, this._end);
  }

  get visible() {
    return !this._hiddenChildren;
  }

  get childNodes() {
    if (this._hiddenChildren) return this._hiddenChildren;

    var cnode = this._start.nextSibling;
    var childNodes = [];
    while(cnode && cnode != this._end) {
      childNodes.push(cnode);
      cnode = cnode.nextSibling;
    }

    return childNodes;
  }

  get targetNode() {
    return this._start.parentNode;
  }

  toString() {
    return this.innerHTML;
  }

  get innerHTML() {
    return this.childNodes.map(function(childNode) {
      return childNode.outerHTML || childNode.nodeValue;
    }).join('');
  }

  get allChildNodes() {
    return [this._start, ...this.childNodes, this._end];
  }

  toFragment() {
    var fragment = this._nodeFactory.createDocumentFragment();

    for (var child of this.allChildNodes) {
      fragment.appendChild(child);
    }

    return fragment;
  }

  /**
   * remove the section completely
   */

  remove() {
    var parent = this._nodeFactory.createElement('div');
    for (var child of this.allChildNodes) {
      parent.appendChild(child);
    }
  }

  /**
   * hides the section, but maintains the section position
   */

  hide() {
    if (this._hiddenChildren) return;
    this._hiddenChildren = this.childNodes;
    for (var child of this._hiddenChildren) {
      child.parentNode.removeChild(child);
    }
  }

  /**
   * shows the section if it's hidden
   */

  show() {
    if (!this._hiddenChildren) return;
    var hiddenChildren = this._hiddenChildren;
    this._hiddenChildren = void 0;
    for (var child of hiddenChildren) {
      this._start.appendChild(child);
    }
  }

  /**
   */

  createMarker() {
    return new Marker(
      getPath(this._start),
      getPath(this._end),
      this._nodeFactory
    );
  }

  /**
   */

  static create = create;
}
