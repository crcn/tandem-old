"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
require("./artboards.scss");
var VOID_ELEMENTS = require("void-elements");
var React = require("react");
var recompose_1 = require("recompose");
var artboard_1 = require("./artboard");
exports.ArtboardsBase = function (_a) {
    var workspace = _a.workspace, fullScreenArtboardId = _a.fullScreenArtboardId, dispatch = _a.dispatch, smooth = _a.smooth;
    return React.createElement("div", { className: "preview-component" }, workspace.artboards.map(function (artboard) { return React.createElement(artboard_1.Artboard, { smooth: smooth, fullScreenArtboardId: fullScreenArtboardId, dispatch: dispatch, key: artboard.$id, artboard: artboard }); }));
};
exports.Artboards = recompose_1.pure(exports.ArtboardsBase);
__export(require("./artboard"));
//# sourceMappingURL=artboards.js.map