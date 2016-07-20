"use strict";
const get_path_1 = require('../utils/node/get-path');
const get_node_1 = require('../utils/node/get-node');
/**
 */
class Marker {
    constructor(path, nodeFactory) {
        this._path = path;
        this._nodeFactory = nodeFactory;
    }
    getNode(rootNode) {
        return get_node_1.default(rootNode, this._path);
    }
    createSection(rootNode) {
        return new NodeSection(this.getNode(rootNode), this._nodeFactory);
    }
}
exports.Marker = Marker;
/**
 * a section is a group of nodes contained within a
 */
class NodeSection {
    constructor(_target, _nodeFactory = document) {
        this._target = _target;
        this._nodeFactory = _nodeFactory;
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
        if (this._placeholderNode)
            return;
        this._placeholderNode = this._nodeFactory.createTextNode('');
        this._target.parentNode.insertBefore(this._target, this._placeholderNode);
        this.remove();
    }
    /**
     * shows the section if it's hidden
     */
    show() {
        if (!this._placeholderNode)
            return;
        var placeholderNode = this._placeholderNode;
        this._placeholderNode = void 0;
        placeholderNode.parentNode.insertBefore(this._target, placeholderNode);
        placeholderNode.parentNode.removeChild(placeholderNode);
    }
    /**
     */
    createMarker() {
        return new Marker(get_path_1.default(this._target), this._nodeFactory);
    }
    /**
     */
    clone() {
        return new NodeSection(this.targetNode.cloneNode(true), this._nodeFactory);
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = NodeSection;
//# sourceMappingURL=node.js.map