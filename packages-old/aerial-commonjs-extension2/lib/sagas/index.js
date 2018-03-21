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
var effects_1 = require("redux-saga/effects");
var aerial_sandbox2_1 = require("aerial-sandbox2");
var path = require("path");
var detective = require("detective");
var aerial_common2_1 = require("aerial-common2");
var vm_1 = require("vm");
function createCommonJSSaga(mimeType) {
    if (mimeType === void 0) { mimeType = "application/javascript"; }
    return function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, effects_1.fork(handleLoadCommonJS, mimeType)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, effects_1.fork(handleEvaluateCommonJS, mimeType)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    };
}
exports.createCommonJSSaga = createCommonJSSaga;
function handleLoadCommonJS(mimeType) {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!true) return [3 /*break*/, 2];
                return [4 /*yield*/, aerial_common2_1.takeRequest(function (request) { return request.type === aerial_sandbox2_1.DEFAULT_GRAPH_STRATEGY_LOAD_CONTENT && request.contentType === mimeType; }, function (_a) {
                        var content = _a.content, contentType = _a.contentType;
                        var dependencies = detective(String(content));
                        return {
                            content: content,
                            contentType: contentType,
                            importedDependencyUris: dependencies
                        };
                    })];
            case 1:
                _a.sent();
                return [3 /*break*/, 0];
            case 2: return [2 /*return*/];
        }
    });
}
function handleEvaluateCommonJS(mimeType) {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!true) return [3 /*break*/, 2];
                return [4 /*yield*/, aerial_common2_1.takeRequest(function (request) { return request.type === aerial_sandbox2_1.EVALUATE_DEPENDENCY && request.entry.contentType === mimeType; }, function (_a) {
                        var globalContext = _a.context, entry = _a.entry, graph = _a.graph;
                        var moduleContexts = globalContext.$$moduleContexts = {};
                        globalContext.global = globalContext;
                        globalContext.console = console;
                        var evaluate = function (dep) {
                            if (moduleContexts[dep.hash])
                                return moduleContexts[dep.hash].module.exports;
                            var script = compile(dep.hash, dep.uri, String(dep.content));
                            var context = moduleContexts[dep.hash] = {
                                __dirname: path.dirname(dep.uri),
                                __filename: dep.uri,
                                require: function (depPath) {
                                    var hash = dep.importedDependencyHashes[dep.importedDependencyUris.indexOf(depPath)];
                                    return evaluate(graph.allDependencies[hash]);
                                },
                                module: {
                                    exports: {}
                                }
                            };
                            script.runInContext(globalContext);
                            return context.module.exports;
                        };
                        return evaluate(entry);
                    })];
            case 1:
                _a.sent();
                return [3 /*break*/, 0];
            case 2: return [2 /*return*/];
        }
    });
}
var compile = aerial_common2_1.weakMemo(function (hash, uri, content) {
    return new vm_1.Script("\n    with($$moduleContexts[\"" + hash + "\"]) {\n      " + content + "\n    }\n  ", {
        filename: uri,
        displayErrors: true
    });
});
//# sourceMappingURL=index.js.map