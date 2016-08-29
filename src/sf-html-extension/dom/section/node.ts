import { getNodePath, findNode } from "../utils";
import { IDOMSectionMarker, IDOMSection } from "./base";

/**
 */

export class NodeMarker implements IDOMSectionMarker {

  private _path: Array<number>;
  private _nodeFactory: any;

  constructor(path, nodeFactory) {
    this._path = path;
    this._nodeFactory = nodeFactory;
  }

  getNode(rootNode) {
    return findNode(this._path, rootNode);
  }

  createSection(rootNode) {
    return new NodeSection(<Node>this.getNode(rootNode), this._nodeFactory);
  }
}

/**
 * a section is a group of nodes contained within a
 */

export class NodeSection implements IDOMSection {
  private _placeholderNode: any;

  constructor(private _target: Node, private _nodeFactory: any = document) { }

  appendChild(child) {
    this._target.appendChild(child);
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

  toFragment() {
    return this._target;
  }

  /**
   * remove the section completely
   */

  remove() {
    const parentNode = this._nodeFactory.createElement("div");
    parentNode.appendChild(this._target);
  }

  /**
   * hides the section, but maintains the section position
   */

  hide() {
    if (this._placeholderNode) return;
    this._placeholderNode = this._nodeFactory.createTextNode("");
    this._target.parentNode.insertBefore(this._target, this._placeholderNode);
    this.remove();
  }

  /**
   * shows the section if it"s hidden
   */

  show() {
    if (!this._placeholderNode) return;
    const placeholderNode = this._placeholderNode;
    this._placeholderNode = void 0;
    placeholderNode.parentNode.insertBefore(this._target, placeholderNode);
    placeholderNode.parentNode.removeChild(placeholderNode);
  }

  /**
   */

  createMarker() {
    return new NodeMarker(getNodePath(this._target), this._nodeFactory);
  }

  /**
   */

  clone() {
    return new NodeSection(<Node>this.targetNode.cloneNode(true), this._nodeFactory);
  }
}
