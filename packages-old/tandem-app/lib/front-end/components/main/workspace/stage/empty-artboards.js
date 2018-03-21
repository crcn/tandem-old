"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./empty-artboards.scss");
var React = require("react");
var recompose_1 = require("recompose");
var EmptyArtboardsBase = function () {
    return React.createElement("div", { className: "m-empty-artboards" }, "Drag and drop a component here.");
};
var enhanceEmptyArboards = recompose_1.compose(recompose_1.pure, recompose_1.withHandlers({}));
exports.EmptyArtboards = enhanceEmptyArboards(EmptyArtboardsBase);
//# sourceMappingURL=empty-artboards.js.map