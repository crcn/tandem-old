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
var constants_1 = require("../constants");
var events_1 = require("../events");
var exceptions_1 = require("./exceptions");
var events_2 = require("../events");
var constants_2 = require("./constants");
var named_node_map_1 = require("./named-node-map");
var collections_1 = require("./collections");
var aerial_common2_1 = require("aerial-common2");
var source_mutation_1 = require("source-mutation");
;
exports.getSEnvNodeClass = aerial_common2_1.weakMemo(function (context) {
    var SEnvEventTarget = events_2.getSEnvEventTargetClass(context);
    var SEnvNamedNodeMap = named_node_map_1.getSEnvNamedNodeMapClass(context);
    var SEnvNodeList = collections_1.getSEnvHTMLCollectionClasses(context).SEnvNodeList;
    var SEnvDOMException = exceptions_1.getDOMExceptionClasses(context).SEnvDOMException;
    var SEnvMutationEvent = events_1.getSEnvEventClasses(context).SEnvMutationEvent;
    return /** @class */ (function (_super) {
        __extends(SEnvNode, _super);
        function SEnvNode() {
            var _this = _super.call(this) || this;
            _this.$id = aerial_common2_1.generateDefaultId();
            _this.childNodes = _this.childNodesArray = new SEnvNodeList();
            // called specifically for elements
            if (_this._constructed) {
                throw new Error("Cannot call constructor twice.");
            }
            _this._constructed = true;
            _this.addEventListener(SEnvMutationEvent.MUTATION, _this._onMutation.bind(_this));
            return _this;
        }
        Object.defineProperty(SEnvNode.prototype, "assignedSlot", {
            get: function () {
                return this._assignedSlot;
            },
            enumerable: true,
            configurable: true
        });
        SEnvNode.prototype.$$setAssignedSlot = function (value) {
            this._assignedSlot = value;
            if (value) {
                this.slottedCallback();
            }
            else {
                this.unslottedCallback();
            }
        };
        Object.defineProperty(SEnvNode.prototype, "$id", {
            get: function () {
                return this._$id;
            },
            set: function (value) {
                this._$id = value;
                // TODO - probably want to dispatch a mutation change
                this._struct = undefined;
            },
            enumerable: true,
            configurable: true
        });
        SEnvNode.prototype.initialize = function () {
        };
        Object.defineProperty(SEnvNode.prototype, "ownerDocument", {
            get: function () {
                return this._ownerDocument;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SEnvNode.prototype, "nextSibling", {
            get: function () {
                return this.parentNode.childNodes[Array.prototype.indexOf.call(this.parentNode.childNodes, this) + 1];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SEnvNode.prototype, "previousSibling", {
            get: function () {
                return this.parentNode.childNodes[Array.prototype.indexOf.call(this.parentNode.childNodes, this) - 1];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SEnvNode.prototype, "offsetParent", {
            get: function () {
                // TODO - read the docs: https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetParent
                // Impl here is partial.
                return this.parentNode;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SEnvNode.prototype, "parentNode", {
            get: function () {
                return this.$$parentNode;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SEnvNode.prototype, "parentElement", {
            get: function () {
                return this.$$parentNode;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SEnvNode.prototype, "firstChild", {
            get: function () {
                return this.childNodes[0];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SEnvNode.prototype, "lastChild", {
            get: function () {
                return this.childNodes[this.childNodes.length - 1];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SEnvNode.prototype, "struct", {
            get: function () {
                if (!this._struct) {
                    this.updateStruct();
                }
                return this._struct;
            },
            enumerable: true,
            configurable: true
        });
        SEnvNode.prototype.setSource = function (source) {
            this.source = source;
            this.dispatchMutationEvent(exports.createSyntheticSourceChangeMutation(this, source));
        };
        SEnvNode.prototype.updateStruct = function () {
            this._struct = this.createStruct();
        };
        SEnvNode.prototype.createStruct = function () {
            return {
                parentId: this.parentNode ? this.parentNode.$id : null,
                nodeType: this.nodeType,
                nodeName: this.nodeName,
                source: this.source,
                instance: this,
                $type: this.structType,
                $id: this.$id
            };
        };
        SEnvNode.prototype._linkChild = function (child) {
        };
        SEnvNode.prototype.appendChild = function (newChild) {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvNode.prototype.cloneNode = function (deep) {
            var clone = this.cloneShallow();
            clone["" + "nodeName"] = this.nodeName;
            clone["" + "_initialized"] = this._initialized;
            clone.source = this.source;
            clone.$id = this.$id;
            if (deep !== false) {
                for (var i = 0, n = this.childNodes.length; i < n; i++) {
                    var child = this.childNodes[i].cloneNode(true);
                    // do NOT call appendChild to ensure that mutation events
                    // aren't triggered.
                    Array.prototype.push.call(clone.childNodes, child);
                    clone["" + "_linkChild"](child);
                }
            }
            return clone;
        };
        SEnvNode.prototype.cloneShallow = function () {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvNode.prototype.compareDocumentPosition = function (other) {
            return 0;
        };
        SEnvNode.prototype.contains = function (child) {
            return Array.prototype.indexOf.call(this.childNodes, child) !== -1;
        };
        SEnvNode.prototype.remove = function () {
            if (this.parentNode) {
                this.parentNode.removeChild(this);
            }
        };
        SEnvNode.prototype.hasAttributes = function () {
            return this.attributes.length > 0;
        };
        SEnvNode.prototype.hasChildNodes = function () {
            return this.childNodes.length > 0;
        };
        SEnvNode.prototype.insertBefore = function (newChild, refChild) {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvNode.prototype.isDefaultNamespace = function (namespaceURI) {
            return false;
        };
        SEnvNode.prototype.isEqualNode = function (arg) {
            return false;
        };
        SEnvNode.prototype.isSameNode = function (other) {
            return false;
        };
        SEnvNode.prototype.lookupNamespaceURI = function (prefix) {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvNode.prototype.lookupPrefix = function (namespaceURI) {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvNode.prototype.normalize = function () { };
        SEnvNode.prototype.removeChild = function (oldChild) {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvNode.prototype.connectedCallback = function () {
            if (this._initialized) {
                this.initialize();
            }
        };
        SEnvNode.prototype.disconnectedCallback = function () {
        };
        SEnvNode.prototype.paintedCallback = function () {
            // override me
        };
        SEnvNode.prototype._onMutation = function (event) {
            this._struct = undefined;
        };
        // non-standard
        SEnvNode.prototype.slottedCallback = function () {
            for (var i = 0, length_1 = this.childNodes.length; i < length_1; i++) {
                this.childNodes[i].slottedCallback();
            }
        };
        SEnvNode.prototype.unslottedCallback = function () {
            for (var i = 0, length_2 = this.childNodes.length; i < length_2; i++) {
                this.childNodes[i].unslottedCallback();
            }
        };
        SEnvNode.prototype.replaceChild = function (newChild, oldChild) {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvNode.prototype._throwUnsupportedMethod = function () {
            throw new SEnvDOMException("This node (" + this["constructor"].name + ") type does not support this method.");
        };
        SEnvNode.prototype.$$setConnectedToDocument = function (value) {
            if (this.connectedToDocument === value) {
                return;
            }
            this.connectedToDocument = value;
            if (value) {
                this.connectedCallback();
            }
            else {
                this.disconnectedCallback();
            }
            for (var _i = 0, _a = this.childNodes; _i < _a.length; _i++) {
                var child = _a[_i];
                child.$$setConnectedToDocument(value);
            }
        };
        SEnvNode.prototype._getDefaultView = function () {
            return this.nodeType === constants_1.SEnvNodeTypes.DOCUMENT ? this.defaultView : this.ownerDocument.defaultView;
        };
        SEnvNode.prototype.$$setOwnerDocument = function (document) {
            if (this.ownerDocument === document) {
                return;
            }
            this._ownerDocument = document;
            if (this.childNodes) {
                for (var _i = 0, _a = this.childNodes; _i < _a.length; _i++) {
                    var child = _a[_i];
                    child.$$setOwnerDocument(document);
                }
            }
        };
        SEnvNode.prototype.$$removedFromDocument = function () {
            this.connectedToDocument = false;
        };
        SEnvNode.prototype.dispatchEvent = function (event) {
            _super.prototype.dispatchEvent.call(this, event);
            // do not bubble if still constructing
            if (this.$$canBubbleParent && event.bubbles && this.$$parentNode) {
                this.$$parentNode.dispatchEvent(event);
            }
            return true;
        };
        SEnvNode.prototype.dispatchMutationEvent = function (mutation) {
            var e = new SEnvMutationEvent();
            e.initMutationEvent(mutation);
            this.dispatchEvent(e);
        };
        return SEnvNode;
    }(SEnvEventTarget));
});
exports.getSEnvValueNode = aerial_common2_1.weakMemo(function (context) {
    var SEnvNode = exports.getSEnvNodeClass(context);
    var SEnvMutationEvent = events_1.getSEnvEventClasses(context).SEnvMutationEvent;
    return /** @class */ (function (_super) {
        __extends(SenvValueNode, _super);
        function SenvValueNode(_nodeValue) {
            var _this = _super.call(this) || this;
            _this._nodeValue = _nodeValue;
            return _this;
        }
        Object.defineProperty(SenvValueNode.prototype, "nodeValue", {
            get: function () {
                return this._nodeValue;
            },
            set: function (value) {
                this._nodeValue = value;
                this.dispatchMutationEvent(source_mutation_1.createPropertyMutation(constants_2.UPDATE_VALUE_NODE, this, "nodeValue", value, undefined));
            },
            enumerable: true,
            configurable: true
        });
        SenvValueNode.prototype.createStruct = function () {
            return __assign({}, _super.prototype.createStruct.call(this), { nodeValue: this._nodeValue });
        };
        return SenvValueNode;
    }(SEnvNode));
});
exports.SET_SYNTHETIC_SOURCE_CHANGE = "SET_SYNTHETIC_SOURCE_CHANGE";
exports.createSyntheticSourceChangeMutation = function (target, value) { return source_mutation_1.createPropertyMutation(exports.SET_SYNTHETIC_SOURCE_CHANGE, target, "source", value); };
exports.diffNodeBase = function (oldNode, newNode) {
    var mutations = [];
    if (!aerial_common2_1.expressionLocationEquals(oldNode.source, newNode.source)) {
        mutations.push(exports.createSyntheticSourceChangeMutation(oldNode, newNode.source));
    }
    return mutations;
};
exports.nodeMutators = (_a = {},
    _a[exports.SET_SYNTHETIC_SOURCE_CHANGE] = function (oldNode, _a) {
        var newValue = _a.newValue;
        // may not exist if oldNode is a DOM node
        if (oldNode.setSource) {
            oldNode.setSource(newValue && JSON.parse(JSON.stringify(newValue)));
        }
    },
    _a);
exports.createUpdateValueNodeMutation = function (oldNode, newValue) {
    return source_mutation_1.createSetValueMutation(constants_2.UPDATE_VALUE_NODE, oldNode, newValue);
};
exports.diffValueNode = function (oldNode, newNode) {
    var mutations = [];
    if (oldNode.nodeValue !== newNode.nodeValue) {
        mutations.push(exports.createUpdateValueNodeMutation(oldNode, newNode.nodeValue));
    }
    return mutations.concat(exports.diffNodeBase(oldNode, newNode));
};
exports.valueNodeMutators = (_b = {},
    _b[constants_2.UPDATE_VALUE_NODE] = function (oldNode, _a) {
        var newValue = _a.newValue;
        oldNode.nodeValue = newValue;
    },
    _b);
exports.baseNodeMutators = __assign({}, exports.nodeMutators, exports.valueNodeMutators);
var _a, _b;
//# sourceMappingURL=node.js.map