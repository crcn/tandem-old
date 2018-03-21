"use strict";
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
function _ImmutableArray() {
    var _this = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        _this[_i] = arguments[_i];
    }
    _this["__proto__"] = this.constructor.prototype;
    return Object.freeze(_this);
}
exports.ImmutableArray = _ImmutableArray;
_ImmutableArray.prototype = [];
Object.assign(_ImmutableArray.prototype, (_a = {
        constructor: _ImmutableArray,
        $$immutable: true,
        set: function (key, value) {
            var tmp = Array.prototype.slice.call(this);
            tmp[key] = value;
            return new ((_a = this.constructor).bind.apply(_a, [void 0].concat(tmp)))();
            var _a;
        },
        push: function () {
            var items = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                items[_i] = arguments[_i];
            }
            return new ((_a = this.constructor).bind.apply(_a, [void 0].concat(this, items)))();
            var _a;
        },
        slice: function (startIndex, endIndex) {
            return new ((_a = this.constructor).bind.apply(_a, [void 0].concat(Array.prototype.slice.call(this).slice(startIndex, endIndex))))();
            var _a;
        },
        filter: function (fn) {
            return new ((_a = this.constructor).bind.apply(_a, [void 0].concat(Array.prototype.filter.call(this, fn))))();
            var _a;
        },
        unshift: function () {
            var items = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                items[_i] = arguments[_i];
            }
            return new ((_a = this.constructor).bind.apply(_a, [void 0].concat(items, this)))();
            var _a;
        },
        splice: function (index, removeCount) {
            var items = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                items[_i - 2] = arguments[_i];
            }
            var tmp = Array.prototype.slice.call(this);
            tmp.splice.apply(tmp, [index, removeCount].concat(items));
            return new ((_a = this.constructor).bind.apply(_a, [void 0].concat(tmp)))();
            var _a;
        }
    },
    _a[Symbol.iterator] = function () {
        var i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < this.length)) return [3 /*break*/, 4];
                    return [4 /*yield*/, this[i]];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    },
    _a));
exports.createImmutableArray = function () {
    var items = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        items[_i] = arguments[_i];
    }
    return new ((_a = exports.ImmutableArray).bind.apply(_a, [void 0].concat(items)))();
    var _a;
};
var _a;
//# sourceMappingURL=array.js.map