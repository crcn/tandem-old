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
var chai_1 = require("chai");
var environment_1 = require("../../environment");
var utils_1 = require("./utils");
describe(__filename + "#", function () {
    describe("basic", function () {
        it("can parse a style rule", function () { return __awaiter(_this, void 0, void 0, function () {
            var window, style, rule;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, utils_1.openTestWindow(utils_1.wrapHTML("\n      <style>\n        body {\n          margin: 0;\n          padding: 0;\n        }\n      </style>"))];
                    case 1:
                        window = _a.sent();
                        return [4 /*yield*/, utils_1.waitForDocumentComplete(window)];
                    case 2:
                        _a.sent();
                        style = window.document.querySelector("style");
                        chai_1.expect(style).not.to.be.undefined;
                        chai_1.expect(style.sheet.cssRules.length).to.eql(1);
                        rule = style.sheet.cssRules.item(0);
                        chai_1.expect(rule.selectorText).to.eql("body");
                        chai_1.expect(rule.style.margin).to.eql("0");
                        chai_1.expect(rule.style.padding).to.eql("0");
                        return [2 /*return*/];
                }
            });
        }); });
        it("can parse a media rule", function () { return __awaiter(_this, void 0, void 0, function () {
            var window, style, rule;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, utils_1.openTestWindow(utils_1.wrapHTML("\n      <style>\n        @media screen {\n          a {\n            b: 1;\n          }\n          c {\n            d: 2;\n          }\n        }\n      </style>"))];
                    case 1:
                        window = _a.sent();
                        return [4 /*yield*/, utils_1.waitForDocumentComplete(window)];
                    case 2:
                        _a.sent();
                        style = window.document.querySelector("style");
                        rule = style.sheet.cssRules.item(0);
                        chai_1.expect(rule.cssRules.length).to.eql(2);
                        return [2 /*return*/];
                }
            });
        }); });
        it("can parse a font rule", function () { return __awaiter(_this, void 0, void 0, function () {
            var window, style, rule;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, utils_1.openTestWindow(utils_1.wrapHTML("\n      <style>\n        @font-face test {\n          color: red;\n        }\n      </style>"))];
                    case 1:
                        window = _a.sent();
                        return [4 /*yield*/, utils_1.waitForDocumentComplete(window)];
                    case 2:
                        _a.sent();
                        style = window.document.querySelector("style");
                        rule = style.sheet.cssRules.item(0);
                        chai_1.expect(rule.style.color).to.eql("red");
                        return [2 /*return*/];
                }
            });
        }); });
        it("can parse an unknown rule", function () { return __awaiter(_this, void 0, void 0, function () {
            var window, style, rule;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, utils_1.openTestWindow(utils_1.wrapHTML("\n      <style>\n        @unknown screen {\n          a {\n            b: 1;\n          }\n          c {\n            d: 2;\n          }\n        }\n      </style>"))];
                    case 1:
                        window = _a.sent();
                        return [4 /*yield*/, utils_1.waitForDocumentComplete(window)];
                    case 2:
                        _a.sent();
                        style = window.document.querySelector("style");
                        rule = style.sheet.cssRules.item(0);
                        chai_1.expect(rule.cssRules.length).to.eql(2);
                        return [2 /*return*/];
                }
            });
        }); });
        it("can parse a keyframes rule", function () { return __awaiter(_this, void 0, void 0, function () {
            var window, style, rule;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, utils_1.openTestWindow(utils_1.wrapHTML("\n      <style>\n        @keyframes test {\n          0% {\n            color: red;\n          }\n        }\n      </style>"))];
                    case 1:
                        window = _a.sent();
                        return [4 /*yield*/, utils_1.waitForDocumentComplete(window)];
                    case 2:
                        _a.sent();
                        style = window.document.querySelector("style");
                        rule = style.sheet.cssRules.item(0);
                        chai_1.expect(rule.cssRules.length).to.eql(1);
                        return [2 /*return*/];
                }
            });
        }); });
        it("can parse a media rule", function () { return __awaiter(_this, void 0, void 0, function () {
            var window, style, rule;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, utils_1.openTestWindow(utils_1.wrapHTML("\n      <style>\n        @media screen {\n          .container {\n            color: red;\n          }\n        }\n      </style>"))];
                    case 1:
                        window = _a.sent();
                        return [4 /*yield*/, utils_1.waitForDocumentComplete(window)];
                    case 2:
                        _a.sent();
                        style = window.document.querySelector("style");
                        rule = style.sheet.cssRules.item(0);
                        chai_1.expect(rule.conditionText).to.eql("screen");
                        chai_1.expect(rule.cssRules.length).to.eql(1);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe("diff/patch#", function () {
        [
            [
                "a { color: red; }",
                "a { color: blue; }"
            ],
            [
                "a { color: red; }",
                "b { color: red; }"
            ],
            [
                "a { color: red; }",
                "b { color: red; } c { color: red; }"
            ],
            [
                "a { color: red; } c { color: red; }",
                "c { color: red; } a { color: red; }"
            ],
            [
                "a { color: red; } c { color: red; }",
                "c { color: red; }"
            ],
            [
                "a { } b { } c { } d { }",
                "d { } c { } b { } a { }",
            ],
            [
                "@media screen { a { color: red; } }",
                "@media screen2 { a { color: red; } }"
            ],
            [
                "@media screen { a { color: red; } }",
                "@media screen { b { color: red; } }"
            ],
            [
                "@media screen { a { color: red; } }",
                "@media screen { a { color: blue; } }"
            ],
        ].forEach(function (variants) {
            it("can diff & patch " + variants.join(" -> "), function () { return __awaiter(_this, void 0, void 0, function () {
                var main, _i, variants_1, variant, current, mutations, allObjects, _a, mutations_1, mutation, target;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _i = 0, variants_1 = variants;
                            _b.label = 1;
                        case 1:
                            if (!(_i < variants_1.length)) return [3 /*break*/, 5];
                            variant = variants_1[_i];
                            return [4 /*yield*/, utils_1.openTestWindow(utils_1.wrapHTML("\n            <style>\n              " + variant + "\n            </style>\n          "))];
                        case 2:
                            current = _b.sent();
                            return [4 /*yield*/, utils_1.waitForDocumentComplete(current)];
                        case 3:
                            _b.sent();
                            if (!main) {
                                main = current;
                                return [3 /*break*/, 4];
                            }
                            mutations = environment_1.diffCSSStyleSheet(main.document.stylesheets[0], current.document.stylesheets[0]);
                            allObjects = environment_1.flattenSyntheticCSSStyleSheetSources(main.document.stylesheets[0].struct);
                            for (_a = 0, mutations_1 = mutations; _a < mutations_1.length; _a++) {
                                mutation = mutations_1[_a];
                                target = allObjects[mutation.target.$id];
                                environment_1.patchCSSStyleSheet(target, mutation);
                            }
                            chai_1.expect(utils_1.stripCSSWhitespace(main.document.styleSheets[0].cssText)).to.eql(utils_1.stripCSSWhitespace(variant));
                            _b.label = 4;
                        case 4:
                            _i++;
                            return [3 /*break*/, 1];
                        case 5: return [2 /*return*/];
                    }
                });
            }); });
        });
    });
});
//# sourceMappingURL=css-test.js.map