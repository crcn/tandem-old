webpackHotUpdate(0,{

/***/ "../paperclip/lib/parser-utils.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var DiagnosticType;
(function (DiagnosticType) {
    DiagnosticType["WARNING"] = "WARNING";
    DiagnosticType["ERROR"] = "ERROR";
})(DiagnosticType = exports.DiagnosticType || (exports.DiagnosticType = {}));
;
// TODO - possibly colorize
exports.generatePrettyErrorMessage = function (_a, graph) {
    var location = _a.location, _b = _a.filePath, filePath = _b === void 0 ? "" : _b, message = _a.message;
    var prettyMessage = message + "\n\n";
    var source = graph[filePath].module.source.input;
    var sourceLines = source.split("\n");
    var targetLines = sourceLines.slice(location.start.line, location.end.line + 1).map(function (line) { return line + "\n"; });
    // const highlightedLines = [
    //   "\x1b[90m" + targetLines[0].substr(0, location.start.column)  + "\x1b[0m" +
    //   "\x1b[31m" + targetLines[0].substr(location.start.column) + "\x1b[0m",
    //   ...targetLines.slice(1, location.end.line - location.start.line).map(line => "\x1b[31m" + line + "\x1b[0m"),
    //   "\x1b[31m" + targetLines[targetLines.length - 1].substr(0, location.end.column) + "\x1b[0m" +
    //   "\x1b[90m" + targetLines[targetLines.length - 1].substr(location.end.column) + "\x1b[0m",
    // ];
    for (var i = 0, length_1 = targetLines.length; i < length_1; i++) {
        prettyMessage += location.start.line + i + "| " + targetLines[i];
    }
    return prettyMessage;
};
//# sourceMappingURL=parser-utils.js.map

/***/ }),

/***/ "./src/front-end/components/css-declaration-input.pc":
/***/ (function(module, exports) {

throw new Error("Module build failed: Error: Missing attribute \"show\"\n\n100|     <td-tooltip>\n101|       <div slot=\"button\" class=\"input-box\" style=[[bind { background: value }]] /> \n\n    at /Users/crcn/Developer/work/tandem/public/packages/paperclip-react-transpiler/lib/webpack-loader.js:20:29");

/***/ }),

/***/ "./src/front-end/components/css-inspector-pane.pc":
/***/ (function(module, exports) {

throw new Error("Module build failed: Error: Missing attribute \"open\"\n\n27|     <td-css-expr-input [[if !overridden]] value=[[bind value]] />\n28|     <span [[else]]>\n\n    at /Users/crcn/Developer/work/tandem/public/packages/paperclip-react-transpiler/lib/webpack-loader.js:20:29");

/***/ }),

/***/ "./src/front-end/components/gutter.pc":
/***/ (function(module, exports) {

throw new Error("Module build failed: Error: The right-hand side of an arithmetic operation must be a number\n\n157|       <div class=\"fill\" style=[[bind { width: value * 100 + \"%\" } ]]>\n158|       </div>\n\n    at /Users/crcn/Developer/work/tandem/public/packages/paperclip-react-transpiler/lib/webpack-loader.js:20:29");

/***/ }),

/***/ "./src/front-end/components/pane.pc":
/***/ (function(module, exports) {

throw new Error("Module build failed: Error: The right-hand side of an arithmetic operation must be a number\n\n157|       <div class=\"fill\" style=[[bind { width: value * 100 + \"%\" } ]]>\n158|       </div>\n\n    at /Users/crcn/Developer/work/tandem/public/packages/paperclip-react-transpiler/lib/webpack-loader.js:20:29");

/***/ }),

/***/ "./src/front-end/components/windows-pane.pc":
/***/ (function(module, exports) {

throw new Error("Module build failed: Error: Missing attribute \"document\"\n\n37|             <td-windows-pane-row [[bind window]] onClick=[[bind onWindowClicked]] />\n38|           </td-list-item>\n\n    at /Users/crcn/Developer/work/tandem/public/packages/paperclip-react-transpiler/lib/webpack-loader.js:20:29");

/***/ })

})