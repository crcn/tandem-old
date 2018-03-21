webpackHotUpdate(0,{

/***/ "./src/front-end/components/css-inspector-pane.pc":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__("./node_modules/react/react.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__css_declaration_input_pc__ = __webpack_require__("./src/front-end/components/css-declaration-input.pc");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__gutter_pc__ = __webpack_require__("./src/front-end/components/gutter.pc");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__global_pc__ = __webpack_require__("./src/front-end/components/global.pc");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pane_pc__ = __webpack_require__("./src/front-end/components/pane.pc");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__tooltip_pc__ = __webpack_require__("./src/front-end/components/tooltip.pc");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__color_picker_pc__ = __webpack_require__("./src/front-end/components/color-picker.pc");








const identity = value => value;

const defaults = (initial, overrides) => {
  const result = Object.assign({}, initial);
  for (const key in overrides) {
    const value = overrides[key];
    if (value != null) {
      result[key] = value;
    }
  }
  return result;
};

const __getDataProps = (props) => {
  const ret = {};
  for (const key in props) {
    if (props[key]) {
      ret["data-" + key] = true;
    }
  }
  return ret;
};

if (typeof document != "undefined") {
  (() => {
    const style = document.createElement("style");
    style.textContent = ".TdStyleDeclaration.host[data-ignored] {opacity:  0.2;} .TdStyleDeclaration.host[data-overridden] span.TdStyleDeclaration {text-decoration:  line-through;color:  var(--font-color-dim);} .name.TdStyleDeclaration {color:  var(--font-color-dim);} .name.TdStyleDeclaration::after {content:  \": \";}"

    document.body.appendChild(style);
  })();
}

const hydrateTdStyleDeclaration = (enhance, hydratedChildComponentClasses = {}) => {
  const baseComponentClasses = {
    TdCssExprInput: __WEBPACK_IMPORTED_MODULE_1__css_declaration_input_pc__["BaseTdCssExprInput"],
  };

  const childComponentClasses = defaults(baseComponentClasses, hydratedChildComponentClasses);  return enhance((props) => {  const { name, overridden, value, sourceValue } = props;  let conditionPassed_1;return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("span", Object.assign({ className: "TdStyleDeclaration host" }, __getDataProps(props)),   __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("span", {"className": "TdStyleDeclaration " + "name",}, name),!conditionPassed_1 && (!overridden) && (conditionPassed_1 = true) ? __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](childComponentClasses.TdCssExprInput, {"value": (value),}, ) : null,!conditionPassed_1 && (true) && (conditionPassed_1 = true) ? __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("span", {"className": "TdStyleDeclaration",}, sourceValue) : null);});
};
/* harmony export (immutable) */ __webpack_exports__["hydrateTdStyleDeclaration"] = hydrateTdStyleDeclaration;


let _BaseTdStyleDeclaration;
const BaseTdStyleDeclaration = (props) => (_BaseTdStyleDeclaration || (_BaseTdStyleDeclaration = hydrateTdStyleDeclaration(identity)))(props);
/* harmony export (immutable) */ __webpack_exports__["BaseTdStyleDeclaration"] = BaseTdStyleDeclaration;


if (typeof document != "undefined") {
  (() => {
    const style = document.createElement("style");
    style.textContent = ".TdStyleRule.host:hover .TdStyleRule.host > .TdGutterSubheader.host span,.TdStyleRule .TdStyleRule.host[data-headerHovering] .controls.TdStyleRule {} .source.TdStyleRule {text-decoration:  underline;color:  var(--font-color-dim);white-space:  nowrap;} .name.TdStyleRule {color:  var(--font-color-dim);padding-right:  var(--base4);} .\n.TdStyleRule .TdStyleRule .TdStyleRule .TdStyleRule .name:after.TdStyleRule {content:  \":\";} .value.TdStyleRule {color:  var(--font-color-alt);} .inherited.TdStyleRule {margin-right:  var(--base6);padding:  var(--base) var(--base3);display:  inline;font-size:  0.6em;text-transform:  uppercase;background:  var(--border-color-deep);color:  var(--font-color-invert);border-radius:  1px;} .selector-text.TdStyleRule {width:  100%;word-break:  break-word;margin-right:  var(--base4);display:  inline-block;} .space.TdStyleRule {display:  inline-block;} .TdStyleRule.host > .TdGutterSubheader.host {display:  flex;flex-direction:  row;} .value:after.TdStyleRule {}"

    document.body.appendChild(style);
  })();
}

const hydrateTdStyleRule = (enhance, hydratedChildComponentClasses = {}) => {
  const baseComponentClasses = {
    TdGutterSubheader: __WEBPACK_IMPORTED_MODULE_2__gutter_pc__["BaseTdGutterSubheader"],
    TdList: __WEBPACK_IMPORTED_MODULE_3__global_pc__["a" /* BaseTdList */],
    TdListItem: __WEBPACK_IMPORTED_MODULE_3__global_pc__["b" /* BaseTdListItem */],
    TdStyleDeclaration: BaseTdStyleDeclaration,
  };

  const childComponentClasses = defaults(baseComponentClasses, hydratedChildComponentClasses);  return enhance((props) => {  const { label, inherited, declarations } = props;  let conditionPassed_1;let conditionPassed_2;return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("span", Object.assign({ className: "TdStyleRule host" }, __getDataProps(props)),   __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](childComponentClasses.TdGutterSubheader, {}, __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("span", {"className": "TdStyleRule " + "selector-text",}, label), !conditionPassed_1 && (inherited) && (conditionPassed_1 = true) ? __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("span", {"className": "TdStyleRule " + "inherited",}, "inherited") : null, __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("span", {"className": "TdStyleRule " + "space",}, ), __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("span", {"className": "TdStyleRule",}, "+")),__WEBPACK_IMPORTED_MODULE_0_react__["createElement"](childComponentClasses.TdList, {}, !conditionPassed_2 && (declarations) && (conditionPassed_2 = true) ? declarations.map((declaration, $$i) => {let conditionPassed_1;return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](childComponentClasses.TdListItem, {}, __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](childComponentClasses.TdStyleDeclaration, Object.assign({"key": (declaration.name),}, declaration), ));}) : null));});
};
/* harmony export (immutable) */ __webpack_exports__["hydrateTdStyleRule"] = hydrateTdStyleRule;


let _BaseTdStyleRule;
const BaseTdStyleRule = (props) => (_BaseTdStyleRule || (_BaseTdStyleRule = hydrateTdStyleRule(identity)))(props);
/* harmony export (immutable) */ __webpack_exports__["BaseTdStyleRule"] = BaseTdStyleRule;


const hydrateTdCssInspectorPane = (enhance, hydratedChildComponentClasses = {}) => {
  const baseComponentClasses = {
    TdPane: __WEBPACK_IMPORTED_MODULE_4__pane_pc__["BaseTdPane"],
    TdStyleRule: BaseTdStyleRule,
  };

  const childComponentClasses = defaults(baseComponentClasses, hydratedChildComponentClasses);  return enhance((props) => {  const { styleRules } = props;  let conditionPassed_1;return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("span", Object.assign({ className: "TdCssInspectorPane host" }, __getDataProps(props)),   __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](childComponentClasses.TdPane, {"headerSlot": __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("span", {"className": "TdCssInspectorPane",}, "CSS Inspector!!"),"contentSlot": __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("span", {"className": "TdCssInspectorPane",}, !conditionPassed_1 && (styleRules) && (conditionPassed_1 = true) ? styleRules.map((styleRule, $$i) => {let conditionPassed_1;return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](childComponentClasses.TdStyleRule, Object.assign({"key": (styleRule.rule.$id),}, styleRule), );}) : null),}, ));});
};
/* harmony export (immutable) */ __webpack_exports__["hydrateTdCssInspectorPane"] = hydrateTdCssInspectorPane;


let _BaseTdCssInspectorPane;
const BaseTdCssInspectorPane = (props) => (_BaseTdCssInspectorPane || (_BaseTdCssInspectorPane = hydrateTdCssInspectorPane(identity)))(props);
/* harmony export (immutable) */ __webpack_exports__["BaseTdCssInspectorPane"] = BaseTdCssInspectorPane;


if (typeof document != "undefined") {
  (() => {
    const style = document.createElement("style");
    style.textContent = ".content.CssInspectorMultipleItemsSelected {padding:  var(--base6);}"

    document.body.appendChild(style);
  })();
}

const hydrateCssInspectorMultipleItemsSelected = (enhance, hydratedChildComponentClasses = {}) => {
  const baseComponentClasses = {
    TdPane: __WEBPACK_IMPORTED_MODULE_4__pane_pc__["BaseTdPane"],
  };

  const childComponentClasses = defaults(baseComponentClasses, hydratedChildComponentClasses);  return enhance((props) => {  return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("span", Object.assign({ className: "CssInspectorMultipleItemsSelected host" }, __getDataProps(props)),   __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](childComponentClasses.TdPane, {"headerSlot": __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("span", {"className": "CssInspectorMultipleItemsSelected",}, "CSS Inspector"),"contentSlot": __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("div", {"className": "CssInspectorMultipleItemsSelected " + "content",}, "Please select only one element to edit CSS \n        properties."),}, ));});
};
/* harmony export (immutable) */ __webpack_exports__["hydrateCssInspectorMultipleItemsSelected"] = hydrateCssInspectorMultipleItemsSelected;


let _BaseCssInspectorMultipleItemsSelected;
const BaseCssInspectorMultipleItemsSelected = (props) => (_BaseCssInspectorMultipleItemsSelected || (_BaseCssInspectorMultipleItemsSelected = hydrateCssInspectorMultipleItemsSelected(identity)))(props);
/* harmony export (immutable) */ __webpack_exports__["BaseCssInspectorMultipleItemsSelected"] = BaseCssInspectorMultipleItemsSelected;




/***/ })

})