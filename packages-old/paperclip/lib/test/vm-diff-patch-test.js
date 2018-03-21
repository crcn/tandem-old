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
// TODO - css diff / patch
var slim_dom_1 = require("slim-dom");
var chai_1 = require("chai");
var __1 = require("..");
var utils_1 = require("./utils");
describe(__filename + "#", function () {
    [
        ["a", "b", [
                {
                    "type": "SET_TEXT_NODE_VALUE",
                    "target": [0, "shadow", 0],
                    "newValue": "b"
                }
            ]],
        ["<a />", "<b />", [
                {
                    "type": "REMOVE_CHILD_NODE",
                    "target": [0, "shadow"],
                    "child": null,
                    "index": 0
                },
                {
                    "type": "INSERT_CHILD_NODE",
                    "target": [0, "shadow"],
                    "child": [
                        [
                            "entry.pc"
                        ],
                        [
                            0,
                            "b",
                            [],
                            null,
                            []
                        ]
                    ],
                    "clone": undefined,
                    "index": 0
                }
            ]],
        ["<a b />", "<a c />", [
                {
                    "type": "REMOVE_ATTRIBUTE",
                    "target": [0, "shadow", 0],
                    "name": "b",
                    "newValue": null,
                    "oldValue": null,
                    "oldName": null,
                    "index": 0
                },
                {
                    "type": "INSERT_ATTRIBUTE",
                    "target": [0, "shadow", 0],
                    "name": "c",
                    "newValue": true,
                    "oldValue": null,
                    "oldName": null,
                    "index": 0
                }
            ]],
        ["<a b=\"1\" />", "<a b=\"2\" />", [
                {
                    "type": "SET_ATTRIBUTE",
                    "target": [0, "shadow", 0],
                    "name": "b",
                    "newValue": "2",
                    "oldName": null,
                    "oldValue": null,
                    "index": 0
                }
            ]],
        ["<a b=\"1\" />", "<a b=\"2\" />", [
                {
                    "type": "SET_ATTRIBUTE",
                    "target": [0, "shadow", 0],
                    "name": "b",
                    "newValue": "2",
                    "oldName": null,
                    "oldValue": null,
                    "index": 0
                }
            ]]
    ].forEach(function (_a) {
        var oldSource = _a[0], newSource = _a[1], expectedDiffs = _a[2];
        it("can diff " + oldSource + " against " + newSource, function () { return __awaiter(_this, void 0, void 0, function () {
            var ag, bg, an, _a, bn, diagnostics, diffs;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, __1.loadModuleDependencyGraph("entry.pc", {
                            readFile: function () { return Promise.resolve(wrapSource(oldSource)); }
                        })];
                    case 1:
                        ag = (_b.sent()).graph;
                        return [4 /*yield*/, __1.loadModuleDependencyGraph("entry.pc", {
                                readFile: function () { return Promise.resolve(wrapSource(newSource)); }
                            })];
                    case 2:
                        bg = (_b.sent()).graph;
                        an = __1.runPCFile({ entry: { filePath: "entry.pc", componentId: "entry", previewName: "main" }, graph: ag }).document;
                        _a = __1.runPCFile({ entry: { filePath: "entry.pc", componentId: "entry", previewName: "main" }, graph: bg }), bn = _a.document, diagnostics = _a.diagnostics;
                        diffs = slim_dom_1.diffNode(an, bn);
                        chai_1.expect(diffs).to.eql(expectedDiffs);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    [
        ["a", "b", "c"],
        ["<a></a>", "<b></b>"],
        ["<a b=\"true\"></a>", "<a c=\"true\"></a>"],
        ["<a b=\"1\"></a>", "<a b=\"2\"></a>"],
        ["<a b=\"1\" c=\"1\"></a>", "<a b=\"1\" c=\"1\"></a>"],
        ["<a b=\"1\"></a>", "<a c=\"1\" b=\"1\"></a>"],
        ["<style>.a {}</style>", "<style>.b {}</style>"],
        ["<style>.a {a: 1;}</style>", "<style>.a {a: 2;}</style>"],
        ["<style>.a {a: 1;}</style>", "<style>.a {b: 1;}</style>"],
        ["<style>.a {a: 1;}</style>", "<style>.a {} .b {}</style>"],
        ["<style>.a {a: 1;} .b {a:2;}</style>", "<style>.a {}</style>"],
        ["<a></a><b></b>", "<b></b><a></a>", "<a></a><b></b>"],
        ["<a></a><b></b><c></c>", "<c></c><a></a><b></b>", "<b></b><a></a><c></c>"],
        ["<a b=\"1\" c=\"1\" d=\"1\"></a>", "<a c=\"1\" b=\"1\" d=\"1\"></a>", "<a d=\"1\" b=\"1\" c=\"1\"></a>"],
        ["<style>.a {} .b {}</style>", "<style>.b {} .a {}</style>"],
        ["<style>@media a {}</style>", "<style>@media b {}</style>"],
        ["<style>@media screen and (max-width: 100px) {}</style>", "<style>@media screen and (max-width: 200px) {}</style>"],
        ["<style>@media a {.b {color: red;}}</style>", "<style>@media a {.b {color: blue;}}</style>"],
        ["<style>@media a {.b {color: red;}}</style>", "<style>@media a {.b {color: blue;}.c {color: red;}}</style>"],
        ["<style>@keyframes a {}</style>", "<style>@keyframes b {}</style>"],
        ["<style>@unknown a {}</style>", "<style>@unknown b {}</style>"],
        ["<div>a</div>", "<style>@unknown b {}</style><div>a</div>"],
        ["<style>.a { color: red; }</style>", "<style>.a { color: red; background: blue; }</style>"],
    ].forEach(function (variants) {
        it("can diff and patch " + variants.join(" -> "), function () { return __awaiter(_this, void 0, void 0, function () {
            var prevDocument, _loop_1, _i, variants_1, variant;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _loop_1 = function (variant) {
                            var graph, document_1, diffs;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, __1.loadModuleDependencyGraph("entry.pc", {
                                            readFile: function () { return Promise.resolve(wrapSource(variant)); }
                                        })];
                                    case 1:
                                        graph = (_a.sent()).graph;
                                        document_1 = __1.runPCFile({ entry: { filePath: "entry.pc", componentId: "entry", previewName: "main" }, graph: graph }).document;
                                        if (prevDocument) {
                                            diffs = slim_dom_1.prepDiff(prevDocument, slim_dom_1.diffNode(prevDocument, document_1));
                                            prevDocument = diffs.reduce(function (doc, mutation) { return slim_dom_1.patchNode2(mutation, doc); }, prevDocument);
                                        }
                                        else {
                                            prevDocument = document_1;
                                        }
                                        chai_1.expect(utils_1.stringifyNode(prevDocument)).to.eql(utils_1.stringifyNode(document_1));
                                        return [2 /*return*/];
                                }
                            });
                        };
                        _i = 0, variants_1 = variants;
                        _a.label = 1;
                    case 1:
                        if (!(_i < variants_1.length)) return [3 /*break*/, 4];
                        variant = variants_1[_i];
                        return [5 /*yield**/, _loop_1(variant)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
    });
});
var wrapSource = function (template) { return "<component id=\"entry\"><template>" + template + "</template><preview name=\"main\"><entry /></preview></component>"; };
//# sourceMappingURL=vm-diff-patch-test.js.map