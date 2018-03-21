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
var redux_saga_1 = require("redux-saga");
var effects_1 = require("redux-saga/effects");
var utils_1 = require("../utils");
var actions_1 = require("../actions");
var DEFER_APPLY_EDIT_TIMEOUT = 10;
function fileEditorSaga() {
    var _deferring, _batchMutations;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects_1.fork(function handleDeferFileEditRequest() {
                    var req;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!true) return [3 /*break*/, 3];
                                return [4 /*yield*/, effects_1.take(actions_1.DEFER_APPLY_FILE_MUTATIONS)];
                            case 1:
                                req = _a.sent();
                                if (!_batchMutations) {
                                    _batchMutations = [];
                                }
                                _batchMutations.push.apply(_batchMutations, req.mutations);
                                if (_deferring) {
                                    return [3 /*break*/, 0];
                                }
                                return [4 /*yield*/, effects_1.spawn(function () {
                                        var mutations;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0: return [4 /*yield*/, effects_1.call(redux_saga_1.delay, DEFER_APPLY_EDIT_TIMEOUT)];
                                                case 1:
                                                    _a.sent();
                                                    _deferring = false;
                                                    mutations = _batchMutations.slice();
                                                    _batchMutations = [];
                                                    return [4 /*yield*/, effects_1.put(actions_1.applyFileMutationsRequest.apply(void 0, mutations))];
                                                case 2:
                                                    _a.sent();
                                                    return [2 /*return*/];
                                            }
                                        });
                                    })];
                            case 2:
                                _a.sent();
                                return [3 /*break*/, 0];
                            case 3: return [2 /*return*/];
                        }
                    });
                })];
            case 1:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(function handleFileEditRequest() {
                        var _loop_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _loop_1 = function () {
                                        var req, apiHost, mutations, state, mutationsByUri, _i, mutations_1, mutation, source, stringMutations;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0: return [4 /*yield*/, effects_1.take(actions_1.APPLY_FILE_MUTATIONS)];
                                                case 1:
                                                    req = _a.sent();
                                                    return [4 /*yield*/, effects_1.select()];
                                                case 2:
                                                    apiHost = (_a.sent()).apiHost;
                                                    mutations = req.mutations;
                                                    return [4 /*yield*/, effects_1.select()];
                                                case 3:
                                                    state = _a.sent();
                                                    mutationsByUri = {};
                                                    for (_i = 0, mutations_1 = mutations; _i < mutations_1.length; _i++) {
                                                        mutation = mutations_1[_i];
                                                        source = mutation.target.source;
                                                        if (!mutationsByUri[source.uri]) {
                                                            mutationsByUri[source.uri] = [];
                                                        }
                                                        mutationsByUri[source.uri].push(mutation);
                                                    }
                                                    stringMutations = [];
                                                    return [4 /*yield*/, effects_1.spawn(function () {
                                                            var _a, _b;
                                                            return __generator(this, function (_c) {
                                                                switch (_c.label) {
                                                                    case 0:
                                                                        _a = effects_1.call;
                                                                        _b = [utils_1.apiEditFile, mutationsByUri];
                                                                        return [4 /*yield*/, effects_1.select()];
                                                                    case 1: return [4 /*yield*/, _a.apply(void 0, _b.concat([_c.sent()]))];
                                                                    case 2:
                                                                        _c.sent();
                                                                        return [2 /*return*/];
                                                                }
                                                            });
                                                        })];
                                                case 4:
                                                    _a.sent();
                                                    return [2 /*return*/];
                                            }
                                        });
                                    };
                                    _a.label = 1;
                                case 1:
                                    if (!true) return [3 /*break*/, 3];
                                    return [5 /*yield**/, _loop_1()];
                                case 2:
                                    _a.sent();
                                    return [3 /*break*/, 1];
                                case 3: return [2 /*return*/];
                            }
                        });
                    })];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}
exports.fileEditorSaga = fileEditorSaga;
//# sourceMappingURL=file-editor.js.map