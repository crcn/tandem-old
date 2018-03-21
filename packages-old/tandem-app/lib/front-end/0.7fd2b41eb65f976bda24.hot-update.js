webpackHotUpdate(0,{

/***/ "./src/front-end/components/pane.pc":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__("./node_modules/react/react.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__global_pc__ = __webpack_require__("./src/front-end/components/global.pc");



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

if (typeof document != "undefined") {
  (() => {
    const style = document.createElement("style");
    style.textContent = ".gutter.TdPane {background:  var(--background);min-width:  250px;height:  100%;display:  flex;flex-direction:  column;overflow:  scroll;} .content.TdPane {flex:  1;overflow:  scroll;} .content.padded.TdPane {padding:  var(--base8);} .header.TdPane {color:  #666;user-select:  none;background:  var(--background-accent);text-transform:  uppercase;padding:  var(--base8) var(--base8);font-size:  0.9em;} .header.sub.TdPane {padding:  var(--base4) var(--base8);margin:  0;border-top:  2px solid var(--border-color);border-bottom:  2px solid var(--border-color);background:  var(--background-accent);} .controls.TdPane {cursor:  pointer;display:  inline-block;font-size:  1.5em;position:  relative;top:  -2px;}"

    document.body.appendChild(style);
  })();
}

const hydrateTdPane = (enhance, hydratedChildComponentClasses = {}) => {
  return enhance((props) => {  const { headerSlot, contentSlot } = props;  return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("span", { className: "TdPane host",  },   __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("div", {"className": "TdPane " + "header",}, headerSlot),__WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("div", {"className": "TdPane " + "content",}, contentSlot));});
};
/* harmony export (immutable) */ __webpack_exports__["hydrateTdPane"] = hydrateTdPane;


let _BaseTdPane;
const BaseTdPane = (props) => (_BaseTdPane || (_BaseTdPane = hydrateTdPane(identity)))(props);
/* harmony export (immutable) */ __webpack_exports__["BaseTdPane"] = BaseTdPane;


if (typeof document != "undefined") {
  (() => {
    const style = document.createElement("style");
    style.textContent = ".color.XTest {color:  red;}"

    document.body.appendChild(style);
  })();
}

const hydrateXTest = (enhance, hydratedChildComponentClasses = {}) => {
  return enhance((props) => {  const {  } = props;  return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("span", { className: "XTest host",  },   "HELLO WORLD");});
};
/* harmony export (immutable) */ __webpack_exports__["hydrateXTest"] = hydrateXTest;


let _BaseXTest;
const BaseXTest = (props) => (_BaseXTest || (_BaseXTest = hydrateXTest(identity)))(props);
/* harmony export (immutable) */ __webpack_exports__["BaseXTest"] = BaseXTest;




/***/ })

})