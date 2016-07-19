import create from '../utils/class/create';
import getPath from '../utils/node/get-path';
import getNode from '../utils/node/get-node';

/**
 */

class Marker {

  private _path:Array<string>;
  private _nodeFactory:any;

  constructor(path, nodeFactory) {
    this._path = path;
    this._nodeFactory = nodeFactory;
  }

  getNode(rootNode) {
    return getNode(rootNode, this._path);
  }

  createSection(rootNode) {
    return new NodeSection(this.getNode(rootNode), this._nodeFactory);
  }
}

/**
 * a section is a group of nodes contained within a
 */

export default class NodeSection {
  private _placeholderNode:any;
  
  constructor(private _target:any, private _nodeFactory:any = document) {

  }

  appendChild(child) {
    this._target.appendChild(child);
  }

  toString() {
    return this._target.outerHTML || this._target.nodeValue;
  }

  get childNodes() {
    return Array.prototype.slice.call(this.targetNode.childNodes);
  }

  get targetNode() {
    return this._target;
  }

  set targetNode(value) {
    this.remove();
    this._target = value;
  }

  get visible() {
    return !this._placeholderNode;
  }

  get innerHTML() {
    return this._target.innerHTML;
  }

  toFragment() {
    return this._target;
  }

  /**
   * remove the section completely
   */

  remove() {
    var parent = this._nodeFactory.createElement('div');
    parent.appendChild(this._target);
  }

  /**
   * hides the section, but maintains the section position
   */

  hide() {
    if (this._placeholderNode) return;
    this._placeholderNode = this._nodeFactory.createTextNode('');
    this._target.parentNode.insertBefore(this._target, this._placeholderNode);
    this.remove();
  }

  /**
   * shows the section if it's hidden
   */

  show() {
    if (!this._placeholderNode) return;
    var placeholderNode = this._placeholderNode;
    this._placeholderNode = void 0;
    placeholderNode.parentNode.insertBefore(this._target, placeholderNode);
    placeholderNode.parentNode.removeChild(placeholderNode);
  }

  /**
   */

  createMarker() { 
    return new Marker(getPath(this._target), this._nodeFactory);
  }

  /**
   */

  clone() {
    return new NodeSection(this.targetNode.cloneNode(true), this._nodeFactory);
  }

  static create = create;
}
