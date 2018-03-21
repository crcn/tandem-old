"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var aerial_common2_1 = require("aerial-common2");
var source_mutation_1 = require("source-mutation");
var constants_1 = require("./constants");
var node_1 = require("./node");
var collections_1 = require("./collections");
var exceptions_1 = require("./exceptions");
var level3_1 = require("../level3");
var events_1 = require("../events");
var constants_2 = require("../constants");
var utils_1 = require("./utils");
exports.getSEnvParentNodeClass = aerial_common2_1.weakMemo(function (context) {
    var SEnvNode = node_1.getSEnvNodeClass(context);
    var SEnvDOMException = exceptions_1.getDOMExceptionClasses(context).SEnvDOMException;
    var SEnvHTMLCollection = collections_1.getSEnvHTMLCollectionClasses(context).SEnvHTMLCollection;
    var SEnvMutationEvent = level3_1.getL3EventClasses(context).SEnvMutationEvent;
    var SEnvMutationEvent2 = events_1.getSEnvEventClasses(context).SEnvMutationEvent;
    return /** @class */ (function (_super) {
        __extends(SEnvParentNode, _super);
        function SEnvParentNode() {
            var _this = _super.call(this) || this;
            _this._children = new SEnvHTMLCollection().$init(_this);
            return _this;
        }
        Object.defineProperty(SEnvParentNode.prototype, "children", {
            get: function () {
                return this._children.update();
            },
            enumerable: true,
            configurable: true
        });
        SEnvParentNode.prototype.appendChild = function (child) {
            return this.insertChildAt(child, this.childNodes.length);
        };
        SEnvParentNode.prototype.insertBefore = function (newChild, refChild) {
            // if null, then append -- this is to spec. See MSDN docs about this.
            if (refChild == null) {
                return this.appendChild(newChild);
            }
            var index = Array.prototype.indexOf.call(this.childNodes, refChild);
            if (index === -1) {
                throw new SEnvDOMException("Failed to execute 'insertBefore' on 'Node': The node before which the new node is to be inserted is not a child of this node.");
            }
            if (Array.prototype.indexOf.call(this.childNodes, newChild) !== -1) {
                throw new Error("Inserting child that already exists");
            }
            return this.insertChildAt(newChild, index);
        };
        SEnvParentNode.prototype.createStruct = function (parentNode) {
            return __assign({}, _super.prototype.createStruct.call(this), { childNodes: Array.prototype.map.call(this.childNodes, function (child) { return child.struct; }) });
        };
        SEnvParentNode.prototype.insertChildAt = function (child, index) {
            if (child.nodeType === constants_2.SEnvNodeTypes.DOCUMENT_FRAGMENT) {
                while (child.childNodes.length) {
                    this.insertChildAt(child.lastChild, index);
                }
                return child;
            }
            var c = child;
            if (c.$$parentNode) {
                c.$$parentNode.removeChild(child);
            }
            this.childNodesArray.splice(index, 0, child);
            var event2 = new SEnvMutationEvent2();
            // need to link child _now_ in case connectedCallback triggers additional
            // children to be created (web components). We do _not_ want those mutations
            // to dispatch a mutation that causes a patch to the DOM renderer
            this._linkChild(c);
            // dispatch insertion now after it's completely linked
            event2.initMutationEvent(exports.createParentNodeInsertChildMutation(this, child, index));
            this.dispatchEvent(event2);
            return child;
        };
        SEnvParentNode.prototype.removeChild = function (child) {
            var index = this.childNodesArray.indexOf(child);
            if (index === -1) {
                throw new SEnvDOMException("The node to be removed is not a child of this node.");
            }
            // needs to come after so that 
            this.childNodesArray.splice(index, 1);
            var event2 = new SEnvMutationEvent2();
            event2.initMutationEvent(exports.createParentNodeRemoveChildMutation(this, child, index));
            this.dispatchEvent(event2);
            this._unlinkChild(child);
            return child;
        };
        SEnvParentNode.prototype.querySelector = function (selectors) {
            return utils_1.querySelector(this, selectors);
        };
        SEnvParentNode.prototype.getElementsByName = function (elementName) {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvParentNode.prototype.getElementsByClassName = function (classNames) {
            // TODO - need to allow for multiple class names
            return this.querySelectorAll(classNames.split(/\s+/g).map(function (className) { return "." + className; }).join(","));
        };
        SEnvParentNode.prototype.getElementsByTagName = function (tagName) {
            return this.querySelectorAll(tagName);
        };
        SEnvParentNode.prototype.getElementsByTagNameNS = function (namespaceURI, localName) {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvParentNode.prototype.querySelectorAll = function (selectors) {
            // TODO - not actually an array here
            return utils_1.querySelectorAll(this, selectors);
        };
        SEnvParentNode.prototype.replaceChild = function (newChild, oldChild) {
            var index = this.childNodesArray.indexOf(oldChild);
            if (index === -1) {
                throw new SEnvDOMException("The node to be replaced is not a child of this node.");
            }
            this.childNodesArray.splice(index, 1, newChild);
            return oldChild;
        };
        Object.defineProperty(SEnvParentNode.prototype, "firstElementChild", {
            get: function () {
                return this.children[0];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SEnvParentNode.prototype, "textContent", {
            get: function () {
                return Array.prototype.map.call(this.childNodes, function (child) { return child.textContent; }).join("");
            },
            set: function (value) {
                this.removeAllChildren();
                var textNode = this.ownerDocument.createTextNode(value);
                this.appendChild(textNode);
            },
            enumerable: true,
            configurable: true
        });
        SEnvParentNode.prototype.removeAllChildren = function () {
            while (this.childNodes.length) {
                this.removeChild(this.childNodes[0]);
            }
        };
        Object.defineProperty(SEnvParentNode.prototype, "lastElementChild", {
            get: function () {
                return this.children[this.children.length - 1];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SEnvParentNode.prototype, "childElementCount", {
            get: function () {
                return this.children.length;
            },
            enumerable: true,
            configurable: true
        });
        SEnvParentNode.prototype._linkChild = function (child) {
            child.$$parentNode = this;
            child.$$setOwnerDocument(this.nodeType === constants_2.SEnvNodeTypes.DOCUMENT ? this : this.ownerDocument);
            child.$$setConnectedToDocument(this.nodeType === constants_2.SEnvNodeTypes.DOCUMENT ? true : this.connectedToDocument);
            child.$$canBubbleParent = true;
        };
        SEnvParentNode.prototype._unlinkChild = function (child) {
            child.$$canBubbleParent = false;
            child.$$parentNode = null;
            child.$$setConnectedToDocument(this.nodeType === constants_2.SEnvNodeTypes.DOCUMENT ? false : this.connectedToDocument);
            if (child.connectedToDocument) {
                child.$$removedFromDocument();
            }
        };
        return SEnvParentNode;
    }(SEnvNode));
});
exports.cloneNode = function (node, deep) {
    if (node.constructor === Object)
        return JSON.parse(JSON.stringify(node));
    return node.cloneNode(deep);
};
exports.createParentNodeInsertChildMutation = function (parent, child, index, cloneChild) {
    if (cloneChild === void 0) { cloneChild = true; }
    return source_mutation_1.createInsertChildMutation(constants_1.INSERT_CHILD_NODE_EDIT, parent, child, index, cloneChild);
};
exports.createParentNodeRemoveChildMutation = function (parent, child, index) {
    return source_mutation_1.createRemoveChildMutation(constants_1.REMOVE_CHILD_NODE_EDIT, parent, child, index != null ? index : Array.from(parent.childNodes).indexOf(child));
};
exports.createParentNodeMoveChildMutation = function (oldNode, child, index, patchedOldIndex) {
    return source_mutation_1.createMoveChildMutation(constants_1.MOVE_CHILD_NODE_EDIT, oldNode, child, patchedOldIndex || Array.from(oldNode.childNodes).indexOf(child), index);
};
exports.diffParentNode = function (oldNode, newNode, diffChildNode) {
    var mutations = [];
    var diff = source_mutation_1.diffArray(Array.from(oldNode.childNodes), Array.from(newNode.childNodes), function (oldNode, newNode) {
        if (oldNode.nodeName !== newNode.nodeName || oldNode.namespaceURI !== newNode.namespaceURI)
            return -1;
        return 1;
    });
    source_mutation_1.eachArrayValueMutation(diff, {
        insert: function (_a) {
            var index = _a.index, value = _a.value;
            mutations.push(exports.createParentNodeInsertChildMutation(oldNode, value, index));
        },
        delete: function (_a) {
            var index = _a.index;
            mutations.push(exports.createParentNodeRemoveChildMutation(oldNode, oldNode.childNodes[index]));
        },
        update: function (_a) {
            var originalOldIndex = _a.originalOldIndex, patchedOldIndex = _a.patchedOldIndex, newValue = _a.newValue, index = _a.index;
            if (patchedOldIndex !== index) {
                mutations.push(exports.createParentNodeMoveChildMutation(oldNode, oldNode.childNodes[originalOldIndex], index, patchedOldIndex));
            }
            var oldValue = oldNode.childNodes[originalOldIndex];
            mutations.push.apply(mutations, diffChildNode(oldValue, newValue));
        }
    });
    mutations.push.apply(mutations, node_1.diffNodeBase(oldNode, newNode));
    return mutations;
};
var insertChildNodeAt = function (parent, child, index) {
    if (index >= parent.childNodes.length || parent.childNodes.length === 0) {
        parent.appendChild(child);
    }
    else {
        var before_1 = parent.childNodes[index];
        parent.insertBefore(child, before_1);
    }
};
exports.parentNodeMutators = __assign({}, node_1.baseNodeMutators, (_a = {}, _a[constants_1.REMOVE_CHILD_NODE_EDIT] = function (oldNode, _a) {
    var index = _a.index, child = _a.child;
    oldNode.removeChild(oldNode.childNodes[index]);
}, _a[constants_1.MOVE_CHILD_NODE_EDIT] = function (oldNode, _a) {
    var oldIndex = _a.oldIndex, index = _a.index;
    insertChildNodeAt(oldNode, oldNode.childNodes[oldIndex], index);
}, _a[constants_1.INSERT_CHILD_NODE_EDIT] = function (oldNode, _a) {
    var index = _a.index, child = _a.child, clone = _a.clone;
    insertChildNodeAt(oldNode, clone !== false ? exports.cloneNode(child, true) : child, index);
}, _a));
var _a;
//# sourceMappingURL=parent-node.js.map