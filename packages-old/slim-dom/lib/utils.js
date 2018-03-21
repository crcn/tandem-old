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
var query_selector_1 = require("./query-selector");
var media_match_1 = require("./media-match");
var lodash_1 = require("lodash");
var constants_1 = require("./constants");
var crc32 = require("crc32");
var weak_memo_1 = require("./weak-memo");
exports.weakMemo = weak_memo_1.weakMemo;
var ID_TYPE_PAD = 2;
exports.pushChildNode = function (parent, child) { return (__assign({}, parent, { childNodes: parent.childNodes.concat([
        child
    ]) })); };
exports.removeChildNodeAt = function (parent, index) { return (__assign({}, parent, { childNodes: parent.childNodes.slice(0, index).concat(parent.childNodes.slice(index + 1)) })); };
exports.insertChildNode = function (parent, child, index) {
    if (index === void 0) { index = Number.MAX_SAFE_INTEGER; }
    return (__assign({}, parent, { childNodes: parent.childNodes.slice(0, index).concat([
            child
        ], parent.childNodes.slice(index)) }));
};
exports.moveChildNode = function (parent, index, newIndex) {
    var childNodes = parent.childNodes.slice();
    var child = childNodes[index];
    childNodes.splice(index, 1);
    childNodes.splice(newIndex, 0, child);
    return __assign({}, parent, { childNodes: childNodes });
};
exports.insertCSSRule = function (parent, child, index) {
    if (index === void 0) { index = Number.MAX_SAFE_INTEGER; }
    return (__assign({}, parent, { rules: parent.rules.slice(0, index).concat([
            child
        ], parent.rules.slice(index)) }));
};
exports.removeCSSRuleAt = function (parent, index) { return (__assign({}, parent, { rules: parent.rules.slice(0, index).concat(parent.rules.slice(index + 1)) })); };
exports.moveCSSRule = function (parent, index, newIndex) {
    var rules = parent.rules.slice();
    var child = rules[index];
    rules.splice(index, 1);
    rules.splice(newIndex, 0, child);
    return __assign({}, parent, { rules: rules });
};
exports.setCSSSelectorText = function (rule, selectorText) { return (__assign({}, rule, { selectorText: selectorText })); };
exports.setCSSAtRuleSetParams = function (rule, params) { return (__assign({}, rule, { params: params })); };
exports.setCSSStyleProperty = function (rule, index, name, value) {
    var newStyle = rule.style.slice();
    var prop = { name: name, value: value };
    if (index > newStyle.length) {
        newStyle.push(prop);
    }
    else {
        newStyle[index] = prop;
    }
    return __assign({}, rule, { style: newStyle });
};
exports.insertCSSStyleProperty = function (rule, index, name, value) {
    var newStyle = rule.style.slice();
    newStyle.splice(index, 0, { name: name, value: value });
    return __assign({}, rule, { style: newStyle });
};
exports.removeCSSStyleProperty = function (rule, index) {
    var newStyle = rule.style.slice();
    newStyle.splice(index, 1);
    return __assign({}, rule, { style: newStyle });
};
exports.moveCSSStyleProperty = function (rule, oldIndex, newIndex) {
    var newStyle = rule.style.slice();
    var prop = newStyle[oldIndex];
    newStyle.splice(oldIndex, 1);
    newStyle.splice(newIndex, 0, prop);
    return __assign({}, rule, { style: newStyle });
};
exports.parseStyle = weak_memo_1.weakMemo(function (styleStr) {
    var style = [];
    styleStr.split(";").forEach(function (part) {
        var _a = part.split(":"), name = _a[0], rest = _a.slice(1);
        if (!name)
            return;
        style.push({
            name: lodash_1.camelCase(name.trim()),
            value: rest.join(":").trim()
        });
    });
    return style;
});
exports.stringifyStyle = function (style) {
    var buffer = "";
    if (Array.isArray(style)) {
        for (var _i = 0, style_1 = style; _i < style_1.length; _i++) {
            var _a = style_1[_i], name_1 = _a.name, value = _a.value;
            buffer += exports.cssPropNameToKebabCase(name_1) + ": " + value + ";";
        }
    }
    else {
        for (var _b = 0, style_2 = style; _b < style_2.length; _b++) {
            var key = style_2[_b];
            buffer += exports.cssPropNameToKebabCase(key) + ": " + style[key] + ";";
        }
    }
    return buffer;
};
exports.stringifyNode = weak_memo_1.weakMemo(function (node, includeShadow) {
    switch (node.type) {
        case state_1.SlimVMObjectType.TEXT: {
            var text = node;
            return text.value;
        }
        case state_1.SlimVMObjectType.ELEMENT: {
            var el = node;
            var buffer = "<" + el.tagName + " ";
            for (var i = 0, length_1 = el.attributes.length; i < length_1; i++) {
                var attr = el.attributes[i];
                buffer += " " + attr.name + "=" + JSON.stringify(attr.value);
            }
            buffer += ">";
            if (includeShadow && el.shadow) {
                buffer += "<#shadow>";
                buffer += exports.stringifyNode(el.shadow, includeShadow);
                buffer += "</#shadow>";
            }
            if (el.tagName === "style") {
                buffer += exports.stringifyStyleObject(el.sheet);
            }
            else {
                for (var i = 0, length_2 = el.childNodes.length; i < length_2; i++) {
                    buffer += exports.stringifyNode(el.childNodes[i], includeShadow);
                }
            }
            buffer += "</" + el.tagName + ">";
            return buffer;
        }
        case state_1.SlimVMObjectType.DOCUMENT_FRAGMENT:
        case state_1.SlimVMObjectType.DOCUMENT: {
            var el = node;
            var buffer = "";
            for (var i = 0, length_3 = el.childNodes.length; i < length_3; i++) {
                buffer += exports.stringifyNode(el.childNodes[i], includeShadow);
            }
            return buffer;
        }
    }
});
exports.stringifyStyleObject = weak_memo_1.weakMemo(function (styleObject) {
    switch (styleObject.type) {
        case state_1.SlimVMObjectType.STYLE_SHEET: {
            var sheet = styleObject;
            return sheet.rules.map(exports.stringifyStyleObject);
        }
        case state_1.SlimVMObjectType.STYLE_RULE: {
            var _a = styleObject, selectorText = _a.selectorText, style = _a.style;
            return selectorText + " { " + exports.stringifyStyle(style) + " }";
        }
        case state_1.SlimVMObjectType.AT_RULE: {
            var _b = styleObject, name_2 = _b.name, params = _b.params, rules = _b.rules;
            return "@" + name_2 + " " + params.trim() + " { " + rules.map(exports.stringifyStyleObject) + " }";
        }
        case state_1.SlimVMObjectType.FONT_FACE_RULE: {
            var style = styleObject.style;
            return "@font-face { " + exports.stringifyStyle(style) + " }";
        }
        default: {
            console.error("cannot stringify ", styleObject);
            // throw new Error(`Cannot stringify style rule type ${styleObject.type}.`);
        }
    }
});
exports.getAttribute = function (name, element) {
    var attributes = element.attributes;
    for (var i = attributes.length; i--;) {
        var attribute = attributes[i];
        if (attribute.name === name) {
            return attribute;
        }
    }
    return null;
};
exports.hasAttribute = function (name, element) {
    return exports.getAttribute(name, element) != null;
};
exports.getAttributeValue = function (name, element) {
    var attribute = exports.getAttribute(name, element);
    return attribute && attribute.value;
};
var MAX_ANCESTOR_COUNT = 1000 * 10;
exports.getNodeAncestors = weak_memo_1.weakMemo(function (value, root, followSlots) {
    if (followSlots === void 0) { followSlots = false; }
    var objects = exports.flattenObjects(root);
    var child = objects[value.id];
    var parent = objects[child.parentId];
    var ancestors = [];
    var i = 0;
    while (parent) {
        if (followSlots && parent.value.shadow) {
            var parentElement = parent.value;
            var slot = exports.getSlot(exports.getNodeSlotName(child.value), parentElement);
            if (slot) {
                ancestors.push.apply(ancestors, exports.getNodeAncestors(slot, parentElement.shadow));
            }
        }
        ancestors.push(parent.value);
        if (!parent.parentId) {
            break;
        }
        child = parent;
        parent = objects[parent.parentId];
        if (i++ > MAX_ANCESTOR_COUNT) {
            throw new Error("Infinite loop detected");
        }
    }
    return ancestors;
});
exports.getVMObjectPath = weak_memo_1.weakMemo(function (value, root) {
    var objects = exports.flattenObjects(root);
    var current = objects[value.id];
    var path = [];
    while (current && current.parentId) {
        var parentInfo = objects[current.parentId];
        // TODO - check if css rules
        if (parentInfo.value.shadow === current.value) {
            path.unshift("shadow");
        }
        else if (parentInfo.value.sheet === current.value) {
            path.unshift("sheet");
        }
        else if (parentInfo.value.childNodes) {
            path.unshift(parentInfo.value.childNodes.indexOf(current.value));
        }
        else if (parentInfo.value.rules) {
            path.unshift(parentInfo.value.rules.indexOf(current.value));
        }
        current = parentInfo;
    }
    return path;
});
// not memoized because this isn't a very expensive op
exports.getVMObjectFromPath = weak_memo_1.weakMemo(function (path, root) {
    var current = root;
    for (var i = 0, length_4 = path.length; i < length_4; i++) {
        var part = path[i];
        if (part === "shadow") {
            current = current.shadow;
        }
        else if (part === "sheet") {
            current = current.sheet;
        }
        else if (current.childNodes) {
            current = current.childNodes[part];
        }
        else if (current.rules) {
            current = current.rules[part];
        }
        if (!current) {
            return null;
        }
    }
    return current;
});
exports.getVmObjectSourceUris = weak_memo_1.weakMemo(function (node) {
    return lodash_1.uniq(getNestedSourceUris(node));
});
var getNestedSourceUris = weak_memo_1.weakMemo(function (node) {
    var sources = [];
    if (node.source && node.source.uri) {
        sources.push(node.source.uri);
    }
    if (node.type === state_1.SlimVMObjectType.ELEMENT) {
        var element = node;
        if (element.shadow) {
            sources.push.apply(sources, getNestedSourceUris(element.shadow));
        }
        if (element.tagName === "style") {
            sources.push.apply(sources, getNestedSourceUris(element.sheet));
        }
    }
    if (node.type === state_1.SlimVMObjectType.STYLE_SHEET || node.type === state_1.SlimVMObjectType.AT_RULE) {
        var grouping = node;
        if (node.type === state_1.SlimVMObjectType.AT_RULE) {
            var _a = node, name_3 = _a.name, params = _a.params;
            if (name_3 === "import") {
                sources.push(params);
            }
        }
        for (var i = 0, length_5 = grouping.rules.length; i < length_5; i++) {
            sources.push.apply(sources, getNestedSourceUris(grouping.rules[i]));
        }
    }
    if (node.type === state_1.SlimVMObjectType.ELEMENT || node.type === state_1.SlimVMObjectType.DOCUMENT_FRAGMENT) {
        sources.push.apply(sources, lodash_1.flatten(node.childNodes.map(function (child) { return getNestedSourceUris(child); })));
    }
    return sources;
});
exports.getNestedObjectById = weak_memo_1.weakMemo(function (id, root) {
    var ref = exports.flattenObjects(root);
    return ref[id] && ref[id].value;
});
exports.flattenObjects = weak_memo_1.weakMemo(function (value, parentId) {
    return Object.assign.apply(Object, [{}].concat(layoutObjects(value, parentId)));
});
var layoutObjects = weak_memo_1.weakMemo(function (value, parentId) {
    switch (value.type) {
        case state_1.SlimVMObjectType.TEXT: {
            var node = value;
            return [
                (_a = {},
                    _a[node.id] = {
                        parentId: parentId,
                        value: value
                    },
                    _a)
            ];
        }
        case state_1.SlimVMObjectType.ELEMENT: {
            var element = value;
            var children = [];
            var base = (_b = {},
                _b[element.id] = {
                    parentId: parentId,
                    value: value
                },
                _b);
            var style = exports.getAttributeValue("style", element);
            if (element.tagName === "style") {
                children.push.apply(children, layoutCSSObjects(element.sheet, element.id));
            }
            else {
                if (element.shadow) {
                    children.push.apply(children, layoutObjects(element.shadow, element.id));
                }
                children.push.apply(children, layoutChildNodes(element.childNodes, element.id));
            }
            children.push(base);
            return children;
        }
        case state_1.SlimVMObjectType.DOCUMENT:
        case state_1.SlimVMObjectType.DOCUMENT_FRAGMENT: {
            return [
                (_c = {},
                    _c[value.id] = { parentId: parentId, value: value },
                    _c)
            ].concat(layoutChildNodes(value.childNodes, value.id));
        }
    }
    var _a, _b, _c;
});
var layoutCSSObjects = weak_memo_1.weakMemo(function (value, parentId) {
    var children = [];
    switch (value.type) {
        case state_1.SlimVMObjectType.AT_RULE:
        case state_1.SlimVMObjectType.STYLE_SHEET: {
            var grouping = value;
            return [
                (_a = {},
                    _a[grouping.id] = {
                        parentId: parentId,
                        value: value,
                    },
                    _a)
            ].concat(layoutCSSRules(grouping.rules, grouping.id));
        }
        case state_1.SlimVMObjectType.STYLE_RULE: {
            var rule = value;
            return [(_b = {},
                    _b[rule.id] = {
                        parentId: parentId,
                        value: value,
                    },
                    _b)];
        }
    }
    var _a, _b;
});
var layoutChildNodes = weak_memo_1.weakMemo(function (childNodes, parentId) {
    var children = [];
    for (var i = 0, length_6 = childNodes.length; i < length_6; i++) {
        children.push.apply(children, layoutObjects(childNodes[i], parentId));
    }
    return children;
});
var layoutCSSRules = weak_memo_1.weakMemo(function (rules, parentId) {
    var children = [];
    for (var i = 0, length_7 = rules.length; i < length_7; i++) {
        children.push.apply(children, layoutCSSObjects(rules[i], parentId));
    }
    return children;
});
exports.getDocumentChecksum = weak_memo_1.weakMemo(function (document) { return crc32(exports.stringifyNode(document, true)); });
exports.replaceNestedChild = function (current, path, child, index) {
    if (index === void 0) { index = 0; }
    var part = path[index];
    if (index === path.length) {
        return child;
    }
    if (part === "shadow") {
        return __assign({}, current, { shadow: exports.replaceNestedChild(current.shadow, path, child, index + 1) });
    }
    if (part === "sheet") {
        return __assign({}, current, { sheet: exports.replaceNestedChild(current.sheet, path, child, index + 1) });
    }
    if (current.childNodes) {
        var parentNode = current;
        return __assign({}, parentNode, { childNodes: parentNode.childNodes.slice(0, part).concat([
                exports.replaceNestedChild(parentNode.childNodes[part], path, child, index + 1)
            ], parentNode.childNodes.slice(part + 1)) });
    }
    else if (current.rules) {
        var parentRule = current;
        return __assign({}, parentRule, { rules: parentRule.rules.slice(0, part).concat([
                exports.replaceNestedChild(parentRule.rules[part], path, child, index + 1)
            ], parentRule.rules.slice(part + 1)) });
    }
};
exports.getStyleOwnerScopeInfo = function (ownerId, root) {
    var owner = exports.getNestedObjectById(ownerId, root);
    var path = exports.getVMObjectPath(owner, root);
    if (owner.type === state_1.SlimVMObjectType.STYLE_RULE) {
        var styleElement = getSheetStyleElement(path, root);
        return [
            owner.type,
            owner.selectorText,
            exports.getAttributeValue("scope", styleElement)
        ].concat(path.slice(path.indexOf("sheet")));
    }
    else {
        console.log(owner);
        console.error("Not implemented yet");
        return [];
    }
};
exports.getStyleOwnerFromScopeInfo = function (_a, window) {
    var type = _a[0], rest = _a.slice(1);
    if (type === state_1.SlimVMObjectType.STYLE_RULE) {
        var selectorText = rest[0], scope = rest[1], relPath = rest.slice(2);
        var styleElements = exports.getScopedStyleElements(scope, window);
        for (var _i = 0, styleElements_1 = styleElements; _i < styleElements_1.length; _i++) {
            var styleElement = styleElements_1[_i];
            var absPath = exports.getVMObjectPath(styleElement, window.document).concat(relPath);
            var owner = exports.getVMObjectFromPath(absPath, window.document);
            if (owner && owner.type === type && owner.selectorText === selectorText) {
                return owner;
            }
        }
    }
};
var getSheetStyleElement = function (path, root) {
    var index = path.indexOf("sheet");
    return index > -1 ? exports.getVMObjectFromPath(path.slice(0, index), root) : null;
};
exports.setTextNodeValue = function (target, newValue) { return (__assign({}, target, { value: newValue })); };
exports.setElementAttribute = function (target, name, value, index) {
    var attributes = [];
    var foundIndex = -1;
    for (var i = 0, length_8 = target.attributes.length; i < length_8; i++) {
        var attribute = target.attributes[i];
        if (attribute.name === name) {
            foundIndex = i;
            if (value) {
                attributes.push({ name: name, value: value });
            }
        }
        else {
            attributes.push(attribute);
        }
    }
    if (foundIndex === -1) {
        foundIndex = attributes.length;
        attributes.push({ name: name, value: value });
    }
    if (index != null && foundIndex !== index) {
        var attribute = attributes[foundIndex];
        attributes.splice(foundIndex, 1);
        attributes.splice(index, 0, attribute);
    }
    return __assign({}, target, { attributes: attributes });
};
exports.setElementAttributeAt = function (target, index, name, value) {
    var attributes = target.attributes.slice();
    attributes[index] = { name: name, value: value };
    return __assign({}, target, { attributes: attributes });
};
exports.removeElementAttributeAt = function (target, index) {
    var attributes = target.attributes.slice();
    attributes.splice(index, 1);
    return __assign({}, target, { attributes: attributes });
};
exports.insertElementAttributeAt = function (target, index, name, value) {
    var attributes = target.attributes.slice();
    attributes.splice(index, 0, { name: name, value: value });
    return __assign({}, target, { attributes: attributes });
};
exports.moveElementAttribute = function (target, index, newIndex) {
    var _a = target.attributes[index], name = _a.name, value = _a.value;
    target = exports.removeElementAttributeAt(target, index);
    return exports.insertElementAttributeAt(target, newIndex, name, value);
};
exports.getSyntheticWindowChild = weak_memo_1.weakMemo(function (nodeId, window) {
    return exports.getNestedObjectById(nodeId, window.document);
});
exports.getSlimNodeHost = weak_memo_1.weakMemo(function (node, root) {
    var path = exports.getVMObjectPath(node, root);
    var shadowIndex = path.lastIndexOf("shadow");
    return shadowIndex > -1 ? exports.getVMObjectFromPath(path.slice(0, shadowIndex), root) : null;
});
var getDocumentStyleSheets = weak_memo_1.weakMemo(function (document) {
    var allObjects = exports.flattenObjects(document);
    var styleSheets = [];
    for (var key in allObjects) {
        var value = allObjects[key].value;
        if (value.type === state_1.SlimVMObjectType.ELEMENT && value.tagName === "style" && !exports.getAttributeValue("scope", value)) {
            styleSheets.push(value.sheet);
        }
    }
    return styleSheets;
});
var getDocumentCSSRules = weak_memo_1.weakMemo(function (document) {
    var allRules = [];
    var styleSheets = getDocumentStyleSheets(document);
    for (var _i = 0, styleSheets_1 = styleSheets; _i < styleSheets_1.length; _i++) {
        var styleSheet = styleSheets_1[_i];
        for (var _a = 0, _b = styleSheet.rules; _a < _b.length; _a++) {
            var rule = _b[_a];
            if (rule.type === state_1.SlimVMObjectType.STYLE_RULE || rule.type == state_1.SlimVMObjectType.AT_RULE) {
                allRules.push(rule);
            }
        }
    }
    return allRules;
});
exports.isMediaRule = function (rule) { return rule.type == state_1.SlimVMObjectType.AT_RULE && rule.name === "media"; };
exports.getScopedStyleRules = weak_memo_1.weakMemo(function (tagName, window) {
    var allVMObjects = exports.flattenObjects(window.document);
    var scopedRules = [];
    var scopedStyleElements = exports.getScopedStyleElements(tagName, window);
    for (var _i = 0, scopedStyleElements_1 = scopedStyleElements; _i < scopedStyleElements_1.length; _i++) {
        var styleElement = scopedStyleElements_1[_i];
        for (var _a = 0, _b = styleElement.sheet.rules; _a < _b.length; _a++) {
            var rule = _b[_a];
            if (rule.type === state_1.SlimVMObjectType.STYLE_RULE || rule.type == state_1.SlimVMObjectType.AT_RULE) {
                scopedRules.push(rule);
            }
        }
    }
    return scopedRules;
});
exports.getScopedStyleElements = weak_memo_1.weakMemo(function (tagName, window) {
    var allVMObjects = exports.flattenObjects(window.document);
    var elements = [];
    for (var id in allVMObjects) {
        var value = allVMObjects[id].value;
        if (value.type === state_1.SlimVMObjectType.ELEMENT && value.tagName === "style" && exports.getAttributeValue("scope", value) == tagName) {
            elements.push(value);
        }
    }
    return elements;
});
var getNodeCSSRules = weak_memo_1.weakMemo(function (node, window) {
    var host = exports.getSlimNodeHost(node, window.document);
    var allRules = getDocumentCSSRules(window.document);
    if (host) {
        allRules = exports.getScopedStyleRules(host.tagName, window).concat(allRules);
    }
    // if shadow exists, then the element may have scoped styles
    if (node.type === state_1.SlimVMObjectType.ELEMENT && node.shadow) {
        allRules = allRules.concat(exports.getScopedStyleRules(node.tagName, window));
    }
    return allRules;
});
exports.getPseudoElementName = function (selector) {
    var match = selector.match(/::?(before|after|placeholder)/);
    return match ? match[1] : null;
};
exports.getSyntheticMatchingCSSRules = weak_memo_1.weakMemo(function (window, elementId, breakPastHost) {
    var element = exports.getSyntheticWindowChild(elementId, window);
    var allRules = getNodeCSSRules(element, window);
    var matchingRules = [];
    var elementStyle = exports.getAttribute("style", element);
    for (var i = 0, n = allRules.length; i < n; i++) {
        var rule = allRules[i];
        // no parent rule -- check
        if (rule.type === state_1.SlimVMObjectType.STYLE_RULE) {
            if (query_selector_1.elementMatches(rule.selectorText, element, window.document)) {
                var styleRule = rule;
                matchingRules.push({
                    assocId: rule.id,
                    pseudo: exports.getPseudoElementName(styleRule.selectorText),
                    style: styleRule.style,
                    rule: styleRule,
                    targetElement: element
                });
            }
            // else - check if media rule
        }
        else if ((exports.isMediaRule(rule) && media_match_1.createMediaMatcher(window)(rule.params))) {
            var grouping = rule;
            for (var _i = 0, _a = grouping.rules; _i < _a.length; _i++) {
                var childRule = _a[_i];
                if (query_selector_1.elementMatches(childRule.selectorText, element, window.document)) {
                    matchingRules.push({
                        assocId: childRule.id,
                        style: childRule.style,
                        rule: childRule,
                        mediaRule: rule,
                        targetElement: element
                    });
                }
            }
        }
    }
    if (elementStyle) {
        matchingRules.push({
            assocId: element.id,
            targetElement: element,
            style: typeof elementStyle.value === "string" ? exports.parseStyle(elementStyle.value) : elementStyle.value
        });
    }
    return matchingRules;
});
var getSyntheticInheritableCSSRules = weak_memo_1.weakMemo(function (window, elementId) {
    var matchingCSSRules = exports.getSyntheticMatchingCSSRules(window, elementId, true);
    var inheritableCSSRules = [];
    for (var i = 0, n = matchingCSSRules.length; i < n; i++) {
        var rule = matchingCSSRules[i];
        if (exports.containsInheritableStyleProperty(rule.style)) {
            inheritableCSSRules.push(rule);
        }
    }
    return inheritableCSSRules;
});
exports.containsInheritableStyleProperty = function (style) {
    for (var _i = 0, style_3 = style; _i < style_3.length; _i++) {
        var _a = style_3[_i], name_4 = _a.name, value = _a.value;
        if (constants_1.INHERITED_CSS_STYLE_PROPERTIES[name_4] && value) {
            return true;
        }
    }
    return false;
};
var getDisabledDeclarations = function (matchingRule, window, disabledDeclarationInfo) {
    if (disabledDeclarationInfo === void 0) { disabledDeclarationInfo = {}; }
    var ruleOwner = matchingRule.rule || matchingRule.targetElement;
    return exports.getDisabledStyleRuleProperties(ruleOwner.id, window.document, disabledDeclarationInfo);
};
exports.isCSSPropertyDisabled = function (itemId, propertyName, document, disabledDeclarationInfo) {
    if (disabledDeclarationInfo === void 0) { disabledDeclarationInfo = {}; }
    return Boolean(exports.getDisabledStyleRuleProperties(itemId, document, disabledDeclarationInfo)[propertyName]);
};
exports.getDisabledStyleRuleProperties = function (itemId, document, disabledDeclarationInfo) {
    var scopeInfo = exports.getStyleOwnerScopeInfo(itemId, document);
    var scopeHash = scopeInfo.join("");
    var disabledPropertyNames = {};
    var info = disabledDeclarationInfo[scopeHash] || {};
    for (var key in info) {
        disabledPropertyNames[key] = Boolean(info[key]);
    }
    return disabledPropertyNames;
};
exports.getSyntheticAppliedCSSRules = weak_memo_1.weakMemo(function (window, elementId, disabledDeclarationInfo) {
    if (disabledDeclarationInfo === void 0) { disabledDeclarationInfo = {}; }
    var element = exports.getSyntheticWindowChild(elementId, window);
    var allRules = getNodeCSSRules(element, window);
    // first grab the rules that are applied directly to the element
    var matchingRules = exports.getSyntheticMatchingCSSRules(window, elementId);
    var appliedPropertNames = {};
    var appliedStyleRules = {};
    var appliedRules = [];
    for (var i = matchingRules.length; i--;) {
        var matchingRule = matchingRules[i];
        var pseudo = matchingRule.pseudo;
        var disabledPropertyNames = getDisabledDeclarations(matchingRule, window, disabledDeclarationInfo);
        appliedStyleRules[matchingRule.assocId] = true;
        var overriddenPropertyNames = {};
        ;
        for (var _i = 0, _a = matchingRule.style; _i < _a.length; _i++) {
            var propertyName = _a[_i].name;
            if (appliedPropertNames[pseudo + propertyName]) {
                overriddenPropertyNames[propertyName] = true;
            }
            else if (!disabledPropertyNames[propertyName]) {
                appliedPropertNames[pseudo + propertyName] = true;
            }
        }
        appliedRules.push({
            inherited: false,
            rule: matchingRule,
            overriddenPropertyNames: overriddenPropertyNames,
            disabledPropertyNames: disabledPropertyNames,
        });
    }
    // next, fetch the style rules that have inheritable properties such as font-size, color, etc. 
    var ancestors = exports.getNodeAncestors(element, window.document, true);
    // reduce by 1 to omit #document
    for (var i = 0, n = ancestors.length - 1; i < n; i++) {
        var ancestor = ancestors[i];
        if (ancestor.type !== state_1.SlimVMObjectType.ELEMENT) {
            continue;
        }
        var inheritedRules = getSyntheticInheritableCSSRules(window, ancestor.id);
        for (var j = inheritedRules.length; j--;) {
            var ancestorRule = inheritedRules[j];
            if (appliedStyleRules[ancestorRule.assocId]) {
                continue;
            }
            var pseudo = ancestorRule.pseudo;
            var disabledPropertyNames = getDisabledDeclarations(ancestorRule, window, disabledDeclarationInfo);
            appliedStyleRules[ancestorRule.assocId] = true;
            var overriddenPropertyNames = {};
            var ignoredPropertyNames = {};
            for (var _b = 0, _c = ancestorRule.style; _b < _c.length; _b++) {
                var propertyName = _c[_b].name;
                if (!constants_1.INHERITED_CSS_STYLE_PROPERTIES[propertyName]) {
                    ignoredPropertyNames[propertyName] = true;
                }
                else if (appliedPropertNames[pseudo + propertyName]) {
                    overriddenPropertyNames[propertyName] = true;
                }
                else if (!disabledPropertyNames[propertyName]) {
                    appliedPropertNames[pseudo + propertyName] = true;
                }
            }
            appliedRules.push({
                inherited: true,
                rule: ancestorRule,
                ignoredPropertyNames: ignoredPropertyNames,
                disabledPropertyNames: disabledPropertyNames,
                overriddenPropertyNames: overriddenPropertyNames,
            });
        }
    }
    var rootStyleRule = exports.getRootStyleRule(window);
    if (rootStyleRule) {
        var matchingCSSRules = {
            assocId: rootStyleRule.id,
            style: rootStyleRule.style,
            rule: rootStyleRule,
        };
        appliedRules.push({
            inherited: true,
            rule: matchingCSSRules,
            ignoredPropertyNames: {},
            overriddenPropertyNames: {},
            disabledPropertyNames: getDisabledDeclarations(matchingCSSRules, window, disabledDeclarationInfo)
        });
    }
    return appliedRules;
});
exports.getRootStyleRule = weak_memo_1.weakMemo(function (window) {
    var allObjects = exports.flattenObjects(window.document);
    for (var id in allObjects) {
        var value = allObjects[id].value;
        if (value.type === state_1.SlimVMObjectType.STYLE_RULE && value.selectorText === ":root") {
            return value;
        }
    }
});
var getTargetStyleOwners = function (element, propertyNames, targetSelectors, window, disabledProperties) {
    // find all applied rules
    var styleOwners = exports.getSyntheticAppliedCSSRules(window, element.id, disabledProperties).map(function (_a) {
        var rule = _a.rule;
        return rule.rule || rule.targetElement;
    });
    // cascade down style rule list until targets are found (defined in css inspector)
    var matchingStyleOwners = styleOwners.filter(function (rule) { return Boolean(targetSelectors.find(function (_a) {
        var uri = _a.uri, value = _a.value;
        return rule.source.uri === uri && rule["selectorText"] == value;
    })); });
    if (!matchingStyleOwners.length) {
        matchingStyleOwners = [styleOwners[0]];
    }
    var ret = {};
    var _loop_1 = function (propName) {
        ret[propName] = matchingStyleOwners.find(function (owner) { return Boolean(owner.type === state_1.SlimVMObjectType.ELEMENT ? exports.getStyleValue(propName, exports.getAttribute("style", owner) || []) && owner : exports.getStyleValue(propName, owner.style) && owner) || Boolean(matchingStyleOwners[0]); });
    };
    for (var _i = 0, propertyNames_1 = propertyNames; _i < propertyNames_1.length; _i++) {
        var propName = propertyNames_1[_i];
        _loop_1(propName);
    }
    return ret;
};
exports.getStyleValue = function (name, style) {
    for (var i = style.length; i--;) {
        var prop = style[i];
        if (prop.name === name) {
            return prop.value;
        }
    }
    return null;
};
exports.cssPropNameToKebabCase = function (propName) {
    propName = propName.substr(0, 2) === "--" ? propName : lodash_1.kebabCase(propName);
    // vendor prefix
    if (/^(webkit|moz|ms|o)-/.test(propName)) {
        propName = "-" + propName;
    }
    return propName;
};
exports.getElementLabel = function (element) {
    var label = String(element.tagName).toLowerCase();
    var className = exports.getAttributeValue("class", element);
    var id = exports.getAttributeValue("id", element);
    if (id) {
        label += "#" + id;
    }
    else if (className) {
        label += "." + className;
    }
    return label;
};
/**
 * exists so that other parts of an application can hold onto a reference to a vm object
 */
// TODO - probably better to use something like updateNested
exports.setVMObjectIds = function (current, idSeed, refCount) {
    if (refCount === void 0) { refCount = 0; }
    switch (current.type) {
        case state_1.SlimVMObjectType.ELEMENT: {
            var el = current;
            if (el.shadow) {
                el = __assign({}, el, { shadow: exports.setVMObjectIds(el.shadow, idSeed, refCount) });
                refCount = exports.getRefCount(el.shadow, idSeed);
            }
            if (el.sheet) {
                el = __assign({}, el, { sheet: exports.setVMObjectIds(el.sheet, idSeed, refCount) });
                refCount = exports.getRefCount(el.sheet, idSeed);
            }
            current = el;
            // fall through
        }
        case state_1.SlimVMObjectType.DOCUMENT_FRAGMENT:
        case state_1.SlimVMObjectType.DOCUMENT: {
            var parent_1 = current;
            var newChildren = new Array(parent_1.childNodes.length);
            for (var i = 0, length_9 = parent_1.childNodes.length; i < length_9; i++) {
                var child = exports.setVMObjectIds(parent_1.childNodes[i], idSeed, refCount);
                refCount = exports.getRefCount(child, idSeed);
                newChildren[i] = child;
            }
            parent_1 = __assign({}, parent_1, { childNodes: newChildren });
            current = parent_1;
            break;
        }
        // case SlimVMObjectType.STYLE_RULE: {
        //   let styleRule = current as any as SlimCSSStyleRule;
        //   styleRule = {
        //     ...styleRule,
        //     style: setVMObjectIds(styleRule.style, idSeed, refCount)
        //   } as SlimCSSStyleRule;
        //   refCount = getRefCount(styleRule.style, idSeed);
        //   current = styleRule as any as TObject;
        //   break;
        // }
        case state_1.SlimVMObjectType.AT_RULE:
        case state_1.SlimVMObjectType.STYLE_SHEET: {
            var groupingRule = current;
            var newRules = new Array(groupingRule.rules.length);
            for (var i = 0, length_10 = groupingRule.rules.length; i < length_10; i++) {
                var rule = exports.setVMObjectIds(groupingRule.rules[i], idSeed, refCount);
                refCount = exports.getRefCount(rule, idSeed);
                newRules[i] = rule;
            }
            groupingRule = __assign({}, groupingRule, { rules: newRules });
            current = groupingRule;
            break;
        }
    }
    ;
    if (current.type == null) {
        throw new Error("Current type is not defined");
    }
    return __assign({}, current, { 
        // insert type to allow other parts of app to pull it out (like dom renderer)
        id: lodash_1.padStart(String(current.type), ID_TYPE_PAD, "0") + idSeed + (refCount + 1) });
};
exports.getVMObjectIdType = function (id) { return Number(id.substr(0, ID_TYPE_PAD)); };
exports.getRefCount = function (current, idSeed) {
    return Number(current.id.substr(idSeed.length + ID_TYPE_PAD));
};
exports.traverseSlimNode = function (current, each) {
    if (each(current) === false) {
        return false;
    }
    switch (current.type) {
        case state_1.SlimVMObjectType.ELEMENT:
        case state_1.SlimVMObjectType.DOCUMENT_FRAGMENT: {
            var parent_2 = current;
            for (var i = 0, length_11 = parent_2.childNodes.length; i < length_11; i++) {
                if (exports.traverseSlimNode(parent_2.childNodes[i], each) === false) {
                    return false;
                }
            }
        }
    }
};
exports.compileScopedCSS = function (selectorText, scopeClass, aliases) {
    if (aliases === void 0) { aliases = {}; }
    var parts = selectorText.match(/.*?([,\s]+|$)/g) || [selectorText];
    return parts.map(function (part, i) {
        if (!part)
            return part;
        var _a = part.match(/(.*?)([,\s]+)/) || [part, part, ""], match = _a[0], selector = _a[1], delim = _a[2];
        selector = getScopedSelector(selector, scopeClass, aliases, i);
        return "" + selector + delim;
    }).join("");
};
var getScopedSelector = function (part, scopeClass, aliases, i) {
    if (/%/.test(part))
        return part;
    var scopeHostClass = scopeClass + "_host";
    // TODO - this is all nasty. Need to parse selector as AST, then transform
    // that.
    for (var alias in aliases) {
        if (part.indexOf(alias) !== -1) {
            part = part.replace(part, part.replace(alias, aliases[alias] + "_host"));
        }
    }
    var pseudo = (part.match(/::.*/) || [""])[0];
    part = part.replace(pseudo, "");
    if (part.indexOf(":host") !== -1) {
        var _a = part.match(/\:host\((.*?)\)/) || [null, ""], match = _a[0], params = _a[1];
        params = params.replace(/\[([\w\d\-]+)\]/g, "[data-$1]");
        // for (const prop of componentProps) {
        //   params = params.replace(prop, "data-" + prop);
        // }
        return part.replace(/\:host(\(.*?\))?/g, "." + scopeHostClass + (params ? params : ""));
    }
    // don't want to target spans since the host is one
    if (part === "span" && i === 0) {
        return "." + scopeHostClass + " span." + scopeClass;
    }
    var addedClass = "." + scopeClass;
    // part first in case the selector is a tag name
    // TODO - consider psuedo selectors
    return part + addedClass + pseudo;
};
exports.getSlot = weak_memo_1.weakMemo(function (slotName, parent) {
    if (!parent.shadow) {
        return null;
    }
    var foundSlot;
    exports.traverseSlimNode(parent.shadow, function (nestedChild) {
        if (nestedChild.type === state_1.SlimVMObjectType.ELEMENT) {
            var element = nestedChild;
            if (element.tagName === "slot" && exports.getAttributeValue("name", element) == slotName) {
                foundSlot = element;
                return false;
            }
        }
    });
    return foundSlot;
});
exports.getSlotChildren = function (slot, parent) {
    return exports.getSlotChildrenByName(exports.getAttributeValue("name", slot), parent);
};
exports.getSlotChildrenByName = weak_memo_1.weakMemo(function (slotName, parent) {
    return parent.childNodes.filter(function (child) { return exports.getNodeSlotName(child) == slotName; });
});
exports.getNodeSlotName = function (node) { return node.type === state_1.SlimVMObjectType.ELEMENT ? exports.getAttributeValue("slot", node) : null; };
exports.isValidStyleDeclarationName = function (name) { return !/^([\$_]|\d+$)/.test(name.charAt(0)) && !/^(type|id)$/.test(name); };
//# sourceMappingURL=utils.js.map