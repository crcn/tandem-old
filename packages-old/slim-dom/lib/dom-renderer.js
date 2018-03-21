"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var state_1 = require("./state");
var utils_1 = require("./utils");
var diff_patch_1 = require("./diff-patch");
exports.renderDOM = function (node, mount, options) {
    if (options === void 0) { options = {}; }
    var map = {};
    mount.appendChild(createNode(node, mount.ownerDocument, map, options));
    return map;
};
var createNode = function (node, document, map, options) {
    switch (node.type) {
        case state_1.SlimVMObjectType.TEXT: {
            return map[node.id] = document.createTextNode(node.value);
        }
        case state_1.SlimVMObjectType.ELEMENT: {
            var _a = node, tagName = _a.tagName, id = _a.id, shadow = _a.shadow, childNodes = _a.childNodes, attributes = _a.attributes;
            var ret = map[id] = document.createElement(tagName);
            if (shadow) {
                ret.attachShadow({ mode: "open" }).appendChild(createNode(shadow, document, map, options));
            }
            if (tagName === "style") {
                renderStyle(node.sheet, ret, options);
            }
            for (var i = 0, length_1 = attributes.length; i < length_1; i++) {
                var attribute = attributes[i];
                if (attribute.name === "style") {
                    if (typeof attribute.value === "object") {
                        Object.assign(ret[attribute.name], attribute.value);
                    }
                }
                else if (typeof attribute.value !== "object") {
                    ret.setAttribute(attribute.name, attribute.value);
                }
            }
            for (var i = 0, length_2 = childNodes.length; i < length_2; i++) {
                ret.appendChild(createNode(childNodes[i], document, map, options));
            }
            return ret;
        }
        case state_1.SlimVMObjectType.DOCUMENT_FRAGMENT: {
            var childNodes = node.childNodes;
            var fragment = document.createDocumentFragment();
            for (var i = 0, length_3 = childNodes.length; i < length_3; i++) {
                fragment.appendChild(createNode(childNodes[i], document, map, options));
            }
            return fragment;
        }
        default: {
            console.warn("Unable to render node");
            return document.createTextNode("");
        }
    }
};
var renderStyle = function (sheet, element, options) {
    element.textContent = stringifyStyleSheet(sheet, options);
};
var stringifyStyleSheet = function (sheet, options) {
    var buffer = "";
    for (var i = 0, length_4 = sheet.rules.length; i < length_4; i++) {
        var rule = sheet.rules[i];
        var ruleText = stringifyRule(sheet.rules[i], options);
        if (!ruleText) {
            continue;
        }
        buffer += ruleText + "\n";
    }
    return buffer;
};
// TODO - move to util file
var stringifyRule = function (rule, options) {
    switch (rule.type) {
        case state_1.SlimVMObjectType.STYLE_RULE: {
            var _a = rule, selectorText = _a.selectorText, style = _a.style;
            return selectorText + " { " + stringifyStyle(style) + " }";
        }
        case state_1.SlimVMObjectType.FONT_FACE_RULE: {
            var style = rule.style;
            return "@font-face { " + stringifyStyle(style) + " }";
        }
        case state_1.SlimVMObjectType.AT_RULE: {
            var _b = rule, name_1 = _b.name, params = _b.params, rules = _b.rules;
            return /^(charset|import)$/.test(name_1) ? "@" + name_1 + " \"" + params + "\";" : "@" + name_1 + " " + params + " { " + rules.map(function (rule) { return stringifyRule(rule, options); }).join(" ") + " }";
        }
    }
};
var stringifyStyle = function (style) {
    var buffer = "";
    for (var key in style) {
        // TODO - change to isValidCSSKey
        if (key === "id")
            continue;
        buffer += key + ": " + style[key] + ";";
    }
    return buffer;
};
// do NOT memoize this since computed information may change over time. 
exports.computedDOMInfo = function (map) {
    var computedInfo = {};
    for (var nodeId in map) {
        var node = map[nodeId];
        if (!node) {
            continue;
        }
        if (node.nodeName.charAt(0) === "#") {
            continue;
        }
        var element = node;
        if (!element.ownerDocument.defaultView) {
            console.warn("Element is not attached to the document body.");
            return {};
        }
        // TODO - memoize computed info here
        computedInfo[nodeId] = {
            bounds: element.getBoundingClientRect(),
            style: element.ownerDocument.defaultView.getComputedStyle(element)
        };
    }
    return computedInfo;
};
var getDOMNodeFromPath = function (path, root) {
    var current = root;
    for (var i = 0, length_5 = path.length; i < length_5; i++) {
        var part = path[i];
        if (part === "shadow") {
            current = current.shadowRoot;
        }
        else {
            current = current.childNodes[part];
        }
        if (!current) {
            return null;
        }
    }
    return current;
};
var getNativeNodePath = function (current, root) {
    var path = [];
    while (current !== root) {
        if (current.host) {
            path.unshift("shadow");
        }
        else {
            path.unshift(Array.prototype.indexOf.call(current.parentNode.childNodes, current));
        }
        current = current.host || current.parentNode;
    }
    return path;
};
// TODO
exports.patchDOM = function (diffs, slimRoot, map, root, options) {
    if (options === void 0) { options = {}; }
    var resetStyleMap = [];
    for (var i = 0, length_6 = diffs.length; i < length_6; i++) {
        var mutation = diffs[i];
        var target = getDOMNodeFromPath(mutation.target, root);
        switch (mutation.type) {
            case diff_patch_1.SET_TEXT_NODE_VALUE: {
                target.nodeValue = mutation.newValue;
                break;
            }
            // case SET_ATTRIBUTE_VALUE: {
            //   const { name, newValue } = mutation as SetPropertyMutation<any>;
            //   if (!newValue) {
            //     (target as HTMLElement).removeAttribute(name);
            //   } else {
            //     (target as HTMLElement).setAttribute(name, newValue);
            //   }
            //   break;
            // }
            case diff_patch_1.REMOVE_CHILD_NODE: {
                var _a = mutation, child = _a.child, index = _a.index;
                map = __assign({}, map, (_b = {}, _b[child] = undefined, _b));
                target.removeChild(target.childNodes[index]);
                break;
            }
            case diff_patch_1.INSERT_CHILD_NODE: {
                var _c = mutation, child = _c.child, index = _c.index;
                var childMap = {};
                var nativeChild = createNode(child, root.ownerDocument, childMap, options);
                if (index >= target.childNodes.length) {
                    target.appendChild(nativeChild);
                }
                else {
                    target.insertBefore(nativeChild, target.childNodes[index]);
                }
                map = __assign({}, map, childMap);
                break;
            }
            case diff_patch_1.MOVE_CHILD_NODE: {
                var _d = mutation, index = _d.index, oldIndex = _d.oldIndex;
                var child = target.childNodes[oldIndex];
                target.removeChild(child);
                if (index >= target.childNodes.length) {
                    target.appendChild(child);
                }
                else {
                    target.insertBefore(child, target.childNodes[index]);
                }
                break;
            }
            case diff_patch_1.CSS_INSERT_RULE:
            case diff_patch_1.CSS_DELETE_RULE:
            case diff_patch_1.CSS_MOVE_RULE:
            case diff_patch_1.CSS_SET_SELECTOR_TEXT:
            case diff_patch_1.CSS_SET_STYLE_PROPERTY: {
                var stylePath = mutation.target.slice(0, mutation.target.indexOf("sheet"));
                var nativeStyle = getDOMNodeFromPath(stylePath, root);
                if (resetStyleMap.indexOf(nativeStyle) === -1) {
                    resetStyleMap.push(nativeStyle);
                }
                break;
            }
        }
    }
    for (var _i = 0, resetStyleMap_1 = resetStyleMap; _i < resetStyleMap_1.length; _i++) {
        var nativeStyle = resetStyleMap_1[_i];
        var slimStyle = utils_1.getVMObjectFromPath(getNativeNodePath(nativeStyle, root), slimRoot);
        var sheet = nativeStyle.sheet;
        var rules = slimStyle.sheet.rules;
        while (sheet.rules.length) {
            sheet.deleteRule(0);
        }
        for (var i = 0, length_7 = rules.length; i < length_7; i++) {
            var synthRule = rules[i];
            var synthRuleText = stringifyRule(slimStyle.sheet.rules[i], options);
            try {
                sheet.insertRule(synthRuleText, i);
            }
            catch (e) {
            }
        }
    }
    return map;
    var _b;
};
//# sourceMappingURL=dom-renderer.js.map