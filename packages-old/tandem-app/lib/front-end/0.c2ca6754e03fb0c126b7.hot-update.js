webpackHotUpdate(0,{

/***/ "./src/front-end/components/windows-pane.pc":
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

const hydrateTdWindowsPaneRow = (enhance, hydratedChildComponentClasses = {}) => {
  return enhance((props) => {  const { document, location } = props;  return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("span", { className: "TdWindowsPaneRow host", "data-document": document ? true : null, "data-location": location ? true : null },   __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("span", {"className": "TdWindowsPaneRow",}, document && document.title || "Loading..."));});
};
/* harmony export (immutable) */ __webpack_exports__["hydrateTdWindowsPaneRow"] = hydrateTdWindowsPaneRow;


let _BaseTdWindowsPaneRow;
const BaseTdWindowsPaneRow = (props) => (_BaseTdWindowsPaneRow || (_BaseTdWindowsPaneRow = hydrateTdWindowsPaneRow(identity)))(props);
/* harmony export (immutable) */ __webpack_exports__["BaseTdWindowsPaneRow"] = BaseTdWindowsPaneRow;


const hydrateTdWindowsPane = (enhance, hydratedChildComponentClasses = {}) => {
  const baseComponentClasses = {
    TdPane: __WEBPACK_IMPORTED_MODULE_1__pane_pc__["BaseTdPane"],
    TdList: __WEBPACK_IMPORTED_MODULE_2__global_pc__["a" /* BaseTdList */],
    TdListItem: __WEBPACK_IMPORTED_MODULE_2__global_pc__["b" /* BaseTdListItem */],
    TdWindowsPaneRow: BaseTdWindowsPaneRow,
  };

  const childComponentClasses = defaults(baseComponentClasses, hydratedChildComponentClasses);  return enhance((props) => {  const { windows } = props;  return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("span", { className: "TdWindowsPane host", "data-windows": windows ? true : null },   __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](childComponentClasses.TdPane, {"headerSlot": __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("span", {"className": "TdWindowsPane",}, "Artboards"),"contentSlot": __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("span", {"className": "TdWindowsPane",}, __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](childComponentClasses.TdList, {}, windows.map((window, $$i) => {return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](childComponentClasses.TdListItem, Object.assign({"selectable": true,"key": (window.$id),}, window), __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](childComponentClasses.TdWindowsPaneRow, Object.assign({}, window), ));}))),}, ));});
};
/* harmony export (immutable) */ __webpack_exports__["hydrateTdWindowsPane"] = hydrateTdWindowsPane;


let _BaseTdWindowsPane;
const BaseTdWindowsPane = (props) => (_BaseTdWindowsPane || (_BaseTdWindowsPane = hydrateTdWindowsPane(identity)))(props);
/* harmony export (immutable) */ __webpack_exports__["BaseTdWindowsPane"] = BaseTdWindowsPane;




/***/ })

})