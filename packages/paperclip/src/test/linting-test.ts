import { expect } from "chai";
import { InferenceType } from "..";

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
          </component>
        `
      },
      {
        componentInferences: {
          test: {
            type: InferenceType.OBJECT_OR_ARRAY,
            properties: {
              a: {
                type: InferenceType.ANY,
                properties: {}
              }
            }
          },
          test2: {
            type: InferenceType.ANY,
            properties: {}
          }
        },
        diagnostics: []
      }
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
      {
        componentInferences: {
          test: {
            type: InferenceType.OBJECT_OR_ARRAY,
            properties: {
              a: {
                type: InferenceType.NUMBER,
                properties: {}
              },
              c: {
                type: InferenceType.NUMBER,
                properties: {}
              }
            }
          }
        },
        diagnostics: []
      }
    ]
  ].forEach(([sources, inferResult]: any) => {
    it(`can lint ${sources.entry}`, async () => {
      // const graph = await loadModuleDependencyGraph("entry", {
      //   readFile: (uri) => sources[uri]
      // });

      // const result = inferDependencyGraph(graph);

      // expect(result).to.eql(inferResult);
    });
  });
});