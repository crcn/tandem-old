"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DUMP_DEFAULT_ANCHOR_INTERVAL = 1000 * 60 * 5;
function weakMemo(func, mapMemo) {
    if (mapMemo === void 0) { mapMemo = (function (value) { return value; }); }
    var memoKey = Symbol();
    // if func takes a single argument, then use the faster method
    // of memoization by storing the result on the argument itself. 
    if (func.length === 1) {
        return function (arg) {
            // check if self _is_ arg in case arg was copied via Object.assign(newArg, arg), or {...arg} -- both of these operations copy symbol keys over.
            if (arg[memoKey] && arg[memoKey].self === arg) {
                return arg[memoKey].value;
            }
            var value = func.call(this, arg);
            arg[memoKey] = { self: arg, value: value };
            return value;
        };
    }
    var argCount = 1;
    var hashKey = Symbol();
    var defaultAnchor = {};
    var previousPurgeTime = 0;
    // If more arguments are provided, then use the slower method of
    // memoizing the result by building a hash of the arguments and storing that value in an "anchor" argument (where the memoization symbol is stored).
    return function () {
        // Memory purge for cases where memoization result must be stored globally -- this happens when only primitive data types are passed in the memoized function
        if (previousPurgeTime && Date.now() - DUMP_DEFAULT_ANCHOR_INTERVAL > previousPurgeTime) {
            previousPurgeTime = Date.now();
            defaultAnchor = {};
        }
        var hash = "";
        // anchor is global by default, but is overridden by an object passed in the argument.
        var anchor = defaultAnchor;
        // start building up a unique hash based on the arguments provided
        for (var i = 0, n = arguments.length; i < n; i++) {
            var arg = arguments[i];
            var hashPart = void 0;
            // arg is an object, so use memoKey + reference count to create a unique hash part.
            if (arg && typeof arg === "object") {
                anchor = arg;
                // Ensure that if the memoized symbol key is found that it actually belongs to the argument and wasn't copied over, otherwise create a new hash. 
                hashPart = arg[hashKey] && arg[hashKey].self === arg ? arg[hashKey].value : (arg[hashKey] = { self: arg, value: ":" + (argCount++) }).value;
                // arg is a primitive, so we can just add it as the hash value
            }
            else {
                hashPart = ":" + arg;
            }
            hash += hashPart;
        }
        if (!anchor[memoKey] || anchor[memoKey].self !== anchor) {
            anchor[memoKey] = { self: anchor };
        }
        return mapMemo(anchor[memoKey].hasOwnProperty(hash) ? anchor[memoKey][hash] : anchor[memoKey][hash] = func.apply(this, arguments));
    };
}
exports.weakMemo = weakMemo;
;
//# sourceMappingURL=weak-memo.js.map