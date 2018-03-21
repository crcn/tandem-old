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
Object.defineProperty(exports, "__esModule", { value: true });
var slim_dom_1 = require("slim-dom");
var lodash_1 = require("lodash");
exports.stringifyNode = function (node) {
    switch (node.type) {
        case slim_dom_1.SlimVMObjectType.TEXT: {
            var text = node;
            return text.value;
        }
        case slim_dom_1.SlimVMObjectType.ELEMENT: {
            var element = node;
            var buffer = "<" + element.tagName;
            var attrBuffer = [];
            for (var _i = 0, _a = element.attributes; _i < _a.length; _i++) {
                var attribute = _a[_i];
                if (typeof attribute.value === "object") {
                    continue;
                }
                attrBuffer.push(" " + attribute.name + "=\"" + attribute.value + "\"");
            }
            buffer += attrBuffer.sort().join("") + ">";
            if (element.shadow) {
                buffer += "<#shadow>" + exports.stringifyNode(element.shadow) + "</#shadow>";
            }
            buffer += element.childNodes.map(exports.stringifyNode).join("");
            if (element.tagName === "style") {
                buffer += stringifyStyleSheet(element.sheet);
            }
            buffer += "</" + element.tagName + ">";
            return buffer;
        }
        case slim_dom_1.SlimVMObjectType.DOCUMENT_FRAGMENT:
        case slim_dom_1.SlimVMObjectType.DOCUMENT: {
            return node.childNodes.map(exports.stringifyNode).join("");
        }
    }
};
var stringifyStyleSheet = function (sheet) {
    switch (sheet.type) {
        case slim_dom_1.SlimVMObjectType.STYLE_SHEET: {
            return sheet.rules.map(stringifyStyleSheet).join(" ");
        }
        case slim_dom_1.SlimVMObjectType.STYLE_RULE: {
            var rule = sheet;
            var buffer = rule.selectorText + " {";
            for (var _i = 0, _a = rule.style; _i < _a.length; _i++) {
                var _b = _a[_i], name_1 = _b.name, value = _b.value;
                buffer += name_1 + ":" + value + ";";
            }
            buffer += "}";
            return buffer;
        }
        case slim_dom_1.SlimVMObjectType.AT_RULE: {
            var _c = sheet, name_2 = _c.name, params = _c.params, rules = _c.rules;
            return /^(charset|import)$/.test(name_2) ? "@" + name_2 + " \"" + params + "\";" : "@" + name_2 + " " + params + " {" + rules.map(stringifyStyleSheet).join("") + "}";
        }
    }
};
var FakeBaseNode = /** @class */ (function () {
    function FakeBaseNode(ownerDocument) {
        this.ownerDocument = ownerDocument;
        this.childNodes = [];
    }
    Object.defineProperty(FakeBaseNode.prototype, "nextSibling", {
        get: function () {
            return this.parentNode.childNodes[this.parentNode.childNodes.indexOf(this) + 1];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FakeBaseNode.prototype, "previousSibling", {
        get: function () {
            return this.parentNode.childNodes[this.parentNode.childNodes.indexOf(this) - 1];
        },
        enumerable: true,
        configurable: true
    });
    return FakeBaseNode;
}());
var FakeParentNode = /** @class */ (function (_super) {
    __extends(FakeParentNode, _super);
    function FakeParentNode(ownerDocument) {
        return _super.call(this, ownerDocument) || this;
    }
    FakeParentNode.prototype.appendChild = function (child) {
        if (child.nodeType === 11) {
            var children = child.childNodes.slice();
            for (var _i = 0, children_1 = children; _i < children_1.length; _i++) {
                var subChild = children_1[_i];
                this.appendChild(subChild);
            }
        }
        else {
            if (child.parentNode) {
                child.parentNode.removeChild(child);
            }
            child.parentNode = this;
            this.childNodes.push(child);
        }
    };
    FakeParentNode.prototype.removeChild = function (child) {
        var index = this.childNodes.indexOf(child);
        if (index !== -1) {
            this.childNodes.splice(index, 1);
        }
        else {
            throw new Error("child does not exist");
        }
    };
    FakeParentNode.prototype.insertBefore = function (newChild, refChild) {
        if (newChild.nodeType === 11) {
            var children = newChild.childNodes.slice();
            for (var i = children.length; i--;) {
                this.insertBefore(children[i], refChild);
                refChild = children[i];
            }
            return;
        }
        if (newChild.parentNode) {
            newChild.parentNode.removeChild(newChild);
        }
        var index = this.childNodes.indexOf(refChild);
        newChild.parentNode = this;
        if (index === -1) {
            throw new Error("ref child does not exist");
        }
        this.childNodes.splice(index, 0, newChild);
    };
    FakeParentNode.prototype.toString = function () {
        return this.childrenToString();
    };
    FakeParentNode.prototype.childrenToString = function () {
        return this.childNodes.map(function (child) { return child.toString(); }).join("");
    };
    return FakeParentNode;
}(FakeBaseNode));
var FakeDocumentFragment = /** @class */ (function (_super) {
    __extends(FakeDocumentFragment, _super);
    function FakeDocumentFragment() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.nodeType = 11;
        return _this;
    }
    return FakeDocumentFragment;
}(FakeParentNode));
exports.FakeDocumentFragment = FakeDocumentFragment;
var FakeAttribute = /** @class */ (function () {
    function FakeAttribute(name, value) {
        this.name = name;
        this.value = value;
    }
    return FakeAttribute;
}());
exports.FakeAttribute = FakeAttribute;
var FakeElement = /** @class */ (function (_super) {
    __extends(FakeElement, _super);
    function FakeElement(tagName, ownerDocument) {
        var _this = _super.call(this, ownerDocument) || this;
        _this.tagName = tagName;
        _this.attributes = [];
        _this.dataset = {};
        _this.nodeType = 1;
        return _this;
    }
    Object.defineProperty(FakeElement.prototype, "classList", {
        get: function () {
            var _this = this;
            return {
                add: function () {
                    var classNames = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        classNames[_i] = arguments[_i];
                    }
                    var prevClass = _this.getAttribute("class");
                    _this.setAttribute("class", (prevClass ? [prevClass] : []).concat(classNames).join(" "));
                }
            };
        },
        enumerable: true,
        configurable: true
    });
    FakeElement.prototype.removeAttribute = function (name) {
        var index = this.attributes.findIndex(function (attr) { return attr.name === name; });
        if (index !== -1) {
            this.attributes.splice(index, 1);
        }
    };
    FakeElement.prototype.attachShadow = function () {
        if (this._shadowRoot) {
            throw new Error("Cannot re-attach shadow root");
        }
        return this._shadowRoot = this.ownerDocument.createDocumentFragment();
    };
    Object.defineProperty(FakeElement.prototype, "shadowRoot", {
        get: function () {
            return this._shadowRoot;
        },
        enumerable: true,
        configurable: true
    });
    FakeElement.prototype.getAttribute = function (name) {
        var attr = this.attributes.find(function (attr) { return attr.name === name; });
        return attr && attr.value;
    };
    FakeElement.prototype.setAttribute = function (name, value) {
        var index = this.attributes.findIndex(function (attr) { return attr.name === name; });
        if (index !== -1) {
            this.attributes[index].value = value;
        }
        else {
            this.attributes.push(new FakeAttribute(name, value));
        }
    };
    FakeElement.prototype.toString = function () {
        var buffer = "<" + this.tagName;
        var attrBuffer = [];
        for (var _i = 0, _a = this.attributes; _i < _a.length; _i++) {
            var _b = _a[_i], name_3 = _b.name, value = _b.value;
            attrBuffer.push(" " + name_3 + "=\"" + value + "\"");
        }
        buffer += attrBuffer.sort().join("") + ">";
        buffer += _super.prototype.toString.call(this);
        buffer += "</" + this.tagName + ">";
        return buffer;
    };
    return FakeElement;
}(FakeParentNode));
exports.FakeElement = FakeElement;
var FakeStyleElement = /** @class */ (function (_super) {
    __extends(FakeStyleElement, _super);
    function FakeStyleElement(tagName, ownerDocument) {
        var _this = _super.call(this, tagName, ownerDocument) || this;
        _this.sheet = new FakeCSSStyleSheet();
        return _this;
    }
    FakeStyleElement.prototype.childrenToString = function () {
        return this.sheet.toString();
    };
    return FakeStyleElement;
}(FakeElement));
exports.FakeStyleElement = FakeStyleElement;
var FakeTextNode = /** @class */ (function (_super) {
    __extends(FakeTextNode, _super);
    function FakeTextNode(nodeValue, ownerDocument) {
        var _this = _super.call(this, ownerDocument) || this;
        _this.nodeValue = nodeValue;
        _this.nodeType = 3;
        return _this;
    }
    FakeTextNode.prototype.toString = function () {
        return this.nodeValue.trim();
    };
    return FakeTextNode;
}(FakeBaseNode));
exports.FakeTextNode = FakeTextNode;
var FakeComment = /** @class */ (function (_super) {
    __extends(FakeComment, _super);
    function FakeComment(text, ownerDocument) {
        var _this = _super.call(this, ownerDocument) || this;
        _this.text = text;
        _this.nodeType = 8;
        return _this;
    }
    FakeComment.prototype.toString = function () {
        return "<!--" + this.text.trim() + "-->";
    };
    return FakeComment;
}(FakeBaseNode));
exports.FakeComment = FakeComment;
var FakeCSSObject = /** @class */ (function () {
    function FakeCSSObject() {
    }
    return FakeCSSObject;
}());
var FakeCSSGroupingRule = /** @class */ (function (_super) {
    __extends(FakeCSSGroupingRule, _super);
    function FakeCSSGroupingRule(cssRules) {
        if (cssRules === void 0) { cssRules = []; }
        var _this = _super.call(this) || this;
        _this.cssRules = cssRules.slice();
        return _this;
    }
    FakeCSSGroupingRule.prototype.insertRule = function (ruleSource, index) {
        if (index === void 0) { index = Number.MAX_SAFE_INTEGER; }
        var rule = parseCSSRule(ruleSource);
        this._linkRule(rule);
        this.cssRules.splice(index, 0, rule);
    };
    FakeCSSGroupingRule.prototype.deleteRule = function (index) {
        this.cssRules.splice(index, 1);
    };
    FakeCSSGroupingRule.prototype._linkRule = function (rule) {
        rule.parentRule = this;
    };
    FakeCSSGroupingRule.prototype.toString = function () {
        return this.cssRules.join(" ");
    };
    return FakeCSSGroupingRule;
}(FakeCSSObject));
var parseCSSRule = function (source) {
    if (/@\w+\s+.*?{/.test(source)) {
        var _a = source.match(/@(\w+)\s+(.*?){/), match = _a[0], name_4 = _a[1], params = _a[2];
        if (name_4 === "media") {
            return new FakeCSSMediaRule(params, parseDeclarationBlock(source));
        }
        else if (name_4 === "keyframes") {
            return new FakeCSSKeyframesRule(params, parseDeclarationBlock(source));
        }
        else {
            throw new Error("Cannot create " + name_4 + " at rule for now.");
        }
    }
    else {
        var _b = source.match(/(.*?){/), match = _b[0], selectorText = _b[1];
        return new FakeCSSStyleRule(selectorText, parseStyleDeclaration(source));
    }
};
var parseDeclarationBlock = function (source, factory) {
    if (factory === void 0) { factory = parseCSSRule; }
    return (getInnerBlock(source).match(/.*?{[\s\S]*?}/g) || []).map(factory);
};
var parseStyleDeclaration = function (source) {
    var style = new FakeCSSStyle();
    var inner = getInnerBlock(source);
    for (var _i = 0, _a = inner.split(";"); _i < _a.length; _i++) {
        var property = _a[_i];
        var _b = property.trim().split(":"), name_5 = _b[0], value = _b[1];
        if (name_5.trim()) {
            style[name_5.trim()] = value.trim();
        }
    }
    return style;
};
var getInnerBlock = function (source) {
    source = source.substr(source.indexOf("{") + 1);
    source = source.substr(0, source.lastIndexOf("}"));
    return source;
};
var FakeCSSMediaRule = /** @class */ (function (_super) {
    __extends(FakeCSSMediaRule, _super);
    function FakeCSSMediaRule(conditionText, cssRules) {
        if (cssRules === void 0) { cssRules = []; }
        var _this = _super.call(this, cssRules) || this;
        _this.conditionText = conditionText;
        _this.type = 4;
        return _this;
    }
    FakeCSSMediaRule.prototype.toString = function () {
        return "@media " + this.conditionText.trim() + " { " + _super.prototype.toString.call(this) + " }";
    };
    return FakeCSSMediaRule;
}(FakeCSSGroupingRule));
exports.FakeCSSMediaRule = FakeCSSMediaRule;
var FakeCSSKeyframesRule = /** @class */ (function (_super) {
    __extends(FakeCSSKeyframesRule, _super);
    function FakeCSSKeyframesRule(name, cssRules) {
        if (cssRules === void 0) { cssRules = []; }
        var _this = _super.call(this, cssRules) || this;
        _this.name = name;
        _this.type = 7;
        return _this;
    }
    FakeCSSKeyframesRule.prototype.toString = function () {
        return "@keyframes " + this.name.trim() + " { " + _super.prototype.toString.call(this) + " }";
    };
    return FakeCSSKeyframesRule;
}(FakeCSSGroupingRule));
exports.FakeCSSKeyframesRule = FakeCSSKeyframesRule;
var FakeCSSStyleRule = /** @class */ (function (_super) {
    __extends(FakeCSSStyleRule, _super);
    function FakeCSSStyleRule(selectorText, style) {
        var _this = _super.call(this) || this;
        _this.selectorText = selectorText;
        _this.style = style;
        return _this;
    }
    FakeCSSStyleRule.prototype.toString = function () {
        return this.selectorText.trim() + " { " + this.style.toString() + " }";
    };
    return FakeCSSStyleRule;
}(FakeCSSObject));
exports.FakeCSSStyleRule = FakeCSSStyleRule;
var FakeCSSStyle = /** @class */ (function (_super) {
    __extends(FakeCSSStyle, _super);
    function FakeCSSStyle() {
        return _super.call(this) || this;
    }
    FakeCSSStyle.prototype.removeProperty = function (name) {
        delete this[name];
    };
    FakeCSSStyle.prototype.setProperty = function (name, value) {
        this[name] = value;
    };
    FakeCSSStyle.prototype.toString = function () {
        var buffer = [];
        for (var key in this) {
            var value = this[key];
            if (this.hasOwnProperty(key)) {
                buffer.push(key + ": " + value.trim());
            }
        }
        return buffer.sort().join(";");
    };
    return FakeCSSStyle;
}(FakeCSSObject));
exports.FakeCSSStyle = FakeCSSStyle;
var FakeCSSStyleSheet = /** @class */ (function (_super) {
    __extends(FakeCSSStyleSheet, _super);
    function FakeCSSStyleSheet() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FakeCSSStyleSheet.prototype._linkRule = function (child) {
        _super.prototype._linkRule.call(this, child);
        child.parentStyleSheet = this;
    };
    return FakeCSSStyleSheet;
}(FakeCSSGroupingRule));
exports.FakeCSSStyleSheet = FakeCSSStyleSheet;
var FakeDocument = /** @class */ (function () {
    function FakeDocument() {
    }
    FakeDocument.prototype.createElement = function (tagName) {
        switch (tagName) {
            case "style": return new FakeStyleElement(tagName, this);
            default: return new FakeElement(tagName, this);
        }
    };
    FakeDocument.prototype.createTextNode = function (nodeValue) {
        return new FakeTextNode(nodeValue, this);
    };
    FakeDocument.prototype.createComment = function (nodeValue) {
        return new FakeComment(nodeValue, this);
    };
    FakeDocument.prototype.createDocumentFragment = function () {
        return new FakeDocumentFragment(this);
    };
    return FakeDocument;
}());
exports.FakeDocument = FakeDocument;
;
var CHARS = "abcdefghijkl".split("");
function generateRandomText(maxLength) {
    if (maxLength === void 0) { maxLength = 5; }
    return lodash_1.sampleSize(CHARS, lodash_1.random(1, maxLength)).join("");
}
function generateRandomChar() {
    return lodash_1.sample(CHARS);
}
exports.generateRandomStyleSheet = function (maxRules, maxDeclarations) {
    if (maxRules === void 0) { maxRules = 10; }
    if (maxDeclarations === void 0) { maxDeclarations = 20; }
    function createKeyFramesRule() {
        return " @keyframes " + generateRandomChar() + " {" +
            Array.from({ length: lodash_1.random(1, maxRules) }).map(function (v, i) { return Math.round(Math.random() * 100); }).sort().map(function (v) {
                return createKeyframeRule(v);
            }).join(" ") +
            "}";
    }
    function createKeyframeRule(perc) {
        return " " + perc + "% {" +
            Array.from({ length: lodash_1.random(1, maxDeclarations) }).map(function (v) {
                return " " + generateRandomChar() + ": " + generateRandomText(2) + ";";
            }).join("") +
            "}";
    }
    function createStyleRule() {
        return " ." + generateRandomChar() + " {" +
            Array.from({ length: lodash_1.random(1, maxDeclarations) }).map(function (v) {
                return " " + generateRandomChar() + ": " + generateRandomText(2) + ";";
            }).join("") +
            "}";
    }
    function createMediaRule() {
        return " @media " + generateRandomChar() + " {" +
            Array.from({ length: lodash_1.random(1, maxRules) }).map(function (v) {
                return lodash_1.sample([createStyleRule, createKeyFramesRule])();
            }).join(" ") +
            "}";
    }
    var randomStyleSheet = Array
        .from({ length: lodash_1.random(1, maxRules) })
        .map(function (v) { return lodash_1.sample([createStyleRule, createMediaRule, createKeyFramesRule])(); }).join(" ");
    return randomStyleSheet;
};
exports.generateRandomComponents = function (maxComponents, maxAttributes, maxSlots, maxNodeDepth, maxChildNodes, maxStyleRules, maxStyleDeclarations) {
    if (maxComponents === void 0) { maxComponents = 4; }
    if (maxAttributes === void 0) { maxAttributes = 5; }
    if (maxSlots === void 0) { maxSlots = 3; }
    if (maxNodeDepth === void 0) { maxNodeDepth = 2; }
    if (maxChildNodes === void 0) { maxChildNodes = 4; }
    if (maxStyleRules === void 0) { maxStyleRules = 4; }
    if (maxStyleDeclarations === void 0) { maxStyleDeclarations = 4; }
    var components = [];
    function createComponent(v, i) {
        var id = "component" + i;
        var slotNames = Array.from({ length: lodash_1.random(0, maxSlots) }).map(function (v, i) { return "" + generateRandomChar() + i; });
        var info = {
            id: id,
            slotNames: slotNames
        };
        var buffer = "<component id=\"" + id + "\">" +
            createStyle() +
            createTemplate(info) +
            createPreview(info) +
            "</component>";
        components.push(info);
        return buffer;
    }
    function createStyle() {
        if (!maxStyleRules || Math.random() < 0.2) {
            return "";
        }
        return "<style>" +
            exports.generateRandomStyleSheet(maxStyleRules, maxStyleDeclarations) +
            "</style>";
    }
    function createTemplate(_a) {
        var id = _a.id, slotNames = _a.slotNames;
        return "<template>" +
            Array.from({ length: lodash_1.random(1, 10) }).map(function (v, i) {
                return generateRandomElement(0, slotNames[lodash_1.random(0, slotNames.length - 1)]);
            }).join("") +
            "</template>";
    }
    function createPreview(_a) {
        var id = _a.id, slotNames = _a.slotNames;
        return "<preview name=\"main\">" +
            createComponentElement({ id: id, slotNames: slotNames }) +
            "</preview>";
    }
    function createComponentElement(_a, depth, unclaimedSlotName) {
        var id = _a.id, slotNames = _a.slotNames;
        if (depth === void 0) { depth = 0; }
        if (unclaimedSlotName === void 0) { unclaimedSlotName = null; }
        return "<" + id + " " + generateRandomAttributes() + ">" +
            slotNames.slice(0, lodash_1.random(0, depth > maxNodeDepth ? 0 : slotNames.length)).map(function (slotName) {
                var tagName = generateRandomChar();
                "<" + tagName + " slot=\"" + slotName + "\">" +
                    generateRandomElement(depth + 1, unclaimedSlotName);
                "</" + tagName + ">";
            }).join("") +
            ("</" + id + ">");
    }
    function generateRandomComponentElement(depth, unclaimedSlotName) {
        if (depth === void 0) { depth = 0; }
        if (unclaimedSlotName === void 0) { unclaimedSlotName = null; }
        return components.length ? createComponentElement(lodash_1.sample(components), depth, unclaimedSlotName) : generateRandomElement(depth, unclaimedSlotName);
    }
    function generateRandomElement(depth, unclaimedSlotName) {
        if (depth === void 0) { depth = 0; }
        if (unclaimedSlotName === void 0) { unclaimedSlotName = null; }
        var claimSlotName = unclaimedSlotName && Math.random() < 0.5;
        if (!claimSlotName && Math.random() < 0.5) {
            return generateRandomComponentElement(depth, unclaimedSlotName);
        }
        var tagName = claimSlotName ? "slot" : generateRandomChar();
        return "<" + tagName + " " + (claimSlotName ? "name=\"" + unclaimedSlotName + "\"" : generateRandomAttributes()) + ">" +
            Array.from({ length: lodash_1.random(0, depth < maxNodeDepth ? maxChildNodes : 0) }).map(function () { return generateRandomNode(depth + 1, unclaimedSlotName); }).join("") +
            ("</" + tagName + ">");
    }
    function generateRandomNode(depth, unclaimedSlotName) {
        if (depth === void 0) { depth = 0; }
        return lodash_1.sample([
            generateRandomElement,
            generateRandomTextNode
        ])(depth, unclaimedSlotName);
    }
    function generateRandomTextNode() {
        return "" + generateRandomText(5);
    }
    function generateRandomAttributes() {
        return Array.from({ length: lodash_1.random(1, maxAttributes) }).map(function () {
            return generateRandomChar() + "=\"" + generateRandomText(2) + "\"";
        }).join(" ");
    }
    var randomComponents = Array
        .from({ length: lodash_1.random(1, maxComponents) })
        .map(createComponent).join(" ");
    return randomComponents;
};
//# sourceMappingURL=utils.js.map