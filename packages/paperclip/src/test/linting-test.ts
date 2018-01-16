// TODO - infinite loop detection

import { expect } from "chai";
import { InferenceType, loadModuleDependencyGraph, lintDependencyGraph, DiagnosticType } from "..";

describe(__filename + "#", () => {

  // deep inferencing
  [
    [
      {
        "entry.pc": `
          <component id="test">
            <template>
              [[bind a]]
            </template>
          </component>
          <component id="test2">
            <template>
              <test />
            </template>
          </component>
        `
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
        "entry.pc": `
          <component id="test">
          </component>
        `
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
        "entry.pc": `
          <component id="test">
            <preview name="test">
              <test />
            </preview>
          </component>
        `
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
        "entry.pc": `
          <component id="test">
            <template>
              [[bind a * c]]
            </template>
            <preview name="main">
              <test a="b" />
            </preview>
          </component>
        `
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
          message: `Type mismatch: attribute "a" expecting a number, string provided.`,
          type: DiagnosticType.ERROR
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
          message: `Property "c" is undefined`,
          type: DiagnosticType.ERROR
        }
      ]
    ],
    [
      {
        "entry.pc": `
          <component id="test">
            <template>
              [[bind a * c]]
            </template>
            <preview name="main">
              <test a=[[bind 1]] c=[[bind 2]] />
            </preview>
          </component>
        `
      },
      [],
    ],
    [
      {
        "entry.pc": `
          <component id="test">
            <template>
              [[bind a.b.c * 4]]
            </template>
            <preview name="main">
              <test a=[[bind {a: {b: 1 }}]] />
            </preview>
          </component>
        `
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
          message: `Property "a.b.c" is undefined`,
          type: "ERROR"
        },
      ]
    ],
    [
      {
        "entry.pc": `
          <component id="a">
            <template>
              [[bind c * 1]]
            </template>
          </component>
          <component id="b">
            <template>
              <a c=[[bind d]] />
            </template>
            <preview name="main">
              <b d="1" />
            </preview>
          </component>
        `
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
        "entry.pc": `
          <component id="a">
            <template>
              [[bind c * 1]]
            </template>
          </component>
          <component id="b">
            <template>
              <a c=[[bind d]] />
            </template>
            <preview name="main">
              <b [[bind {d: 1}]] />
            </preview>
          </component>
        `
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
        "entry.pc": `
          <component id="a">
            <template>
              [[bind c * 1]]
            </template>
          </component>
          <component id="b">
            <template>
              <a c=[[bind d]] />
            </template>
            <preview name="main">
              <b [[bind {c: 1}]] />
            </preview>
          </component>
        `
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
        "entry.pc": `
          <component id="a">
            <template>
              <a />
            </template>
            <preview name="a">
              <a />
            </preview>
          </component>
        `
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
          message: `Maximum callstack exceeded`,
          type: DiagnosticType.ERROR
        }
      ]
    ],
    [
      {
        "entry.pc": `
          <component id="a">
            <template>
              <a [[if a.a]] a=[[bind a.a]] />
            </template>
            <preview name="a">
            </preview>
          </component>
        `
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
        "entry.pc": `
          <component id="a">
            <template>
              [[bind c]]
              <a [[if a.a]] a=[[bind a.a]] />
            </template>
            <preview name="main">
              <a a=[[bind { c: 1, a: { c: 1, a: null } }]] c="1" />
            </preview>
          </component>
        `
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
          message: `Property "c" is undefined`,
          type: DiagnosticType.ERROR
        }
      ]
    ],
    [
      {
        "entry.pc": `
          <component id="a">
            <template>
              [[bind c]]
              <a [[if a.a]] a=[[bind a.a]] c=[[bind a.c]] />
            </template>
            <preview name="main">
              <a a=[[bind { c: 1, a: { c: 1, a: null } }]] c="1" />
            </preview>
          </component>
        `
      },
      []
    ],
    [
      {
        "entry.pc": `
          <component id="a">
            <template>
              <a [[repeat a as b]] [[bind b]]></a>
            </template>
            <preview name="main">
              <a a=[[bind []]] />
            </preview>
          </component>
        `
      },
      []
    ],
    [
      {
        "entry.pc": `
          <component id="a">
            <template>
            </template>
            <preview name="main">
              <a a=[[bind [{a:1}, ]]] />
            </preview>
          </component>
        `
      },
      []
    ],
    [
      {
        "entry.pc": `
          <component id="a">
            <template>
              <a [[repeat a as b]] [[bind b]]></a>
            </template>
            <preview name="main">
              <a a=[[bind [ {} ]]] />
            </preview>
          </component>
        `
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
        "entry.pc": `
          <component id="a">
            <template>
              <a [[repeat a as b]] a=[[bind b]]></a>
            </template>
            <preview name="main">
              <a a=[[bind [ {a: []} ]]] />
            </preview>
          </component>
        `
      },
      []
    ],
    [
      {
        "entry.pc": `
          <component id="a">
            <template>
              <a [[repeat a as b]] [[bind b]]></a>
            </template>
            <preview name="main">
              <a a=[[bind [ {a: [{a:[]}]} ]]] />
            </preview>
          </component>
        `
      },
      []
    ],
    [
      {
        "entry.pc": `
          <component id="c">
            <template>
              [[bind d]]
            </template>
            <preview name="a">
              <c />
            </preview>
          </component>
          <component id="b">
            <template>

            </template>
            <preview name="a">
              <b />
            </preview>
          </component>
          <component id="a">
            <template>
              <b>
                <c [[repeat i as k]] [[bind k]] />
              </b>
            </template>
            <preview name="main">
              <a i=[[bind [{}]]] />
            </preview>
          </component>
        `
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
        "entry.pc": `
          <component id="c">
            <template>
              <a [[if a]]>[[bind a]]</a>
            </template>
            <preview name="main">
              <c />
            </preview>
          </component>          
        `
      },
      []
    ],
    [
      {
        "entry.pc": `
          <component id="c">
            <template>
              [[bind a || "not defined"]]
            </template>
            <preview name="main">
              <c />
            </preview>
          </component>          
        `
      },
      []
    ],
    [
      {
        "entry.pc": `
          <component id="c">
            <template>
              <a [[if a]]>[[bind a]]</a>
              [[bind a]]
            </template>
            <preview name="main">
              <c />
            </preview>
          </component>          
        `
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
          message: `Property "a" is undefined`,
          type: DiagnosticType.ERROR
        }
      ]
    ],
    [
      {
        "entry.pc": `
          <component id="c">
            <template>
            </template>
            <preview name="main">
              <c />
            </preview>
          </component>

          <component id="c">
            <template>
            </template>
            <preview name="main">
              <c />
            </preview>
          </component>          
        `
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
        "entry.pc": `
          <component id="test2">
          <template>
            <td-css-expr-input [[elseif !overridden &&]] value=[[bind value]] />
          </template>
          <preview name="test">
            <test2 value="a" />
          </preview>
          </component>
        `
      },
      []
    ],
    [
      {
        "entry.pc": `
        <component id="a">
          <style>
          </style>
          <template>
            <i [[elseif]] />
          </template>
          <preview name="main" width="1366" height="768">
            <a />
          </preview>
        </component>
        `
      },
      []
    ],
    [
      {
        "entry.pc": `
        <component id="a">
          <style>
          </style>
          <template>
            [[bind c]] [[bind d]]
          </template>
          <preview name="main" width="1366" height="768">
            <a c d />
          </preview>
        </component>

        <component id="b">
          <style>
          </style>
          <template>
            <a [[bind aProps]] />
          </template>
          <preview name="main" width="1366" height="768">
            <b aProps=[[bind {c: true, d: true}]] />
          </preview>
        </component>
        `
      },
      []
    ],
    [
      {
        "entry.pc": `
        <component id="a">
          <style>
          </style>
          <template>
            [[bind c]] [[bind d]]
          </template>
          <preview name="main" width="1366" height="768">
            <a c d />
          </preview>
        </component>

        <component id="b">
          <style>
          </style>
          <template>
            <a [[bind aProps]] />
          </template>
          <preview name="main" width="1366" height="768">
            <b aProps=[[bind {c: true}]] />
          </preview>
        </component>
        `
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
        "entry.pc": `
        <component id="td-components-pane">
        <template>
          <td-pane noHeadingPadding>
            <span slot="header" class="header">
              <span class="tab [[bind nativeElementsTabSelected && "selected"]]">
                Native Elements
              </span>
              <span class="tab [[bind nativeComponentsTabSelected && "selected"]]">
                Components
                <input type="text"></input>
                <span class="controls" onClick=[[bind onAddComponentClick]]>
                  +
                </span>
              </span>
            </span>
            <div slot="content" class="content">
              <td-list [[if nativeComponentsTabSelected]]>
                <td-list-item [[repeat components as component]]>
                </td-list-item>
              </td-list>
              <td-list [[elseif nativeElementsTabSelected]]>
                <td-list-item [[repeat nativeElements as nativeElement]]>
                  
                </td-list-item>
              </td-list>
            </div>
          </td-pane>
        </template>
        <preview name="main">
          <td-components-pane nativeElementsTabSelected=[[bind false]] nativeComponentsTabSelected=[[bind true]] dispatch onAddComponentClick components=[[bind []]] nativeElements=[[bind [
                { label: "li", $id: null, onDragStart: null, onDragEnd: null, onClick: null }
              ]]]
               />
        </preview>
      </component>
        `
      },
      [
      ]
    ]
  ].forEach(([sources, inferResult]: any) => {
    it(`can lint ${sources["entry.pc"]}`, async () => {
      const { graph } = await loadModuleDependencyGraph("entry.pc", {
        readFile: (uri) => sources[uri]
      });

      const result = lintDependencyGraph(graph);

      // uncomment to update locs
      // console.log(JSON.stringify(result.diagnostics, null, 2));
      expect(result.diagnostics).to.eql(inferResult);
    });
  });
});