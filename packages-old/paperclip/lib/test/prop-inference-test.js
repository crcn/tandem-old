"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var __1 = require("..");
describe(__filename + "#", function () {
    // smoke
    [
        ["[[bind a]]", {
                type: __1.InferenceType.OBJECT_OR_ARRAY,
                properties: {
                    a: {
                        type: __1.InferenceType.ANY,
                        properties: {}
                    }
                }
            }],
        ["[[bind a]] [[bind b]]", {
                type: __1.InferenceType.OBJECT_OR_ARRAY,
                properties: {
                    a: {
                        type: __1.InferenceType.ANY,
                        properties: {}
                    },
                    b: {
                        type: __1.InferenceType.ANY,
                        properties: {}
                    }
                }
            }],
        ["[[bind a.b.c]]", {
                type: __1.InferenceType.OBJECT_OR_ARRAY,
                properties: {
                    a: {
                        type: __1.InferenceType.OBJECT_OR_ARRAY,
                        properties: {
                            b: {
                                type: __1.InferenceType.OBJECT_OR_ARRAY,
                                properties: {
                                    c: {
                                        type: __1.InferenceType.ANY,
                                        properties: {}
                                    }
                                }
                            }
                        }
                    }
                }
            }],
        ["[[bind a * b]]", {
                type: __1.InferenceType.OBJECT_OR_ARRAY,
                properties: {
                    a: {
                        type: __1.InferenceType.NUMBER,
                        properties: {}
                    },
                    b: {
                        type: __1.InferenceType.NUMBER,
                        properties: {}
                    }
                }
            }],
        ["[[bind a / b]]", {
                type: __1.InferenceType.OBJECT_OR_ARRAY,
                properties: {
                    a: {
                        type: __1.InferenceType.NUMBER,
                        properties: {}
                    },
                    b: {
                        type: __1.InferenceType.NUMBER,
                        properties: {}
                    }
                }
            }],
        ["[[bind a - b]]", {
                type: __1.InferenceType.OBJECT_OR_ARRAY,
                properties: {
                    a: {
                        type: __1.InferenceType.NUMBER,
                        properties: {}
                    },
                    b: {
                        type: __1.InferenceType.NUMBER,
                        properties: {}
                    }
                }
            }],
        ["[[bind a + b]]", {
                type: __1.InferenceType.OBJECT_OR_ARRAY,
                properties: {
                    a: {
                        type: __1.InferenceType.ANY,
                        properties: {}
                    },
                    b: {
                        type: __1.InferenceType.ANY,
                        properties: {}
                    }
                }
            }],
        ["[[bind a * c]] [[bind a + b]]", {
                type: __1.InferenceType.OBJECT_OR_ARRAY,
                properties: {
                    a: {
                        type: __1.InferenceType.NUMBER,
                        properties: {}
                    },
                    c: {
                        type: __1.InferenceType.NUMBER,
                        properties: {}
                    },
                    b: {
                        type: __1.InferenceType.ANY,
                        properties: {}
                    }
                }
            }],
        ["[[bind (a + b) * c]]", {
                type: __1.InferenceType.OBJECT_OR_ARRAY,
                properties: {
                    a: {
                        type: __1.InferenceType.NUMBER,
                        properties: {}
                    },
                    b: {
                        type: __1.InferenceType.NUMBER,
                        properties: {}
                    },
                    c: {
                        type: __1.InferenceType.NUMBER,
                        properties: {}
                    }
                }
            }],
        ["[[bind (a.b + c) * d]]", {
                type: __1.InferenceType.OBJECT_OR_ARRAY,
                properties: {
                    a: {
                        type: __1.InferenceType.OBJECT_OR_ARRAY,
                        properties: {
                            b: {
                                type: __1.InferenceType.NUMBER,
                                properties: {}
                            }
                        }
                    },
                    c: {
                        type: __1.InferenceType.NUMBER,
                        properties: {}
                    },
                    d: {
                        type: __1.InferenceType.NUMBER,
                        properties: {}
                    }
                }
            }],
        ["[[bind a + \"\"]]", {
                type: __1.InferenceType.OBJECT_OR_ARRAY,
                properties: {
                    a: {
                        type: __1.InferenceType.ANY,
                        properties: {}
                    }
                }
            }],
        ["[[bind a || b]]", {
                type: __1.InferenceType.OBJECT_OR_ARRAY,
                properties: {
                    a: {
                        type: __1.InferenceType.ANY,
                        properties: {}
                    },
                    b: {
                        type: __1.InferenceType.ANY,
                        properties: {}
                    }
                }
            }],
        ["[[bind a && b]]", {
                type: __1.InferenceType.OBJECT_OR_ARRAY,
                properties: {
                    a: {
                        type: __1.InferenceType.ANY,
                        properties: {}
                    },
                    b: {
                        type: __1.InferenceType.ANY,
                        properties: {}
                    }
                }
            }],
        ["[[bind a * c]] [[bind a == b]]", {
                type: __1.InferenceType.OBJECT_OR_ARRAY,
                properties: {
                    a: {
                        type: __1.InferenceType.NUMBER,
                        properties: {}
                    },
                    c: {
                        type: __1.InferenceType.NUMBER,
                        properties: {}
                    },
                    b: {
                        type: __1.InferenceType.ANY,
                        properties: {}
                    }
                }
            }],
        ["[[bind a * c]][[bind a === b]]", {
                type: __1.InferenceType.OBJECT_OR_ARRAY,
                properties: {
                    a: {
                        type: __1.InferenceType.NUMBER,
                        properties: {}
                    },
                    c: {
                        type: __1.InferenceType.NUMBER,
                        properties: {}
                    },
                    b: {
                        type: __1.InferenceType.NUMBER,
                        properties: {}
                    }
                }
            }],
        ["[[bind a * b + \"%\"]]", {
                type: __1.InferenceType.OBJECT_OR_ARRAY,
                properties: {
                    a: {
                        type: __1.InferenceType.NUMBER,
                        properties: {}
                    },
                    b: {
                        type: __1.InferenceType.NUMBER,
                        properties: {}
                    }
                }
            }],
        ["<a b=[[bind c]] />", {
                type: __1.InferenceType.OBJECT_OR_ARRAY,
                properties: {
                    c: {
                        type: __1.InferenceType.ANY,
                        properties: {}
                    }
                }
            }],
        ["<a b=\"[[bind c]] [[bind d]]\" />", {
                type: __1.InferenceType.OBJECT_OR_ARRAY,
                properties: {
                    c: {
                        type: __1.InferenceType.PRIMITIVE,
                        properties: {}
                    },
                    d: {
                        type: __1.InferenceType.PRIMITIVE,
                        properties: {}
                    }
                }
            }],
        ["<a b />", {
                type: __1.InferenceType.ANY,
                properties: {}
            }],
        ["<a>[[bind b]]</a>", {
                type: __1.InferenceType.OBJECT_OR_ARRAY,
                properties: {
                    b: {
                        type: __1.InferenceType.ANY,
                        properties: {}
                    }
                }
            }],
        // reserved attr names
        ["<a href=[[bind b]]>c</a>", {
                type: __1.InferenceType.OBJECT_OR_ARRAY,
                properties: {
                    b: {
                        type: __1.InferenceType.ANY,
                        properties: {}
                    }
                }
            }],
        ["<a class=[[bind b]]>c</a>", {
                type: __1.InferenceType.OBJECT_OR_ARRAY,
                properties: {
                    b: {
                        type: __1.InferenceType.ANY,
                        properties: {}
                    }
                }
            }],
        // special bindings
        ["<a [[if b]]></a>", {
                type: __1.InferenceType.OBJECT_OR_ARRAY,
                properties: {
                    b: {
                        type: __1.InferenceType.ANY,
                        properties: {}
                    }
                }
            }],
        ["<a [[elseif b]]></a>", {
                type: __1.InferenceType.OBJECT_OR_ARRAY,
                properties: {
                    b: {
                        type: __1.InferenceType.ANY,
                        properties: {}
                    }
                }
            }],
        ["<a [[repeat items as item]] [[bind item]]></a>", {
                type: __1.InferenceType.OBJECT_OR_ARRAY,
                properties: {
                    items: {
                        type: __1.InferenceType.OBJECT_OR_ARRAY,
                        properties: {
                            $$each: {
                                properties: {},
                                type: __1.InferenceType.ANY
                            }
                        }
                    }
                }
            }],
        ["<a [[repeat items as item]] key[[bind item.key]]></a>", {
                type: __1.InferenceType.OBJECT_OR_ARRAY,
                properties: {
                    items: {
                        type: __1.InferenceType.OBJECT_OR_ARRAY,
                        properties: {
                            $$each: {
                                type: __1.InferenceType.OBJECT_OR_ARRAY,
                                properties: {
                                    key: {
                                        type: __1.InferenceType.ANY,
                                        properties: {}
                                    }
                                }
                            }
                        }
                    }
                }
            }],
        ["<a [[repeat items as item]] key=[[bind item.b.c]]></a>", {
                type: __1.InferenceType.OBJECT_OR_ARRAY,
                properties: {
                    items: {
                        type: __1.InferenceType.OBJECT_OR_ARRAY,
                        properties: {
                            $$each: {
                                type: __1.InferenceType.OBJECT_OR_ARRAY,
                                properties: {
                                    b: {
                                        type: __1.InferenceType.OBJECT_OR_ARRAY,
                                        properties: {
                                            c: {
                                                type: __1.InferenceType.ANY,
                                                properties: {}
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }],
        ["<a [[repeat items as item]] [[bind item]]></a>[[bind item]]", {
                type: __1.InferenceType.OBJECT_OR_ARRAY,
                properties: {
                    items: {
                        type: __1.InferenceType.OBJECT_OR_ARRAY,
                        properties: {
                            $$each: {
                                type: __1.InferenceType.ANY,
                                properties: {}
                            }
                        }
                    },
                    item: {
                        type: __1.InferenceType.ANY,
                        properties: {}
                    }
                }
            }],
        ["<a [[repeat [1, 2, 3] as item]] [[bind item]]></a>", {
                type: __1.InferenceType.ANY,
                properties: {}
            }],
        ["<a [[repeat b as c]]><d [[repeat c as f]] g=[[bind c.length]] h=[[bind f.b]] /></a>", {
                type: __1.InferenceType.OBJECT_OR_ARRAY,
                properties: {
                    b: {
                        type: __1.InferenceType.OBJECT_OR_ARRAY,
                        properties: {
                            $$each: {
                                type: __1.InferenceType.OBJECT_OR_ARRAY,
                                properties: {
                                    length: {
                                        type: __1.InferenceType.ANY,
                                        properties: {},
                                    },
                                    $$each: {
                                        type: __1.InferenceType.OBJECT_OR_ARRAY,
                                        properties: {
                                            b: {
                                                type: __1.InferenceType.ANY,
                                                properties: {}
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }],
        ["<a style=[[bind { color: color }]]></a>", {
                type: __1.InferenceType.OBJECT_OR_ARRAY,
                properties: {
                    color: {
                        type: __1.InferenceType.ANY,
                        properties: {}
                    }
                }
            }]
    ].forEach(function (_a) {
        var source = _a[0], inference = _a[1];
        it("can get the Inference for " + source, function () {
            chai_1.expect(__1.inferNodeProps(__1.parseModuleSource(source).root).inference).to.eql(inference);
        });
    });
    // error smoke
    [
        ["[[bind a * c]] [[bind a.c]]", [
                {
                    type: __1.DiagnosticType.ERROR,
                    filePath: "entry",
                    location: {
                        start: {
                            column: 22,
                            line: 1,
                            pos: 22
                        },
                        end: {
                            column: 25,
                            line: 1,
                            pos: 25
                        }
                    },
                    message: "Cannot call property \"c\" on primitive \"a\""
                }
            ]],
        ["[[bind a * \"5\"]]", [
                {
                    type: __1.DiagnosticType.ERROR,
                    filePath: "entry",
                    location: {
                        start: {
                            column: 11,
                            line: 1,
                            pos: 11
                        },
                        end: {
                            column: 14,
                            line: 1,
                            pos: 14
                        }
                    },
                    message: "The right-hand side of an arithmetic operation must be a number"
                }
            ]],
        ["[[bind a * b + \"%\"]]", []],
        ["[[bind a.b * c]] [[bind a.b.c]]", [
                {
                    type: __1.DiagnosticType.ERROR,
                    filePath: "entry",
                    location: {
                        start: {
                            column: 24,
                            line: 1,
                            pos: 24
                        },
                        end: {
                            column: 29,
                            line: 1,
                            pos: 29
                        }
                    },
                    message: "Cannot call property \"c\" on primitive \"a.b\""
                }
            ]],
        ["[[bind a.b.c]] [[bind a.b * c]]", [
                {
                    type: __1.DiagnosticType.ERROR,
                    filePath: "entry",
                    location: {
                        start: {
                            column: 22,
                            line: 1,
                            pos: 22
                        },
                        end: {
                            column: 25,
                            line: 1,
                            pos: 25
                        }
                    },
                    message: "The left-hand side of an arithmetic operation must be a number"
                }
            ]],
        ["[[bind a.b.c]] [[bind c * a.b]]", [
                {
                    type: __1.DiagnosticType.ERROR,
                    filePath: "entry",
                    location: {
                        start: {
                            column: 26,
                            line: 1,
                            pos: 26
                        },
                        end: {
                            column: 29,
                            line: 1,
                            pos: 29
                        }
                    },
                    message: "The right-hand side of an arithmetic operation must be a number"
                }
            ]],
        ["[[bind a * 5]] [[bind a.b.c]] [[bind c * a.b]]", [
                {
                    filePath: "entry",
                    "type": "ERROR",
                    "location": {
                        "start": {
                            "column": 22,
                            "line": 1,
                            "pos": 22
                        },
                        "end": {
                            "column": 27,
                            "line": 1,
                            "pos": 27
                        }
                    },
                    "message": "Cannot call property \"b.c\" on primitive \"a\""
                },
                {
                    filePath: "entry",
                    "type": "ERROR",
                    "location": {
                        "start": {
                            "column": 41,
                            "line": 1,
                            "pos": 41
                        },
                        "end": {
                            "column": 44,
                            "line": 1,
                            "pos": 44
                        }
                    },
                    "message": "The right-hand side of an arithmetic operation must be a number"
                }
            ]]
    ].forEach(function (_a) {
        var source = _a[0], diagnostics = _a[1];
        it("displays an inference error for " + source, function () {
            chai_1.expect(__1.inferNodeProps(__1.parseModuleSource(source).root, "entry").diagnostics).to.eql(diagnostics);
        });
    });
});
//# sourceMappingURL=prop-inference-test.js.map