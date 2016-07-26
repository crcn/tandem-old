import { getNodePath, findNode } from '../utils';
import { IMarkupSectionMarker, IMarkupSection } from './base';
import { IContainerNode, INode } from '../base';

/**
 */

export class GroupMarker implements IMarkupSectionMarker {
  constructor(
    private _startPath:Array<number>,
    private _endPath:Array<number>,
    private _nodeFactory:any
  ) { }

  createSection(rootNode:IContainerNode) {
    return new GroupMarkupSection(
      findNode(this._startPath, rootNode),
      findNode(this._endPath, rootNode),
      this._nodeFactory
    );
  }
}


/**
 * a section is a group of nodes contained within a
 */

export default class GroupMarkupSection implements IMarkupSection  {

  private _start:INode;
  private _end:INode;
  private _nodeFactory:any;
  private _hiddenChildren:Array<any>;

  constructor(start = undefined, end = undefined, nodeFactory = document) {

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
    while (cnode && cnode !== this._end) {
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

  removeChildNodes() {
    for (var child of this.childNodes) {
      child.parentNode.removeChild(child);
    }
  }

  get innerHTML() {
    return this.childNodes.map((childNode) => (
      childNode.outerHTML || childNode.nodeValue
    )).join('');
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
    var parent = this._nodeFactory.createDocumentFragment();
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
    // for (var child of hiddenChildren) {
    //   this._start.appendChild(child);
    // }
  }

  /**
   */

  createMarker() {
    return new GroupMarkupSection(
      getNodePath(this._start),
      getNodePath(this._end),
      this._nodeFactory
    );
  }

  /**
   */

  clone() {
    if (this.targetNode.nodeType !== 11) {
      throw new Error('cannot currently clone fragment section that is attached to an element.');
    }

    var clone = <IContainerNode>this.targetNode.cloneNode(true);
    return new GroupMarkupSection(clone.firstChild, clone.lastChild, this._nodeFactory);
  }
}
