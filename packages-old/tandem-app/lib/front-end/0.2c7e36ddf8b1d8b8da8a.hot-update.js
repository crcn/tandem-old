webpackHotUpdate(0,{

/***/ "./src/front-end/components/main/workspace/stage/window.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__("./src/front-end/components/main/workspace/stage/window.scss");
var VOID_ELEMENTS = __webpack_require__("./node_modules/void-elements/index.js");
var React = __webpack_require__("./node_modules/react/react.js");
var react_motion_1 = __webpack_require__("./node_modules/react-motion/lib/react-motion.js");
var recompose_1 = __webpack_require__("./node_modules/recompose/es/Recompose.js");
var actions_1 = __webpack_require__("./src/front-end/actions/index.ts");
var stiffSpring = function (amount) { return react_motion_1.spring(amount, { stiffness: 330, damping: 30 }); };
var WindowMountBase = function (_a) {
    var setContainer = _a.setContainer;
    return React.createElement("div", { ref: setContainer });
};
var enhanceWindowMount = recompose_1.compose(recompose_1.pure, recompose_1.withState("container", "setContainer", null), recompose_1.lifecycle({
    shouldComponentUpdate: function (props) {
        console.log(this.props.renderContainer === props.renderContainer, props.renderContainer);
        return this.props.renderContainer !== props.renderContainer || this.props.container !== props.container;
    },
    componentDidUpdate: function () {
        var _a = this.props, container = _a.container, renderContainer = _a.renderContainer;
        if (container && renderContainer) {
            console.log("UP INNER");
            if (container.firstChild) {
                container.removeChild(container.firstChild);
            }
            container.appendChild(renderContainer);
            // TODO - dispatch mounted here
        }
    }
}));
var WindowMount = enhanceWindowMount(WindowMountBase);
var WindowBase = function (_a) {
    var window = _a.window, fullScreenWindowId = _a.fullScreenWindowId, dispatch = _a.dispatch, smooth = _a.smooth;
    var bounds = window.bounds, document = window.document;
    var style = {
        left: bounds.left,
        top: bounds.top,
        width: bounds.right - bounds.left,
        height: bounds.bottom - bounds.top,
    };
    var defaultStyle = {
        // default to white since window background colors
        // are white too (CC)
        background: "white",
        display: fullScreenWindowId && window.$id !== fullScreenWindowId ? "none" : undefined
    };
    var smoothStyle = smooth ? {
        left: stiffSpring(style.left),
        top: stiffSpring(style.top),
        width: stiffSpring(style.width),
        height: stiffSpring(style.height)
    } : style;
    return React.createElement(react_motion_1.Motion, { defaultStyle: style, style: smoothStyle, onRest: function () { return dispatch(actions_1.canvasMotionRested()); } }, function (style) {
        return React.createElement("div", { className: "preview-window-component", style: __assign({}, style, defaultStyle) },
            React.createElement(WindowMount, { renderContainer: window.renderContainer }));
    });
};
exports.Window = recompose_1.pure(WindowBase);
exports.Preview = function () { return React.createElement("div", null, "PREVIEW!"); };


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/components/main/workspace/stage/window.tsx"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/components/main/workspace/stage/window.tsx"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "./src/front-end/components/main/workspace/stage/windows.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__("./src/front-end/components/main/workspace/stage/windows.scss");
var VOID_ELEMENTS = __webpack_require__("./node_modules/void-elements/index.js");
var React = __webpack_require__("./node_modules/react/react.js");
var recompose_1 = __webpack_require__("./node_modules/recompose/es/Recompose.js");
var window_1 = __webpack_require__("./src/front-end/components/main/workspace/stage/window.tsx");
exports.WindowsBase = function (_a) {
    var _b = _a.browser, browser = _b === void 0 ? null : _b, fullScreenWindowId = _a.fullScreenWindowId, dispatch = _a.dispatch, smooth = _a.smooth;
    return browser && React.createElement("div", { className: "preview-component" }, browser.windows.map(function (window) { return React.createElement(window_1.Window, { smooth: smooth, fullScreenWindowId: fullScreenWindowId, dispatch: dispatch, key: window.$id, window: window }); }));
};
exports.Windows = recompose_1.pure(exports.WindowsBase);
__export(__webpack_require__("./src/front-end/components/main/workspace/stage/window.tsx"));


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/components/main/workspace/stage/windows.tsx"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/components/main/workspace/stage/windows.tsx"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ })

})