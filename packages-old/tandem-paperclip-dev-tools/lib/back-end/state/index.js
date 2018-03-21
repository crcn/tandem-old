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
var slim_dom_1 = require("slim-dom");
var paperclip_1 = require("paperclip");
exports.updateApplicationState = function (state, properties) { return (__assign({}, state, properties)); };
exports.addComponentScreenshot = function (screenshot, state) { return exports.updateApplicationState(state, {
    componentScreenshots: state.componentScreenshots.concat([screenshot])
}); };
exports.removeComponentScreenshot = function (uri, state) {
    var index = state.componentScreenshots.findIndex(function (screenshot) { return screenshot.uri === uri; });
    if (index === -1) {
        return state;
    }
    return exports.updateApplicationState(state, {
        componentScreenshots: aerial_common2_1.arrayRemoveIndex(state.componentScreenshots, index)
    });
};
exports.addPreviewDocument = function (componentId, previewName, document, root) {
    var key = getPreviewHash(componentId, previewName, root);
    return exports.updateApplicationState(root, {
        previewDocuments: __assign({}, root.previewDocuments, (_a = {}, _a[key] = (root.previewDocuments[key] || []).concat([
            document
        ]), _a))
    });
    var _a;
};
exports.limitPreviewDocuments = function (componentId, previewName, max, root) {
    var key = getPreviewHash(componentId, previewName, root);
    if (root.previewDocuments[key].length > max) {
        return exports.updateApplicationState(root, {
            previewDocuments: __assign({}, root.previewDocuments, (_a = {}, _a[key] = root.previewDocuments[key].slice(1), _a))
        });
    }
    return root;
    var _a;
};
exports.getLatestPreviewDocument = function (componentId, previewName, root) {
    var key = getPreviewHash(componentId, previewName, root);
    var docs = root.previewDocuments[key];
    return docs && docs.length ? docs[docs.length - 1] : null;
};
exports.getPreviewDocumentByChecksum = function (componentId, previewName, checksum, root) {
    var key = getPreviewHash(componentId, previewName, root);
    var docs = root.previewDocuments[key];
    if (checksum === "latest") {
        return docs[docs.length - 1];
    }
    return docs.find(function (doc) { return slim_dom_1.getDocumentChecksum(doc) === checksum; });
};
var getPreviewHash = function (componentId, previewName, _a) {
    var graph = _a.graph;
    if (previewName) {
        return componentId + previewName;
    }
    var component = paperclip_1.getAllComponents(graph)[componentId];
    return componentId + component.previews[0].name;
};
exports.updateFileCacheItem = function (state, item) {
    var index = state.fileCache.findIndex(function (v) { return v.filePath === item.filePath; });
    return exports.updateApplicationState(state, {
        fileCache: index > -1 ? aerial_common2_1.arraySplice(state.fileCache, index, 1, item) : aerial_common2_1.arraySplice(state.fileCache, 0, 0, item)
    });
};
exports.removeFileCacheItem = function (state, filePath) {
    var index = state.fileCache.findIndex(function (v) { return v.filePath === filePath; });
    return exports.updateApplicationState(state, {
        fileCache: index > -1 ? aerial_common2_1.arraySplice(state.fileCache, index, 1) : state.fileCache
    });
};
exports.getFileCacheContent = function (filePath, state) {
    var item = state.fileCache.find(function (item) { return item.filePath === filePath; });
    return item && item.content;
};
//# sourceMappingURL=index.js.map