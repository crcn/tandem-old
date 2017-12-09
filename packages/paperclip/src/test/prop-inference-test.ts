import { expect } from "chai";
import { inferNodeProps, Inference, InferenceType, parseModuleSource, DiagnosticType, loadModuleDependencyGraph, inferDependencyGraph, InferredTypeKind } from "..";

describe(__filename + "#", () => {

  // smoke
  [
    [`[[bind a]]`, { 
      type: InferenceType.OBJECT_OR_ARRAY, 
      properties: { 
        a: { 
          type: InferenceType.ANY,
          properties: {}
        }
      }
    }],
    [`[[bind a]] [[bind b]]`, { 
      type: InferenceType.OBJECT_OR_ARRAY, 
      properties: { 
        a: { 
          type: InferenceType.ANY, 
          properties: {}
        }, 
        b: { 
          type: InferenceType.ANY, 
          properties: {}
        }
      }
    }],
    [`[[bind a.b.c]]`, { 
      type: InferenceType.OBJECT_OR_ARRAY, 
      properties: { 
        a: { 
          type: InferenceType.OBJECT_OR_ARRAY, 
          properties: {
            b: {
              type: InferenceType.OBJECT_OR_ARRAY, 
              properties: {
                c: {
                  type: InferenceType.ANY,
                  properties: {}
                }
              }
            }
          }
        }
      }
    }],
    [`[[bind a * b]]`, { 
      type: InferenceType.OBJECT_OR_ARRAY, 
      properties: { 
        a: { 
          type: InferenceType.NUMBER, 
          properties: { }
        },
        b: { 
          type: InferenceType.NUMBER, 
          properties: { }
        }
      }
    }],
    [`[[bind a / b]]`, { 
      type: InferenceType.OBJECT_OR_ARRAY, 
      properties: { 
        a: { 
          type: InferenceType.NUMBER, 
          properties: { }
        },
        b: { 
          type: InferenceType.NUMBER, 
          properties: { }
        }
      }
    }],
    [`[[bind a - b]]`, { 
      type: InferenceType.OBJECT_OR_ARRAY, 
      properties: { 
        a: { 
          type: InferenceType.NUMBER, 
          properties: { }
        },
        b: { 
          type: InferenceType.NUMBER, 
          properties: { }
        }
      }
    }],
    [`[[bind a + b]]`, { 
      type: InferenceType.OBJECT_OR_ARRAY, 
      properties: { 
        a: { 
          type: InferenceType.ANY, 
          properties: { }
        },
        b: { 
          type: InferenceType.ANY, 
          properties: { }
        }
      }
    }],
    [`[[bind a * c]] [[bind a + b]]`, { 
      type: InferenceType.OBJECT_OR_ARRAY, 
      properties: { 
        a: { 
          type: InferenceType.NUMBER, 
          properties: { }
        },
        c: { 
          type: InferenceType.NUMBER, 
          properties: { }
        },
        b: { 
          type: InferenceType.ANY, 
          properties: { }
        }
      }
    }],
    [`[[bind (a + b) * c]]`, { 
      type: InferenceType.OBJECT_OR_ARRAY, 
      properties: { 
        a: { 
          type: InferenceType.NUMBER, 
          properties: { }
        },
        b: { 
          type: InferenceType.NUMBER, 
          properties: { }
        },
        c: { 
          type: InferenceType.NUMBER, 
          properties: { }
        }
      }
    }],
    [`[[bind (a.b + c) * d]]`, { 
      type: InferenceType.OBJECT_OR_ARRAY, 
      properties: { 
        a: { 
          type: InferenceType.OBJECT_OR_ARRAY, 
          properties: {
            b: {
              type: InferenceType.NUMBER,
              properties: {}
            }
          }
        },
        c: { 
          type: InferenceType.NUMBER, 
          properties: { }
        },
        d: { 
          type: InferenceType.NUMBER, 
          properties: { }
        }
      }
    }],
    [`[[bind a + ""]]`, { 
      type: InferenceType.OBJECT_OR_ARRAY, 
      properties: { 
        a: { 
          type: InferenceType.ANY, 
          properties: { }
        }
      }
    }],
    [`[[bind a || b]]`, { 
      type: InferenceType.OBJECT_OR_ARRAY, 
      properties: { 
        a: { 
          type: InferenceType.ANY, 
          properties: { }
        },
        b: { 
          type: InferenceType.ANY, 
          properties: { }
        }
      }
    }],
    [`[[bind a && b]]`, { 
      type: InferenceType.OBJECT_OR_ARRAY, 
      properties: { 
        a: { 
          type: InferenceType.ANY, 
          properties: { }
        },
        b: { 
          type: InferenceType.ANY, 
          properties: { }
        }
      }
    }],
    [`[[bind a * c]] [[bind a == b]]`, { 
      type: InferenceType.OBJECT_OR_ARRAY, 
      properties: { 
        a: { 
          type: InferenceType.NUMBER, 
          properties: { }
        },
        c: { 
          type: InferenceType.NUMBER, 
          properties: { }
        },
        b: { 
          type: InferenceType.ANY, 
          properties: { }
        }
      }
    }],
    [`[[bind a * c]][[bind a === b]]`, { 
      type: InferenceType.OBJECT_OR_ARRAY, 
      properties: { 
        a: { 
          type: InferenceType.NUMBER, 
          properties: { }
        },
        c: { 
          type: InferenceType.NUMBER, 
          properties: { }
        },
        b: { 
          type: InferenceType.NUMBER, 
          properties: { }
        }
      }
    }],

    [`<a b=[[bind c]] />`, { 
      type: InferenceType.OBJECT_OR_ARRAY, 
      properties: { 
        c: { 
          type: InferenceType.ANY, 
          properties: { }
        }
      }
    }],
    [`<a b="[[bind c]] [[bind d]]" />`, { 
      type: InferenceType.OBJECT_OR_ARRAY, 
      properties: { 
        c: { 
          type: InferenceType.STRING, 
          properties: { }
        },
        d: { 
          type: InferenceType.STRING, 
          properties: { }
        }
      }
    }],
    [`<a b />`, { 
      type: InferenceType.ANY, 
      properties: { 
      }
    }],
    [`<a>[[bind b]]</a>`, { 
      type: InferenceType.OBJECT_OR_ARRAY, 
      properties: { 
        b: { 
          type: InferenceType.ANY, 
          properties: { }
        }
      }
    }],

    // reserved attr names
    [`<a href=[[bind b]]>c</a>`, { 
      type: InferenceType.OBJECT_OR_ARRAY, 
      properties: { 
        b: { 
          type: InferenceType.STRING, 
          properties: { }
        }
      }
    }],
    [`<a class=[[bind b]]>c</a>`, { 
      type: InferenceType.OBJECT_OR_ARRAY, 
      properties: { 
        b: { 
          type: InferenceType.STRING, 
          properties: { }
        }
      }
    }],
    [`<div class=[[bind b]]>c</a>`, { 
      type: InferenceType.OBJECT_OR_ARRAY, 
      properties: { 
        b: { 
          type: InferenceType.STRING, 
          properties: { }
        }
      }
    }],

    // special bindings
    [`<a [[if b]]></a>`, {
      type: InferenceType.OBJECT_OR_ARRAY, 
      properties: { 
        b: { 
          type: InferenceType.ANY, 
          properties: { }
        }
      }
    }],
    [`<a [[elseif b]]></a>`, {
      type: InferenceType.OBJECT_OR_ARRAY, 
      properties: { 
        b: { 
          type: InferenceType.ANY, 
          properties: { }
        }
      }
    }],
    [`<a [[repeat items as item]] [[bind item]]></a>`, {
      type: InferenceType.OBJECT_OR_ARRAY, 
      properties: { 
        items: { 
          type: InferenceType.OBJECT_OR_ARRAY, 
          properties: {
            $$each: {
              properties: {},
              type: InferenceType.ANY
            }
          }
        }
      }
    }],
    [`<a [[repeat items as item]] key[[bind item.key]]></a>`, {
      type: InferenceType.OBJECT_OR_ARRAY, 
      properties: { 
        items: { 
          type: InferenceType.OBJECT_OR_ARRAY, 
          properties: {
            $$each: {
              type: InferenceType.OBJECT_OR_ARRAY,
              properties: {
                key: {
                  type: InferenceType.ANY,
                  properties: {}
                }
              }
            }
          }
        }
      }
    }],
    [`<a [[repeat items as item]] key[[bind item.b.c]]></a>`, {
      type: InferenceType.OBJECT_OR_ARRAY, 
      properties: { 
        items: { 
          type: InferenceType.OBJECT_OR_ARRAY, 
          properties: {
            $$each: {
              type: InferenceType.OBJECT_OR_ARRAY,
              properties: {
                b: {
                  type: InferenceType.OBJECT_OR_ARRAY,
                  properties: {
                    c: {
                      type: InferenceType.ANY,
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
    [`<a [[repeat items as item]] [[bind item]]></a>[[bind item]]`, {
      type: InferenceType.OBJECT_OR_ARRAY, 
      properties: { 
        items: { 
          type: InferenceType.OBJECT_OR_ARRAY, 
          properties: {
            $$each: {
              type: InferenceType.ANY,
              properties: {}
            }
          }
        },
        item: {
          type: InferenceType.ANY,
          properties: { }
        }
      }
    }],
    [`<a [[repeat [1, 2, 3] as item]] [[bind item]]></a>`, {
      type: InferenceType.ANY, 
      properties: { 
      }
    }],

    [`<a [[repeat b as c]]><d [[repeat c as f]] g=[[bind c.length]] h=[[bind f.b]] /></a>`, {
      type: InferenceType.OBJECT_OR_ARRAY, 
      properties: { 
        b: {
          type: InferenceType.OBJECT_OR_ARRAY,
          properties: {
            $$each: {
              type: InferenceType.OBJECT_OR_ARRAY,
              properties: {
                length: {
                  type: InferenceType.ANY,
                  properties: {}
                },
                $$each: {
                  type: InferenceType.OBJECT_OR_ARRAY,
                  properties: {
                    b: {
                      type: InferenceType.ANY,
                      properties: {}
                    }
                  }
                }
              }
            }
          }
        }
      }
    }]
  ].forEach(([source, inference]: any) => {
    it(`can get the Inference for ${source}`, () => {
      expect(inferNodeProps(parseModuleSource(source).root).inference).to.eql(inference);
    });
  });

  // error smoke
  [
    [`[[bind a * c]] [[bind a.c]]`, [
      { 
        type: DiagnosticType.ERROR,
        filePath: undefined,
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
        message: `Cannot call property "c" on primitive "a"`
      }
    ]],
    [`[[bind a * "5"]]`, [
      { 
        type: DiagnosticType.ERROR,
        filePath: undefined,
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
        message: `The right-hand side of an arithmetic operation must be a number`
      }
    ]],
    [`[[bind a.b * c]] [[bind a.b.c]]`, [
      { 
        type: DiagnosticType.ERROR,
        filePath: undefined,
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
        message: `Cannot call property "c" on primitive "a.b"`
      }
    ]],
    [`[[bind a.b.c]] [[bind a.b * c]]`, [
      { 
        type: DiagnosticType.ERROR,
        filePath: undefined,
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
        message: `The left-hand side of an arithmetic operation must be a number`
      }
    ]],
    [`[[bind a.b.c]] [[bind c * a.b]]`, [
      { 
        type: DiagnosticType.ERROR,
        filePath: undefined,
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
        message: `The right-hand side of an arithmetic operation must be a number`
      }
    ]],
    [`[[bind a * 5]] [[bind a.b.c]] [[bind c * a.b]]`, [
      {
        filePath: undefined,
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
        filePath: undefined,
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
  ].forEach(([source, diagnostics]: any) => {
    it(`displays an inference error for ${source}`, () => {
      expect(inferNodeProps(parseModuleSource(source).root).diagnostics).to.eql(diagnostics);
    }); 
  });
});