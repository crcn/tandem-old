webpackHotUpdate(0,{

/***/ "./src/front-end/components/components-pane.tsx":
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
var React = __webpack_require__("./node_modules/react/react.js");
var recompose_1 = __webpack_require__("./node_modules/recompose/es/Recompose.js");
var components_pane_pc_1 = __webpack_require__("./src/front-end/components/components-pane.pc");
var pane_1 = __webpack_require__("./src/front-end/components/pane.tsx");
var actions_1 = __webpack_require__("./src/front-end/actions/index.ts");
var state_1 = __webpack_require__("./src/front-end/state/index.ts");
var ICON_SIZE = 110;
var enhanceComponentsPaneCell = recompose_1.compose(recompose_1.pure, state_1.withDragSource({
    getData: function (_a) {
        var tagName = _a.tagName;
        return [state_1.AVAILABLE_COMPONENT, tagName];
    },
    start: function (props) { return function (event) {
        if (props.screenshots.length) {
            var screenshot = props.screenshots[0];
            var nativeEvent = event.nativeEvent;
            var image = new Image();
            image.src = "/components/" + props.tagName + "/screenshots/" + screenshot.previewName + "/latest.png";
            document.body.appendChild(image);
            event.dataTransfer.setDragImage(image, 0, 0);
        }
    }; }
}), recompose_1.withHandlers({
    onClick: function (_a) {
        var dispatch = _a.dispatch, tagName = _a.tagName;
        return function (event) {
            dispatch(actions_1.componentsPaneComponentClicked(tagName, event));
        };
    }
}), function (Base) { return function (_a) {
    var label = _a.label, selected = _a.selected, screenshots = _a.screenshots, connectDragSource = _a.connectDragSource, onClick = _a.onClick, dispatch = _a.dispatch;
    var screenshot = screenshots.length ? screenshots[0] : null;
    var width = screenshot && screenshot.clip.right - screenshot.clip.left;
    var height = screenshot && screenshot.clip.bottom - screenshot.clip.top;
    var scale = 1;
    if (width >= height && width > ICON_SIZE) {
        scale = ICON_SIZE / width;
    }
    else if (height >= width && height > ICON_SIZE) {
        scale = ICON_SIZE / height;
    }
    return connectDragSource(React.createElement(Base, { label: label, onClick: onClick, selected: selected, screenshot: screenshot, screenshotScale: scale, hovering: false, onDragStart: null, onDragEnd: null }));
}; });
var enhanceComponentsPane = recompose_1.compose(recompose_1.pure, recompose_1.withHandlers({
    onAddComponentClick: function (_a) {
        var dispatch = _a.dispatch;
        return function (event) {
            dispatch(actions_1.componentsPaneAddComponentClicked());
        };
    }
}), function (Base) { return function (_a) {
    var workspace = _a.workspace, dispatch = _a.dispatch, onAddComponentClick = _a.onAddComponentClick;
    var components = (workspace.availableComponents || []).map(function (component) { return (__assign({}, component, { selected: workspace.selectionRefs.find(function (ref) { return ref[1] === component.tagName; }) })); });
    return React.createElement(Base, { components: components, dispatch: dispatch, onAddComponentClick: onAddComponentClick });
}; });
var ComponentsPaneCell = components_pane_pc_1.hydrateTdComponentsPaneCell(enhanceComponentsPaneCell, {});
exports.ComponentsPane = components_pane_pc_1.hydrateTdComponentsPane(enhanceComponentsPane, {
    TdPane: pane_1.Pane,
    TdComponentsPaneCell: ComponentsPaneCell
});


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/components/components-pane.tsx"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/components/components-pane.tsx"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "./src/front-end/components/enhanced.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__("./src/front-end/components/components-pane.tsx"));
__export(__webpack_require__("./src/front-end/components/windows-pane.tsx"));
__export(__webpack_require__("./src/front-end/components/gutter.tsx"));
__export(__webpack_require__("./src/front-end/components/css-inspector-pane.tsx"));
__export(__webpack_require__("./src/front-end/components/artboards-pane.tsx"));


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/components/enhanced.ts"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/components/enhanced.ts"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ })

})