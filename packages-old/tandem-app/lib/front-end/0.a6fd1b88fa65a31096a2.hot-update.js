webpackHotUpdate(0,{

/***/ "./src/front-end/components/global.pc":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__("./node_modules/react/react.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);


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
    style.textContent = "* {box-sizing:  border-box;} :root {--base:  2px;--base2:  4px;--base3:  6px;--base4:  8px;--base6:  10px;--base8:  12px;--base10:  14px;--base11:  16px;--font-size-rg:  12px;--font-size-md:  18px;--font-size-lg:  24px;--font-size-sm:  8px;--font-color:  #777;--font-color-alt:  #999;--font-color-dim:  #CCC;--font-color-light:  rgba(255, 255, 255, 0.9);--font-color-invert:  rgba(255, 255, 255, 0.9);--background:  orange;--background-alt:  #F9F9F9;--border-color:  #ECECEC;--border-color-deep:  #D9D9D9;--background-accent:  #F4F4F4;--background-deep:  #E9E9E9;--background-bold:  #EFEFEF;--background-highlight:  #00B5FF;--background-overlay:  rgba(255, 255, 255, 0.7);} body, html {font-family:  Helvetica;margin:  0;padding:  0;font-size:  var(--font-size-rg);color:  var(--font-color);}"

    document.body.appendChild(style);
  })();
}

if (typeof document != "undefined") {
  (() => {
    const style = document.createElement("style");
    style.textContent = "svg.TdPlayer {background:  var(--background-actor);}"

    document.body.appendChild(style);
  })();
}

const hydrateTdPlayer = (enhance, hydratedChildComponentClasses = {}) => {
  return enhance((props) => {  const {  } = props;  return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("span", { className: "TdPlayer host",  },   __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("svg", {"className": "TdPlayer",}, ));});
};
/* unused harmony export hydrateTdPlayer */


let _BaseTdPlayer;
const BaseTdPlayer = (props) => (_BaseTdPlayer || (_BaseTdPlayer = hydrateTdPlayer(identity)))(props);
/* unused harmony export BaseTdPlayer */


const hydrateTdList = (enhance, hydratedChildComponentClasses = {}) => {
  return enhance((props) => {  const { children } = props;  return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("span", { className: "TdList host",  },   __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("span", {"className": "TdList",}, children));});
};
/* unused harmony export hydrateTdList */


let _BaseTdList;
const BaseTdList = (props) => (_BaseTdList || (_BaseTdList = hydrateTdList(identity)))(props);
/* harmony export (immutable) */ __webpack_exports__["a"] = BaseTdList;


const hydrateTdListPreview = (enhance, hydratedChildComponentClasses = {}) => {
  const baseComponentClasses = {
    TdList: BaseTdList,
    TdListItem: BaseTdListItem,
  };

  const childComponentClasses = defaults(baseComponentClasses, hydratedChildComponentClasses);  return enhance((props) => {  const {  } = props;  return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("span", { className: "TdListPreview host",  },   __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](childComponentClasses.TdList, {}, __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](childComponentClasses.TdListItem, {}, "Item 1"), __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](childComponentClasses.TdListItem, {}, "Item 2"), __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](childComponentClasses.TdListItem, {}, "Item 3"), __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](childComponentClasses.TdListItem, {}, "Item 4"), __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](childComponentClasses.TdListItem, {}, "Item 5")));});
};
/* unused harmony export hydrateTdListPreview */


let _BaseTdListPreview;
const BaseTdListPreview = (props) => (_BaseTdListPreview || (_BaseTdListPreview = hydrateTdListPreview(identity)))(props);
/* unused harmony export BaseTdListPreview */


if (typeof document != "undefined") {
  (() => {
    const style = document.createElement("style");
    style.textContent = ".TdPreviewComponentExample.host {width:  250px;margin:  var(--base4);position:  relative;float:  left;} h3.TdPreviewComponentExample {margin:  0px;}"

    document.body.appendChild(style);
  })();
}

const hydrateTdPreviewComponentExample = (enhance, hydratedChildComponentClasses = {}) => {
  return enhance((props) => {  const { label, children } = props;  return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("span", { className: "TdPreviewComponentExample host", "data-label": label ? true : null },   __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("h3", {"className": "TdPreviewComponentExample",}, label),children);});
};
/* unused harmony export hydrateTdPreviewComponentExample */


let _BaseTdPreviewComponentExample;
const BaseTdPreviewComponentExample = (props) => (_BaseTdPreviewComponentExample || (_BaseTdPreviewComponentExample = hydrateTdPreviewComponentExample(identity)))(props);
/* unused harmony export BaseTdPreviewComponentExample */


if (typeof document != "undefined") {
  (() => {
    const style = document.createElement("style");
    style.textContent = ".TdListItem.host {background:  var(--background);border-bottom:  1px solid var(--border-color);padding:  var(--base6) var(--base8);display:  block;} .TdListItem.host:last-child {border-bottom:  0;} .TdListItem.host:nth-child(2n) {background:  var(--background-alt);}"

    document.body.appendChild(style);
  })();
}

const hydrateTdListItem = (enhance, hydratedChildComponentClasses = {}) => {
  return enhance((props) => {  const { children } = props;  return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("span", { className: "TdListItem host",  },   children);});
};
/* unused harmony export hydrateTdListItem */


let _BaseTdListItem;
const BaseTdListItem = (props) => (_BaseTdListItem || (_BaseTdListItem = hydrateTdListItem(identity)))(props);
/* harmony export (immutable) */ __webpack_exports__["b"] = BaseTdListItem;


if (typeof document != "undefined") {
  (() => {
    const style = document.createElement("style");
    style.textContent = ".TdProgress.host {display:  block;position:  relative;} .fill.TdProgress {height:  20px;background:  red;border-radius:  100px;min-width:  20px;position:  relative;transition:  all 0.2s ease;} .background.TdProgress {width:  100%;display:  inline-block;background:  blue;border-radius:  100px;position:  relative;} .TdProgress.host span.TdProgress {color:  var(--font-color-light);position:  absolute;left:  var(--base4);top:  50%;transform:  translateY(-50%);}"

    document.body.appendChild(style);
  })();
}

const hydrateTdProgress = (enhance, hydratedChildComponentClasses = {}) => {
  return enhance((props) => {  const { value, children } = props;  return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("span", { className: "TdProgress host", "data-value": value ? true : null },   __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("div", {"className": "TdProgress " + "background",}, __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("div", {"className": "TdProgress " + "fill","style": ({width:value * 100 + "%", }),}, ), __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("span", {"className": "TdProgress",}, children)));});
};
/* unused harmony export hydrateTdProgress */


let _BaseTdProgress;
const BaseTdProgress = (props) => (_BaseTdProgress || (_BaseTdProgress = hydrateTdProgress(identity)))(props);
/* unused harmony export BaseTdProgress */


if (typeof document != "undefined") {
  (() => {
    const style = document.createElement("style");
    style.textContent = ".TdBanner.host {padding:  var(--base4);display:  block;} .TdBanner.host[warning] {background:  yellow;} .TdBanner.host[error] {color:  var(--font-color-light);background:  red;} .TdBanner.host[success] {color:  var(--font-color-light);background:  blue;}"

    document.body.appendChild(style);
  })();
}

const hydrateTdBanner = (enhance, hydratedChildComponentClasses = {}) => {
  return enhance((props) => {  const { children } = props;  return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("span", { className: "TdBanner host",  },   children);});
};
/* unused harmony export hydrateTdBanner */


let _BaseTdBanner;
const BaseTdBanner = (props) => (_BaseTdBanner || (_BaseTdBanner = hydrateTdBanner(identity)))(props);
/* unused harmony export BaseTdBanner */


if (typeof document != "undefined") {
  (() => {
    const style = document.createElement("style");
    style.textContent = ".TdProgressExample.host > .TdProgress.host {margin:  var(--base4);}"

    document.body.appendChild(style);
  })();
}

const hydrateTdProgressExample = (enhance, hydratedChildComponentClasses = {}) => {
  const baseComponentClasses = {
    TdProgress: BaseTdProgress,
  };

  const childComponentClasses = defaults(baseComponentClasses, hydratedChildComponentClasses);  return enhance((props) => {  const { value } = props;  return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("span", { className: "TdProgressExample host", "data-value": value ? true : null },   __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](childComponentClasses.TdProgress, {"value": (value),}, value * 100, "%"));});
};
/* unused harmony export hydrateTdProgressExample */


let _BaseTdProgressExample;
const BaseTdProgressExample = (props) => (_BaseTdProgressExample || (_BaseTdProgressExample = hydrateTdProgressExample(identity)))(props);
/* unused harmony export BaseTdProgressExample */




/***/ })

})