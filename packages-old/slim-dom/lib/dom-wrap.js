"use strict";
/**
 * Light DOM wrapper for interoperability with immutable DOM objects and third-party DOM libraries such as nwmatcher.
 */
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
Object.defineProperty(exports, "__esModule", { value: true });
var state_1 = require("./state");
var weak_memo_1 = require("./weak-memo");
exports.getLightDomWrapper = weak_memo_1.weakMemo(function (node) {
    switch (node.type) {
        case state_1.SlimVMObjectType.TEXT: return new LightTextNode(node);
        case state_1.SlimVMObjectType.ELEMENT: return new LightElement(node);
        case state_1.SlimVMObjectType.DOCUMENT:
        case state_1.SlimVMObjectType.DOCUMENT_FRAGMENT: return new LightDocumentFragment(node);
    }
});
exports.getLightDocumentWrapper = weak_memo_1.weakMemo(function (node) {
    var document = new LightDocument();
    document.body = exports.getLightDomWrapper(node);
    return document;
});
exports.traverseLightDOM = function (current, each) {
    if (each(current) === false) {
        return false;
    }
    for (var i = 0, length_1 = current.childNodes.length; i < length_1; i++) {
        var child = current.childNodes[i];
        if (exports.traverseLightDOM(child, each) === false) {
            return false;
        }
    }
    return true;
};
var LightBaseNode = /** @class */ (function () {
    function LightBaseNode(source) {
        this.source = source;
        this.childNodes = [];
    }
    Object.defineProperty(LightBaseNode.prototype, "nextSibling", {
        get: function () {
            return this.parentNode ? this.parentNode.childNodes[this.parentNode.childNodes.indexOf(this) + 1] : null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LightBaseNode.prototype, "prevSibling", {
        get: function () {
            return this.parentNode ? this.parentNode.childNodes[this.parentNode.childNodes.indexOf(this) - 1] : null;
        },
        enumerable: true,
        configurable: true
    });
    return LightBaseNode;
}());
exports.LightBaseNode = LightBaseNode;
var LightParentNode = /** @class */ (function (_super) {
    __extends(LightParentNode, _super);
    function LightParentNode(source) {
        var _this = _super.call(this, source) || this;
        if (source) {
            _this.childNodes = source.childNodes.map(function (child) {
                var lightChild = exports.getLightDomWrapper(child);
                lightChild.parentNode = _this;
                return lightChild;
            });
        }
        return _this;
    }
    LightParentNode.prototype.appendChild = function (child) {
        this.childNodes.push(child);
        return child;
    };
    LightParentNode.prototype.insertBefore = function (child, refChild) {
        var index = this.childNodes.indexOf(refChild);
        this.childNodes.splice(index, 0, child);
        return child;
    };
    Object.defineProperty(LightParentNode.prototype, "firstChild", {
        get: function () {
            return this.childNodes[0];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LightParentNode.prototype, "lastChild", {
        get: function () {
            return this.childNodes[this.childNodes.length - 1];
        },
        enumerable: true,
        configurable: true
    });
    return LightParentNode;
}(LightBaseNode));
exports.LightParentNode = LightParentNode;
var LightAttribute = /** @class */ (function () {
    function LightAttribute(name, value) {
        this.name = name;
        this.value = value;
        this.specified = true;
    }
    return LightAttribute;
}());
var LightElement = /** @class */ (function (_super) {
    __extends(LightElement, _super);
    function LightElement(source, ownerDocument) {
        var _this = _super.call(this, source) || this;
        _this.nodeType = 1;
        _this.ownerDocument = ownerDocument;
        _this.nodeName = _this.tagName = source.tagName;
        if (source) {
            if (source.shadow) {
                _this.shadowRoot = exports.getLightDomWrapper(source.shadow);
                _this.shadowRoot.host = _this;
            }
            _this._attributesByName = {};
            _this.attributes = [];
            for (var i = 0, length_2 = source.attributes.length; i < length_2; i++) {
                var _a = source.attributes[i], name_1 = _a.name, value = _a.value;
                _this.setAttribute(name_1, value);
            }
        }
        return _this;
    }
    LightElement.prototype.setAttribute = function (name, value) {
        var attrNode = this.getAttributeNode(name);
        if (attrNode) {
            attrNode.value = value;
        }
        else {
            this.attributes.push(this._attributesByName[name] = new LightAttribute(name, value));
        }
    };
    LightElement.prototype.removeAttribute = function (name) {
        var attrNode = this.getAttributeNode(name);
        if (attrNode) {
            this._attributesByName[name] = undefined;
            var index = this.attributes.indexOf(attrNode);
            this.attributes.splice(index, 1);
        }
    };
    LightElement.prototype.hasAttribute = function (name) {
        return Boolean(this._attributesByName[name]);
    };
    LightElement.prototype.getAttributeNode = function (name) {
        return this._attributesByName[name];
    };
    LightElement.prototype.getAttribute = function (name) {
        var attr = this._attributesByName[name];
        if (name === "class") {
            console.log(attr.value);
        }
        return attr && attr.value;
    };
    return LightElement;
}(LightParentNode));
exports.LightElement = LightElement;
;
var LightDocumentFragment = /** @class */ (function (_super) {
    __extends(LightDocumentFragment, _super);
    function LightDocumentFragment(source) {
        var _this = _super.call(this, source) || this;
        _this.nodeType = 11;
        _this.nodeName = "#document-fragment";
        return _this;
    }
    return LightDocumentFragment;
}(LightParentNode));
exports.LightDocumentFragment = LightDocumentFragment;
var LightTextNode = /** @class */ (function (_super) {
    __extends(LightTextNode, _super);
    function LightTextNode(node) {
        var _this = _super.call(this, node) || this;
        _this.nodeType = 3;
        _this.nodeName = "#text";
        _this.nodeValue = node.value;
        return _this;
    }
    return LightTextNode;
}(LightBaseNode));
exports.LightTextNode = LightTextNode;
var LightDocument = /** @class */ (function () {
    function LightDocument() {
        this.nodeType = 9;
        this.documentElement = this.createElement("html");
        this.documentElement.childNodes[0] = this.createElement("head");
    }
    Object.defineProperty(LightDocument.prototype, "body", {
        get: function () {
            return this.documentElement.childNodes[1];
        },
        set: function (value) {
            this._elementsById = {};
            this.documentElement.childNodes[1] = value;
            value.parentNode = this.documentElement;
        },
        enumerable: true,
        configurable: true
    });
    LightDocument.prototype.createElement = function (tagName) {
        return new LightElement({
            tagName: tagName,
            id: null,
            type: state_1.SlimVMObjectType.ELEMENT,
            attributes: [],
            source: null,
            shadow: null,
            childNodes: []
        }, this);
    };
    LightDocument.prototype.getElementById = function (id) {
        if (this._elementsById[id]) {
            return this._elementsById[id];
        }
        var found;
        exports.traverseLightDOM(this.documentElement, function (child) {
            if (child.nodeType === 1 && child.getAttribute(id) === id) {
                found = child;
                return false;
            }
        });
        return this._elementsById[id] = found;
    };
    return LightDocument;
}());
exports.LightDocument = LightDocument;
//# sourceMappingURL=dom-wrap.js.map