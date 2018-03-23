import { expect } from "chai";
import { loadEntry, evaluateEntry, TreeNode } from "..";

type TestModuleFiles = {
  [identifier: string]: TreeNode
};

const createTestFileReader = (files: TestModuleFiles) => (uri) => JSON.stringify(files[uri]);

describe(__filename + "#", () => {
  it("can be created", async () => {
    const files: TestModuleFiles = {
      "entry.json": {
        name: "module",
        attributes: [],
        children: []
      }
    };

    const syntheticNode = evaluateEntry(await loadEntry("entry.json", { openFile: createTestFileReader(files) }));
  });
});