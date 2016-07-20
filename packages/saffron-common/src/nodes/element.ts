import Node from './base';
import Attributes from './attributes';

export default class Element extends Node {

  private _attributes:Attributes;
  private _childNodes:Array<Node>; 

  flatten(nodes = []) {
    super.flatten(nodes);
    this.childNodes.forEach((childNode) => {
      childNode.flatten(nodes);
    });
    return nodes;
  }

  set attributes(value) {
    this._attributes = new Attributes(value);
  }

  get attributes() {
    return this._attributes || {};
  }

  set childNodes(value) {
    this._childNodes = value;
    for (const child of value) this._linkChild(child);
  }

  get childNodes() {

    if (!this._childNodes) {
      this._childNodes = [];
    }

    return this._childNodes;
  }

  filter(filter, ret = []) {
    super.filter(filter, ret);
    for (const child of this.childNodes) {
      child.filter(filter, ret);
    }
    return ret;
  }

  getAttribute(key) {
    return this._attributes[key];
  }

  setAttribute(key, value) {
    this._attributes[key] = value;
  }

  appendChild(child) {
    this.childNodes.push(this._linkChild(child));
  }

  removeChild(child) {
    this.childNodes.splice(this._getChildIndex(this._unlinkChild(child)), 1);
  }

  insertBefore(newChild, existingChild) {
    if (newChild === existingChild) return;
    this.childNodes.splice(this._getChildIndex(existingChild), 0, this._linkChild(newChild));
  }

  _getChildIndex(existingChild) {
    const i = this.childNodes.indexOf(existingChild);
    if (!~i) throw new Error('child node does not exist');
    return i;
  }

  _linkChild(child) {
    if (child.parentNode) {
      child.parentNode.removeChild(child);
    }
    child.parentNode = this;
    child.didMount();
    return child;
  }

  _unlinkChild(child) {
    child.willUnmount();
    child.parentNode = void 0;
    return child;
  }

  cloneNode() {
    return new (this.constructor as any)({
      attributes: this.attributes,
      childNodes: this.childNodes
    });
  }
}
