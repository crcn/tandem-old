webpackHotUpdate(0,{

/***/ "./node_modules/codemirror/lib/codemirror.css":
false,

/***/ "./node_modules/codemirror/lib/codemirror.js":
false,

/***/ "./node_modules/codemirror/mode/css/css.js":
false,

/***/ "./node_modules/codemirror/mode/javascript/javascript.js":
false,

/***/ "./node_modules/codemirror/mode/xml/xml.js":
false,

/***/ "./node_modules/codemirror/theme/dracula.css":
false,

/***/ "./node_modules/create-react-class/index.js":
false,

/***/ "./node_modules/lodash.debounce/index.js":
false,

/***/ "./node_modules/lodash.isequal/index.js":
false,

/***/ "./node_modules/react-codemirror/lib/Codemirror.js":
false,

/***/ "./src/front-end/components/main/workspace/index.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__("./src/front-end/components/main/workspace/index.scss");
var React = __webpack_require__("./node_modules/react/react.js");
var recompose_1 = __webpack_require__("./node_modules/recompose/es/Recompose.js");
var element_gutter_1 = __webpack_require__("./src/front-end/components/main/workspace/element-gutter/index.tsx");
var project_gutter_1 = __webpack_require__("./src/front-end/components/main/workspace/project-gutter/index.tsx");
var stage_1 = __webpack_require__("./src/front-end/components/main/workspace/stage/index.tsx");
var breadcrumbs_1 = __webpack_require__("./src/front-end/components/main/workspace/breadcrumbs/index.tsx");
var react_dnd_1 = __webpack_require__("./node_modules/react-dnd/lib/index.js");
var react_dnd_html5_backend_1 = __webpack_require__("./node_modules/react-dnd-html5-backend/lib/index.js");
exports.WorkspaceBase = function (_a) {
    var state = _a.state, workspace = _a.workspace, browser = _a.browser, dispatch = _a.dispatch;
    var stage = workspace.stage;
    return React.createElement("div", { className: "workspace-component" },
        stage.showLeftGutter ? React.createElement(project_gutter_1.ProjectGutter, { workspace: workspace, browser: browser, dispatch: dispatch }) : null,
        React.createElement("div", { className: "workspace-editors" },
            React.createElement("div", { className: "workspace-stage" },
                React.createElement(stage_1.Stage, { workspace: workspace, dispatch: dispatch, browser: browser }),
                React.createElement(breadcrumbs_1.Breadcrumbs, { workspace: workspace, dispatch: dispatch, browser: browser }))),
        stage.showRightGutter ? React.createElement(element_gutter_1.ElementGutter, { browser: browser, workspace: workspace, dispatch: dispatch }) : null);
};
exports.Workspace = recompose_1.compose(recompose_1.pure, react_dnd_1.DragDropContext(react_dnd_html5_backend_1.default))(exports.WorkspaceBase);


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/components/main/workspace/index.tsx"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/components/main/workspace/index.tsx"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "./src/front-end/components/main/workspace/text-editor/index.scss":
false,

/***/ "./src/front-end/components/main/workspace/text-editor/index.tsx":
false

})