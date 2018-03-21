"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var languageModelCache_1 = require("./languageModelCache");
var embeddedSupport_1 = require("./embeddedSupport");
var style_1 = require("./style");
var template_1 = require("./template");
function getLanguageModes(workspacePath, devToolsPort) {
    var documentRegions = languageModelCache_1.getLanguageModelCache(10, 60, function (document) { return embeddedSupport_1.getDocumentRegions(document); });
    var modelCaches = [];
    modelCaches.push(documentRegions);
    var modes = {
        paperclip: template_1.getPaperclipHTMLMode(documentRegions, workspacePath, devToolsPort),
        css: style_1.getCSSMode(documentRegions)
    };
    return {
        getModeAtPosition: function (document, position) {
            var languageId = documentRegions.get(document).getLanguageAtPosition(position);
            if (languageId) {
                return modes[languageId];
            }
            return null;
        },
        getModesInRange: function (document, range) {
            return documentRegions
                .get(document)
                .getLanguageRanges(range)
                .map(function (r) {
                return {
                    start: r.start,
                    end: r.end,
                    mode: modes[r.languageId],
                    attributeValue: r.attributeValue
                };
            });
        },
        getAllModesInDocument: function (document) {
            var result = [];
            for (var _i = 0, _a = documentRegions.get(document).getLanguagesInDocument(); _i < _a.length; _i++) {
                var languageId = _a[_i];
                var mode = modes[languageId];
                if (mode) {
                    result.push(mode);
                }
            }
            return result;
        },
        getAllModes: function () {
            var result = [];
            for (var languageId in modes) {
                var mode = modes[languageId];
                if (mode) {
                    result.push(mode);
                }
            }
            return result;
        },
        getMode: function (languageId) {
            return modes[languageId];
        },
        onDocumentRemoved: function (document) {
            modelCaches.forEach(function (mc) { return mc.onDocumentRemoved(document); });
            for (var mode in modes) {
                modes[mode].onDocumentRemoved(document);
            }
        },
        dispose: function () {
            modelCaches.forEach(function (mc) { return mc.dispose(); });
            modelCaches = [];
            for (var mode in modes) {
                modes[mode].dispose();
            }
            modes = {}; // drop all references
        }
    };
}
exports.getLanguageModes = getLanguageModes;
//# sourceMappingURL=languageModes.js.map