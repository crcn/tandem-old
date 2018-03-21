"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Reader = /** @class */ (function () {
    function Reader(__fn) {
        var _this = this;
        this.__fn = __fn;
        this.run = function (input) {
            return _this.__fn(input);
        };
        this.then = function (_then) {
            return new Reader(function (input) {
                var map = function (value) {
                    var ret = _then(value);
                    return ret instanceof Reader ? ret.run(input) : ret;
                };
                var output = _this.__fn(input);
                if (output && output.then) {
                    return new Promise(function (resolve) {
                        output.then(function (value) {
                            resolve(map(value));
                        });
                    });
                }
                return map(output);
            });
        };
    }
    return Reader;
}());
exports.Reader = Reader;
exports.reader = function (fn) { return new Reader(fn); };
var ReaderUtils;
(function (ReaderUtils) {
    ReaderUtils.race = function () {
        var fns = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            fns[_i] = arguments[_i];
        }
        return exports.reader(function (input) { return Promise.race(fns.map(function (r) { return r.run(input); })); });
    };
})(ReaderUtils = exports.ReaderUtils || (exports.ReaderUtils = {}));
//# sourceMappingURL=reader.js.map