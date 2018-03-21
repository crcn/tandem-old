"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
var __1 = require("..");
describe(__filename + "#", function () {
    [
        ["<a></a>"],
        ["<a b=\"1\"></a>"],
        ["<a b=\"1\">c</a>"],
        ["<a b=\"1\"><c>d</c></a>"],
        ["<a></a>", "<b></b>"],
        ["<a></a>", "<b></b><a></a>"],
        ["<a></a><b></b>", "<b></b><a></a>"],
        ["<a></a><b></b><c></c>", "<b></b><c></c><a></a>", "<c></c><d></d><a></a><b></b>"]
    ].forEach(function (variants) {
        it("can render and patch " + variants.join(" -> "), function () { return __awaiter(_this, void 0, void 0, function () {
            var currDocument, fakeDocument, fakeBody, _loop_1, i, length_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fakeDocument = new utils_1.FakeDocument();
                        fakeBody = fakeDocument.createElement("body");
                        _loop_1 = function (i, length_1) {
                            var variant, graph, document_1;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        variant = variants[i];
                                        return [4 /*yield*/, __1.loadModuleDependencyGraph("entry.pc", {
                                                readFile: function () { return Promise.resolve(wrapSource(variant)); }
                                            })];
                                    case 1:
                                        graph = (_a.sent()).graph;
                                        document_1 = __1.runPCFile({
                                            entry: {
                                                filePath: "entry.pc",
                                                componentId: "entry",
                                                previewName: "main"
                                            },
                                            graph: graph
                                        }).document;
                                        return [2 /*return*/];
                                }
                            });
                        };
                        i = 0, length_1 = variants.length;
                        _a.label = 1;
                    case 1:
                        if (!(i < length_1)) return [3 /*break*/, 4];
                        return [5 /*yield**/, _loop_1(i, length_1)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
    });
});
var wrapSource = function (template) { return "<component id=\"entry\"><template>" + template + "</template><preview name=\"main\"><entry /></preview></component>"; };
//# sourceMappingURL=dom-render-test.js.map