"use strict";
// TODO - need to test dynamic updates
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
var __1 = require("..");
var aerial_browser_sandbox_1 = require("aerial-browser-sandbox");
describe(__filename + "#", function () {
    var runCode = function (input, wrap, init) {
        if (wrap === void 0) { wrap = function (value) { return value; }; }
        if (init === void 0) { init = ""; }
        return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            var code, outerCode, SEnvWindow, window;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, __1.bundleVanilla("component.pc", {
                            target: __1.PaperclipTargetType.TANDEM,
                            io: {
                                readFile: function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, wrap(input)];
                                }); }); },
                                resolveFile: function (a, b) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, null];
                                }); }); }
                            }
                        })];
                    case 1:
                        code = (_a.sent()).code;
                        outerCode = "\n\n      // need access to native tags\n      with(window) {\n        const { entry } = " + code + "\n        " + init + "\n      }\n    ";
                        SEnvWindow = aerial_browser_sandbox_1.getSEnvWindowClass({
                            fetch: function (uri) { return __awaiter(_this, void 0, void 0, function () {
                                var _this = this;
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, ({
                                            text: function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                                return [2 /*return*/, input];
                                            }); }); }
                                        })];
                                });
                            }); }
                        });
                        window = new SEnvWindow("index.html", null, null);
                        new Function("window", "console", outerCode)(window, console);
                        return [2 /*return*/, window.document];
                }
            });
        });
    };
    [
        [{}, "a", "a"],
        [{}, "<span />", "<span></span>"],
        [{}, "a <span />", "a <span></span>"],
        [{}, "<span>a</span>", "<span>a</span>"],
        [{}, "<span><h1 />1</span>", "<span><h1></h1>1</span>"],
        [{}, "<span>a</span><!-- a -->", "<span>a</span>"],
        [{}, "<style>.container { }</style>", "<style></style>"],
        [{}, "<span b=\"c\">!sbang</span>", "<span b=\"c\">!sbang</span>"],
        [{}, "<span b=\"c\">bang!</span>", "<span b=\"c\">bang!</span>"],
        [{}, "<span b=\"c\"></span>", "<span b=\"c\"></span>"],
        // bind
        [{ a: 1, c: 2 }, "<span b=\"[[bind a]] b [[bind c]]\"></span>", "<span b=\"1 b 2\"></span>"],
        [{ a: 1, c: 2 }, "<span b=[[bind a]]></span>", "<span></span>"],
        [{ a: 1 }, "[[bind a]]", "1"],
        [{ a: 1, b: 2 }, "[[bind a]][[bind b]]", "12"],
        [{}, "[[bind \"a\"]]", "a"],
        [{}, "[[bind \"a\\\"b\\\"\"]]", "a\\\"b\\\""],
        [{}, "[[bind 1]]", "1"],
        [{}, "[[bind -1]]", "-1"],
        [{}, "[[bind 1.1]]", "1.1"],
        [{}, "[[bind -1.1]]", "-1.1"],
        [{}, "[[bind .1]]", "0.1"],
        [{ a: 1, b: 2 }, "[[bind { a: 1 }]]", "[object Object]"],
        [{ a: 1, b: 2 }, "[[bind {}]]", "[object Object]"],
        [{ a: 1, b: 2 }, "[[bind { a: 1, b: 2 }]]", "[object Object]"],
        [{ a: 1, b: 2 }, "[[bind { \"a\": 1, b: 2 }]]", "[object Object]"],
        [{ a: 1, b: 2 }, "[[bind { a: 1, b: 2 }]]", "[object Object]"],
        [{ a: 1, b: 2 }, "[[bind { a: 1, b: 2, }]]", "[object Object]"],
        [{ a: { b: { c: 1 } } }, "[[bind a.b.c]]", "1"],
        [{}, "[[bind [1, 2, 3]]]", "1,2,3"],
        [{}, "[[bind []]]", ""],
        [{ a: { b: 1, d: 2 } }, "<span [[bind a]] />", "<span></span>"],
        // repeat
        [{ items: [1, 2, 3] }, "<span [[repeat items as item]]>[[bind item]]</span>", "<span>1</span><span>2</span><span>3</span>"],
        // // repeat with index
        [{ items: [1, 2, 3] }, "<span [[repeat items as item, k]]>[[bind item]] [[bind k]]</span>", "<span>1 0</span><span>2 1</span><span>3 2</span>"],
        // // repeat object
        [{ items: { b: 1, c: 2 } }, "<span [[repeat items as item, k]]>[[bind item]] [[bind k]]</span>", "<span>1 b</span><span>2 c</span>"],
        // // if
        [{ a: 1 }, "<span [[if a]]>A</span>", "<span>A</span>"],
        [{ a: 1 }, "<span [[if !a]]>A</span><span [[else]]>B</span>", "<span>B</span>"],
        [{ a: 1 }, "<span [[if !a]]>A</span>b", "b"],
        [{ a: 1, b: 2 }, "<span [[if a && b]]>A</span>", "<span>A</span>"],
        [{ a: 1, b: 1 }, "<span [[if a === b]]>A</span>", "<span>A</span>"],
        [{ a: 1, b: 2 }, "<span [[if a === b]]>A</span>b", "b"],
        [{ a: 1, b: 2 }, "<span [[if a == b]]>A</span>b", "b"],
        [{ a: null }, "<span [[if a == undefined]]>A</span>b", "<span>A</span>b"],
        [{ a: 1 }, "<span [[if a + 1 == 2]]>A</span>b", "<span>A</span>b"],
        [{ a: 1 }, "<span [[if a > 1]]>A</span>b", "b"],
        [{ a: 1 }, "<span [[if a >= 1]]>A</span>b", "<span>A</span>b"],
        [{ a: 1 }, "<span [[if a < 1]]>A</span>b", "b"],
        [{ a: 1 }, "<span [[if a <= 1]]>A</span>b", "<span>A</span>b"],
        [{ a: 1, b: 0, c: 1 }, "<span [[if (a || b) && c]]>A</span>b", "<span>A</span>b"],
        [{ a: 1, b: 0, c: 0 }, "<span [[if (a || b) && c]]>A</span>b", "b"],
        [{ a: 1, b: 0 }, "<span [[if a || b]]>A</span>b", "<span>A</span>b"]
    ].forEach(function (_a) {
        var context = _a[0], input = _a[1], output = _a[2];
        it("renders " + input + " as " + output + " with " + JSON.stringify(context), function () { return __awaiter(_this, void 0, void 0, function () {
            var document;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, runCode(input, function (html) { return "<component id=\"test\"><template>" + html + "</template></component>"; }, "const el = document.createElement(\"x-test\"); \n      Object.assign(el, " + JSON.stringify(context) + ")\n      window.document.body.appendChild(el);")];
                    case 1:
                        document = _a.sent();
                        chai_1.expect(Array.prototype.map.call(document.body.querySelector("x-test").shadowRoot.childNodes, function (child) { return child.outerHTML || child.nodeValue; }).join("").trim()).to.eql(output.trim());
                        return [2 /*return*/];
                }
            });
        }); });
    });
    // styles
    [
        [".container {}", ".container { }"],
        [".container {} /*\na comment */ .content {}", ".container { } .content { }"],
        ["  .container {\na:b;}  ", ".container { a: b; }"],
        [".container {a:b;c:d}", ".container { a: b;c: d; }"],
        ["@media screen { .container { color: red; } }", "@media screen { .container { color: red; } }"],
        ["@unknown screen { .container { color: red; } }", ""],
        ["@charset \"utf8\";", ""],
        ["@keyframes bab { 0% { color: red; }}", "@keyframes bab { 0% { color: red; } }"],
        ["@font-face { color: red; }", "@font-face { color: red; }"],
        [".container:after { content: \": \"; }", ".container:after { content: \": \"; }"],
        [".container:after { content: \"; \"; }", ".container:after { content: \"; \"; }"]
    ].forEach(function (_a) {
        var input = _a[0], output = _a[1];
        it("can parse " + input + " to " + output, function () { return __awaiter(_this, void 0, void 0, function () {
            var wrap, document, cssText;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        wrap = function (input) { return "<style>" + input.trim() + "</style>"; };
                        return [4 /*yield*/, runCode(input, wrap)];
                    case 1:
                        document = _a.sent();
                        cssText = Array.prototype.map.call(document.styleSheets, function (sheet) { return sheet.cssText; }).join("").replace(/[\s\r\n\t]+/g, " ");
                        chai_1.expect(cssText.trim()).to.eql(output);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=vanilla-transpiler-test.js.map