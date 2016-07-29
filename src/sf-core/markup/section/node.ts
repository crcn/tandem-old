import { getNodePath, findNode } from "../utils";
import { IMarkupSectionMarker, IMarkupSection } from "./base";
import { IContainerNode, INode } from "../base";

/**
 */

export class NodeMarker {

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
    return new NodeSection(<IContainerNode>this.getNode(rootNode), this._nodeFactory);
  }
}

/**
 * a section is a group of nodes contained within a
 */

export class NodeSection implements IMarkupSection {
  private _placeholderNode: any;

  constructor(private _target: IContainerNode, private _nodeFactory: any = document) { }

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

  toDependency() {
    return this._target;
  }

  /**
   * remove the section completely
   */

  remove() {
    const parent = this._nodeFactory.createElement("div");
    parent.appendChild(this._target);
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
    return new NodeSection(<IContainerNode>this.targetNode.cloneNode(true), this._nodeFactory);
  }
}
