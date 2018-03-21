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
var aerial_common2_1 = require("aerial-common2");
exports.OPEN_SYNTHETIC_WINDOW = "OPEN_SYNTHETIC_WINDOW";
exports.TOGGLE_CSS_DECLARATION_PROPERTY = "TOGGLE_CSS_DECLARATION_PROPERTY";
exports.SYNTHETIC_WINDOW_RESOURCE_LOADED = "SYNTHETIC_WINDOW_RESOURCE_LOADED";
exports.NEW_SYNTHETIC_WINDOW_ENTRY_RESOLVED = "NEW_SYNTHETIC_WINDOW_ENTRY_RESOLVED";
exports.FETCH_REQUEST = "FETCH_REQUEST";
exports.SYNTHETIC_WINDOW_RECTS_UPDATED = "SYNTHETIC_WINDOW_RECTS_UPDATED";
exports.SYNTHETIC_WINDOW_LOADED = "SYNTHETIC_WINDOW_LOADED";
exports.SYNTHETIC_WINDOW_CHANGED = "SYNTHETIC_WINDOW_CHANGED";
exports.SYNTHETIC_NODE_TEXT_CONTENT_CHANGED = "SYNTHETIC_NODE_TEXT_CONTENT_CHANGED";
exports.NODE_VALUE_STOPPED_EDITING = "NODE_VALUE_STOPPED_EDITING";
exports.EDIT_SOURCE_CONTENT = "EDIT_SOURCE_CONTENT";
exports.MUTATE_SOURCE_CONTENT = "MUTATE_SOURCE_CONTENT";
exports.APPLY_FILE_MUTATIONS = "APPLY_FILE_MUTATIONS";
exports.DEFER_APPLY_FILE_MUTATIONS = "DEFER_APPLY_FILE_MUTATIONS";
exports.SYNTHETIC_WINDOW_SCROLLED = "SYNTHETIC_WINDOW_SCROLLED";
exports.SYNTHETIC_WINDOW_SCROLL = "SYNTHETIC_WINDOW_SCROLL";
exports.SYNTHETIC_WINDOW_OPENED = "SYNTHETIC_WINDOW_OPENED";
exports.SYNTHETIC_WINDOW_PROXY_OPENED = "SYNTHETIC_WINDOW_PROXY_OPENED";
exports.SYNTHETIC_WINDOW_MOVED = "SYNTHETIC_WINDOW_MOVED";
exports.SYNTHETIC_WINDOW_CLOSED = "SYNTHETIC_WINDOW_CLOSED";
exports.SYNTHETIC_WINDOW_RESIZED = "SYNTHETIC_WINDOW_RESIZED";
exports.SYNTHETIC_WINDOW_RESOURCE_CHANGED = "SYNTHETIC_WINDOW_RESOURCE_CHANGED";
exports.FILE_CONTENT_CHANGED = "FILE_CONTENT_CHANGED";
exports.FETCHED_CONTENT = "FETCHED_CONTENT";
exports.mutateSourceContentRequest = function (content, contentType, mutation) { return ({
    content: content,
    mutation: mutation,
    contentType: contentType,
    $id: aerial_common2_1.generateDefaultId(),
    type: exports.EDIT_SOURCE_CONTENT,
}); };
exports.toggleCSSDeclarationProperty = function (propertyName, cssDeclarationId, windowId) { return ({
    cssDeclarationId: cssDeclarationId,
    windowId: windowId,
    propertyName: propertyName,
    type: exports.TOGGLE_CSS_DECLARATION_PROPERTY
}); };
exports.mutateSourceContentRequest2 = function (mutations) { return ({
    mutations: mutations.map((function (mutation) { return (__assign({}, mutation, { target: { source: mutation.target.source }, child: mutation.child && { source: mutation.child.source } })); })),
    $id: aerial_common2_1.generateDefaultId(),
    type: exports.MUTATE_SOURCE_CONTENT,
}); };
exports.syntheticWindowOpened = function (instance, parentWindowId, isNew) { return ({
    parentWindowId: parentWindowId,
    instance: instance,
    isNew: isNew,
    type: exports.SYNTHETIC_WINDOW_OPENED
}); };
exports.syntheticWindowProxyOpened = function (instance, parentWindowId, isNew) { return ({
    parentWindowId: parentWindowId,
    instance: instance,
    isNew: isNew,
    type: exports.SYNTHETIC_WINDOW_PROXY_OPENED
}); };
exports.fetchedContent = function (publicPath, content) { return ({
    type: exports.FETCHED_CONTENT,
    publicPath: publicPath,
    content: content,
    mtime: null
}); };
exports.syntheticWindowMoved = function (instance) { return ({
    instance: instance,
    type: exports.SYNTHETIC_WINDOW_MOVED
}); };
exports.syntheticWindowClosed = function (instance) { return ({
    instance: instance,
    type: exports.SYNTHETIC_WINDOW_CLOSED
}); };
exports.syntheticWindowResized = function (instance) { return ({
    instance: instance,
    type: exports.SYNTHETIC_WINDOW_RESIZED
}); };
exports.syntheticWindowResourceChanged = function (uri) { return ({
    uri: uri,
    type: exports.SYNTHETIC_WINDOW_RESOURCE_CHANGED
}); };
exports.applyFileMutationsRequest = function () {
    var mutations = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        mutations[_i] = arguments[_i];
    }
    return ({
        mutations: mutations,
        $id: aerial_common2_1.generateDefaultId(),
        type: exports.APPLY_FILE_MUTATIONS,
    });
};
exports.fetchRequest = function (info) { return ({
    info: info,
    type: exports.FETCH_REQUEST,
    $id: aerial_common2_1.generateDefaultId()
}); };
exports.deferApplyFileMutationsRequest = function () {
    var mutations = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        mutations[_i] = arguments[_i];
    }
    return ({
        mutations: mutations,
        $id: aerial_common2_1.generateDefaultId(),
        type: exports.DEFER_APPLY_FILE_MUTATIONS,
    });
};
exports.testMutateContentRequest = function (contentType, mutationType) { return (function (action) { return action.type === exports.EDIT_SOURCE_CONTENT && action.contentType === contentType && (!mutationType || action.mutation.$type === mutationType); }); };
exports.syntheticNodeValueStoppedEditing = function (syntheticWindowId, nodeId) { return ({
    nodeId: nodeId,
    syntheticWindowId: syntheticWindowId,
    type: exports.NODE_VALUE_STOPPED_EDITING
}); };
exports.syntheticWindowScrolled = function (syntheticWindowId, scrollPosition) { return ({
    scrollPosition: scrollPosition,
    syntheticWindowId: syntheticWindowId,
    type: exports.SYNTHETIC_WINDOW_SCROLLED
}); };
exports.syntheticWindowScroll = function (syntheticWindowId, scrollPosition) { return ({
    scrollPosition: scrollPosition,
    syntheticWindowId: syntheticWindowId,
    type: exports.SYNTHETIC_WINDOW_SCROLL
}); };
exports.syntheticNodeTextContentChanged = function (syntheticWindowId, syntheticNodeId, textContent) { return ({
    textContent: textContent,
    syntheticNodeId: syntheticNodeId,
    syntheticWindowId: syntheticWindowId,
    type: exports.SYNTHETIC_NODE_TEXT_CONTENT_CHANGED
}); };
exports.openSyntheticWindowRequest = function (state, syntheticBrowserId, fromSavedState) { return ({
    state: state,
    syntheticBrowserId: syntheticBrowserId,
    type: exports.OPEN_SYNTHETIC_WINDOW,
    $id: aerial_common2_1.generateDefaultId()
}); };
exports.newSyntheticWindowEntryResolved = function (location, syntheticBrowserId) { return ({
    location: location,
    syntheticBrowserId: syntheticBrowserId,
    type: exports.NEW_SYNTHETIC_WINDOW_ENTRY_RESOLVED,
}); };
exports.syntheticWindowRectsUpdated = function (syntheticWindowId, rects, styles) { return ({
    rects: rects,
    styles: styles,
    syntheticWindowId: syntheticWindowId,
    type: exports.SYNTHETIC_WINDOW_RECTS_UPDATED,
}); };
exports.syntheticWindowResourceLoaded = function (syntheticWindowId, uri) { return ({
    uri: uri,
    syntheticWindowId: syntheticWindowId,
    type: exports.SYNTHETIC_WINDOW_RESOURCE_LOADED,
}); };
exports.syntheticWindowLoaded = function (instance) { return ({
    instance: instance,
    type: exports.SYNTHETIC_WINDOW_LOADED,
}); };
exports.syntheticWindowChanged = function (instance) { return ({
    instance: instance,
    type: exports.SYNTHETIC_WINDOW_CHANGED,
}); };
//# sourceMappingURL=index.js.map