webpackHotUpdate(0,{

/***/ "./src/front-end/components/main/workspace/project-gutter/index.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__("./node_modules/react/react.js");
var enhanced_1 = __webpack_require__("./src/front-end/components/enhanced.ts");
exports.ProjectGutterBase = function (_a) {
    var workspace = _a.workspace, browser = _a.browser, dispatch = _a.dispatch;
    return React.createElement(enhanced_1.Gutter, { left: true, right: false },
        React.createElement(enhanced_1.WindowsPane, { windows: browser.windows || [], dispatch: dispatch, workspace: workspace }),
        React.createElement(enhanced_1.ComponentsPane, { workspace: workspace, dispatch: dispatch }));
};
exports.ProjectGutter = exports.ProjectGutterBase;
// export * from "./file-navigator";
__export(__webpack_require__("./src/front-end/components/main/workspace/project-gutter/windows/index.tsx"));


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/components/main/workspace/project-gutter/index.tsx"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/components/main/workspace/project-gutter/index.tsx"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ })

})