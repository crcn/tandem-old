import { expect } from "chai";
import { loadEntry, evaluateDependencyEntry, TreeNode } from "..";

type TestModuleFiles = {
  [identifier: string]: TreeNode
};

const createTestFileReader = (files: TestModuleFiles) => (uri) => JSON.stringify(files[uri]);

describe(__filename + "#", () => {
  it("can evaluate a module with a component", async () => {
    const files: TestModuleFiles = {
      "entry.json": {
        name: "module",
        attributes: [],
        children: [
          {
            name: "component",
            attributes: [
            ],
            children: [
              {
                name: "template",
                attributes: [],
                children: []
              }
            ]
          },
          {
            name: "component",
            attributes: [
            ],
            children: [
              {
                name: "template",
                attributes: [],
                children: []
              }
            ]
          }
        ]
      }
    };

    const { componentPreviews } = evaluateDependencyEntry(await loadEntry("entry.json", { openFile: createTestFileReader(files) }));

    expect(componentPreviews.length).to.eql(2);
    const preview1 = componentPreviews[0];
    expect(preview1.name).to.eql("div");
  });
});