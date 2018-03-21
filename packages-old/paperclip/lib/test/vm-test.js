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
var vm_1 = require("../vm");
var chai_1 = require("chai");
var loader_1 = require("../loader");
var utils_1 = require("./utils");
describe(__filename + "#", function () {
    [
        [
            {
                "entry.pc": "\n          <component id=\"root\">\n            <template>\n              Hello\n            </template>\n            <preview name=\"main\">\n              <root />\n            </preview>\n          </component>\n        "
            },
            "<root><#shadow> Hello </#shadow></root>"
        ],
        [
            {
                "entry.pc": "\n          <component id=\"root\">\n            <template>\n              a\n            </template>\n            <preview name=\"main\">\n              <root>b</root>\n            </preview>\n          </component>\n        "
            },
            "<root><#shadow> a </#shadow>b</root>"
        ],
        [
            {
                "entry.pc": "\n          <component id=\"root\">\n            <template>\n              [[bind a]]\n            </template>\n            <preview name=\"main\">\n              <root a=\"b\" />\n            </preview>\n          </component>\n        "
            },
            "<root a=\"b\"><#shadow> b </#shadow></root>"
        ],
        [
            {
                "entry.pc": "\n          <component id=\"a\">\n            <template>\n              [[bind a]]\n            </template>\n          </component>\n          <component id=\"root\">\n            <template>\n              <a a=[[bind a]] />\n              [[bind a]]\n            </template>\n            <preview name=\"main\">\n              <root a=\"b\" />\n            </preview>\n          </component>\n        "
            },
            "<root a=\"b\"><#shadow><a a=\"b\"><#shadow> b </#shadow></a> b </#shadow></root>"
        ],
        [
            {
                "entry.pc": "\n          <component id=\"root\">\n            <template>\n              [[bind a]]\n            </template>\n            <preview name=\"main\">\n              <root a=\"[[bind 'b']]\" />\n            </preview>\n          </component>\n        "
            },
            "<root a=\"b\"><#shadow> b </#shadow></root>"
        ],
        [
            {
                "entry.pc": "\n          <component id=\"root\">\n            <template>\n              [[bind a]]\n            </template>\n            <preview name=\"main\">\n              <root a />\n            </preview>\n          </component>\n        "
            },
            "<root a=\"true\"><#shadow> true </#shadow></root>"
        ],
        [
            {
                "entry.pc": "\n          <component id=\"root\">\n            <template>\n              <div [[repeat items as item]]>\n                [[bind item]]\n              </div>\n            </template>\n            <preview name=\"main\">\n              <root items=[[bind [1, 2, 3]]] />\n            </preview>\n          </component>\n        "
            },
            "<root><#shadow><div> 1 </div><div> 2 </div><div> 3 </div></#shadow></root>"
        ],
        [
            {
                "entry.pc": "\n          <component id=\"root\">\n            <template>\n              <div [[repeat items as item, k]]>\n                [[bind item]] [[bind k]]\n              </div>\n            </template>\n            <preview name=\"main\">\n              <root items=[[bind {a: 1, b: 2}]] />\n            </preview>\n          </component>\n        "
            },
            "<root><#shadow><div> 1 a </div><div> 2 b </div></#shadow></root>"
        ],
        [
            {
                "entry.pc": "\n          <component id=\"root\">\n            <template>\n              <div [[repeat items as a]]>\n                <div [[repeat a as b]]>\n                  [[bind b]]\n                </div>\n              </div>\n            </template>\n            <preview name=\"main\">\n              <root items=[[bind [[1, 2, 3], [4, 5, 6, 7]]]] />\n            </preview>\n          </component>\n        "
            },
            "<root><#shadow><div><div> 1 </div><div> 2 </div><div> 3 </div></div><div><div> 4 </div><div> 5 </div><div> 6 </div><div> 7 </div></div></#shadow></root>"
        ],
        [
            {
                "entry.pc": "\n          <component id=\"root\">\n            <template>\n              <div [[if a]]>\n                [[bind a]]!\n              </div>\n            </template>\n            <preview name=\"main\">\n              <root a />\n            </preview>\n          </component>\n        "
            },
            "<root a=\"true\"><#shadow><div> true! </div></#shadow></root>"
        ],
        [
            {
                "entry.pc": "\n          <component id=\"root\">\n            <template>\n              <div [[if a]]>\n                [[bind a]]!\n              </div>\n            </template>\n            <preview name=\"main\">\n              <root />\n            </preview>\n          </component>\n        "
            },
            "<root><#shadow></#shadow></root>"
        ],
        [
            {
                "entry.pc": "\n          <component id=\"root\">\n            <template>\n              <div [[if a]]>\n                [[bind a]]!\n              </div>\n              <div [[else]]>\n                no pass\n              </div>\n            </template>\n            <preview name=\"main\">\n              <root />\n            </preview>\n          </component>\n        "
            },
            "<root><#shadow><div> no pass </div></#shadow></root>"
        ],
        [
            {
                "entry.pc": "\n          <component id=\"root\">\n            <template>\n              <div [[if a === 1]]>\n                One\n              </div>\n              <div [[elseif a === 2]]>\n                Two\n              </div>\n            </template>\n            <preview name=\"main\">\n              <root a=[[bind 1]] />\n            </preview>\n          </component>\n        "
            },
            "<root a=\"1\"><#shadow><div> One </div></#shadow></root>"
        ],
        [
            {
                "entry.pc": "\n          <component id=\"root\">\n            <template>\n              <div [[if a === 1]]>\n                One\n              </div>\n              <div [[elseif a === 2]]>\n                Two\n              </div>\n              <div [[else]]>\n                No pass\n              </div>\n            </template>\n            <preview name=\"main\">\n              <root a=[[bind 2]] />\n            </preview>\n          </component>\n        "
            },
            "<root a=\"2\"><#shadow><div> Two </div></#shadow></root>"
        ],
        [
            {
                "entry.pc": "\n          <component id=\"root\">\n            <template>\n              <div [[if a === 1]]>\n                One\n              </div>\n              <div [[elseif a === 2]]>\n                Two\n              </div>\n              <div [[else]]>\n                No pass\n              </div>\n            </template>\n            <preview name=\"main\">\n              <root a=[[bind 3]] />\n            </preview>\n          </component>\n        "
            },
            "<root a=\"3\"><#shadow><div> No pass </div></#shadow></root>"
        ],
        [
            {
                "entry.pc": "\n          <component id=\"root\">\n            <template>\n              <root [[if a < 3]] a=[[bind a + 1]]>\n                [[bind a]]\n              </root>\n            </template>\n            <preview name=\"main\">\n              <root a=[[bind 1]] />\n            </preview>\n          </component>\n        "
            },
            "<root a=\"1\"><#shadow><root a=\"2\"><#shadow><root a=\"3\"><#shadow></#shadow> 2 </root></#shadow> 1 </root></#shadow></root>"
        ],
        [
            {
                "entry.pc": "\n          <component id=\"root\">\n            <template>  \n              [[bind a]] [[bind 2]]\n            </template>\n            <preview name=\"main\">\n              <root [[bind {a: 1}]] [[bind {b: 2}]] />\n            </preview>\n          </component>\n        "
            },
            "<root a=\"1\" b=\"2\"><#shadow> 1 2 </#shadow></root>"
        ],
        [
            {
                "entry.pc": "\n          <link rel=\"import\" href=\"module.pc\" />\n          <component id=\"root\">\n            <template>  \n              <compc [[bind props]]> \n                child\n              </compc>\n            </template>\n            <preview name=\"main\">\n              <root props=[[bind {a: 1}]] />\n            </preview>\n          </component>\n        ",
                "/module.pc": "\n          <component id=\"compc\">\n            <template>  \n              [[bind a]]\n            </template>\n          </component>\n        "
            },
            "<root><#shadow><compc a=\"1\"><#shadow> 1 </#shadow> child </compc></#shadow></root>"
        ],
        [
            {
                "entry.pc": "\n          <component id=\"root\">\n            <style>\n              .container {\n                color: red;\n              }\n            </style>\n            <template>  \n              <div class=\"container\">\n              </div>\n            </template>\n            <preview name=\"main\">\n              <root />\n            </preview>\n          </component>\n        "
            },
            "<style scope=\"root\">.container {color: red;}</style><root><#shadow><div class=\"container\"></div></#shadow></root>"
        ],
        [
            {
                "/style.css": "\n          .container {\n            color: red;\n          }\n        ",
                "entry.pc": "\n          <component id=\"root\">\n            <style>\n              @import \"style.css\";\n            </style>\n            <template>  \n              <div class=\"container\">\n              </div>\n            </template>\n            <preview name=\"main\">\n              <root />\n            </preview>\n          </component>\n        "
            },
            "<style scope=\"root\">@import \"/style.css\";</style><style>.container {color: red;}</style><root><#shadow><div class=\"container\"></div></#shadow></root>"
        ]
    ].forEach(function (_a) {
        var entries = _a[0], result = _a[1];
        it("can render " + entries["entry.pc"], function () { return __awaiter(_this, void 0, void 0, function () {
            var output, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = vm_1.runPCFile;
                        _b = {
                            entry: {
                                filePath: "entry.pc",
                                componentId: "root",
                                previewName: "main"
                            }
                        };
                        return [4 /*yield*/, loader_1.loadModuleDependencyGraph("entry.pc", {
                                readFile: function (uri) {
                                    return Promise.resolve(entries[uri]);
                                }
                            })];
                    case 1: return [4 /*yield*/, _a.apply(void 0, [(_b.graph = (_c.sent()).graph,
                                _b)])];
                    case 2:
                        output = _c.sent();
                        chai_1.expect(utils_1.stringifyNode(output.document).replace(/[\s\r\n\t]+/g, " ")).to.eql(result);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=vm-test.js.map