"use strict";
const get_path_1 = require('../utils/node/get-path');
const get_node_1 = require('../utils/node/get-node');
/**
 */
class Marker {
    constructor(_startPath, _endPath, _nodeFactory) {
        this._startPath = _startPath;
        this._endPath = _endPath;
        this._nodeFactory = _nodeFactory;
    }
    createSection(rootNode) {
        return new FragmentSection(get_node_1.default(rootNode, this._startPath), get_node_1.default(rootNode, this._endPath), this._nodeFactory);
    }
}
exports.Marker = Marker;
/**
 * a section is a group of nodes contained within a
 */
class FragmentSection {
    constructor(start = undefined, end = undefined, nodeFactory = document) {
        this._start = start || nodeFactory.createTextNode('');
        this._end = end || nodeFactory.createTextNode('');
        this._nodeFactory = nodeFactory;
        if (!this._start.parentNode) {
            this.remove();
        }
    }
    appendChild(child) {
        if (this._hiddenChildren)
            return this._hiddenChildren.push(child);
        this._end.parentNode.insertBefore(child, this._end);
    }
    get visible() {
        return !this._hiddenChildren;
    }
    get childNodes() {
        if (this._hiddenChildren)
            return this._hiddenChildren;
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
        return this.childNodes.map((childNode) => (childNode.outerHTML || childNode.nodeValue)).join('');
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
        if (this._hiddenChildren)
            return;
        this._hiddenChildren = this.childNodes;
        for (var child of this._hiddenChildren) {
            child.parentNode.removeChild(child);
        }
    }
    /**
     * shows the section if it's hidden
     */
    show() {
        if (!this._hiddenChildren)
            return;
        var hiddenChildren = this._hiddenChildren;
        this._hiddenChildren = void 0;
        for (var child of hiddenChildren) {
            this._start.appendChild(child);
        }
    }
    /**
     */
    createMarker() {
        return new Marker(get_path_1.default(this._start), get_path_1.default(this._end), this._nodeFactory);
    }
    /**
     */
    clone() {
        if (this.targetNode.nodeType !== 11) {
            throw new Error('cannot currently clone fragment section that is attached to an element.');
        }
        var clone = this.targetNode.cloneNode(true);
        return new FragmentSection(clone.firstChild, clone.lastChild, this._nodeFactory);
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = FragmentSection;
//# sourceMappingURL=fragment.js.map