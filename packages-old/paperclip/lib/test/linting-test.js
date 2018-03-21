"use strict";
// TODO - infinite loop detection
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
describe(__filename + "#", function () {
    // deep inferencing
    [
        [
            {
                "entry.pc": "\n          <component id=\"test\">\n            <template>\n              [[bind a]]\n            </template>\n          </component>\n          <component id=\"test2\">\n            <template>\n              <test />\n            </template>\n          </component>\n        "
            },
            [
                {
                    "type": "WARNING",
                    "location": {
                        "start": {
                            "column": 11,
                            "line": 2,
                            "pos": 11
                        },
                        "end": {
                            "column": 23,
                            "line": 6,
                            "pos": 127
                        }
                    },
                    "message": "Missing preview tag",
                    "filePath": "entry.pc"
                },
                {
                    "type": "ERROR",
                    "location": {
                        "start": {
                            "column": 15,
                            "line": 9,
                            "pos": 198
                        },
                        "end": {
                            "column": 23,
                            "line": 9,
                            "pos": 206
                        }
                    },
                    "message": "Property \"a\" is undefined",
                    "filePath": "entry.pc"
                },
                {
                    "type": "WARNING",
                    "location": {
                        "start": {
                            "column": 11,
                            "line": 7,
                            "pos": 138
                        },
                        "end": {
                            "column": 23,
                            "line": 11,
                            "pos": 253
                        }
                    },
                    "message": "Missing preview tag",
                    "filePath": "entry.pc"
                }
            ]
        ],
        [
            {
                "entry.pc": "\n          <component id=\"test\">\n          </component>\n        "
            },
            [
                {
                    "type": "ERROR",
                    "location": {
                        "start": {
                            "column": 11,
                            "line": 2,
                            "pos": 11
                        },
                        "end": {
                            "column": 23,
                            "line": 3,
                            "pos": 55
                        }
                    },
                    "message": "missing template",
                    "filePath": "entry.pc"
                },
                {
                    "type": "WARNING",
                    "location": {
                        "start": {
                            "column": 11,
                            "line": 2,
                            "pos": 11
                        },
                        "end": {
                            "column": 23,
                            "line": 3,
                            "pos": 55
                        }
                    },
                    "message": "Missing preview tag",
                    "filePath": "entry.pc"
                }
            ]
        ],
        [
            {
                "entry.pc": "\n          <component id=\"test\">\n            <preview name=\"test\">\n              <test />\n            </preview>\n          </component>\n        "
            },
            [
                {
                    "type": "ERROR",
                    "location": {
                        "start": {
                            "column": 11,
                            "line": 2,
                            "pos": 11
                        },
                        "end": {
                            "column": 23,
                            "line": 6,
                            "pos": 135
                        }
                    },
                    "message": "missing template",
                    "filePath": "entry.pc"
                }
            ]
        ],
        [
            {
                "entry.pc": "\n          <component id=\"test\">\n            <template>\n              [[bind a * c]]\n            </template>\n            <preview name=\"main\">\n              <test a=\"b\" />\n            </preview>\n          </component>\n        "
            },
            [
                {
                    filePath: "entry.pc",
                    location: {
                        start: {
                            column: 23,
                            line: 7,
                            pos: 165
                        },
                        end: {
                            column: 26,
                            line: 7,
                            pos: 168
                        }
                    },
                    message: "Type mismatch: attribute \"a\" expecting a number, string provided.",
                    type: __1.DiagnosticType.ERROR
                },
                {
                    filePath: "entry.pc",
                    location: {
                        start: {
                            column: 15,
                            line: 7,
                            pos: 157
                        },
                        end: {
                            column: 29,
                            line: 7,
                            pos: 171
                        }
                    },
                    message: "Property \"c\" is undefined",
                    type: __1.DiagnosticType.ERROR
                }
            ]
        ],
        [
            {
                "entry.pc": "\n          <component id=\"test\">\n            <template>\n              [[bind a * c]]\n            </template>\n            <preview name=\"main\">\n              <test a=[[bind 1]] c=[[bind 2]] />\n            </preview>\n          </component>\n        "
            },
            [],
        ],
        [
            {
                "entry.pc": "\n          <component id=\"test\">\n            <template>\n              [[bind a.b.c * 4]]\n            </template>\n            <preview name=\"main\">\n              <test a=[[bind {a: {b: 1 }}]] />\n            </preview>\n          </component>\n        "
            },
            [
                {
                    filePath: "entry.pc",
                    location: {
                        end: {
                            column: 42,
                            line: 7,
                            pos: 188
                        },
                        start: {
                            column: 30,
                            line: 7,
                            pos: 176
                        }
                    },
                    message: "Property \"a.b.c\" is undefined",
                    type: "ERROR"
                },
            ]
        ],
        [
            {
                "entry.pc": "\n          <component id=\"a\">\n            <template>\n              [[bind c * 1]]\n            </template>\n          </component>\n          <component id=\"b\">\n            <template>\n              <a c=[[bind d]] />\n            </template>\n            <preview name=\"main\">\n              <b d=\"1\" />\n            </preview>\n          </component>\n        "
            },
            [
                {
                    "type": "WARNING",
                    "location": {
                        "start": {
                            "column": 11,
                            "line": 2,
                            "pos": 11
                        },
                        "end": {
                            "column": 23,
                            "line": 6,
                            "pos": 128
                        }
                    },
                    "message": "Missing preview tag",
                    "filePath": "entry.pc"
                },
                {
                    "type": "ERROR",
                    "location": {
                        "start": {
                            "column": 20,
                            "line": 12,
                            "pos": 291
                        },
                        "end": {
                            "column": 23,
                            "line": 12,
                            "pos": 294
                        }
                    },
                    "message": "Type mismatch: attribute \"c\" expecting a number, string provided.",
                    "filePath": "entry.pc"
                }
            ]
        ],
        [
            {
                "entry.pc": "\n          <component id=\"a\">\n            <template>\n              [[bind c * 1]]\n            </template>\n          </component>\n          <component id=\"b\">\n            <template>\n              <a c=[[bind d]] />\n            </template>\n            <preview name=\"main\">\n              <b [[bind {d: 1}]] />\n            </preview>\n          </component>\n        "
            },
            [
                {
                    "type": "WARNING",
                    "location": {
                        "start": {
                            "column": 11,
                            "line": 2,
                            "pos": 11
                        },
                        "end": {
                            "column": 23,
                            "line": 6,
                            "pos": 128
                        }
                    },
                    "message": "Missing preview tag",
                    "filePath": "entry.pc"
                }
            ]
        ],
        [
            {
                "entry.pc": "\n          <component id=\"a\">\n            <template>\n              [[bind c * 1]]\n            </template>\n          </component>\n          <component id=\"b\">\n            <template>\n              <a c=[[bind d]] />\n            </template>\n            <preview name=\"main\">\n              <b [[bind {c: 1}]] />\n            </preview>\n          </component>\n        "
            },
            [
                {
                    "type": "WARNING",
                    "location": {
                        "start": {
                            "column": 11,
                            "line": 2,
                            "pos": 11
                        },
                        "end": {
                            "column": 23,
                            "line": 6,
                            "pos": 128
                        }
                    },
                    "message": "Missing preview tag",
                    "filePath": "entry.pc"
                },
                {
                    "type": "ERROR",
                    "location": {
                        "start": {
                            "column": 25,
                            "line": 12,
                            "pos": 296
                        },
                        "end": {
                            "column": 31,
                            "line": 12,
                            "pos": 302
                        }
                    },
                    "message": "Property \"d\" is undefined",
                    "filePath": "entry.pc"
                },
                {
                    "type": "ERROR",
                    "location": {
                        "start": {
                            "column": 25,
                            "line": 12,
                            "pos": 296
                        },
                        "end": {
                            "column": 31,
                            "line": 12,
                            "pos": 302
                        }
                    },
                    "message": "Property \"c\" is undefined",
                    "filePath": "entry.pc"
                }
            ]
        ],
        [
            {
                "entry.pc": "\n          <component id=\"a\">\n            <template>\n              <a />\n            </template>\n            <preview name=\"a\">\n              <a />\n            </preview>\n          </component>\n        "
            },
            [
                {
                    filePath: "entry.pc",
                    location: {
                        start: {
                            column: 15,
                            line: 4,
                            pos: 67
                        },
                        end: {
                            column: 20,
                            line: 4,
                            pos: 72
                        }
                    },
                    message: "Maximum callstack exceeded",
                    type: __1.DiagnosticType.ERROR
                }
            ]
        ],
        [
            {
                "entry.pc": "\n          <component id=\"a\">\n            <template>\n              <a [[if a.a]] a=[[bind a.a]] />\n            </template>\n            <preview name=\"a\">\n            </preview>\n          </component>\n        "
            },
            [
                {
                    "type": "ERROR",
                    "location": {
                        "start": {
                            "column": 13,
                            "line": 6,
                            "pos": 135
                        },
                        "end": {
                            "column": 23,
                            "line": 7,
                            "pos": 176
                        }
                    },
                    "message": "missing element child",
                    "filePath": "entry.pc"
                }
            ]
        ],
        [
            {
                "entry.pc": "\n          <component id=\"a\">\n            <template>\n              [[bind c]]\n              <a [[if a.a]] a=[[bind a.a]] />\n            </template>\n            <preview name=\"main\">\n              <a a=[[bind { c: 1, a: { c: 1, a: null } }]] c=\"1\" />\n            </preview>\n          </component>\n        "
            },
            [
                {
                    filePath: "entry.pc",
                    location: {
                        start: {
                            column: 15,
                            line: 5,
                            pos: 92
                        },
                        end: {
                            column: 46,
                            line: 5,
                            pos: 123
                        }
                    },
                    message: "Property \"c\" is undefined",
                    type: __1.DiagnosticType.ERROR
                }
            ]
        ],
        [
            {
                "entry.pc": "\n          <component id=\"a\">\n            <template>\n              [[bind c]]\n              <a [[if a.a]] a=[[bind a.a]] c=[[bind a.c]] />\n            </template>\n            <preview name=\"main\">\n              <a a=[[bind { c: 1, a: { c: 1, a: null } }]] c=\"1\" />\n            </preview>\n          </component>\n        "
            },
            []
        ],
        [
            {
                "entry.pc": "\n          <component id=\"a\">\n            <template>\n              <a [[repeat a as b]] [[bind b]]></a>\n            </template>\n            <preview name=\"main\">\n              <a a=[[bind []]] />\n            </preview>\n          </component>\n        "
            },
            []
        ],
        [
            {
                "entry.pc": "\n          <component id=\"a\">\n            <template>\n            </template>\n            <preview name=\"main\">\n              <a a=[[bind [{a:1}, ]]] />\n            </preview>\n          </component>\n        "
            },
            []
        ],
        [
            {
                "entry.pc": "\n          <component id=\"a\">\n            <template>\n              <a [[repeat a as b]] [[bind b]]></a>\n            </template>\n            <preview name=\"main\">\n              <a a=[[bind [ {} ]]] />\n            </preview>\n          </component>\n        "
            },
            [
                {
                    "type": "ERROR",
                    "location": {
                        "start": {
                            "column": 29,
                            "line": 7,
                            "pos": 190
                        },
                        "end": {
                            "column": 31,
                            "line": 7,
                            "pos": 192
                        }
                    },
                    "message": "Property \"a\" is undefined",
                    "filePath": "entry.pc"
                }
            ]
        ],
        [
            {
                "entry.pc": "\n          <component id=\"a\">\n            <template>\n              <a [[repeat a as b]] a=[[bind b]]></a>\n            </template>\n            <preview name=\"main\">\n              <a a=[[bind [ {a: []} ]]] />\n            </preview>\n          </component>\n        "
            },
            []
        ],
        [
            {
                "entry.pc": "\n          <component id=\"a\">\n            <template>\n              <a [[repeat a as b]] [[bind b]]></a>\n            </template>\n            <preview name=\"main\">\n              <a a=[[bind [ {a: [{a:[]}]} ]]] />\n            </preview>\n          </component>\n        "
            },
            []
        ],
        [
            {
                "entry.pc": "\n          <component id=\"c\">\n            <template>\n              [[bind d]]\n            </template>\n            <preview name=\"a\">\n              <c />\n            </preview>\n          </component>\n          <component id=\"b\">\n            <template>\n\n            </template>\n            <preview name=\"a\">\n              <b />\n            </preview>\n          </component>\n          <component id=\"a\">\n            <template>\n              <b>\n                <c [[repeat i as k]] [[bind k]] />\n              </b>\n            </template>\n            <preview name=\"main\">\n              <a i=[[bind [{}]]] />\n            </preview>\n          </component>\n        "
            },
            [
                {
                    "type": "ERROR",
                    "location": {
                        "start": {
                            "column": 15,
                            "line": 7,
                            "pos": 147
                        },
                        "end": {
                            "column": 20,
                            "line": 7,
                            "pos": 152
                        }
                    },
                    "message": "Property \"d\" is undefined",
                    "filePath": "entry.pc"
                },
                {
                    "type": "ERROR",
                    "location": {
                        "start": {
                            "column": 28,
                            "line": 25,
                            "pos": 598
                        },
                        "end": {
                            "column": 30,
                            "line": 25,
                            "pos": 600
                        }
                    },
                    "message": "Property \"d\" is undefined",
                    "filePath": "entry.pc"
                }
            ]
        ],
        // optional testing
        [
            {
                "entry.pc": "\n          <component id=\"c\">\n            <template>\n              <a [[if a]]>[[bind a]]</a>\n            </template>\n            <preview name=\"main\">\n              <c />\n            </preview>\n          </component>          \n        "
            },
            []
        ],
        [
            {
                "entry.pc": "\n          <component id=\"c\">\n            <template>\n              [[bind a || \"not defined\"]]\n            </template>\n            <preview name=\"main\">\n              <c />\n            </preview>\n          </component>          \n        "
            },
            []
        ],
        [
            {
                "entry.pc": "\n          <component id=\"c\">\n            <template>\n              <a [[if a]]>[[bind a]]</a>\n              [[bind a]]\n            </template>\n            <preview name=\"main\">\n              <c />\n            </preview>\n          </component>          \n        "
            },
            [
                {
                    filePath: "entry.pc",
                    location: {
                        end: {
                            column: 20,
                            line: 8,
                            pos: 196
                        },
                        start: {
                            column: 15,
                            line: 8,
                            pos: 191
                        }
                    },
                    message: "Property \"a\" is undefined",
                    type: __1.DiagnosticType.ERROR
                }
            ]
        ],
        [
            {
                "entry.pc": "\n          <component id=\"c\">\n            <template>\n            </template>\n            <preview name=\"main\">\n              <c />\n            </preview>\n          </component>\n\n          <component id=\"c\">\n            <template>\n            </template>\n            <preview name=\"main\">\n              <c />\n            </preview>\n          </component>          \n        "
            },
            [
                {
                    "type": "ERROR",
                    "location": {
                        "start": {
                            "column": 11,
                            "line": 10,
                            "pos": 188
                        },
                        "end": {
                            "column": 23,
                            "line": 16,
                            "pos": 353
                        }
                    },
                    "message": "Duplicate component",
                    "filePath": "entry.pc"
                }
            ]
        ],
        [
            {
                "entry.pc": "\n          <component id=\"test2\">\n          <template>\n            <td-css-expr-input [[elseif !overridden &&]] value=[[bind value]] />\n          </template>\n          <preview name=\"test\">\n            <test2 value=\"a\" />\n          </preview>\n          </component>\n        "
            },
            []
        ],
        [
            {
                "entry.pc": "\n        <component id=\"a\">\n          <style>\n          </style>\n          <template>\n            <i [[elseif]] />\n          </template>\n          <preview name=\"main\" width=\"1366\" height=\"768\">\n            <a />\n          </preview>\n        </component>\n        "
            },
            []
        ],
        [
            {
                "entry.pc": "\n        <component id=\"a\">\n          <style>\n          </style>\n          <template>\n            [[bind c]] [[bind d]]\n          </template>\n          <preview name=\"main\" width=\"1366\" height=\"768\">\n            <a c d />\n          </preview>\n        </component>\n\n        <component id=\"b\">\n          <style>\n          </style>\n          <template>\n            <a [[bind aProps]] />\n          </template>\n          <preview name=\"main\" width=\"1366\" height=\"768\">\n            <b aProps=[[bind {c: true, d: true}]] />\n          </preview>\n        </component>\n        "
            },
            []
        ],
        [
            {
                "entry.pc": "\n        <component id=\"a\">\n          <style>\n          </style>\n          <template>\n            [[bind c]] [[bind d]]\n          </template>\n          <preview name=\"main\" width=\"1366\" height=\"768\">\n            <a c d />\n          </preview>\n        </component>\n\n        <component id=\"b\">\n          <style>\n          </style>\n          <template>\n            <a [[bind aProps]] />\n          </template>\n          <preview name=\"main\" width=\"1366\" height=\"768\">\n            <b aProps=[[bind {c: true}]] />\n          </preview>\n        </component>\n        "
            },
            [
                {
                    "type": "ERROR",
                    "location": {
                        "start": {
                            "column": 30,
                            "line": 20,
                            "pos": 493
                        },
                        "end": {
                            "column": 39,
                            "line": 20,
                            "pos": 502
                        }
                    },
                    "message": "Property \"d\" is undefined",
                    "filePath": "entry.pc"
                }
            ]
        ],
        [
            {
                "entry.pc": "\n        <component id=\"td-components-pane\">\n        <template>\n          <td-pane noHeadingPadding>\n            <span slot=\"header\" class=\"header\">\n              <span class=\"tab [[bind nativeElementsTabSelected && \"selected\"]]\">\n                Native Elements\n              </span>\n              <span class=\"tab [[bind nativeComponentsTabSelected && \"selected\"]]\">\n                Components\n                <input type=\"text\"></input>\n                <span class=\"controls\" onClick=[[bind onAddComponentClick]]>\n                  +\n                </span>\n              </span>\n            </span>\n            <div slot=\"content\" class=\"content\">\n              <td-list [[if nativeComponentsTabSelected]]>\n                <td-list-item [[repeat components as component]]>\n                </td-list-item>\n              </td-list>\n              <td-list [[elseif nativeElementsTabSelected]]>\n                <td-list-item [[repeat nativeElements as nativeElement]]>\n                  \n                </td-list-item>\n              </td-list>\n            </div>\n          </td-pane>\n        </template>\n        <preview name=\"main\">\n          <td-components-pane nativeElementsTabSelected=[[bind false]] nativeComponentsTabSelected=[[bind true]] dispatch onAddComponentClick components=[[bind []]] nativeElements=[[bind [\n                { label: \"li\", $id: null, onDragStart: null, onDragEnd: null, onClick: null }\n              ]]]\n               />\n        </preview>\n      </component>\n        "
            },
            []
        ]
    ].forEach(function (_a) {
        var sources = _a[0], inferResult = _a[1];
        it("can lint " + sources["entry.pc"], function () { return __awaiter(_this, void 0, void 0, function () {
            var graph, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, __1.loadModuleDependencyGraph("entry.pc", {
                            readFile: function (uri) { return sources[uri]; }
                        })];
                    case 1:
                        graph = (_a.sent()).graph;
                        result = __1.lintDependencyGraph(graph);
                        // uncomment to update locs
                        // console.log(JSON.stringify(result.diagnostics, null, 2));
                        chai_1.expect(result.diagnostics).to.eql(inferResult);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=linting-test.js.map