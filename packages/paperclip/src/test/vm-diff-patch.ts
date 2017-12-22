import { diffNode } from "slim-dom";
import { expect } from "chai";
import { loadModuleDependencyGraph, runPCFile } from "..";

describe(__filename + "#", () => {
  [
    [`a`, `b`, [
      {
        "type": "SET_TEXT_NODE_VALUE",
        "target": {
          "type": 5,
          "uri": "entry",
          "range": {
            "start": {
              "column": 32,
              "line": 1,
              "pos": 32
            },
            "end": {
              "column": 33,
              "line": 1,
              "pos": 33
            }
          }
        },
        "newValue": "b"
      }
    ]],
    [`<a />`, `<b />`, [
      {
        "type": "REMOVE_CHILD_NODE",
        "target": {
          "type": 3,
          "uri": "entry",
          "range": {
            "start": {
              "column": 0,
              "line": 1,
              "pos": 0
            },
            "end": {
              "column": 100,
              "line": 1,
              "pos": 100
            }
          }
        },
        "child": null,
        "index": 0
      },
      {
        "type": "INSERT_CHILD_NODE",
        "target": {
          "type": 3,
          "uri": "entry",
          "range": {
            "start": {
              "column": 0,
              "line": 1,
              "pos": 0
            },
            "end": {
              "column": 100,
              "line": 1,
              "pos": 100
            }
          }
        },
        "child": [
          [
            "entry"
          ],
          [
            0,
            "10002",
            [
              4,
              0,
              1,
              32,
              32,
              1,
              37,
              37
            ],
            "b",
            [],
            null,
            []
          ]
        ],
        "clone": undefined,
        "index": 9007199254740991
      }
    ]],
    [`<a b />`, `<a c />`, [
      {
        "type": "SET_ATTRIBUTE_VALUE",
        "target": {
          "type": 4,
          "uri": "entry",
          "range": {
            "start": {
              "column": 32,
              "line": 1,
              "pos": 32
            },
            "end": {
              "column": 39,
              "line": 1,
              "pos": 39
            }
          }
        },
        "name": "b",
        "newValue": null,
        "oldValue": undefined,
        "oldName": undefined,
        "index": undefined
      },
      {
        "type": "SET_ATTRIBUTE_VALUE",
        "target": {
          "type": 4,
          "uri": "entry",
          "range": {
            "start": {
              "column": 32,
              "line": 1,
              "pos": 32
            },
            "end": {
              "column": 39,
              "line": 1,
              "pos": 39
            }
          }
        },
        "name": "c",
        "newValue": true,
        "oldValue": undefined,
        "oldName": undefined,
        "index": undefined
      }
    ]],
    [`<a b="1" />`, `<a b="2" />`, [
      {
        "type": "SET_ATTRIBUTE_VALUE",
        "target": {
          "type": 4,
          "uri": "entry",
          "range": {
            "start": {
              "column": 32,
              "line": 1,
              "pos": 32
            },
            "end": {
              "column": 43,
              "line": 1,
              "pos": 43
            }
          }
        },
        "name": "b",
        "newValue": "2",
        "oldName": undefined,
        "oldValue": undefined,
        "index": undefined
      }
    ]]
  ].forEach(([oldSource, newSource, expectedDiffs]: any) => {
    it(`can diff ${oldSource} against ${newSource}`, async () => {
      const { graph: ag } = await loadModuleDependencyGraph("entry", {
        readFile: () => Promise.resolve(wrapSource(oldSource))
      });
      const { graph: bg } =  await loadModuleDependencyGraph("entry", {
        readFile: () => Promise.resolve(wrapSource(newSource))
      });

      const { document: an } = runPCFile({ entry: {filePath: "entry", componentId: "entry", previewName: "main" }, graph: ag, idSeed: "2000" });

      const { document: bn, diagnostics } = runPCFile({ entry: {filePath: "entry", componentId: "entry", previewName: "main" }, graph: bg,  idSeed: "1000" });

      const diffs = diffNode(an, bn);
      // console.log(JSON.stringify(diffs, null, 2));
      expect(diffs).to.eql(expectedDiffs);
    });
  });
});

const wrapSource = (template: string) => `<component id="entry"><template>${template}</template><preview name="main"><entry /></preview></component>`;