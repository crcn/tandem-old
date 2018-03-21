webpackHotUpdate(0,{

/***/ "../aerial-common2/lib/saga/utils.js":
/***/ (function(module, exports, __webpack_require__) {

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
var redux_saga_1 = __webpack_require__("./node_modules/redux-saga/es/index.js");
var actions_1 = __webpack_require__("../aerial-common2/lib/actions/index.js");
var effects_1 = __webpack_require__("./node_modules/redux-saga/es/effects.js");
var WATCH_DELAY = 100;
function watch(selector, onChange) {
    var currentValue;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                currentValue = null;
                return [4 /*yield*/, effects_1.fork(function () {
                        var newValue, _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    if (false) return [3 /*break*/, 6];
                                    return [4 /*yield*/, effects_1.take()];
                                case 1:
                                    _c.sent();
                                    return [4 /*yield*/, effects_1.select(selector)];
                                case 2:
                                    newValue = _c.sent();
                                    if (!(currentValue !== newValue)) return [3 /*break*/, 5];
                                    currentValue = newValue;
                                    _a = effects_1.call;
                                    _b = [onChange, currentValue];
                                    return [4 /*yield*/, effects_1.select()];
                                case 3: return [4 /*yield*/, _a.apply(void 0, _b.concat([_c.sent()]))];
                                case 4:
                                    if ((_c.sent()) !== true) {
                                        return [3 /*break*/, 6];
                                    }
                                    _c.label = 5;
                                case 5: return [3 /*break*/, 0];
                                case 6: return [2 /*return*/];
                            }
                        });
                    })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}
exports.watch = watch;
function waitUntil(test) {
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (false) return [3 /*break*/, 3];
                _a = test;
                return [4 /*yield*/, effects_1.select()];
            case 1:
                if (_a.apply(void 0, [_b.sent()]))
                    return [3 /*break*/, 3];
                return [4 /*yield*/, effects_1.call(redux_saga_1.delay, WATCH_DELAY)];
            case 2:
                _b.sent();
                return [3 /*break*/, 0];
            case 3: return [2 /*return*/];
        }
    });
}
exports.waitUntil = waitUntil;
exports.createSocketIOSaga = function (socket) {
    return function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, effects_1.fork(function () {
                        var action;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (false) return [3 /*break*/, 2];
                                    return [4 /*yield*/, effects_1.take(actions_1.isPublicAction)];
                                case 1:
                                    action = _a.sent();
                                    socket.emit("action", action);
                                    return [3 /*break*/, 0];
                                case 2: return [2 /*return*/];
                            }
                        });
                    })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, bubbleEventChannel(function (emit) {
                            socket.on("action", emit);
                            socket.on("connection", function (connection) {
                                emit({ type: "SOCKET_CLIENT_CONNECTED", $public: true });
                                connection.on("action", emit);
                            });
                            return function () { };
                        })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    };
};
var TAG = "$$" + Date.now() + "." + Math.random();
function bubbleEventChannel(subscribe) {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects_1.spawn(function () {
                    var chan, _loop_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                chan = redux_saga_1.eventChannel(subscribe);
                                _loop_1 = function () {
                                    var event_1;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, effects_1.take(chan)];
                                            case 1:
                                                event_1 = _a.sent();
                                                if (event_1[TAG])
                                                    return [2 /*return*/, "continue"];
                                                event_1[TAG] = 1;
                                                return [4 /*yield*/, effects_1.fork(function () {
                                                        return __generator(this, function (_a) {
                                                            switch (_a.label) {
                                                                case 0: return [4 /*yield*/, effects_1.put(event_1)];
                                                                case 1:
                                                                    _a.sent();
                                                                    return [2 /*return*/];
                                                            }
                                                        });
                                                    })];
                                            case 2:
                                                _a.sent();
                                                return [2 /*return*/];
                                        }
                                    });
                                };
                                _a.label = 1;
                            case 1:
                                if (false) return [3 /*break*/, 3];
                                return [5 /*yield**/, _loop_1()];
                            case 2:
                                _a.sent();
                                return [3 /*break*/, 1];
                            case 3: return [2 /*return*/];
                        }
                    });
                })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}
//# sourceMappingURL=utils.js.map

/***/ })

})