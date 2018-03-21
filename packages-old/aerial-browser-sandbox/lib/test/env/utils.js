"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var environment_1 = require("../../environment");
exports.openTestWindow = function (htmlOrFiles, context) {
    if (htmlOrFiles === void 0) { htmlOrFiles = ""; }
    if (context === void 0) { context = {}; }
    var files = typeof htmlOrFiles === "string" ? { "local://index.html": htmlOrFiles } : htmlOrFiles;
    var fetchFile = typeof files === "function" ? files : function (info) { return Promise.resolve(files[info]); };
    return environment_1.openSyntheticEnvironmentWindow("local://index.html", __assign({ fetch: function (info) {
            return Promise.resolve({
                text: function () {
                    return fetchFile(info);
                }
            });
        } }, context));
};
exports.waitForDocumentComplete = function (window) { return new Promise(function (resolve) {
    window.document.onreadystatechange = function () {
        if (window.document.readyState === "complete") {
            resolve();
        }
    };
}); };
exports.wrapHTML = function (content) {
    if (content === void 0) { content = ""; }
    return "<html><head></head><body>" + content + "</body></html>";
};
__export(require("../utils"));
//# sourceMappingURL=utils.js.map