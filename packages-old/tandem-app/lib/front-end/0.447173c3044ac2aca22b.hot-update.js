webpackHotUpdate(0,{

/***/ "../aerial-browser-sandbox/lib/state/index.js":
/***/ (function(module, exports, __webpack_require__) {

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
var aerial_common2_1 = __webpack_require__("../aerial-common2/index.js");
var constants_1 = __webpack_require__("../aerial-browser-sandbox/lib/environment/constants.js");
var environment_1 = __webpack_require__("../aerial-browser-sandbox/lib/environment/index.js");
exports.SYNTHETIC_BROWSER_STORE = "SYNTHETIC_BROWSER_STORE";
exports.SYNTHETIC_BROWSER = "SYNTHETIC_BROWSER";
exports.SYNTHETIC_DOCUMENT = "SYNTHETIC_DOCUMENT";
exports.SYNTHETIC_TEXT_NODE = "SYNTHETIC_TEXT_NODE";
exports.SYNTHETIC_WINDOW = "SYNTHETIC_WINDOW";
exports.SYNTHETIC_ELEMENT = "SYNTHETIC_ELEMENT";
exports.SYNTHETIC_COMMENT = "SYNTHETIC_COMMENT";
exports.SYNTHETIC_CSS_STYLE_SHEET = "SYNTHETIC_CSS_STYLE_SHEET";
exports.SYNTHETIC_CSS_STYLE_RULE = "SYNTHETIC_CSS_STYLE_RULE";
exports.SYNTHETIC_CSS_MEDIA_RULE = "SYNTHETIC_CSS_MEDIA_RULE";
exports.SYNTHETIC_CSS_UNKNOWN_RULE = "SYNTHETIC_CSS_UNKNOWN_RULE";
exports.SYNTHETIC_CSS_KEYFRAME_RULE = "SYNTHETIC_CSS_KEYFRAME_RULE";
exports.SYNTHETIC_CSS_FONT_FACE_RULE = "SYNTHETIC_CSS_FONT_FACE_RULE";
exports.SYNTHETIC_CSS_KEYFRAMES_RULE = "SYNTHETIC_CSS_KEYFRAMES_RULE";
exports.SYNTHETIC_CSS_STYLE_DECLARATION = "SYNTHETIC_CSS_STYLE_DECLARATION";
exports.isSyntheticNodeType = function (value) {
    return [exports.SYNTHETIC_DOCUMENT, exports.SYNTHETIC_TEXT_NODE, exports.SYNTHETIC_COMMENT, exports.SYNTHETIC_ELEMENT].indexOf(value) !== -1;
};
exports.createSyntheticBrowserStore = function (syntheticBrowsers) { return aerial_common2_1.dsIndex(aerial_common2_1.createDataStore(syntheticBrowsers), "$id"); };
exports.createSyntheticWindow = aerial_common2_1.serializableKeysFactory(["scrollPosition", "bounds", "location", "$id", "browserId"], aerial_common2_1.createStructFactory(exports.SYNTHETIC_WINDOW, {
    externalResourceUris: []
}));
exports.createSyntheticBrowser = aerial_common2_1.createStructFactory(exports.SYNTHETIC_BROWSER, {
    windows: []
});
exports.createSyntheticBrowserRootState = function (syntheticBrowsers) {
    return {
        browserStore: exports.createSyntheticBrowserStore(syntheticBrowsers),
        fileCache: {},
    };
};
exports.addSyntheticBrowser = function (root, syntheticBrowser) {
    if (syntheticBrowser === void 0) { syntheticBrowser = exports.createSyntheticBrowser(); }
    var store = root.browserStore;
    return __assign({}, root, { browserStore: aerial_common2_1.dsInsert(root.browserStore, syntheticBrowser) });
};
exports.addSyntheticWindow = function (root, syntheticBrowserId, syntheticWindow) {
    var store = root.browserStore;
    var idQuery = getIdQuery(syntheticBrowserId);
    var windows = aerial_common2_1.dsFind(store, idQuery).windows;
    return __assign({}, root, { browserStore: aerial_common2_1.dsUpdateOne(store, idQuery, {
            windows: windows.concat([syntheticWindow])
        }) });
};
exports.getSyntheticBrowserItemBounds = aerial_common2_1.weakMemo(function (root, item) {
    if (!item)
        return null;
    if (item.bounds)
        return item.bounds;
    var window = exports.getSyntheticNodeWindow(root, item.$id);
    return window && window.allComputedBounds[item.$id] && aerial_common2_1.shiftBounds(window.allComputedBounds[item.$id], window.bounds);
});
exports.getSyntheticBrowserStoreItemByReference = aerial_common2_1.weakMemo(function (root, _a) {
    var type = _a[0], id = _a[1];
    if (type === exports.SYNTHETIC_TEXT_NODE || type === exports.SYNTHETIC_ELEMENT) {
        return getSyntheticNodeById(root, id);
    }
    else if (type === exports.SYNTHETIC_WINDOW) {
        return exports.getSyntheticWindow(root, id);
    }
});
exports.createSyntheticCSSStyleSheet = aerial_common2_1.createStructFactory(exports.SYNTHETIC_CSS_STYLE_SHEET);
exports.createSyntheticCSSStyleRule = aerial_common2_1.createStructFactory(exports.SYNTHETIC_CSS_STYLE_RULE, {
    type: constants_1.CSSRuleType.STYLE_RULE
});
exports.createSyntheticCSSMediaRule = aerial_common2_1.createStructFactory(exports.SYNTHETIC_CSS_MEDIA_RULE, {
    type: constants_1.CSSRuleType.MEDIA_RULE
});
exports.createSyntheticCSSFontFaceRule = aerial_common2_1.createStructFactory(exports.SYNTHETIC_CSS_FONT_FACE_RULE, {
    type: constants_1.CSSRuleType.FONT_FACE_RULE
});
exports.createSyntheticCSSKeyframeRule = aerial_common2_1.createStructFactory(exports.SYNTHETIC_CSS_KEYFRAME_RULE, {
    type: constants_1.CSSRuleType.KEYFRAME_RULE
});
exports.createSyntheticCSSKeyframesRule = aerial_common2_1.createStructFactory(exports.SYNTHETIC_CSS_KEYFRAMES_RULE, {
    type: constants_1.CSSRuleType.KEYFRAMES_RULE
});
exports.createSyntheticCSSUnknownGroupingRule = aerial_common2_1.createStructFactory(exports.SYNTHETIC_CSS_UNKNOWN_RULE, {
    type: constants_1.CSSRuleType.UNKNOWN_RULE
});
exports.getFileCacheItem = function (uri, state) { return state.fileCache && state.fileCache[uri]; };
exports.setFileCacheItem = function (uri, content, mtime, state) {
    if (exports.getFileCacheItem(uri, state) && exports.getFileCacheItem(uri, state).mtime.getTime() === mtime.getTime()) {
        return state;
    }
    return __assign({}, state, { fileCache: __assign({}, (state.fileCache || {}), (_a = {}, _a[uri] = {
            content: content,
            mtime: mtime
        }, _a)) });
    var _a;
};
exports.createSyntheticCSSStyleDeclaration = aerial_common2_1.createStructFactory(exports.SYNTHETIC_CSS_STYLE_DECLARATION);
exports.createSyntheticDocument = aerial_common2_1.nonSerializableFactory(aerial_common2_1.createStructFactory(exports.SYNTHETIC_DOCUMENT, {
    nodeName: "#document",
    nodeType: constants_1.SEnvNodeTypes.DOCUMENT
}));
exports.createSyntheticElement = aerial_common2_1.createStructFactory(exports.SYNTHETIC_ELEMENT, {
    nodeType: constants_1.SEnvNodeTypes.ELEMENT
});
exports.createSyntheticTextNode = aerial_common2_1.createStructFactory(exports.SYNTHETIC_TEXT_NODE, {
    nodeName: "#text",
    nodeType: constants_1.SEnvNodeTypes.TEXT
});
exports.createSyntheticComment = aerial_common2_1.createStructFactory(exports.SYNTHETIC_COMMENT, {
    nodeName: "#comment",
    nodeType: constants_1.SEnvNodeTypes.COMMENT
});
// TODO - move all utils here to utils folder
exports.isSyntheticDOMNode = function (value) { return value && value.constructor === Object && value.nodeType != null; };
exports.getSyntheticBrowsers = aerial_common2_1.weakMemo(function (root) { return root.browserStore.records; });
var getIdQuery = aerial_common2_1.weakMemo(function (id) { return ({
    $id: id
}); });
exports.getSyntheticBrowser = function (root, id) { return aerial_common2_1.dsFind(root.browserStore, getIdQuery(id)); };
exports.getSyntheticWindow = function (root, id) {
    var filter = function (window) { return window.$id === id; };
    return root.browserStore ? exports.eachSyntheticWindow(root, filter) : root.windows.find(filter);
};
exports.getSyntheticBrowserBounds = function (browser, filter) {
    if (filter === void 0) { filter = function (window) { return true; }; }
    var availWindows = browser.windows.filter(filter);
    return availWindows.length ? availWindows.map(function (window) { return window.bounds; }).reduce(function (a, b) { return ({
        left: Math.min(a.left, b.left),
        top: Math.min(a.top, b.top),
        right: Math.max(a.right, b.right),
        bottom: Math.max(a.bottom, b.bottom)
    }); }, { left: Infinity, top: Infinity, right: -Infinity, bottom: -Infinity }) : aerial_common2_1.createZeroBounds();
};
exports.updateSyntheticBrowser = function (root, browserId, properties) {
    var browser = exports.getSyntheticBrowser(root, browserId);
    return __assign({}, root, { browserStore: aerial_common2_1.dsUpdate(root.browserStore, { $id: browser.$id }, __assign({}, browser, properties)) });
};
exports.updateSyntheticWindow = function (root, windowId, properties) {
    var browser = exports.getSyntheticWindowBrowser(root, windowId);
    var window = exports.getSyntheticWindow(browser, windowId);
    return exports.updateSyntheticBrowser(root, browser.$id, {
        windows: aerial_common2_1.arrayReplaceItem(browser.windows, window, __assign({}, window, properties))
    });
};
exports.upsertSyntheticWindow = function (root, browserId, newWindow) {
    var browser = exports.getSyntheticBrowser(root, browserId);
    var window = exports.getSyntheticWindow(browser, newWindow.$id);
    if (window) {
        return exports.updateSyntheticWindow(root, window.$id, newWindow);
    }
    return exports.updateSyntheticBrowser(root, browser.$id, {
        windows: browser.windows.concat([
            __assign({}, newWindow)
        ])
    });
};
exports.getSyntheticWindowChildStructs = aerial_common2_1.weakMemo(function (window) {
    var instances = environment_1.flattenWindowObjectSources(window);
    var children = {};
    for (var $id in instances) {
        children[$id] = instances[$id].struct;
    }
    return children;
});
exports.getSyntheticWindowChild = function (window, id) { return exports.getSyntheticWindowChildStructs(window)[id]; };
exports.getSyntheticNodeAncestors = aerial_common2_1.weakMemo(function (node, window) {
    var prev = node;
    var current = node;
    var ancestors = [];
    var checkedShadowRoots = [];
    while (1) {
        // if (current.nodeType === SEnvNodeTypes.ELEMENT) {
        //   const element = current as SyntheticElement;
        //   if (element.shadowRoot && ancestors.indexOf(element.shadowRoot) === -1) {
        //   }
        // }
        prev = current;
        current = exports.getSyntheticWindowChild(window, current.parentId || current.hostId);
        if (!current) {
            break;
        }
        // dive into slots
        if (current.nodeType === constants_1.SEnvNodeTypes.ELEMENT) {
            var element = current;
            if (!prev.hostId && element.shadowRoot && checkedShadowRoots.indexOf(element.shadowRoot) === -1) {
                checkedShadowRoots.push(element.shadowRoot);
                var slotName = prev.nodeType === constants_1.SEnvNodeTypes.ELEMENT ? exports.getSyntheticElementAttribute("slot", prev) : null;
                var slot = element.shadowRoot.instance.querySelector(slotName ? "slot[name=" + slotName + "]" : "slot");
                if (!slot) {
                    break;
                }
                current = slot.struct;
            }
        }
        ancestors.push(current);
    }
    return ancestors;
});
exports.getComputedStyle = aerial_common2_1.weakMemo(function (elementId, window) {
    return window.allComputedStyles[elementId];
});
exports.getSyntheticParentNode = function (node, window) { return exports.getSyntheticWindowChild(window, node.parentId); };
exports.removeSyntheticWindow = function (root, windowId) {
    var browser = exports.getSyntheticWindowBrowser(root, windowId);
    return exports.updateSyntheticBrowser(root, browser.$id, {
        windows: aerial_common2_1.arrayRemoveItem(browser.windows, exports.getSyntheticWindow(browser, windowId))
    });
};
exports.getSyntheticWindowBrowser = aerial_common2_1.weakMemo(function (root, windowId) {
    for (var _i = 0, _a = exports.getSyntheticBrowsers(root); _i < _a.length; _i++) {
        var browser = _a[_i];
        for (var _b = 0, _c = browser.windows; _b < _c.length; _b++) {
            var window_1 = _c[_b];
            if (window_1.$id === windowId)
                return browser;
        }
    }
    return null;
});
function getSyntheticNodeById(root, id) {
    var window = root.$type === exports.SYNTHETIC_WINDOW ? root : exports.getSyntheticNodeWindow(root, id);
    return window && exports.getSyntheticWindowChild(window, id);
}
exports.getSyntheticNodeById = getSyntheticNodeById;
;
exports.getSyntheticNodeTextContent = aerial_common2_1.weakMemo(function (node) {
    var text = "";
    aerial_common2_1.traverseObject(node, function (child) {
        if (exports.isSyntheticDOMNode(child) && child.nodeType === constants_1.SEnvNodeTypes.TEXT) {
            text += child.nodeValue;
        }
    });
    return text;
});
exports.eachSyntheticWindow = aerial_common2_1.weakMemo(function (_a, each) {
    var browserStore = _a.browserStore;
    for (var _i = 0, _b = browserStore.records; _i < _b.length; _i++) {
        var syntheticBrowser = _b[_i];
        for (var _c = 0, _d = syntheticBrowser.windows; _c < _d.length; _c++) {
            var window_2 = _d[_c];
            if (each(window_2) === true)
                return window_2;
        }
    }
    return null;
});
exports.getSyntheticNodeWindow = aerial_common2_1.weakMemo(function (root, nodeId) {
    var filter = function (window) { return exports.syntheticWindowContainsNode(window, nodeId); };
    return root.browserStore ? exports.eachSyntheticWindow(root, filter) : root.windows.find(filter);
});
exports.getMatchingElements = aerial_common2_1.weakMemo(function (window, selectorText) { return Array.prototype.map.call(window.document.instance.querySelectorAll(selectorText), function (element) { return element.struct; }); });
exports.elementMatches = aerial_common2_1.weakMemo(function (selectorText, element, window) { return element.instance.matches(selectorText); });
exports.syntheticWindowContainsNode = aerial_common2_1.weakMemo(function (window, nodeId) {
    return Boolean(exports.getSyntheticWindowChild(window, nodeId));
});
exports.syntheticNodeIsRelative = aerial_common2_1.weakMemo(function (window, nodeId, refNodeId) {
    var node = exports.getSyntheticWindowChild(window, nodeId);
    var refNode = exports.getSyntheticWindowChild(window, refNodeId);
    if (!node || !refNode) {
        return false;
    }
    var nodeAncestors = exports.getSyntheticNodeAncestors(node, window);
    var refNodeAncestors = exports.getSyntheticNodeAncestors(refNode, window);
    return refNodeAncestors.indexOf(node) !== -1 || nodeAncestors.indexOf(refNode) !== -1;
});
exports.isSyntheticBrowserItemMovable = function (root, item) {
    if (item.$type === exports.SYNTHETIC_WINDOW)
        return true;
    if (exports.isSyntheticNodeType(item.$type) && item.nodeType === constants_1.SEnvNodeTypes.ELEMENT) {
        var element = item;
    }
    return false;
};
// TODO - use getElementLabel instead
exports.getSyntheticElementAttribute = function (name, element) {
    var attr = element.attributes.find(function (attribute) { return attribute.name === name; });
    return attr && attr.value;
};
exports.getSyntheticElementLabel = function (element) {
    var label = String(element.nodeName).toLowerCase();
    var className = exports.getSyntheticElementAttribute("class", element);
    var id = exports.getSyntheticElementAttribute("id", element);
    if (id) {
        label += "#" + id;
    }
    else if (className) {
        label += "." + className;
    }
    return label;
};
//# sourceMappingURL=index.js.map

/***/ })

})