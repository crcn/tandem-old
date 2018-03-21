webpackHotUpdate(0,{

/***/ "./src/front-end/components/main/workspace/text-editor/index.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(setImmediate, process) {
Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__("./src/front-end/components/main/workspace/text-editor/index.scss");
if (typeof window !== "undefined") {
    __webpack_require__("./node_modules/codemirror/lib/codemirror.css");
    __webpack_require__("./node_modules/codemirror/mode/javascript/javascript.js");
    __webpack_require__("./node_modules/codemirror/mode/xml/xml.js");
    __webpack_require__("./node_modules/codemirror/mode/css/css.js");
    __webpack_require__("./node_modules/codemirror/theme/dracula.css");
}
var React = __webpack_require__("./node_modules/react/react.js");
var CodeMirror = __webpack_require__("./node_modules/react-codemirror/lib/Codemirror.js");
var recompose_1 = __webpack_require__("./node_modules/recompose/es/Recompose.js");
var MODES = {
    "application/javascript": "javascript",
    "text/html": "xml",
    "text/css": "css",
};
exports.TextEditorBase = function (_a) {
    var options = _a.options, file = _a.file, dispatch = _a.dispatch, setCodeMirror = _a.setCodeMirror;
    return React.createElement("div", { className: "text-editor-component" },
        React.createElement(CodeMirror, { ref: setCodeMirror, options: {
                theme: "dracula",
                mode: file && MODES[file.contentType]
            } }));
};
exports.TextEditor = recompose_1.compose(recompose_1.pure, recompose_1.withState("codeMirror", "setCodeMirror", null), recompose_1.lifecycle({
    componentWillUpdate: function (_a) {
        var codeMirror = _a.codeMirror, cursorPosition = _a.cursorPosition, file = _a.file;
        if (codeMirror) {
            if (cursorPosition !== this.props.cursorPosition) {
                setImmediate(function () {
                    codeMirror.focus();
                    codeMirror.codeMirror.setCursor({ line: cursorPosition.line - 1, ch: cursorPosition.column - 1 });
                });
            }
            if (file !== this["_file"] && codeMirror.codeMirror.getValue() !== String(file.content)) {
                this["_file"] = file;
                var scrollInfo = codeMirror.codeMirror.getScrollInfo();
                codeMirror.codeMirror.setValue(String(file.content));
                codeMirror.codeMirror.scrollTo(scrollInfo.left, scrollInfo.top);
            }
        }
    }
}))(exports.TextEditorBase);


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/components/main/workspace/text-editor/index.tsx"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/components/main/workspace/text-editor/index.tsx"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/timers-browserify/main.js").setImmediate, __webpack_require__("./node_modules/process/browser.js")))

/***/ })

})