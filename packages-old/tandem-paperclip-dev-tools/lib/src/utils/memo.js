"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DUMP_DEFAULT_ANCHOR_INTERVAL = 1000 * 60 * 10;
var DEFAULT_ANCHOR = {};
function weakMemo(func, mapMemo) {
    if (mapMemo === void 0) { mapMemo = (function (value) { return value; }); }
    var count = 1;
    var memoKey = Symbol();
    var hashKey = Symbol();
    return function () {
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
//# sourceMappingURL=memo.js.map