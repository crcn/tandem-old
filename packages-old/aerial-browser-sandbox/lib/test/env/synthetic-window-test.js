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
    it("can open a simple page", function () { return __awaiter(_this, void 0, void 0, function () {
        var window, content;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    window = utils_1.openTestWindow(utils_1.wrapHTML("Test"));
                    return [4 /*yield*/, utils_1.waitForDocumentComplete(window)];
                case 1:
                    _a.sent();
                    content = window.document.documentElement.outerHTML;
                    chai_1.expect(utils_1.stripWhitespace(content)).to.eql("<html><head></head><body>Test</body></html>");
                    return [2 /*return*/];
            }
        });
    }); });
    describe("diff/patch#", function () {
        var cases = [
            // basic DOM 
            ["a", "b", "c"],
            ["<!--a-->", "<!--b-->", "<!--c-->"],
            ["<h1></h1>", "<h2></h2>", "<h3></h3>"],
            ["<div a=\"b\"></div>", "<div a=\"c\"></div>"],
            ["<div a=\"b\" c=\"d\"></div>", "<div c=\"d\"></div>"],
            ["<h2></h2><h1></h1>", "<h1></h1><h2></h2>"],
            // basic CSS
            ["<style>.a { color: red; }</style>", "<style>.a { color: blue; }</style>"]
        ];
        cases.forEach(function (variants) {
            it("can diff & patch " + variants.join(" -> "), function () { return __awaiter(_this, void 0, void 0, function () {
                var mainWindow, _i, variants_1, variant, newWindow, diffs;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _i = 0, variants_1 = variants;
                            _a.label = 1;
                        case 1:
                            if (!(_i < variants_1.length)) return [3 /*break*/, 4];
                            variant = variants_1[_i];
                            newWindow = utils_1.openTestWindow(utils_1.wrapHTML(variant));
                            return [4 /*yield*/, utils_1.waitForDocumentComplete(newWindow)];
                        case 2:
                            _a.sent();
                            if (mainWindow) {
                                diffs = environment_1.diffWindow(mainWindow, newWindow);
                                environment_1.patchWindow(mainWindow, diffs);
                                chai_1.expect(mainWindow.document.body.innerHTML).to.eql(newWindow.document.body.innerHTML);
                                if (mainWindow.document.stylesheets[0]) {
                                    chai_1.expect(mainWindow.document.stylesheets[0].cssText).to.eql(newWindow.document.stylesheets[0].cssText);
                                }
                            }
                            else {
                                mainWindow = newWindow;
                            }
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
});
//# sourceMappingURL=synthetic-window-test.js.map