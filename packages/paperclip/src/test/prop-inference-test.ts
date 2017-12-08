import { expect } from "chai";
import { inferNodeProps, Inference, InferenceType, parseModuleSource, DiagnosticType } from "..";

describe(__filename + "#", () => {

  // smoke
  [
    [`[[bind a]]`, { 
      type: InferenceType.ANY, 
      properties: { 
        a: { 
          type: InferenceType.ANY,
          properties: {}
        }
      }
    }],
    [`[[bind a]] [[bind b]]`, { 
      type: InferenceType.ANY, 
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
      type: InferenceType.ANY, 
      properties: { 
        a: { 
          type: InferenceType.ANY, 
          properties: {
            b: {
              type: InferenceType.ANY, 
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
      type: InferenceType.ANY, 
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
      type: InferenceType.ANY, 
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
      type: InferenceType.ANY, 
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
      type: InferenceType.ANY, 
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
      type: InferenceType.ANY, 
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
      type: InferenceType.ANY, 
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
      type: InferenceType.ANY, 
      properties: { 
        a: { 
          type: InferenceType.ANY, 
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
      type: InferenceType.ANY, 
      properties: { 
        a: { 
          type: InferenceType.ANY, 
          properties: { }
        }
      }
    }],
    [`[[bind a || b]]`, { 
      type: InferenceType.ANY, 
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
      type: InferenceType.ANY, 
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
      type: InferenceType.ANY, 
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
      type: InferenceType.ANY, 
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
      type: InferenceType.ANY, 
      properties: { 
        c: { 
          type: InferenceType.ANY, 
          properties: { }
        }
      }
    }],
    [`<a b="[[bind c]] [[bind d]]" />`, { 
      type: InferenceType.ANY, 
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
      type: InferenceType.ANY, 
      properties: { 
        b: { 
          type: InferenceType.ANY, 
          properties: { }
        }
      }
    }],

    // reserved attr names
    [`<a href=[[bind b]]>c</a>`, { 
      type: InferenceType.ANY, 
      properties: { 
        b: { 
          type: InferenceType.STRING, 
          properties: { }
        }
      }
    }],
    [`<a class=[[bind b]]>c</a>`, { 
      type: InferenceType.ANY, 
      properties: { 
        b: { 
          type: InferenceType.STRING, 
          properties: { }
        }
      }
    }],
    [`<div class=[[bind b]]>c</a>`, { 
      type: InferenceType.ANY, 
      properties: { 
        b: { 
          type: InferenceType.STRING, 
          properties: { }
        }
      }
    }],

    // special bindings
    [`<a [[if b]]></a>`, {
      type: InferenceType.ANY, 
      properties: { 
        b: { 
          type: InferenceType.ANY, 
          properties: { }
        }
      }
    }],
    [`<a [[elseif b]]></a>`, {
      type: InferenceType.ANY, 
      properties: { 
        b: { 
          type: InferenceType.ANY, 
          properties: { }
        }
      }
    }],
    [`<a [[repeat items as item]] [[bind item]]></a>`, {
      type: InferenceType.ANY, 
      properties: { 
        items: { 
          type: InferenceType.ANY, 
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
      type: InferenceType.ANY, 
      properties: { 
        items: { 
          type: InferenceType.ANY, 
          properties: {
            $$each: {
              type: InferenceType.ANY,
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
      type: InferenceType.ANY, 
      properties: { 
        items: { 
          type: InferenceType.ANY, 
          properties: {
            $$each: {
              type: InferenceType.ANY,
              properties: {
                b: {
                  type: InferenceType.ANY,
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
      type: InferenceType.ANY, 
      properties: { 
        items: { 
          type: InferenceType.ANY, 
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
      type: InferenceType.ANY, 
      properties: { 
        b: {
          type: InferenceType.ANY,
          properties: {
            $$each: {
              type: InferenceType.ANY,
              properties: {
                length: {
                  type: InferenceType.ANY,
                  properties: {}
                },
                $$each: {
                  type: InferenceType.ANY,
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
    ]]
  ].forEach(([source, diagnostics]: any) => {
    it(`displays an inference error for ${source}`, () => {
      expect(inferNodeProps(parseModuleSource(source).root).diagnostics).to.eql(diagnostics);
    }); 
  });
  
});