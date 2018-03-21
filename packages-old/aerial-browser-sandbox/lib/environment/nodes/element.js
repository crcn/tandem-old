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
var comment_1 = require("./comment");
var text_1 = require("./text");
var constants_1 = require("../constants");
var constants_2 = require("./constants");
var aerial_common2_1 = require("aerial-common2");
var source_mutation_1 = require("source-mutation");
var parent_node_1 = require("./parent-node");
var events_1 = require("../events");
var light_document_1 = require("./light-document");
var utils_1 = require("./utils");
var collections_1 = require("./collections");
var node_1 = require("./node");
var state_1 = require("../../state");
exports.getSEnvAttr = aerial_common2_1.weakMemo(function (context) {
    var SEnvNode = node_1.getSEnvNodeClass(context);
    return /** @class */ (function (_super) {
        __extends(SEnvAttr, _super);
        function SEnvAttr(name, value, ownerElement) {
            var _this = _super.call(this) || this;
            _this.name = name;
            _this.value = value;
            _this.ownerElement = ownerElement;
            _this.specified = true;
            return _this;
        }
        SEnvAttr.prototype.createStruct = function () {
            return __assign({}, _super.prototype.createStruct.call(this), { name: this.name, value: this.value });
        };
        return SEnvAttr;
    }(SEnvNode));
});
exports.getSEnvElementClass = aerial_common2_1.weakMemo(function (context) {
    var SEnvAttr = exports.getSEnvAttr(context);
    var SEnvNode = node_1.getSEnvNodeClass(context);
    var SEnvParentNode = parent_node_1.getSEnvParentNodeClass(context);
    var SEnvNamedNodeMap = collections_1.getSEnvHTMLCollectionClasses(context).SEnvNamedNodeMap;
    var SEnvMutationEvent = events_1.getSEnvEventClasses(context).SEnvMutationEvent;
    var SEnvShadowRoot = light_document_1.getSEnvShadowRootClass(context);
    return /** @class */ (function (_super) {
        __extends(SEnvElement, _super);
        function SEnvElement() {
            var _this = _super.call(this) || this;
            _this.structType = state_1.SYNTHETIC_ELEMENT;
            _this.nodeType = constants_1.SEnvNodeTypes.ELEMENT;
            _this.className = "";
            _this.nodeType = constants_1.SEnvNodeTypes.ELEMENT;
            _this.attributes = new Proxy(new SEnvNamedNodeMap(), {
                get: function (target, key) {
                    return typeof target[key] === "function" ? target[key].bind(target) : target[key];
                },
                set: function (target, key, value, receiver) {
                    var oldItem = target.getNamedItem(value);
                    if (value == null) {
                        target.removeNamedItem(key);
                    }
                    else {
                        target.setNamedItem(new SEnvAttr(key, value, _this));
                    }
                    _this.attributeChangedCallback(key, oldItem && oldItem.value, value);
                    return true;
                }
            });
            return _this;
        }
        Object.defineProperty(SEnvElement.prototype, "slot", {
            get: function () {
                return this.getAttribute("slot");
            },
            set: function (value) {
                this.setAttribute("slot", value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SEnvElement.prototype, "previousElementSibling", {
            get: function () {
                for (var i = Array.prototype.indexOf.call(this.parentNode.childNodes, this); i--;) {
                    if (this.parentNode.childNodes[i].nodeType === constants_1.SEnvNodeTypes.ELEMENT) {
                        return this.parentNode.childNodes[i];
                    }
                }
                return null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SEnvElement.prototype, "nextElementSibling", {
            get: function () {
                for (var i = Array.prototype.indexOf.call(this.parentNode.childNodes, this) + 1, length_1 = this.parentNode.childNodes.length; i < length_1; i++) {
                    if (this.parentNode.childNodes[i].nodeType === constants_1.SEnvNodeTypes.ELEMENT) {
                        return this.parentNode.childNodes[i];
                    }
                }
                return null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SEnvElement.prototype, "id", {
            get: function () {
                return this.getAttribute("id");
            },
            set: function (value) {
                this.setAttribute("id", value);
            },
            enumerable: true,
            configurable: true
        });
        SEnvElement.prototype.getAttribute = function (name) {
            return this.hasAttribute(name) ? this.attributes[name].value : null;
        };
        SEnvElement.prototype.getPreviewAttribute = function (name) {
            return this.getAttribute(name);
        };
        SEnvElement.prototype.getAttributeNode = function (name) {
            return this.attributes[name];
        };
        SEnvElement.prototype.getAttributeNodeNS = function (namespaceURI, localName) {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvElement.prototype.getAttributeNS = function (namespaceURI, localName) {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvElement.prototype.getBoundingClientRect = function () {
            return this.ownerDocument.defaultView.renderer.getBoundingClientRect(this);
        };
        SEnvElement.prototype.getClientRects = function () {
            this._throwUnsupportedMethod();
            return null;
        };
        Object.defineProperty(SEnvElement.prototype, "outerHTML", {
            get: function () {
                var buffer = "<" + this.nodeName.toLowerCase();
                for (var i = 0, n = this.attributes.length; i < n; i++) {
                    var _a = this.attributes[i], name_1 = _a.name, value = _a.value;
                    buffer += " " + name_1 + "=\"" + value + "\"";
                }
                buffer += ">" + this.innerHTML + "</" + this.nodeName.toLowerCase() + ">";
                return buffer;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SEnvElement.prototype, "innerHTML", {
            get: function () {
                return Array.prototype.map.call(this.childNodes, function (child) {
                    switch (child.nodeType) {
                        case constants_1.SEnvNodeTypes.TEXT: return child.nodeValue;
                        case constants_1.SEnvNodeTypes.COMMENT: return "<!--" + child.nodeValue + "-->";
                        case constants_1.SEnvNodeTypes.ELEMENT: return child.outerHTML;
                    }
                    return "";
                }).join("");
            },
            set: function (value) {
                this.removeAllChildren();
                var documentFragment = utils_1.evaluateHTMLDocumentFragment(value, this.ownerDocument, this);
            },
            enumerable: true,
            configurable: true
        });
        SEnvElement.prototype.createStruct = function (parentNode) {
            return __assign({}, _super.prototype.createStruct.call(this, parentNode), { shadowRoot: this.shadowRoot && this.shadowRoot.struct, attributes: Array.prototype.map.call(this.attributes, function (attr) { return attr.struct; }) });
        };
        SEnvElement.prototype.hasAttribute = function (name) {
            return this.attributes[name] != null;
        };
        SEnvElement.prototype.hasAttributeNS = function (namespaceURI, localName) {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvElement.prototype.msGetRegionContent = function () {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvElement.prototype.msGetUntransformedBounds = function () {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvElement.prototype.msMatchesSelector = function (selectors) {
            return this.matches(selectors);
        };
        SEnvElement.prototype.msReleasePointerCapture = function (pointerId) {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvElement.prototype.msSetPointerCapture = function (pointerId) {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvElement.prototype.msZoomTo = function (args) {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvElement.prototype.releasePointerCapture = function (pointerId) {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvElement.prototype.removeAttribute = function (qualifiedName) {
            this.attributes[qualifiedName] = undefined;
        };
        SEnvElement.prototype.removeAttributeNode = function (oldAttr) {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvElement.prototype.removeAttributeNS = function (namespaceURI, localName) {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvElement.prototype.requestFullscreen = function () {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvElement.prototype.requestPointerLock = function () {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvElement.prototype.setAttribute = function (name, value) {
            if (this.getAttribute(name) !== value) {
                this.attributes[name] = value;
            }
        };
        SEnvElement.prototype.setAttributeNode = function (newAttr) {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvElement.prototype.setAttributeNodeNS = function (newAttr) {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvElement.prototype.setAttributeNS = function (namespaceURI, qualifiedName, value) {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvElement.prototype.setPointerCapture = function (pointerId) {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvElement.prototype.webkitMatchesSelector = function (selectors) {
            return this.matches(selectors);
        };
        SEnvElement.prototype.webkitRequestFullscreen = function () {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvElement.prototype.webkitRequestFullScreen = function () {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvElement.prototype.matches = function (selector) {
            return utils_1.matchesSelector(this, selector);
        };
        SEnvElement.prototype.closest = function (selector) {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvElement.prototype.scrollIntoView = function (arg) {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvElement.prototype.scroll = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvElement.prototype.scrollTo = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvElement.prototype.scrollBy = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvElement.prototype.insertAdjacentElement = function (position, insertedElement) {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvElement.prototype.insertAdjacentHTML = function (where, html) {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvElement.prototype.insertAdjacentText = function (where, text) {
            this._throwUnsupportedMethod();
            return null;
        };
        SEnvElement.prototype.attachShadow = function (shadowRootInitDict) {
            if (this.shadowRoot) {
                return this.shadowRoot;
            }
            // const SEnvDocument = getSEnvDocumentClass(context)
            return this.$$setShadowRoot(this.ownerDocument.$$linkNode(new SEnvShadowRoot()));
        };
        SEnvElement.prototype.$$setShadowRoot = function (shadowRoot) {
            this.shadowRoot = shadowRoot;
            if (this.connectedToDocument) {
                this.shadowRoot.$$setConnectedToDocument(true);
            }
            this.shadowRoot["" + "host"] = this;
            this.dispatchMutationEvent(exports.attachShadowRootMutation(this));
            this.shadowRoot.addEventListener(SEnvMutationEvent.MUTATION, this._onShadowMutation.bind(this));
            return this.shadowRoot;
        };
        SEnvElement.prototype._onShadowMutation = function (event) {
            this._onMutation(event);
            this.dispatchEvent(event);
        };
        SEnvElement.prototype.attributeChangedCallback = function (name, oldValue, newValue) {
            this.dispatchMutationEvent(source_mutation_1.createPropertyMutation(constants_2.SET_ELEMENT_ATTRIBUTE_EDIT, this, name, newValue, oldValue));
        };
        SEnvElement.prototype.cloneNode = function (deep) {
            var clone = _super.prototype.cloneNode.call(this, deep);
            if (deep !== false && this.shadowRoot) {
                clone.attachShadow({ mode: "open" }).appendChild(this.shadowRoot.cloneNode(true));
            }
            return clone;
        };
        SEnvElement.prototype.cloneShallow = function () {
            // note that we're instantiating the constructor here instead
            // of calling document.createElement since document.createElement
            // may have a different class registered to this tag name at a different time. 
            var clone = this.ownerDocument.$$linkElement(new this.constructor(), this.tagName, this.namespaceURI);
            clone["" + "tagName"] = this.tagName;
            for (var i = 0, n = this.attributes.length; i < n; i++) {
                var attr = this.attributes[i];
                clone.setAttribute(attr.name, attr.value);
            }
            return clone;
        };
        return SEnvElement;
    }(SEnvParentNode));
});
exports.diffBaseNode = function (oldChild, newChild, diffChildNode) {
    if (diffChildNode === void 0) { diffChildNode = exports.diffBaseNode; }
    switch (oldChild.nodeType) {
        case constants_1.SEnvNodeTypes.ELEMENT: return exports.diffBaseElement(oldChild, newChild, diffChildNode);
        case constants_1.SEnvNodeTypes.DOCUMENT_FRAGMENT: return parent_node_1.diffParentNode(oldChild, newChild, diffChildNode);
        case constants_1.SEnvNodeTypes.TEXT: return text_1.diffTextNode(oldChild, newChild);
        case constants_1.SEnvNodeTypes.COMMENT: return comment_1.diffComment(oldChild, newChild);
    }
    return [];
};
exports.createSetElementTextContentMutation = function (target, value) {
    return source_mutation_1.createPropertyMutation(constants_2.SET_TEXT_CONTENT, target, "textContent", value);
};
exports.attachShadowRootMutation = function (target) {
    return source_mutation_1.createSetValueMutation(constants_2.ATTACH_SHADOW_ROOT_EDIT, target, target.shadowRoot);
};
exports.createSetElementAttributeMutation = function (target, name, value, oldName, index) {
    return source_mutation_1.createPropertyMutation(constants_2.SET_ELEMENT_ATTRIBUTE_EDIT, target, name, value, undefined, oldName, index);
};
exports.diffBaseElement = function (oldElement, newElement, diffChildNode) {
    if (diffChildNode === void 0) { diffChildNode = exports.diffBaseNode; }
    var mutations = [];
    if (oldElement.nodeName !== newElement.nodeName) {
        throw new Error("nodeName must match in order to diff");
    }
    var attrDiff = source_mutation_1.diffArray(Array.from(oldElement.attributes), Array.from(newElement.attributes), function (a, b) { return a.name === b.name ? 1 : -1; });
    source_mutation_1.eachArrayValueMutation(attrDiff, {
        insert: function (_a) {
            var index = _a.index, value = _a.value;
            mutations.push(exports.createSetElementAttributeMutation(oldElement, value.name, value.value, undefined, index));
        },
        delete: function (_a) {
            var index = _a.index;
            mutations.push(exports.createSetElementAttributeMutation(oldElement, oldElement.attributes[index].name, undefined));
        },
        update: function (_a) {
            var originalOldIndex = _a.originalOldIndex, patchedOldIndex = _a.patchedOldIndex, newValue = _a.newValue, index = _a.index;
            if (oldElement.attributes[originalOldIndex].value !== newValue.value) {
                mutations.push(exports.createSetElementAttributeMutation(oldElement, newValue.name, newValue.value, undefined, index));
            }
        }
    });
    // TODO - open / close shadow root
    if (oldElement.shadowRoot && newElement.shadowRoot) {
        mutations.push.apply(mutations, diffChildNode(oldElement.shadowRoot, newElement.shadowRoot));
    }
    else if (oldElement.shadowRoot && !newElement.shadowRoot) {
        console.error("Attempting to diff unimplemented attachment of shadow root");
    }
    else if (!oldElement.shadowRoot && newElement.shadowRoot) {
        console.error("Attempting to diff unimplemented detattachment of shadow root");
    }
    mutations.push.apply(mutations, parent_node_1.diffParentNode(oldElement, newElement, diffChildNode));
    return mutations;
};
exports.baseElementMutators = __assign({}, parent_node_1.parentNodeMutators, (_a = {}, _a[constants_2.ATTACH_SHADOW_ROOT_EDIT] = function (oldElement, mutation) {
    if (oldElement.$$setShadowRoot) {
        oldElement.$$setShadowRoot(mutation.newValue.cloneNode(true));
    }
    else {
        oldElement.attachShadow({ mode: "open" });
    }
}, _a[constants_2.SET_ELEMENT_ATTRIBUTE_EDIT] = function (oldElement, mutation) {
    var _a = mutation, name = _a.name, oldName = _a.oldName, newValue = _a.newValue;
    // need to set the current value (property), and the default value (attribute)
    // TODO - this may need to be separated later on.
    if (oldElement.constructor.prototype.hasOwnProperty(name)) {
        oldElement[name] = newValue == null ? "" : newValue;
    }
    if (newValue == null) {
        oldElement.removeAttribute(name);
    }
    else {
        // An error will be thrown by the DOM if the name is invalid. Need to ignore
        // native exceptions so that other parts of the app do not break.
        try {
            oldElement.setAttribute(name, newValue);
        }
        catch (e) {
            console.warn(e);
        }
    }
    if (oldName) {
        if (oldElement.hasOwnProperty(oldName)) {
            oldElement[oldName] = undefined;
        }
        oldElement.removeAttribute(oldName);
    }
}, _a));
var _a;
//# sourceMappingURL=element.js.map