import { runPCFile } from "../vm";
import { expect } from "chai";
import { NodeType, Element, ParentNode, stringifyNode } from "slim-dom";

describe(__filename + "#", () => {
  [
    [
      {
        entry: `
          <component id="root">
            <template>
              Hello
            </template>
            <preview name="main">
              <root />
            </preview>
          </component>
        `
      },
      `<root>Hello</root>`
    ]
  ].forEach(([entries, result]: any) => {
    it(`can render ${entries.entry}`, async () => {
        const output = await runPCFile({
          entry: {
            filePath: "entry",
            componentId: "root",
            previewName: "main"
          },
          io: {
            readFile: (uri) => Promise.resolve(entries[uri])
          }
        })

        expect(stringifyNode(output.document).replace(/[\s\r\n\t]+/g, " ")).to.eql(result);
    });
  });
});
