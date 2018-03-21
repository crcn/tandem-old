webpackHotUpdate(0,{

/***/ "../aerial-common2/lib/array/diff-patch.js":
false,

/***/ "../aerial-common2/lib/array/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// export * from "./diff-patch";
Object.defineProperty(exports, "__esModule", { value: true });
function toArray(value) {
    return Array.isArray(value) ? value : value == null ? [] : [value];
}
exports.toArray = toArray;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "../aerial-common2/lib/content-edit/index.js":
false,

/***/ "../aerial-common2/lib/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__("../aerial-common2/lib/struct/index.js"));
// export * from "./content-edit";
__export(__webpack_require__("../aerial-common2/lib/actions/index.js"));
__export(__webpack_require__("../aerial-common2/lib/application/index.js"));
__export(__webpack_require__("../aerial-common2/lib/immutable/index.js"));
__export(__webpack_require__("../aerial-common2/lib/gen/index.js"));
__export(__webpack_require__("../aerial-common2/lib/bus/index.js"));
__export(__webpack_require__("../aerial-common2/lib/log/index.js"));
__export(__webpack_require__("../aerial-common2/lib/memo/index.js"));
__export(__webpack_require__("../aerial-common2/lib/monad/index.js"));
__export(__webpack_require__("../aerial-common2/lib/dispatchers/index.js"));
__export(__webpack_require__("../aerial-common2/lib/worker/index.js"));
__export(__webpack_require__("../aerial-common2/lib/geom/index.js"));
__export(__webpack_require__("../aerial-common2/lib/array/index.js"));
// export * from "./mutate";
__export(__webpack_require__("../aerial-common2/lib/dom/index.js"));
__export(__webpack_require__("../aerial-common2/lib/messages/index.js"));
__export(__webpack_require__("../aerial-common2/lib/saga/index.js"));
__export(__webpack_require__("../aerial-common2/lib/ast/index.js"));
// export * from "./string";
__export(__webpack_require__("../aerial-common2/lib/ds/index.js"));
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "../aerial-common2/lib/memo/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var DUMP_DEFAULT_ANCHOR_INTERVAL = 1000 * 60 * 10;
var previousPurgeTime = 0;
var DEFAULT_ANCHOR = {};
function weakMemo(func, mapMemo) {
    if (mapMemo === void 0) { mapMemo = (function (value) { return value; }); }
    var count = 1;
    var memoKey = Symbol();
    var hashKey = Symbol();
    return function () {
        if (previousPurgeTime && Date.now() - DUMP_DEFAULT_ANCHOR_INTERVAL > previousPurgeTime) {
            previousPurgeTime = Date.now();
            DEFAULT_ANCHOR = {};
        }
        var hash = "";
        var anchor = DEFAULT_ANCHOR;
        for (var i = 0, n = arguments.length; i < n; i++) {
            var arg = arguments[i];
            var hashPart = void 0;
            if (arg && typeof arg === "object") {
                anchor = arg;
                hashPart = arg[hashKey] && arg[hashKey].self === arg ? arg[hashKey].value : (arg[hashKey] = { self: arg, value: ":" + (count++) }).value;
            }
            else {
                hashPart = ":" + arg;
            }
            hash += hashPart;
        }
        if (!anchor[memoKey] || anchor[memoKey].self !== anchor)
            anchor[memoKey] = { self: anchor };
        return mapMemo(anchor[memoKey].hasOwnProperty(hash) ? anchor[memoKey][hash] : anchor[memoKey][hash] = func.apply(this, arguments));
    };
}
exports.weakMemo = weakMemo;
;
/**
 * Calls target function once & proxies passed functions
 * @param fn
 */
exports.underchange = function (fn) {
    var currentArgs = [];
    var ret;
    var started;
    var start = function () {
        if (started) {
            return ret;
        }
        started = true;
        return ret = fn.apply(void 0, currentArgs.map(function (a, i) { return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return currentArgs[i].apply(currentArgs, args);
        }; }));
    };
    return (function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        currentArgs = args;
        return start();
    });
};
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "../aerial-common2/lib/mutate/index.js":
false,

/***/ "../aerial-common2/lib/string/editor.js":
false,

/***/ "../aerial-common2/lib/string/index.js":
false

})