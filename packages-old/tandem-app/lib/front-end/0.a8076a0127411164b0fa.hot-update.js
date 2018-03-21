webpackHotUpdate(0,{

/***/ "./src/front-end/components/components-pane.pc":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__("./node_modules/react/react.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__pane_pc__ = __webpack_require__("./src/front-end/components/pane.pc");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__global_pc__ = __webpack_require__("./src/front-end/components/global.pc");




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
    style.textContent = ".TdComponentsPaneCell.host {user-select:  none;cursor:  pointer;overflow:  hidden;box-sizing:  border-box;height:  130px;position:  relative;text-align:  center;border-right:  1px solid var(--border-color);border-bottom:  1px solid var(--border-color);} .TdComponentsPaneCell.host:hover, .TdComponentsPaneCell.host[data-hovering], .TdComponentsPaneCell.host[data-selected] {color:  var(--font-color-light);background:  var(--background-highlight);} .TdComponentsPaneCell.host > .inner.TdComponentsPaneCell {width:  100%;height: 100%;position:  relative;border:  var(--base4) solid transparent;box-sizing:  border-box;} .label.TdComponentsPaneCell {color:  var(--font-color-dim);position:  relative;top:  10px;overflow:  hidden;} .screenshot.TdComponentsPaneCell {position:  absolute;transform-origin:  top left;background-repeat:  no-repeat;top:  50%;left:  50%;}"

    document.body.appendChild(style);
  })();
}

const hydrateTdComponentsPaneCell = (enhance, hydratedChildComponentClasses = {}) => {
  return enhance((props) => {  const { label, onDragStart, onDragEnd, onClick, screenshot, screenshotScale } = props;  let conditionPassed_1;let conditionPassed_2;return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("span", Object.assign({ className: "TdComponentsPaneCell host" }, __getDataProps(props)),   __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("div", {"className": "TdComponentsPaneCell " + "inner","title": (label),"draggable": true,"alt": (label),"onDragStart": (onDragStart),"onDragEnd": (onDragEnd),"onClick": (onClick),}, !conditionPassed_1 && (!screenshot) && (conditionPassed_1 = true) ? __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("span", {"className": "TdComponentsPaneCell " + "label",}, label) : null, !conditionPassed_2 && (screenshot) && (conditionPassed_2 = true) ? __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("div", {"className": "TdComponentsPaneCell " + "screenshot","src": ((screenshot.uri)),"style": ({width:screenshot.clip.right - screenshot.clip.left, height:screenshot.clip.bottom - screenshot.clip.top, transform:"scale(" + screenshotScale + ") translate(-50%, -50%)", backgroundImage:"url('" + screenshot.uri + "')", backgroundPosition:"-" + (screenshot.clip.left) + "px -" + (screenshot.clip.top) + "px", }),}, ) : null));});
};
/* harmony export (immutable) */ __webpack_exports__["hydrateTdComponentsPaneCell"] = hydrateTdComponentsPaneCell;


let _BaseTdComponentsPaneCell;
const BaseTdComponentsPaneCell = (props) => (_BaseTdComponentsPaneCell || (_BaseTdComponentsPaneCell = hydrateTdComponentsPaneCell(identity)))(props);
/* harmony export (immutable) */ __webpack_exports__["BaseTdComponentsPaneCell"] = BaseTdComponentsPaneCell;


if (typeof document != "undefined") {
  (() => {
    const style = document.createElement("style");
    style.textContent = ".content.TdComponentsPane {position:  relative;display:  grid;grid-template-areas:  inherit;grid-template-columns:  repeat(2, 1fr);grid-gap:  0px;grid-auto-rows:  minmax(100px, auto);} .TdComponentsPane.host > .TdComponentsPaneCell.host:nth-child(2n) {border-right:  none;} .header.TdComponentsPane {} .controls.TdComponentsPane {float:  right;cursor:  pointer;} input.TdComponentsPane {display:  none;}"

    document.body.appendChild(style);
  })();
}

const hydrateTdComponentsPane = (enhance, hydratedChildComponentClasses = {}) => {
  const baseComponentClasses = {
    TdPane: __WEBPACK_IMPORTED_MODULE_1__pane_pc__["BaseTdPane"],
    TdComponentsPaneCell: BaseTdComponentsPaneCell,
  };

  const childComponentClasses = defaults(baseComponentClasses, hydratedChildComponentClasses);  return enhance((props) => {  const { onAddComponentClick, components, dispatch } = props;  return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("span", Object.assign({ className: "TdComponentsPane host" }, __getDataProps(props)),   __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](childComponentClasses.TdPane, {"headerSlot": __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("span", {"className": "TdComponentsPane",}, "Components", __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("input", {"type": "text","className": "TdComponentsPane",}, ), __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("span", {"className": "TdComponentsPane " + "controls","onClick": (onAddComponentClick),}, "+")),"contentSlot": __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("span", {"className": "TdComponentsPane " + "content",}, components.map((component, $$i) => {return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](childComponentClasses.TdComponentsPaneCell, Object.assign({"hovering": (true),"key": (component.$id),"dispatch": (dispatch),}, component), );})),}, ));});
};
/* harmony export (immutable) */ __webpack_exports__["hydrateTdComponentsPane"] = hydrateTdComponentsPane;


let _BaseTdComponentsPane;
const BaseTdComponentsPane = (props) => (_BaseTdComponentsPane || (_BaseTdComponentsPane = hydrateTdComponentsPane(identity)))(props);
/* harmony export (immutable) */ __webpack_exports__["BaseTdComponentsPane"] = BaseTdComponentsPane;




/***/ })

})