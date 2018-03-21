webpackHotUpdate(0,{

/***/ "./src/front-end/components/color-picker.pc":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__("./node_modules/react/react.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__global_pc__ = __webpack_require__("./src/front-end/components/global.pc");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__slider_pc__ = __webpack_require__("./src/front-end/components/slider.pc");




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
    style.textContent = ".color-picker.TdColorPicker {border-radius:  4px;display:  flex;flex-direction:  row;position:  relative;display:  inline-block;box-sizing:  border-box;} input:focus.TdColorPicker {outline:  none;border:  1px solid var(--background-highlight);} .top.TdColorPicker {display:  flex;flex-direction:  column;} #pallete.TdColorPicker {position:  relative;box-sizing:  border-box;display:  inline-block;} #spectrum.TdColorPicker {display:  inline-block;} canvas.TdColorPicker {border-radius:  2px;} .inputs.TdColorPicker {display:  flex;width:  100%;} input.TdColorPicker {border:  1px solid var(--border-color);border-radius:  2px;height:  30px;padding:  0px 8px;width:  100%;} .dropper.TdColorPicker {left:  0;top:  0;display:  inline-block;box-shadow:  0px 0px 0px 1px #000;cursor:  pointer;box-sizing:  border-box;border:  1px solid white;position:  absolute;width:  var(--base11);height:  var(--base11);border-radius:  50%;transform:  translate(-50%, -50%);} .controls.TdColorPicker {flex:  1;} .needle.TdColorPicker {width:  var(--base6);height:  30px;background:  white;box-shadow:  0px 0px 0px 1px #000;border:  1px solid white;border-radius:  2px;position:  absolute;transform:  translate(-50%);top:  -1px;left:  0;} .presets.TdColorPicker {flex-grow:  0;height:  20px;} .preset.TdColorPicker {border-radius:  2px;width:  var(--base4);height:  var(--base4);display:  inline-block;margin:  var(--base2);margin-left:  0px;} td-draggable.TdColorPicker {position:  relative;margin-bottom:  8px;float:  left;} td-slider.TdColorPicker canvas.TdColorPicker {height:  20px;} .hue-saturation-picker.TdColorPicker {width:  100%;height:  100%;}"

    document.body.appendChild(style);
  })();
}

const hydrateTdColorPicker = (enhance, hydratedChildComponentClasses = {}) => {
  return enhance((props) => {  return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("span", Object.assign({ className: "TdColorPicker host" }, __getDataProps(props)),   __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("div", {"className": "TdColorPicker " + "hue-saturation-picker",}, "HSLLL"));});
};
/* unused harmony export hydrateTdColorPicker */


let _BaseTdColorPicker;
const BaseTdColorPicker = (props) => (_BaseTdColorPicker || (_BaseTdColorPicker = hydrateTdColorPicker(identity)))(props);
/* harmony export (immutable) */ __webpack_exports__["a"] = BaseTdColorPicker;




/***/ })

})