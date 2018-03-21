"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var aerial_common2_1 = require("aerial-common2");
exports.ALERT = "ALERT";
exports.EXTENSION_ACTIVATED = "EXTENSION_ACTIVATED";
exports.VISUAL_DEV_CONFIG_LOADED = "VISUAL_DEV_CONFIG_LOADED";
exports.CHILD_DEV_SERVER_STARTED = "CHILD_DEV_SERVER_STARTED";
exports.MUTATE_SOURCE_CONTENT = "MUTATE_SOURCE_CONTENT";
exports.FILE_CONTENT_CHANGED = "FILE_CONTENT_CHANGED";
exports.FILE_REMOVED = "FILE_REMOVED";
exports.DEPENDENCY_GRAPH_LOADED = "DEPENDENCY_GRAPH_LOADED";
exports.HEADLESS_BROWSER_LAUNCHED = "HEADLESS_BROWSER_LAUNCHED";
exports.COMPONENT_SCREENSHOT_SAVED = "COMPONENT_SCREENSHOT_SAVED";
exports.COMPONENT_SCREENSHOT_STARTED = "COMPONENT_SCREENSHOT_STARTED";
exports.MODULE_CREATED = "MODULE_CREATED";
exports.COMPONENT_SCREENSHOT_TAKEN = "COMPONENT_SCREENSHOT_TAKEN";
exports.COMPONENT_SCREENSHOT_REMOVED = "COMPONENT_SCREENSHOT_REMOVED";
exports.START_DEV_SERVER_EXECUTED = "START_DEV_SERVER_EXECUTED";
exports.STOP_DEV_SERVER_EXECUTED = "STOP_DEV_SERVER_EXECUTED";
exports.WATCH_URIS_REQUESTED = "WATCH_URIS_REQUESTED";
exports.WATCHING_FILES = "WATCHING_FILES";
exports.INIT_SERVER_REQUESTED = "INIT_SERVER_REQUESTED";
exports.EXPRESS_SERVER_STARTED = "EXPRESS_SERVER_STARTED";
exports.PREVIEW_EVALUATED = "PREVIEW_EVALUATED";
exports.PREVIEW_DIFFED = "PREVIEW_DIFFED";
var AlertLevel;
(function (AlertLevel) {
    AlertLevel[AlertLevel["NOTICE"] = 0] = "NOTICE";
    AlertLevel[AlertLevel["ERROR"] = 1] = "ERROR";
    AlertLevel[AlertLevel["WARNING"] = 2] = "WARNING";
})(AlertLevel = exports.AlertLevel || (exports.AlertLevel = {}));
;
exports.moduleCreated = function (filePath, publicPath, content) { return ({
    filePath: filePath,
    content: content,
    publicPath: publicPath,
    mtime: new Date(),
    $public: true,
    type: exports.MODULE_CREATED
}); };
exports.initServerRequested = function (options) { return ({
    type: exports.INIT_SERVER_REQUESTED,
    options: options,
    $public: true
}); };
exports.watchUrisRequested = function (uris) { return ({
    uris: uris,
    type: exports.WATCH_URIS_REQUESTED
}); };
exports.extensionActivated = function () { return ({
    type: exports.EXTENSION_ACTIVATED
}); };
exports.fileContentChanged = function (filePath, publicPath, content, mtime) { return ({
    type: exports.FILE_CONTENT_CHANGED,
    content: content,
    filePath: filePath,
    publicPath: publicPath,
    mtime: mtime,
    $public: true
}); };
exports.fileRemoved = function (filePath, publicPath) { return ({
    type: exports.FILE_REMOVED,
    filePath: filePath,
    publicPath: publicPath,
    $public: true
}); };
exports.componentScreenshotTaken = function (buffer, clippings, contentType) { return ({
    buffer: buffer,
    contentType: contentType,
    clippings: clippings,
    type: exports.COMPONENT_SCREENSHOT_TAKEN
}); };
exports.componentScreenshotStarted = function () { return ({
    type: exports.COMPONENT_SCREENSHOT_STARTED
}); };
exports.headlessBrowserLaunched = function (browser) { return ({
    type: exports.HEADLESS_BROWSER_LAUNCHED,
    browser: browser
}); };
exports.componentScreenshotSaved = aerial_common2_1.publicActionFactory(function (uri, clippings) { return ({
    type: exports.COMPONENT_SCREENSHOT_SAVED,
    clippings: clippings,
    uri: uri
}); });
exports.componentScreenshotRemoved = function (uri) { return ({
    type: exports.COMPONENT_SCREENSHOT_REMOVED,
    uri: uri
}); };
exports.dependencyGraphLoaded = function (graph) { return ({
    graph: graph,
    type: exports.DEPENDENCY_GRAPH_LOADED
}); };
exports.previewEvaluated = function (componentId, previewName, document) { return ({
    componentId: componentId,
    previewName: previewName,
    document: document,
    type: exports.PREVIEW_EVALUATED
}); };
exports.previewDiffed = function (componentId, previewName, documentChecksum, diff) { return ({
    componentId: componentId,
    previewName: previewName,
    documentChecksum: documentChecksum,
    diff: diff,
    type: exports.PREVIEW_DIFFED,
    $public: true
}); };
exports.childDevServerStarted = function (port) { return ({
    port: port,
    type: exports.CHILD_DEV_SERVER_STARTED
}); };
exports.watchingFiles = function (initialFileCache) { return ({
    type: exports.WATCHING_FILES,
    initialFileCache: initialFileCache
}); };
exports.startDevServerExecuted = function () { return ({
    type: exports.START_DEV_SERVER_EXECUTED
}); };
exports.expressServerStarted = function (server) { return ({
    type: exports.EXPRESS_SERVER_STARTED,
    server: server
}); };
//# sourceMappingURL=index.js.map