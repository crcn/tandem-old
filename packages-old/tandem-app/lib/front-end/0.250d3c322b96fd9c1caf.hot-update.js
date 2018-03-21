webpackHotUpdate(0,{

/***/ "../slim-dom/lib/dom-renderer.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var state_1 = __webpack_require__("../slim-dom/lib/state.js");
var slim_dom_1 = __webpack_require__("../slim-dom/index.js");
exports.renderDOM = function (node, mount) {
    var map = {};
    mount.appendChild(createNode(node, mount.ownerDocument, map));
    return map;
};
var createNode = function (node, document, map) {
    switch (node.type) {
        case state_1.SlimVMObjectType.TEXT: {
            return document.createTextNode(node.value);
        }
        case state_1.SlimVMObjectType.ELEMENT: {
            var _a = node, tagName = _a.tagName, id = _a.id, shadow = _a.shadow, childNodes = _a.childNodes, attributes = _a.attributes;
            var ret = map[id] = document.createElement(tagName);
            if (shadow) {
                ret.attachShadow({ mode: "open" }).appendChild(createNode(shadow, document, map));
            }
            if (tagName === "style") {
                renderStyle(node.sheet, ret);
            }
            for (var i = 0, length_1 = attributes.length; i < length_1; i++) {
                var attribute = attributes[i];
                if (attribute.name === "style") {
                    if (typeof attribute.value === "object") {
                        Object.assign(ret[attribute.name], attribute.value);
                    }
                }
                else if (attribute.value) {
                    ret.setAttribute(attribute.name, attribute.value);
                }
            }
            for (var i = 0, length_2 = childNodes.length; i < length_2; i++) {
                ret.appendChild(createNode(childNodes[i], document, map));
            }
            return ret;
        }
        case state_1.SlimVMObjectType.DOCUMENT_FRAGMENT: {
            var childNodes = node.childNodes;
            var fragment = document.createDocumentFragment();
            for (var i = 0, length_3 = childNodes.length; i < length_3; i++) {
                fragment.appendChild(createNode(childNodes[i], document, map));
            }
            return fragment;
        }
        default: {
            console.warn("Unable to render node");
            return document.createTextNode("");
        }
    }
};
var renderStyle = function (sheet, element) {
    var j = 0;
    var buffer = "";
    for (var i = 0, length_4 = sheet.rules.length; i < length_4; i++) {
        var rule = sheet.rules[i];
        var ruleText = stringifyRule(sheet.rules[i]);
        if (!ruleText) {
            continue;
        }
        buffer += ruleText + "\n";
    }
    element.textContent = buffer;
};
// TODO - move to util file
var stringifyRule = function (rule) {
    switch (rule.type) {
        case state_1.SlimVMObjectType.STYLE_RULE: {
            var _a = rule, selectorText = _a.selectorText, style = _a.style;
            var buffer = selectorText + " {";
            for (var key in style) {
                buffer += key + ": " + style[key] + ";";
            }
            return buffer + " }";
        }
        case state_1.SlimVMObjectType.MEDIA_RULE: {
            var _b = rule, conditionText = _b.conditionText, rules = _b.rules;
            return "@media " + conditionText + " { " + rules.map(stringifyRule) + " }";
        }
    }
};
// do NOT memoize this since computed information may change over time. 
exports.computedDOMInfo = function (map) {
    var computedInfo = {};
    for (var nodeId in map) {
        var element = map[nodeId];
        // TODO - memoize computed info here
        computedInfo[nodeId] = {
            bounds: element.getBoundingClientRect(),
            style: element.ownerDocument.defaultView.getComputedStyle(element)
        };
    }
    return computedInfo;
};
// TODO
exports.patchDOM = function (diffs, map, container) {
    console.log("PAT");
    for (var i = 0, length_5 = diffs.length; i < length_5; i++) {
        var diff = diffs[i];
        var target = map[diff.target];
        switch (diff.type) {
            case slim_dom_1.SET_TEXT_NODE_VALUE: {
                console.log("VN", target);
            }
        }
    }
    return map;
};
//# sourceMappingURL=dom-renderer.js.map

/***/ })

})