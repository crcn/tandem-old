// TODO - css diff / patch
import { diffNode, SlimParentNode, patchNode, SlimElement } from "slim-dom";
import { expect } from "chai";
import { loadModuleDependencyGraph, runPCFile, PCElement } from "..";
import { stringifyNode } from "./utils";

describe(__filename + "#", () => {
  [
    [`a`, `b`, [
      {
        "type": "SET_TEXT_NODE_VALUE",
        "target": "20003",
        "newValue": "b"
      }
    ]],
    [`<a />`, `<b />`, [
      {
        "type": "REMOVE_CHILD_NODE",
        "target": "20002",
        "child": null,
        "index": 0
      },
      {
        "type": "INSERT_CHILD_NODE",
        "target": "20002",
        "child": [
          [
            "entry"
          ],
          [
            0,
            "10003",
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
        "target": "20003",
        "name": "b",
        "newValue": null,
        "oldValue": undefined,
        "oldName": undefined,
        "index": undefined
      },
      {
        "type": "SET_ATTRIBUTE_VALUE",
        "target": "20003",
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
        "target": "20003",
        "name": "b",
        "newValue": "2",
        "oldName": undefined,
        "oldValue": undefined,
        "index": undefined
      }
    ]],
    [`<a b="1" />`, `<a b="2" />`, [
      {
        "type": "SET_ATTRIBUTE_VALUE",
        "target": "20003",
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
      expect(diffs).to.eql(expectedDiffs);
    });
  });

  [
    [`a`, `b`, `c`],
    [`<a></a>`, `<b></b>`],
    [`<a b="true"></a>`, `<a c="true"></a>`],
    [`<a b="1"></a>`, `<a b="2"></a>`],
    [`<style>.a {}</style>`, `<style>.b {}</style>`],
    [`<style>.a {a: 1;}</style>`, `<style>.a {a: 2;}</style>`],
    [`<style>.a {a: 1;}</style>`, `<style>.a {b: 1;}</style>`],
    [`<style>.a {a: 1;}</style>`, `<style>.a {} .b {}</style>`],
    [`<style>.a {a: 1;} .b {a:2;}</style>`, `<style>.a {} </style>`]
  ].forEach((variants) => {
    it(`can diff and patch ${variants.join(" -> ")}`, async () => {
      let prevDocument: SlimParentNode;
      
      for (const variant of variants) {
        const { graph } = await loadModuleDependencyGraph("entry", {
          readFile: () => Promise.resolve(wrapSource(variant))
        });
        const { document } = runPCFile({ entry: { filePath: "entry", componentId: "entry", previewName: "main" }, graph, idSeed: "1000" });

        if (prevDocument) {
          const diffs = diffNode(prevDocument, document);
          prevDocument = patchNode(prevDocument, diffs);
        } else {          
          prevDocument = document as SlimParentNode;
        }
        
        expect(stringifyNode((prevDocument.childNodes[0] as SlimElement).shadow)).to.eql(variant);
      }
    })
  });
});

const wrapSource = (template: string) => `<component id="entry"><template>${template}</template><preview name="main"><entry /></preview></component>`;