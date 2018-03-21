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
var path = require("path");
var redux_saga_1 = require("redux-saga");
var request = require("request");
var express = require("express");
var cors = require("cors");
var aerial_common2_1 = require("aerial-common2");
var actions_1 = require("../actions");
var effects_1 = require("redux-saga/effects");
function getExpressServer() {
    var expressServer;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!!expressServer) return [3 /*break*/, 4];
                return [4 /*yield*/, effects_1.select(function (state) { return state.http.expressServer; })];
            case 1:
                expressServer = _a.sent();
                if (!!expressServer) return [3 /*break*/, 3];
                return [4 /*yield*/, effects_1.call(redux_saga_1.delay, 10)];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3:
                ;
                return [3 /*break*/, 0];
            case 4: return [2 /*return*/, expressServer];
        }
    });
}
function frontEndService() {
    var frontEnd, expressServer;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects_1.select()];
            case 1:
                frontEnd = (_a.sent()).frontEnd;
                return [4 /*yield*/, effects_1.call(getExpressServer)];
            case 2:
                expressServer = _a.sent();
                expressServer.use(cors());
                expressServer.use(express.static(path.dirname(frontEnd.entryPath)));
                expressServer.use("/proxy/:uri", function (req, res, next) {
                    var uri = req.params.uri;
                    req.url = uri;
                    req.pipe(request({
                        uri: uri
                    }).on("error", next)).pipe(res);
                });
                return [2 /*return*/];
        }
    });
}
function httpService() {
    var httpPort, server;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects_1.select(function (state) { return state.http.port; })];
            case 1:
                httpPort = _a.sent();
                return [4 /*yield*/, effects_1.put(aerial_common2_1.logInfoAction("starting HTTP server on port " + httpPort))];
            case 2:
                _a.sent();
                server = express();
                server.listen(httpPort);
                return [4 /*yield*/, effects_1.put(actions_1.httpServerStarted(server))];
            case 3:
                _a.sent();
                return [2 /*return*/];
        }
    });
}
function mainSaga() {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects_1.fork(httpService)];
            case 1:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(frontEndService)];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}
exports.mainSaga = mainSaga;
;
//# sourceMappingURL=index.js.map