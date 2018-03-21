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
var weak_memo_1 = require("./weak-memo");
exports.renderDOM2 = function (object, root) {
    var domMap = (_a = {}, _a[object.id] = root, _a);
    var cssomMap = {};
    insertStyleSheets(object, root, { map: { dom: domMap, cssom: cssomMap } });
    root.appendChild(createNativeNode(object, root.ownerDocument, { map: domMap, root: object }));
    return { dom: domMap, cssom: cssomMap };
    var _a;
};
var createNativeNode = function (vmNode, document, context) {
    switch (vmNode.type) {
        case state_1.SlimVMObjectType.ELEMENT: {
            var _a = vmNode, tagName = _a.tagName, type = _a.type, id = _a.id, shadow = _a.shadow, childNodes = _a.childNodes, attributes = _a.attributes;
            if (tagName === "style") {
                return null;
            }
            if (tagName === "slot") {
                // Note that document fragment is necessary for slots to ensure that that certain props are inheritable from the parent (like display: flex)
                var slotElement = document.createDocumentFragment();
                // add a marker so that elements can be dynamically inserted when patched
                slotElement.appendChild(context.map[vmNode.id] = document.createComment("section-start"));
                var host = context.host;
                if (host) {
                    var slotName = utils_1.getAttributeValue("name", vmNode);
                    var slotChildNodes = utils_1.getSlotChildrenByName(slotName, host);
                    for (var i = 0, length_1 = slotChildNodes.length; i < length_1; i++) {
                        var child = slotChildNodes[i];
                        var nativeChild = createNativeNode(child, document, __assign({}, context, { host: getNodeHost(child, context.root) }));
                        slotElement.appendChild(nativeChild);
                    }
                }
                // append default slot element children
                if (slotElement.childNodes.length === 1) {
                    appendNativeChildNodes(vmNode, slotElement, document, context);
                }
                slotElement.appendChild(document.createComment("section-end"));
                return slotElement;
            }
            var nativeElement = context.map[vmNode.id] = document.createElement(tagName);
            for (var i = 0, length_2 = attributes.length; i < length_2; i++) {
                var attribute = attributes[i];
                setNativeElementAttribute(nativeElement, attribute.name, attribute.value);
            }
            if (context.host) {
                nativeElement.classList.add(getElementScopeTagName(context.host));
            }
            if (shadow) {
                nativeElement.classList.add(getElementScopeTagName(vmNode) + "_host");
            }
            if (shadow) {
                context.map[shadow.id] = nativeElement;
                var nativeShadow = createNativeNode(shadow, document, __assign({}, context, { host: vmNode }));
                // TODO - get slots
                nativeElement.appendChild(nativeShadow);
            }
            else {
                appendNativeChildNodes(vmNode, nativeElement, document, context);
            }
            return nativeElement;
        }
        case state_1.SlimVMObjectType.TEXT: {
            var textNode = vmNode;
            return context.map[textNode.id] = document.createTextNode(textNode.value);
        }
        case state_1.SlimVMObjectType.DOCUMENT:
        case state_1.SlimVMObjectType.DOCUMENT_FRAGMENT: {
            var fragment = document.createDocumentFragment();
            appendNativeChildNodes(vmNode, fragment, document, context);
            return fragment;
        }
    }
    return null;
};
var createParentChildNodes = function (parent, document, context) {
    parent.childNodes.map(function (child) { return createNativeNode(parent, document, context); });
};
var insertStyleSheets = function (current, mount, context) {
    if (current.type === state_1.SlimVMObjectType.ELEMENT) {
        var element = current;
        if (element.tagName === "style") {
            insertStyleSheet(element, mount, context);
        }
        else if (element.shadow) {
            insertStyleSheets(element.shadow, mount, __assign({}, context, { host: element }));
        }
    }
    if (current.childNodes) {
        var parent_1 = current;
        for (var i = 0, length_3 = parent_1.childNodes.length; i < length_3; i++) {
            insertStyleSheets(parent_1.childNodes[i], mount, context);
        }
    }
};
var insertStyleSheet = function (element, mount, context, index) {
    if (index === void 0) { index = Number.MAX_SAFE_INTEGER; }
    var nativeElement = mount.ownerDocument.createElement("style");
    context.map.dom[element.id] = nativeElement;
    nativeElement.appendChild(mount.ownerDocument.createTextNode(""));
    insertNativeNode(nativeElement, index, mount);
    var sheet = nativeElement.sheet;
    context.map.cssom[element.sheet.id] = sheet;
    var scope = utils_1.getAttributeValue("scope", element);
    insertChildRules(element.sheet, sheet, __assign({}, context, { scope: scope }));
};
var insertChildRules = function (slimRule, nativeRule, context) {
    for (var i = 0, length_4 = slimRule.rules.length; i < length_4; i++) {
        insertChildRule(slimRule.rules[i], nativeRule, context, i);
    }
};
var insertChildRule = function (slimRule, nativeRule, context, index) {
    index = Math.min(index, nativeRule.cssRules.length);
    var childRuleText = shallowStringifyRule(slimRule, context);
    while (1) {
        try {
            if (nativeRule.insertRule) {
                nativeRule.insertRule(childRuleText, index);
            }
            else {
                nativeRule.appendRule(childRuleText, index);
            }
        }
        catch (e) {
            console.warn("Unable to insert " + childRuleText + " style. Inserting placeholder rule.");
            console.warn(e.stack);
            if (slimRule.type === state_1.SlimVMObjectType.STYLE_RULE) {
                childRuleText = ".___placeholder {}";
            }
            else if (slimRule.type === state_1.SlimVMObjectType.AT_RULE) {
                childRuleText = "@media screen and (min-width: 999999999px) { }";
            }
            continue;
        }
        break;
    }
    context.map.cssom[slimRule.id] = nativeRule.cssRules[index];
    if (slimRule.rules) {
        insertChildRules(slimRule, context.map.cssom[slimRule.id], context);
    }
};
var shallowStringifyRule = function (rule, context) {
    switch (rule.type) {
        case state_1.SlimVMObjectType.STYLE_RULE: {
            var _a = rule, selectorText = _a.selectorText, style = _a.style;
            // console.log(stringifyScopedSelectorText(selectorText, context.scope));
            return stringifyScopedSelectorText(selectorText, context.scope) + " { " + stringifyStyle(style) + " }";
        }
        case state_1.SlimVMObjectType.FONT_FACE_RULE: {
            var style = rule.style;
            return "@font-face { " + stringifyStyle(style) + " }";
        }
        case state_1.SlimVMObjectType.AT_RULE: {
            var _b = rule, name_1 = _b.name, params = _b.params, rules = _b.rules;
            return /^(charset|import)$/.test(name_1) ? "@" + name_1 + " \"" + params + "\";" : "@" + name_1 + " " + params + " { }";
        }
    }
};
var stringifyStyle = function (style) {
    var buffer = "";
    for (var _i = 0, style_1 = style; _i < style_1.length; _i++) {
        var _a = style_1[_i], name_2 = _a.name, value = _a.value;
        buffer += name_2 + ": " + value + ";";
    }
    return buffer;
};
var getScopeTagName = function (tagName) { return "__" + tagName + "_scope"; };
var getElementScopeTagName = function (_a) {
    var tagName = _a.tagName;
    return getScopeTagName(tagName);
};
var getElementScopeTagNameHost = function (element) { return getElementScopeTagName(element) + "__host"; };
var stringifyScopedSelectorText = function (selectorText, scope) {
    return scope ? utils_1.compileScopedCSS(selectorText, getScopeTagName(scope)) : selectorText;
};
var appendNativeChildNodes = function (_a, nativeParent, document, context) {
    var childNodes = _a.childNodes;
    for (var i = 0, length_5 = childNodes.length; i < length_5; i++) {
        var nativeChild = createNativeNode(childNodes[i], document, context);
        if (nativeChild) {
            nativeParent.appendChild(nativeChild);
        }
    }
};
var deleteNestedCSSRules = function (rule, map) {
    map = updateCSSOMMap(map, (_a = {}, _a[rule.id] = undefined, _a));
    if (rule.rules) {
        for (var i = rule.rules.length; i--;) {
            map = deleteNestedCSSRules(rule.rules[i], map);
        }
    }
    return map;
    var _a;
};
var deleteNestedChildNodes = function (node, map) {
    map = updateDOMMap(map, (_a = {}, _a[node.id] = undefined, _a));
    if (node.shadow) {
        map = deleteNestedChildNodes(node.shadow, map);
    }
    if (node.childNodes) {
        var parent_2 = node;
        for (var i = parent_2.childNodes.length; i--;) {
            map = deleteNestedChildNodes(parent_2.childNodes[i], map);
        }
    }
    return map;
    var _a;
};
exports.patchDOM2 = function (mutation, root, mount, map) {
    var slimTarget = utils_1.getVMObjectFromPath(mutation.target, root);
    var ownerDocument = mount.ownerDocument;
    switch (mutation.type) {
        case diff_patch_1.SET_TEXT_NODE_VALUE: {
            var nativeTarget = map.dom[slimTarget.id];
            nativeTarget.nodeValue = mutation.newValue;
            break;
        }
        case diff_patch_1.REMOVE_CHILD_NODE: {
            var index = mutation.index;
            var parent_3 = slimTarget;
            var child = parent_3.childNodes[index];
            map = removeNativeChildNode(child, map);
            break;
        }
        case diff_patch_1.REMOVE_ATTRIBUTE:
        case diff_patch_1.INSERT_ATTRIBUTE:
        case diff_patch_1.SET_ATTRIBUTE: {
            var _a = mutation, name_3 = _a.name, newValue = _a.newValue, index = _a.index;
            var slimElement = slimTarget;
            var nativeTarget = map.dom[slimTarget.id];
            var host = getMutationHost(mutation, root);
            if (slimElement.tagName === "slot") {
                if (name_3 === "name") {
                    // TODO - get host
                    // TODO - insert children
                    var oldSlotChildren = utils_1.getSlotChildren(slimElement, host);
                    for (var i = oldSlotChildren.length; i--;) {
                        var child = oldSlotChildren[i];
                        map = removeNativeChildNode(child, map);
                    }
                    var newSlotChildren = utils_1.getSlotChildrenByName(newValue, host);
                    var nativeParent = nativeTarget.parentNode;
                    var slotIndex = Array.prototype.indexOf.call(nativeParent.childNodes, nativeTarget);
                    var childMap = {};
                    for (var i = 0, length_6 = newSlotChildren.length; i < length_6; i++) {
                        var child = newSlotChildren[i];
                        var childHost = getNodeHost(child, root);
                        var newNativeChild = createNativeNode(newSlotChildren[i], nativeTarget.ownerDocument, {
                            root: root,
                            map: childMap,
                            host: childHost
                        });
                        insertNativeNode(newNativeChild, slotIndex + i + 1, nativeParent);
                    }
                    map = updateDOMMap(map, childMap);
                }
            }
            else {
                slimTarget = mutation.type === diff_patch_1.SET_ATTRIBUTE ? utils_1.setElementAttributeAt(slimTarget, index, name_3, newValue) : mutation.type === diff_patch_1.REMOVE_ATTRIBUTE ? utils_1.removeElementAttributeAt(slimTarget, index) : mutation.type === diff_patch_1.INSERT_ATTRIBUTE ? utils_1.insertElementAttributeAt(slimTarget, index, name_3, newValue) : slimTarget;
                var actualValue = utils_1.getAttributeValue(name_3, slimTarget);
                if (name_3 === "class") {
                    actualValue = actualValue + " " + getElementScopeTagName(host);
                }
                if (!actualValue) {
                    nativeTarget.removeAttribute(name_3);
                    delete nativeTarget.dataset[name_3.toLowerCase()];
                }
                else {
                    setNativeElementAttribute(nativeTarget, name_3, actualValue);
                }
            }
            break;
        }
        case diff_patch_1.INSERT_CHILD_NODE: {
            var _b = mutation, child = _b.child, index = _b.index;
            var insertIndex = index;
            var nativeOwner = void 0;
            if (slimTarget.shadow) {
                var slot = utils_1.getSlot(utils_1.getNodeSlotName(child), slimTarget);
                var nativeSlotMarker = map.dom[slot.id];
                var nativeSlotParent = nativeSlotMarker.parentNode;
                var nativeSlotIndex = Array.prototype.indexOf.call(nativeSlotParent.childNodes, nativeSlotMarker);
                nativeOwner = nativeSlotParent;
                // TODO - index needs to be calculated based on other children that share the same slot.
                insertIndex = nativeSlotIndex + index + 1;
            }
            else {
                nativeOwner = map.dom[slimTarget.id];
                var beforeChild = slimTarget.childNodes[insertIndex];
                if (beforeChild) {
                    insertIndex = Array.prototype.indexOf.call(nativeOwner.childNodes, map.dom[beforeChild.id]);
                }
                else {
                    insertIndex = nativeOwner.childNodes.length;
                }
            }
            var domMap = {};
            var cssomMap = {};
            var mutationHost = getMutationHost(mutation, root);
            if (child.type === state_1.SlimVMObjectType.ELEMENT && child.tagName === "style") {
                // console.log("INSERT LES CHILD", child);
                insertStyleSheet(child, mount, {
                    host: getNodeHost(child, root),
                    map: { cssom: cssomMap, dom: domMap }
                }, insertIndex);
            }
            else {
                var nativeChild = createNativeNode(child, ownerDocument, {
                    map: domMap,
                    root: root,
                    host: mutationHost
                });
                if (slimTarget.tagName === "slot") {
                    var host = getMutationHost(mutation, root);
                    var slot = slimTarget;
                    var slotChildren = utils_1.getSlotChildren(slot, host);
                    var nativeParent = nativeOwner.parentNode;
                    if (slotChildren.length === 0) {
                        var beforeChild = index < slot.childNodes.length ? slot.childNodes[index] : null;
                        var beforeNativeChild = beforeChild ? map.dom[beforeChild.id] : getSectionEndComment(nativeOwner);
                        var nativeSlotIndex = Array.prototype.indexOf.call(nativeParent.childNodes, beforeNativeChild);
                        insertNativeNode(nativeChild, nativeSlotIndex, nativeParent);
                    }
                    else {
                    }
                }
                else {
                    insertNativeNode(nativeChild, insertIndex, nativeOwner);
                }
            }
            map = updateNativeMap(map, {
                cssom: cssomMap,
                dom: domMap
            });
            break;
        }
        case diff_patch_1.MOVE_CHILD_NODE: {
            var _c = mutation, index = _c.index, oldIndex = _c.oldIndex;
            var insertIndex = index;
            var parent_4 = slimTarget;
            var slimChild = parent_4.childNodes[oldIndex];
            var beforeChild = parent_4.childNodes[index];
            var nativeChild = map.dom[slimChild.id];
            var nativeParent = nativeChild.parentNode;
            // style sheets cannot be moved (for now) since they will not render if they're removed and re-added to the document. 
            if (slimChild.tagName === "style") {
                break;
            }
            if (slimChild.tagName === "slot") {
                var start = nativeChild;
                var children = getSectionChildNodes(start);
                var end = getSectionEndComment(start);
                nativeChild = nativeChild.ownerDocument.createDocumentFragment();
                nativeChild.appendChild(start);
                for (var _i = 0, children_1 = children; _i < children_1.length; _i++) {
                    var child = children_1[_i];
                    nativeChild.appendChild(child);
                }
                nativeChild.appendChild(end);
            }
            if (beforeChild) {
                insertIndex = Array.prototype.indexOf.call(nativeParent.childNodes, map.dom[beforeChild.id]);
            }
            else {
                insertIndex = nativeParent.childNodes.length;
            }
            insertNativeNode(nativeChild, insertIndex, nativeParent);
            break;
        }
        case diff_patch_1.CSS_SET_SELECTOR_TEXT: {
            var newValue = mutation.newValue;
            var nativeTarget = map.cssom[slimTarget.id];
            var host = getStyleElementFomPath(mutation.target, root);
            nativeTarget.selectorText = stringifyScopedSelectorText(newValue, utils_1.getAttributeValue("scope", host));
            break;
        }
        case diff_patch_1.CSS_DELETE_RULE: {
            var index = mutation.index;
            var grouping = map.cssom[slimTarget.id];
            var slimChild = slimTarget.rules[index];
            var nativeChild = map.cssom[slimChild.id];
            var parentRule = (nativeChild.parentRule || nativeChild.parentStyleSheet);
            parentRule.deleteRule(Array.prototype.indexOf.call(parentRule.cssRules, nativeChild));
            map = updateNativeMap(map, deleteNestedCSSRules(slimChild, map));
            break;
        }
        case diff_patch_1.CSS_DELETE_STYLE_PROPERTY:
        case diff_patch_1.CSS_INSERT_STYLE_PROPERTY:
        case diff_patch_1.CSS_SET_STYLE_PROPERTY: {
            var _d = mutation, type = _d.type, name_4 = _d.name, newValue = _d.newValue, index = _d.index;
            var nativeTarget = map.cssom[slimTarget.id];
            slimTarget = type === diff_patch_1.CSS_INSERT_STYLE_PROPERTY ? utils_1.insertCSSStyleProperty(slimTarget, index, name_4, newValue) : type === diff_patch_1.CSS_DELETE_STYLE_PROPERTY ? utils_1.removeCSSStyleProperty(slimTarget, index) : utils_1.setCSSStyleProperty(slimTarget, index, name_4, newValue);
            var actualValue = utils_1.getStyleValue(name_4, slimTarget.style);
            if (actualValue == null) {
                nativeTarget.style.removeProperty(name_4);
            }
            else {
                nativeTarget.style.setProperty(name_4, actualValue);
            }
            break;
        }
        case diff_patch_1.CSS_AT_RULE_SET_PARAMS: {
            var newValue = mutation.newValue;
            var nativeTarget = map.cssom[slimTarget.id];
            if (nativeTarget.type === 4) {
                var mediaRule = nativeTarget;
                mediaRule.conditionText = newValue;
            }
            else if (nativeTarget.type === 7) {
                var keyframesRule = nativeTarget;
                keyframesRule.name = newValue;
            }
            break;
        }
        case diff_patch_1.REMOVE_SHADOW:
        case diff_patch_1.ATTACH_SHADOW: {
            // dumb patch where the target element is replaced entirely -- this is to reduce complex code, and is probably okay for this case since ATTACH_SHADOW probably won't be called that often.
            var patchedRoot = diff_patch_1.patchNode2(mutation, root);
            var patchedTarget = utils_1.getVMObjectFromPath(mutation.target, patchedRoot);
            var nativeTarget = map.dom[slimTarget.id];
            var nativeParent = nativeTarget.parentNode;
            var index = Array.prototype.indexOf.call(nativeParent.childNodes, nativeTarget);
            nativeParent.removeChild(nativeTarget);
            map = deleteNestedChildNodes(slimTarget, map);
            var domMap = {};
            var newNativeTarget = createNativeNode(patchedTarget, document, {
                root: patchedRoot,
                host: getNodeHost(patchedTarget, patchedRoot),
                map: domMap
            });
            insertNativeNode(newNativeTarget, index, nativeParent);
            map = updateDOMMap(map, domMap);
            break;
        }
        case diff_patch_1.CSS_MOVE_RULE: {
            var _e = mutation, index = _e.index, oldIndex = _e.oldIndex;
            var nativeTarget = map.cssom[slimTarget.id];
            var cssomMap = {};
            var styleElement = getStyleElementFomPath(mutation.target, root);
            var scope = utils_1.getAttributeValue("scope", styleElement);
            if (nativeTarget.appendRule) {
                var patchedRoot = diff_patch_1.patchNode2(mutation, root);
                var patchedSlimParent = utils_1.getVMObjectFromPath(mutation.target, patchedRoot);
                while (nativeTarget.cssRules.length) {
                    nativeTarget.deleteRule(0);
                }
                insertChildRules(patchedSlimParent, nativeTarget, {
                    map: { cssom: cssomMap, dom: {} },
                    scope: scope,
                });
            }
            else {
                nativeTarget.deleteRule(oldIndex);
                insertChildRule(slimTarget.rules[oldIndex], nativeTarget, {
                    map: { cssom: cssomMap, dom: {} },
                    scope: scope
                }, index);
            }
            map = updateCSSOMMap(map, cssomMap);
            break;
        }
        case diff_patch_1.CSS_INSERT_RULE: {
            var _f = mutation, index = _f.index, child = _f.child;
            var cssomMap = {};
            var styleElement = getStyleElementFomPath(mutation.target, root);
            insertChildRule(child, map.cssom[slimTarget.id], {
                map: { cssom: cssomMap, dom: {} },
                scope: utils_1.getAttributeValue("scope", styleElement)
            }, index);
            map = updateCSSOMMap(map, cssomMap);
            break;
        }
    }
    return map;
};
var updateDOMMap = function (map, dom) { return (__assign({}, map, { dom: __assign({}, map.dom, dom) })); };
var setNativeElementAttribute = function (nativeElement, name, value) {
    if (name === "style" && typeof value === "object") {
        Object.assign(nativeElement[name], value);
    }
    else if (typeof value !== "object") {
        nativeElement.setAttribute(name, value);
    }
    nativeElement.dataset[name.toLowerCase()] = "true";
};
var updateNativeMap = function (oldMap, newMap) { return (__assign({}, oldMap, { dom: __assign({}, oldMap.dom, newMap.dom), cssom: __assign({}, oldMap.cssom, newMap.cssom) })); };
var getSectionChildNodes = function (start) {
    var children = [];
    var current = start.nextSibling;
    var end = getSectionEndComment(start);
    while (current !== end) {
        children.push(current);
        current = current.nextSibling;
    }
    return children;
};
var getLastSectionChildNode = function (start) {
    var sectionChildNodes = getSectionChildNodes(start);
    return sectionChildNodes[sectionChildNodes.length - 1];
};
var getSectionEndComment = function (start) {
    var current = start.nextSibling;
    while (current.text !== "section-end") {
        if (current.nodeType === 8 && current.text === "section-start") {
            current = getSectionEndComment(current);
        }
        current = current.nextSibling;
    }
    return current;
};
var updateCSSOMMap = function (oldMap, newMap) { return (__assign({}, oldMap, { cssom: __assign({}, oldMap.cssom, newMap) })); };
var removeNativeChildNode = function (child, map, updateMap) {
    if (updateMap === void 0) { updateMap = true; }
    var nativeChild = map.dom[child.id];
    // happens for style elements
    if (!nativeChild) {
        throw new Error("VM node does not have an associative DOM element");
    }
    if (child.tagName === "slot") {
        var slot = child;
        for (var i = slot.childNodes.length; i--;) {
            removeNativeChildNode(slot.childNodes[i], map, false);
        }
        var end = getSectionEndComment(nativeChild);
        end.parentNode.removeChild(end);
    }
    nativeChild.parentNode.removeChild(nativeChild);
    if (updateMap) {
        map = deleteNestedChildNodes(child, map);
    }
    return map;
};
var insertNativeNode = function (child, index, parent) {
    if (index >= parent.childNodes.length) {
        parent.appendChild(child);
    }
    else {
        parent.insertBefore(child, parent.childNodes[index]);
    }
};
var getMutationHost = function (mutation, root) { return getHostFromPath(mutation.target, root); };
var getNodeHost = function (child, root) { return getHostFromPath(utils_1.getVMObjectPath(child, root), root); };
var getHostFromPath = weak_memo_1.weakMemo(function (path, root) {
    var index = path.lastIndexOf("shadow");
    if (index === -1) {
        return null;
    }
    return utils_1.getVMObjectFromPath(path.slice(0, index), root);
});
var getStyleElementFomPath = weak_memo_1.weakMemo(function (path, root) {
    var index = path.lastIndexOf("sheet");
    if (index === -1) {
        return null;
    }
    return utils_1.getVMObjectFromPath(path.slice(0, index), root);
});
// do NOT memoize this since computed information may change over time. 
exports.computedDOMInfo2 = function (map) {
    var computedInfo = {};
    for (var nodeId in map.dom) {
        var node = map.dom[nodeId];
        if (!node || utils_1.getVMObjectIdType(nodeId) !== state_1.SlimVMObjectType.ELEMENT) {
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
//# sourceMappingURL=dom-renderer2.js.map