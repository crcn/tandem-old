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
var __1 = require("..");
var utils_1 = require("./utils");
var slim_dom_1 = require("slim-dom");
describe(__filename + "#", function () {
    it("can render a component with a template", function () { return __awaiter(_this, void 0, void 0, function () {
        var document, body, slimDoc;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    document = new utils_1.FakeDocument();
                    body = document.createElement("body");
                    return [4 /*yield*/, runPCComponent({
                            "entry.pc": "\n        <component id=\"test\">\n          <template>\n            <span>hello</span>\n          </template>\n          <preview name=\"main\">\n            <test />\n          </preview>\n        </component>\n      "
                        })];
                case 1:
                    slimDoc = _a.sent();
                    slim_dom_1.renderDOM2(slimDoc, body);
                    chai_1.expect(body.toString()).to.eql("<body><test class=\"__test_scope_host\"><span class=\"__test_scope\">hello</span></test></body>");
                    return [2 /*return*/];
            }
        });
    }); });
    it("can render a component that has a slot and no child nodes", function () { return __awaiter(_this, void 0, void 0, function () {
        var document, body, slimDoc;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    document = new utils_1.FakeDocument();
                    body = document.createElement("body");
                    return [4 /*yield*/, runPCComponent({
                            "entry.pc": "\n        <component id=\"test\">\n          <template>\n            <span><slot></slot></span>\n          </template>\n          <preview name=\"main\">\n            <test /><slot />\n          </preview>\n        </component>\n      "
                        })];
                case 1:
                    slimDoc = _a.sent();
                    slim_dom_1.renderDOM2(slimDoc, body);
                    chai_1.expect(body.toString()).to.eql("<body><test class=\"__test_scope_host\"><span class=\"__test_scope\"><!--section-start--><!--section-end--></span></test><!--section-start--><!--section-end--></body>");
                    return [2 /*return*/];
            }
        });
    }); });
    it("can render a component with default slot children", function () { return __awaiter(_this, void 0, void 0, function () {
        var document, body, slimDoc;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    document = new utils_1.FakeDocument();
                    body = document.createElement("body");
                    return [4 /*yield*/, runPCComponent({
                            "entry.pc": "\n        <component id=\"test\">\n          <template>\n            <span><slot></slot></span>\n          </template>\n          <preview name=\"main\">\n            <test>a <b /> c</test>\n          </preview>\n        </component>\n      "
                        })];
                case 1:
                    slimDoc = _a.sent();
                    slim_dom_1.renderDOM2(slimDoc, body);
                    chai_1.expect(body.toString()).to.eql("<body><test class=\"__test_scope_host\"><span class=\"__test_scope\"><!--section-start-->a<b></b>c<!--section-end--></span></test></body>");
                    return [2 /*return*/];
            }
        });
    }); });
    it("can render a component with named slots", function () { return __awaiter(_this, void 0, void 0, function () {
        var document, body, slimDoc;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    document = new utils_1.FakeDocument();
                    body = document.createElement("body");
                    return [4 /*yield*/, runPCComponent({
                            "entry.pc": "\n        <component id=\"test\">\n          <template>\n            <span><slot></slot><slot name=\"a\"></slot><slot name=\"b\"></slot></span>\n          </template>\n          <preview name=\"main\">\n            <test>a <span slot=\"a\">b</span><span slot=\"b\">c</span><span slot=\"b\">d</span>e</test>\n          </preview>\n        </component>\n      "
                        })];
                case 1:
                    slimDoc = _a.sent();
                    slim_dom_1.renderDOM2(slimDoc, body);
                    chai_1.expect(body.toString()).to.eql("<body><test class=\"__test_scope_host\"><span class=\"__test_scope\"><!--section-start-->ae<!--section-end--><!--section-start--><span slot=\"a\">b</span><!--section-end--><!--section-start--><span slot=\"b\">c</span><span slot=\"b\">d</span><!--section-end--></span></test></body>");
                    return [2 /*return*/];
            }
        });
    }); });
    describe("diff/patch", function () {
        [
            [
                // slot testing
                // add slotted child
                "\n          <component id=\"test\">\n            <template>\n              <slot></slot>\n            </template>\n            <preview name=\"main\">\n              <test>\n                <a /><b />\n              </test>\n            </preview>\n          </component>\n        ",
                "\n          <component id=\"test\">\n            <template>\n              <slot></slot>\n            </template>\n            <preview name=\"main\">\n              <test>\n                <a /><b /><c />\n              </test>\n            </preview>\n          </component>\n        "
            ],
            [
                "\n          <component id=\"test\">\n            <template>\n              <slot name=\"test\"></slot>\n            </template>\n            <preview name=\"main\">\n              <test>\n                <a slot=\"test\"></a>\n              </test>\n            </preview>\n          </component>\n        ",
                "\n          <component id=\"test\">\n            <template>\n              <slot name=\"test\"></slot>\n            </template>\n            <preview name=\"main\">\n              <test>\n                <a slot=\"test\"></a>\n                <a slot=\"test\"></a>\n              </test>\n            </preview>\n          </component>\n        "
            ],
            [
                "\n          <component id=\"test\">\n            <template>\n              <slot name=\"test\"></slot>\n            </template>\n            <preview name=\"main\">\n              <test>\n                <b slot=\"test\"></b>\n                <c slot=\"test2\"></c>\n              </test>\n            </preview>\n          </component>\n        ",
                "\n          <component id=\"test\">\n            <template>\n              <slot name=\"test2\"></slot>\n            </template>\n            <preview name=\"main\">\n              <test>\n                <b slot=\"test\"></b>\n                <c slot=\"test2\"></c>\n              </test>\n            </preview>\n          </component>\n        "
            ],
            [
                "\n          <component id=\"test\">\n            <template>\n              <div>\n                <slot></slot>\n              </div>\n            </template>\n            <preview name=\"main\">\n              <test>a</test>\n            </preview>\n          </component>\n        ",
                "\n          <component id=\"test\">\n            <template>\n              <span>\n                <slot></slot>\n              </span>\n            </template>\n            <preview name=\"main\">\n              <test>a</test>\n            </preview>\n          </component>\n        "
            ],
            [
                "\n          <component id=\"test\">\n            <template>\n              <slot></slot>\n            </template>\n            <preview name=\"main\">\n              <test>\n                a\n                <span slot=\"test2\">b</span>\n                c\n              </test>\n            </preview>\n          </component>\n        ",
                "\n          <component id=\"test\">\n            <template>\n              <slot name=\"slot2\"></slot>\n              <slot></slot>\n            </template>\n            <preview name=\"main\">\n              <test>\n                a\n                <span slot=\"test2\">b</span>\n                c\n              </test>\n            </preview>\n          </component>\n        "
            ],
            // add named slotted child
            [
                "\n          <component id=\"test\">\n            <template>\n              <a />\n            </template>\n            <preview name=\"main\">\n              <test />\n            </preview>\n          </component>\n        ",
                "\n          <component id=\"test\">\n            <template>\n              <b />\n            </template>\n            <preview name=\"main\">\n              <test />\n            </preview>\n          </component>\n        "
            ],
            [
                "\n          <component id=\"test\">\n            <template>\n              <slot></slot>\n            </template>\n            <preview name=\"main\">\n              <test>\n                a b\n              </test>\n            </preview>\n          </component>\n        ",
                "\n          <component id=\"test\">\n            <template>\n              <slot></slot>\n            </template>\n            <preview name=\"main\">\n              <test>\n                b c\n              </test>\n            </preview>\n          </component>\n        "
            ],
            // busted fuzzy
            [
                "<component id=\"component0\">\n          <template>\n            <slot name=\"b0\"></slot>\n          </template>\n          <preview name=\"main\">\n            <component0 />\n          </preview>\n        </component>",
                "<component id=\"component0\">\n          <template>\n            <slot name=\"f0\">hgdc</slot>\n          </template>\n          <preview name=\"main\">\n            <component0 />\n          </preview>\n        </component>"
            ],
            [
                "<component id=\"component0\">\n          <template>\n            <i>jfkgcj</i>\n          </template>\n          <preview name=\"main\">\n            <component0 />\n          </preview>\n        </component>",
                "<component id=\"component0\">\n          <template>\n            <slot name=\"l0\">\n              gelcafel\n              <k> ajkbea d</k>\n            </slot>\n            <slot name=\"l0\">\n              <e>iejdl</e>\n            </slot>\n          </template>\n          <preview name=\"main\">\n            <component0></component0>\n          </preview>\n        </component>",
            ],
            [
                "<component id=\"component0\"><template><slot name=\"a0\"></slot><c d=\"ik\" e=\"h\"></c><j c=\"ji\" g=\"a\"></j><slot name=\"a0\"></slot><slot name=\"a0\"></slot></template><preview name=\"main\"><component0 a=\"j\" i=\"dj\"></component0></preview></component>",
                "<component id=\"component0\"><template><g i=\"j\"></g><b h=\"l\"></b><f b=\"ai\" f=\"ie\"></f><c b=\"eg\" g=\"b\"></c><l i=\"ke\"></l><c f=\"e\"></c><c d=\"jh\" f=\"bc\"></c><k d=\"a\"></k><h d=\"ca\"></h><g a=\"a\" j=\"jf\"></g></template><preview name=\"main\"><component0 d=\"gi\" f=\"f\"></component0></preview></component> -> <component id=\"component0\"><template><j k=\"ej\" i=\"dl\"></j><e c=\"kf\"></e><j h=\"h\" i=\"fb\"></j><c f=\"cl\" l=\"k\"></c></template><preview name=\"main\"><component0 c=\"ck\" j=\"g\"></component0></preview></component> -> <component id=\"component0\"><template><e j=\"b\" c=\"kh\"></e><g i=\"gj\"></g></template><preview name=\"main\"><component0 e=\"l\"></component0></preview></component>"
            ],
            [
                "<component id=\"component0\">\n            <template>\n                <b></b>\n                <slot name=\"a0\"></slot>\n            </template>\n            <preview name=\"main\">\n                <component0></component0>\n            </preview>\n        </component>",
                "<component id=\"component0\">\n            <template>\n              <slot name=\"b0\"></slot>\n              <b></b>\n            </template>\n            <preview name=\"main\">\n              <component0></component0>\n            </preview>\n        </component>"
            ],
            [
                "<component id=\"component0\">\n            <template>\n                <g></g>\n                <l></l>\n            </template>\n            <preview name=\"main\">\n                <component0></component0>\n            </preview>\n        </component>",
                "<component id=\"component0\">\n            <template>\n                <slot name=\"h0\"></slot>\n                <k></k>\n                <l></l>\n            </template>\n            <preview name=\"main\">\n                <component0></component0>\n            </preview>\n        </component>"
            ],
            [
                "<component id=\"component0\">\n            <template>\n                <slot name=\"g0\"></slot>\n            </template>\n            <preview name=\"main\">\n                <component0 b=\"le\" g=\"g\" g=\"ej\" i=\"ah\"></component0>\n            </preview>\n        </component>",
                "<component id=\"component0\">\n            <template>\n                <slot name=\"e0\"></slot>\n                <slot name=\"e0\"></slot>\n            </template>\n            <preview name=\"main\">\n                <component0 g=\"g\"></component0>\n            </preview>\n        </component>"
            ],
            [
                "<component id=\"component0\">\n            <template><i i=\"j\"></i></template>\n            <preview name=\"main\">\n                <component0></component0>\n            </preview>\n        </component>",
                "<component id=\"component0\">\n            <template>\n                <i g=\"j\" i=\"i\" k=\"c\" k=\"a\"></i>\n            </template>\n            <preview name=\"main\">\n                <component0 e=\"l\" g=\"h\" i=\"ik\"></component0>\n            </preview>\n        </component>"
            ],
            [
                "<component id=\"component0\">\n            <template>\n                <l></l>\n                <slot name=\"d1\">\n                    <slot name=\"d1\"></slot>\n                </slot>\n            </template>\n            <preview name=\"main\">\n                <component0></component0>\n            </preview>\n        </component>",
                "<component id=\"component0\">\n            <template>\n                <slot name=\"l0\"></slot>\n                <l>lcf</l>\n            </template>\n            <preview name=\"main\">\n                <component0></component0>\n            </preview>\n        </component>"
            ],
            [
                "<component id=\"component0\">\n          <template>\n            <slot name=\"a0\">fch</slot>\n          </template>\n          <preview name=\"main\">\n            <component0></component0>\n          </preview>\n        </component>",
                "<component id=\"component0\">\n          <template>\n            <slot name=\"e0\">\n              <slot name=\"e0\"></slot>dbcf\n            </slot>\n          </template>\n          <preview name=\"main\">\n            <component0></component0>\n          </preview>\n        </component>"
            ],
            [
                "<component id=\"component0\">\n            <template></template>\n            <preview name=\"main\">\n                <component0></component0>\n            </preview>\n        </component>",
                "<component id=\"component0\">\n            <style>\n                .container {\n                  color: red;\n                }\n            </style>\n            <template></template>\n            <preview name=\"main\">\n                <component0></component0>\n            </preview>\n        </component>"
            ],
            [
                "\n        <component id=\"component1\">\n            <style>\n                @media k {\n                   \n                }\n                \n            </style>\n            <template>\n                <component0></component0>\n            </template>\n            <preview name=\"main\">\n                <component1></component1>\n            </preview>\n        </component>",
                "<component id=\"component0\">\n            <style>\n                @media g {\n                    .k {\n                        b: kh;\n                        a: eb;\n                        g: ki;\n                    }\n                }\n            </style>\n            <template>\n                <c></c>\n            </template>\n            <preview name=\"main\">\n                <component0></component0>\n            </preview>\n        </component>\n        <component id=\"component1\">\n            <style>\n                @media e {\n                    .l {\n                        d: fk;\n                    }\n                }\n            </style>\n            <template>\n                <component0></component0>\n            </template>\n            <preview name=\"main\">\n                <component1></component1>\n            </preview>\n        </component>"
            ],
            [
                "\n          <component id=\"test1\">\n            <template>\n              <div class=\"a\"></div>\n            </template>\n            <preview name=\"main\"> \n              <test1 />\n            </preview>\n          </component>\n        ",
                "\n          <component id=\"test1\">\n            <template>\n              <div class=\"b\"></div>\n            </template>\n            <preview name=\"main\"> \n              <test1 />\n            </preview>\n          </component>\n        "
            ],
            [
                "\n          <component id=\"test1\">\n            <template>\n              <span class=\"a\"></div>\n            </template>\n            <preview name=\"main\"> \n              <test1 />\n            </preview>\n          </component>\n        ",
                "\n          <component id=\"test1\">\n            <template>\n              <div class=\"b\"></div>\n            </template>\n            <preview name=\"main\"> \n              <test1 />\n            </preview>\n          </component>\n        "
            ]
        ].forEach(function (variants) {
            it("can diff & patch " + variants.join(" -> "), function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, diffPatchVariants(variants)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe("components", function () {
            describe("fuzzy", function () {
                var tests = Array.from({ length: 100 }).map(function () {
                    return Array.from({ length: 2 }).map(function () { return utils_1.generateRandomComponents(4, 4, 4, 4, 4, 4, 4); });
                });
                tests.forEach(function (variants) {
                    it("can diff & patch " + variants.join(" -> "), function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, diffPatchVariants(variants)];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                });
            });
        });
        describe("CSS", function () {
            [
                [".a {}", ".b {}"],
                [".a {} .b {}", ".b {} .a {}"],
                [".a {} .b {}", ".b {}"],
                [".a {b: c; d: e;}", ".b {d:e;b:c;}"],
                // busted fuzzy tests
                ["@keyframes a {}", "@keyframes b {}"],
                ["@keyframes a { 0% { color: red; }}", "@media b { .c { color: blue; }}"],
                [".k { e: a;}", "i { f: kb; e: k;} .i { a: e;}"],
                [".i { h: ag;}", "@media e { .f { h: ea;}}", ".g { c: el;} @media k { .k { l: h; d: gk;}}"],
                [".i { g: d; a: fk; g: ca;}", ".f { g: d;}"],
                [".d { a: h; i: le; h: j;}", ".a { g: b; c: k; g: c;}  @keyframes j { 100% { a: kl;}  4% { g: c;}}"],
                [".l { i: kj; g: dg;}", ".b { k: c; g: d; i: e;}"]
            ].forEach(function (variants) {
                it("can diff & patch " + variants.join(" -> "), function () { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, diffPatchVariants(variants.map(function (variant) {
                                    return "\n            <component id=\"test\">\n              <style>\n                " + variant + "\n              </style>\n              <template>\n                <slot></slot>\n              </template>\n              <preview name=\"main\">\n                <test />\n              </preview>\n            </component>\n            ";
                                }))];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
            describe("fuzzy tests", function () {
                var tests = Array.from({ length: 100 }).map(function () {
                    return Array.from({ length: 4 }).map(function () { return utils_1.generateRandomStyleSheet(5, 5); });
                });
                tests.forEach(function (variants) {
                    it("can diff & patch " + variants.join(" -> "), function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, diffPatchVariants(variants.map(function (variant) {
                                        return "\n              <component id=\"test\">\n                <style>\n                  " + variant + "\n                </style>\n                <template>\n                  <slot></slot>\n                </template>\n                <preview name=\"main\">\n                  <test />\n                </preview>\n              </component>\n              ";
                                    }))];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                });
            });
        });
    });
});
var diffPatchVariants = function (variants) { return __awaiter(_this, void 0, void 0, function () {
    var fakeDocument, body, map, currentDocument, _i, variants_1, variant, newDocument, result, expBody;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                fakeDocument = new utils_1.FakeDocument();
                body = fakeDocument.createElement("body");
                _i = 0, variants_1 = variants;
                _a.label = 1;
            case 1:
                if (!(_i < variants_1.length)) return [3 /*break*/, 4];
                variant = variants_1[_i];
                return [4 /*yield*/, runPCComponent({
                        "entry.pc": variant
                    })];
            case 2:
                newDocument = _a.sent();
                if (!currentDocument) {
                    currentDocument = slim_dom_1.setVMObjectIds(newDocument, "item");
                    map = slim_dom_1.renderDOM2(currentDocument, body);
                }
                else {
                    result = patchNodeAndDOM(currentDocument, newDocument, body, map);
                    currentDocument = result.node;
                    map = result.map;
                    expBody = fakeDocument.createElement("body");
                    slim_dom_1.renderDOM2(newDocument, expBody);
                    chai_1.expect(body.toString()).to.eql(expBody.toString());
                }
                _a.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4: return [2 /*return*/];
        }
    });
}); };
var patchNodeAndDOM = function (oldNode, newNode, mount, map) {
    var diffs = slim_dom_1.prepDiff(oldNode, slim_dom_1.diffNode(oldNode, newNode));
    for (var _i = 0, diffs_1 = diffs; _i < diffs_1.length; _i++) {
        var mutation = diffs_1[_i];
        map = slim_dom_1.patchDOM2(mutation, oldNode, mount, map);
        oldNode = slim_dom_1.patchNode2(mutation, oldNode);
    }
    return { node: oldNode, map: map };
};
var runPCTemplate = function (source) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, runPCComponent({
                    "entry.pc": "<component id=\"comp\"><template>" + source + "</template><preview name=\"main\"><comp /></preview></component>"
                })];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
var runPCComponent = function (files, entry) {
    if (entry === void 0) { entry = Object.keys(files)[0]; }
    return __awaiter(_this, void 0, void 0, function () {
        var _a, graph, graphDiagnostics, module, _b, document, diagnostics;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, __1.loadModuleDependencyGraph(entry, {
                        readFile: function (filePath) { return files[filePath]; }
                    })];
                case 1:
                    _a = _c.sent(), graph = _a.graph, graphDiagnostics = _a.diagnostics;
                    if (graphDiagnostics.length) {
                        console.error(JSON.stringify(graphDiagnostics, null, 2));
                        throw graphDiagnostics[0];
                    }
                    module = graph[entry].module;
                    _b = __1.runPCFile({
                        entry: {
                            filePath: entry,
                            componentId: module.components[0].id,
                            previewName: module.components[0].previews[0].name
                        },
                        graph: graph
                    }), document = _b.document, diagnostics = _b.diagnostics;
                    return [2 /*return*/, document];
            }
        });
    });
};
//# sourceMappingURL=dom-render2-test.js.map