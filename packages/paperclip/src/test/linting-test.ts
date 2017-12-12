// TODO - infinite loop detection

import { expect } from "chai";
import { InferenceType, loadModuleDependencyGraph, lintDependencyGraph, DiagnosticType } from "..";

describe(__filename + "#", () => {

  // deep inferencing
  [
    [
      {
        "entry": `
          <component id="test">
            <template>
              [[bind a]]
            </template>
          </component>
          <component id="test2">
            <template>
              <test />
            </template>
            <preview />
          </component>
        `
      },
      [
        {
          filePath: "entry",
          location: {
            start: {
              column: 15,
              line: 9,
              pos: 198
            },
            end: {
              column: 23,
              line: 9,
              pos: 206
            }
          },
          message: `Missing attribute "a"`,
          type: DiagnosticType.ERROR
        }
      ]
    ],
    [
      {
        "entry": `
          <component id="test">
            <template>
              [[bind a * c]]
            </template>
            <preview>
              <test a="b" />
            </preview>
          </component>
        `
      },
      [
        {
          filePath: "entry",
          location: {
            start: {
              column: 15,
              line: 7,
              pos: 145
            },
            end: {
              column: 29,
              line: 7,
              pos: 159
            }
          },
          message: `Type mismatch: attribute "a" expecting a number, string provided.`,
          type: DiagnosticType.ERROR
        },
        {
          filePath: "entry",
          location: {
            start: {
              column: 15,
              line: 7,
              pos: 145
            },
            end: {
              column: 29,
              line: 7,
              pos: 159
            }
          },
          message: `Missing attribute "c"`,
          type: DiagnosticType.ERROR
        }
      ]
    ],
    [
      {
        "entry": `
          <component id="test">
            <template>
              [[bind a * c]]
            </template>
            <preview>
              <test a=[[bind 1]] c=[[bind 2]] />
            </preview>
          </component>
        `
      },
      [],
    ],
    [
      {
        "entry": `
          <component id="test">
            <template>
              [[bind a.b.c * 4]]
            </template>
            <preview>
              <test a=[[bind {a: {b: 1 }}]] />
            </preview>
          </component>
        `
      },
      [
        {
          filePath: "entry",
          location: {
            end: {
              column: 47,
              line: 7,
              pos: 181
            },
            start: {
              column: 15,
              line: 7,
              pos: 149
            }
          },
          message: `Missing attribute "a.b"`,
          type: "ERROR"
        },
      ]
    ],
    [
      {
        "entry": `
          <component id="a">
            <template>
              [[bind c * 1]]
            </template>
          </component>
          <component id="b">
            <template>
              <a c=[[bind d]] />
            </template>
            <preview>
              <b d="1" />
            </preview>
          </component>
        `
      },
      [
        {
          filePath: "entry",
          location: {
            end: {
              column: 33,
              line: 9,
              pos: 213
            },
            start: {
              column: 15,
              line: 9,
              pos: 195
            }
          },
          message: `Type mismatch: attribute "c" expecting a number, string provided.`,
          type: "ERROR"
        },
      ]
    ],
    [
      {
        "entry": `
          <component id="a">
            <template>
              [[bind c * 1]]
            </template>
          </component>
          <component id="b">
            <template>
              <a c=[[bind d]] />
            </template>
            <preview>
              <b [[bind {d: 1}]] />
            </preview>
          </component>
        `
      },
      []
    ],
    [
      {
        "entry": `
          <component id="a">
            <template>
              [[bind c * 1]]
            </template>
          </component>
          <component id="b">
            <template>
              <a c=[[bind d]] />
            </template>
            <preview>
              <b [[bind {c: 1}]] />
            </preview>
          </component>
        `
      },
      [
        {
          filePath: "entry",
          location: {
            start: {
              column: 15,
              line: 12,
              pos: 274
            },
            end: {
              column: 36,
              line: 12,
              pos: 295
            }
          },
          message: `Missing attribute "d"`,
          type: DiagnosticType.ERROR
        },
        {
          filePath: "entry",
          location: {
            start: {
              column: 15,
              line: 9,
              pos: 195
            },
            end: {
              column: 33,
              line: 9,
              pos: 213
            }
          },
          message: `Missing attribute "c"`,
          type: DiagnosticType.ERROR
        }
      ]
    ],
    [
      {
        "entry": `
          <component id="a">
            <template>
              <a />
            </template>
          </component>
        `
      },
      [
        {
          filePath: "entry",
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
        "entry": `
          <component id="a">
            <template>
              <a [[if a.a]] a=[[bind a.a]] />
            </template>
          </component>
        `
      },
      []
    ],
    [
      {
        "entry": `
          <component id="a">
            <template>
              [[bind c]]
              <a [[if a.a]] a=[[bind a.a]] />
            </template>
            <preview>
              <a a=[[bind { c: 1, a: { c: 1, a: null } }]] c="1" />
            </preview>
          </component>
        `
      },
      [
        {
          filePath: "entry",
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
          message: `Missing attribute "c"`,
          type: DiagnosticType.ERROR
        }
      ]
    ],
    [
      {
        "entry": `
          <component id="a">
            <template>
              [[bind c]]
              <a [[if a.a]] a=[[bind a.a]] c=[[bind a.c]] />
            </template>
            <preview>
              <a a=[[bind { c: 1, a: { c: 1, a: null } }]] c="1" />
            </preview>
          </component>
        `
      },
      []
    ],
    [
      {
        "entry": `
          <component id="a">
            <template>
              <a [[repeat a as b]] [[bind b]]></a>
            </template>
            <preview>
              <a a=[[bind []]] />
            </preview>
          </component>
        `
      },
      []
    ],
    [
      {
        "entry": `
          <component id="a">
            <template>
              <a [[repeat a as b]] [[bind b]]></a>
            </template>
            <preview>
              <a a=[[bind [ {} ]]] />
            </preview>
          </component>
        `
      },
      [
        {
          filePath: "entry",
          location: {
            start: {
              column: 15,
              line: 4,
              pos: 67
            },
            end: {
              column: 47,
              line: 4,
              pos: 99
            }
          },
          message: `Missing attribute "a"`,
          type: DiagnosticType.ERROR
        }
      ]
    ],
    [
      {
        "entry": `
          <component id="a">
            <template>
            
              <a [[repeat a as b]] a=[[bind b]]></a>
            </template>
            <preview>
              <a a=[[bind [ {a: []} ]]] />
            </preview>
          </component>
        `
      },
      []
    ],
    [
      {
        "entry": `
          <component id="a">
            <template>
              <a [[repeat a as b]] [[bind b]]></a>
            </template>
            <preview>
              <a a=[[bind [ {a: [{a:[]}]} ]]] />
            </preview>
          </component>
        `
      },
      []
    ],
    [
      {
        "entry": `
          <component id="c">
            <template>
              [[bind d]]
            </template>
          </component>
          <component id="b">
            <template>

            </template>
          </component>
          <component id="a">
            <template>
              <b>
                <c [[repeat i as k]] [[bind k]] />
              </b>
            </template>
            <preview>
              <a i=[[bind [{}]]] />
            </preview>
          </component>
        `
      },
      [
        {
          filePath: "entry",
          location: {
            start: {
              column: 17,
              line: 15,
              pos: 311
            },
            end: {
              column: 51,
              line: 15,
              pos: 345
            }
          },
          message: `Missing attribute "d"`,
          type: DiagnosticType.ERROR
        }
      ]
    ]
  ].forEach(([sources, inferResult]: any) => {
    it(`can lint ${sources.entry}`, async () => {
      const { graph } = await loadModuleDependencyGraph("entry", {
        readFile: (uri) => sources[uri]
      });

      const result = lintDependencyGraph(graph);

      expect(result.diagnostics).to.eql(inferResult);
    });
  });
});