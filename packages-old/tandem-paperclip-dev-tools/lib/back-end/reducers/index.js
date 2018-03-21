"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var state_1 = require("../state");
var actions_1 = require("../actions");
var MAX_PREVIEW_DOCUMENTS = 10;
function mainReducer(state, event) {
    switch (event.type) {
        case actions_1.INIT_SERVER_REQUESTED: {
            var options = event.options;
            return state_1.updateApplicationState(state, {
                options: options
            });
        }
        case actions_1.WATCHING_FILES: {
            var initialFileCache = event.initialFileCache;
            return state_1.updateApplicationState(state, {
                fileCache: (state.fileCache || []).concat(initialFileCache)
            });
        }
        case actions_1.DEPENDENCY_GRAPH_LOADED: {
            var graph = event.graph;
            return state_1.updateApplicationState(state, { graph: graph });
        }
        case actions_1.WATCH_URIS_REQUESTED: {
            var uris = event.uris;
            // TODO - purge uris that are not in cache
            return state_1.updateApplicationState(state, {
                watchUris: uris
            });
        }
        case actions_1.PREVIEW_EVALUATED: {
            var _a = event, previewName = _a.previewName, componentId = _a.componentId, document_1 = _a.document;
            return state_1.limitPreviewDocuments(componentId, previewName, MAX_PREVIEW_DOCUMENTS, state_1.addPreviewDocument(componentId, previewName, document_1, state));
        }
        case actions_1.HEADLESS_BROWSER_LAUNCHED: {
            var headlessBrowser = event.browser;
            // TODO - purge uris that are not in cache
            return state_1.updateApplicationState(state, {
                headlessBrowser: headlessBrowser
            });
        }
        case actions_1.COMPONENT_SCREENSHOT_STARTED: {
            // TODO - purge uris that are not in cache
            return state_1.updateApplicationState(state, {
                shouldTakeAnotherScreenshot: false
            });
        }
        case actions_1.COMPONENT_SCREENSHOT_SAVED: {
            var _b = event, uri = _b.uri, clippings = _b.clippings;
            // TODO - purge uris that are not in cache
            return state_1.addComponentScreenshot({ uri: uri, clippings: clippings }, state);
        }
        case actions_1.COMPONENT_SCREENSHOT_REMOVED: {
            var uri = event.uri;
            // TODO - purge uris that are not in cache
            return state_1.removeComponentScreenshot(uri, state);
        }
        case actions_1.FILE_REMOVED: {
            var filePath = event.filePath;
            return state_1.removeFileCacheItem(state, filePath);
        }
        case actions_1.FILE_CONTENT_CHANGED: {
            var _c = event, filePath = _c.filePath, mtime = _c.mtime, content = _c.content;
            state = state_1.updateApplicationState(state, {
                shouldTakeAnotherScreenshot: true
            });
            return state_1.updateFileCacheItem(state, {
                filePath: filePath,
                mtime: mtime,
                content: typeof content === "object" ? content : new Buffer(content, "utf8"),
            });
        }
    }
    return state;
}
exports.mainReducer = mainReducer;
//# sourceMappingURL=index.js.map