webpackHotUpdate(0,{

/***/ "./src/front-end/components/css-inspector-pane.tsx":
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__("./node_modules/react/react.js");
var pane_1 = __webpack_require__("./src/front-end/components/pane.tsx");
var lodash_1 = __webpack_require__("./node_modules/lodash/lodash.js");
var recompose_1 = __webpack_require__("./node_modules/recompose/es/Recompose.js");
var paperclip_1 = __webpack_require__("../paperclip/index.js");
var css_declaration_input_pc_1 = __webpack_require__("./src/front-end/components/css-declaration-input.pc");
var css_inspector_pane_pc_1 = __webpack_require__("./src/front-end/components/css-inspector-pane.pc");
var aerial_browser_sandbox_1 = __webpack_require__("../aerial-browser-sandbox/index.js");
var enhanceCssCallExprInput = recompose_1.compose(recompose_1.pure, function (Base) { return function (_a) {
    var name = _a.name, params = _a.params, rest = __rest(_a, ["name", "params"]);
    var returnType;
    var returnValue = paperclip_1.stringifyDeclarationAST(__assign({ name: name,
        params: params }, rest));
    switch (name) {
        case "rgb":
        case "rgba": {
            returnType = "COLOR";
            break;
        }
    }
    return React.createElement(Base, __assign({ name: name, params: params, returnValue: returnValue, returnType: returnType }, rest));
}; });
var CssCallExprInput = css_declaration_input_pc_1.hydrateTdCssCallExprInput(enhanceCssCallExprInput, {
    TdColorMiniInput: null,
    TdCssExprInput: function (props) {
        return React.createElement(CSSExprInput, __assign({}, props));
    }
});
var enhanceCssNumberInput = recompose_1.compose(recompose_1.pure);
var CssNumberInput = css_declaration_input_pc_1.hydrateTdCssNumberExprInput(enhanceCssNumberInput, {});
var enhanceCssMeasurementInput = recompose_1.compose(recompose_1.pure);
var CssMeasurementInput = css_declaration_input_pc_1.hydrateTdCssMeasurementInput(enhanceCssMeasurementInput, {});
var enhanceCssKeywordInput = recompose_1.compose(recompose_1.pure);
var CssKeywordInput = css_declaration_input_pc_1.hydrateTdCssKeywordExprInput(enhanceCssKeywordInput, {});
var enhanceCssColorInput = recompose_1.compose(recompose_1.pure);
var CssColorInput = css_declaration_input_pc_1.hydrateTdCssColorExprInput(enhanceCssColorInput, {
    TdColorMiniInput: null
});
var enhanceCSSCallExprInput = recompose_1.compose(recompose_1.pure);
var enhanceCSSSpaced = recompose_1.compose(recompose_1.pure);
var CssSpacedList = css_declaration_input_pc_1.hydrateTdCssSpacedListExprInput(enhanceCSSSpaced, {
    TdCssExprInput: function (props) { return React.createElement(CSSExprInput, __assign({}, props)); }
});
var CssCommaList = css_declaration_input_pc_1.hydrateTdCssCommaListExprInput(enhanceCSSSpaced, {
    TdCssExprInput: function (props) { return React.createElement(CSSExprInput, __assign({}, props)); }
});
var CSSExprInput = css_declaration_input_pc_1.hydrateTdCssExprInput(enhanceCSSCallExprInput, {
    TdCssCallExprInput: CssCallExprInput,
    TdCssColorExprInput: CssColorInput,
    TdCssCommaListExprInput: CssCommaList,
    TdCssKeywordExprInput: CssKeywordInput,
    TdCssMeasurementInput: CssMeasurementInput,
    TdCssNumberExprInput: CssNumberInput,
    TdCssSpacedListExprInput: CssSpacedList
});
var enhanceCSSStyleDeclaration = recompose_1.compose(recompose_1.pure, function (Base) { return function (_a) {
    var name = _a.name, ignored = _a.ignored, disabled = _a.disabled, overridden = _a.overridden, value = _a.value;
    return React.createElement(Base, { name: lodash_1.kebabCase(name), ignored: ignored, disabled: disabled, overridden: overridden, value: paperclip_1.parseDeclaration(value), sourceValue: value });
}; });
var CSSStyleDeclaration = css_inspector_pane_pc_1.hydrateTdStyleDeclaration(enhanceCSSStyleDeclaration, {
    TdCssExprInput: CSSExprInput
});
var beautifyLabel = function (label) {
    return label.replace(/\s*,\s*/g, ", ");
};
var enhanceCSSStyleRule = recompose_1.compose(recompose_1.pure, function (Base) { return function (_a) {
    var rule = _a.rule, inherited = _a.inherited, ignoredPropertyNames = _a.ignoredPropertyNames, overriddenPropertyNames = _a.overriddenPropertyNames;
    var declarations = rule.style;
    // const properties = [];
    var childDeclarations = [];
    for (var i = 0, n = declarations.length; i < n; i++) {
        var name_1 = declarations[i];
        var value = declarations[name_1];
        var origValue = rule.style.disabledPropertyNames && rule.style.disabledPropertyNames[name_1];
        var disabled = Boolean(origValue);
        var ignored = Boolean(ignoredPropertyNames && ignoredPropertyNames[name_1]);
        var overridden = Boolean(overriddenPropertyNames && overriddenPropertyNames[name_1]);
        // childDeclarations.push({
        //   name,
        //   ignored,
        //   disabled,
        //   overridden,
        //   value,
        // });
    }
    return React.createElement(Base, { label: beautifyLabel(rule.label || rule.selectorText), source: null, declarations: childDeclarations, inherited: inherited });
}; });
var CSSStyleRule = css_inspector_pane_pc_1.hydrateTdStyleRule(enhanceCSSStyleRule, {
    TdGutterSubheader: null,
    TdStyleDeclaration: CSSStyleDeclaration,
    TdList: null,
    TdListItem: null
});
var CSSPaneMultipleSelectedError = css_inspector_pane_pc_1.hydrateCssInspectorMultipleItemsSelected(lodash_1.identity, {
    TdPane: pane_1.Pane,
});
var enhanceCSSInspectorPane = recompose_1.compose(recompose_1.pure, function (Base) { return function (_a) {
    var workspace = _a.workspace, browser = _a.browser;
    var selectedElementRefs = workspace.selectionRefs.filter(function (_a) {
        var type = _a[0];
        return type === aerial_browser_sandbox_1.SYNTHETIC_ELEMENT;
    });
    if (!selectedElementRefs.length) {
        return null;
    }
    if (selectedElementRefs.length > 1) {
        return React.createElement(CSSPaneMultipleSelectedError, null);
    }
    var _b = selectedElementRefs[0], type = _b[0], targetElementId = _b[1];
    var element = aerial_browser_sandbox_1.getSyntheticNodeById(browser, targetElementId);
    var window = aerial_browser_sandbox_1.getSyntheticNodeWindow(browser, targetElementId);
    if (!element || !window) {
        return null;
    }
    var rules = aerial_browser_sandbox_1.getSyntheticAppliedCSSRules(window, targetElementId);
    return React.createElement(Base, { styleRules: rules });
}; });
exports.CSSInpectorPane = css_inspector_pane_pc_1.hydrateTdCssInspectorPane(enhanceCSSInspectorPane, {
    TdPane: pane_1.Pane,
    TdStyleRule: CSSStyleRule
});


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/components/css-inspector-pane.tsx"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/components/css-inspector-pane.tsx"); } } })();
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


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/components/enhanced.ts"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/components/enhanced.ts"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ })

})