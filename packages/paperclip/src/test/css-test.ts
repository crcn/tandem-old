import { loadModuleDependencyGraph, runPCFile } from "..";
import { } from "slim-dom";

describe(__filename + "#", () => {
  describe("imported css files", () => {
    xit(`loads imported css files into the dependency graph`, async () => {
      const files = {
        "file.css": `
          .container {
            color: red;
          }
        `,
        "entry": `
          <component id="test">
            <style>
              @import "file.css";
            </style>
            <template>
            </template>
            <preview name="main">
              <test />
            </preview>
          </component>
        `
      };

      const { graph } = await loadModuleDependencyGraph("entry", {
        readFile: (uri) => Promise.resolve(files[uri])
      });

      console.log(graph);

      const { document } = runPCFile({
        entry: {
          filePath: "entry",
          componentId: "test",
          previewName: "main"
        },
        graph
      })

      console.log(JSON.stringify((document as any), null, 2));
      const { module } = graph.entry;
      const testComponent = module.components[0];
      console.log(testComponent.style);
    });
  });
});