import { expect } from "chai";
import { loadEntry, evaluateDependencyEntry, TreeNode, translateXMLToTreeNode, DEFAULT_NAMESPACE } from "..";

type TestModuleFiles = {
  [identifier: string]: TreeNode
};

const createTestFileReader = (files: TestModuleFiles) => (uri) => JSON.stringify(files[uri]);

describe(__filename + "#", () => {
  it("can evaluate a module with a component", async () => {
    const files: TestModuleFiles = {
      "entry.json": translateXMLToTreeNode(`
        <module>
          <component id="test">
            <template>
            </template>
          </component>
          <component id="test2">
            <template>
            </template>
          </component>
        </module>
      `)
    };

    const { componentPreviews } = evaluateDependencyEntry(await loadEntry("entry.json", { openFile: createTestFileReader(files) }));

    expect(componentPreviews.length).to.eql(2);
    const preview1 = componentPreviews[0];
    expect(preview1.name).to.eql("div");
  });

  it("can evaluate a component with a simple template", async () => {
    const files: TestModuleFiles = {
      "entry.json": translateXMLToTreeNode(`
        <module>
          <component id="test">
            <template>
              <text></text>
            </template>
          </component>
        </module>
      `)
    };

    const { componentPreviews } = evaluateDependencyEntry(await loadEntry("entry.json", { openFile: createTestFileReader(files) }));

    expect(componentPreviews.length).to.eql(1);
    const preview1 = componentPreviews[0];
    expect(preview1.name).to.eql("div");
    expect(preview1.children.length).to.eql(1);
    expect(preview1.children[0].name).to.eql("text");
  });

  it("can evaluate a component with a style", async () => {
    const files: TestModuleFiles = {
      "entry.json": translateXMLToTreeNode(`
        <module>
          <component id="test" style="color: red; background-color: blue;">
            <template>
            </template>
          </component>
        </module>
      `)
    };

    const { componentPreviews } = evaluateDependencyEntry(await loadEntry("entry.json", { openFile: createTestFileReader(files) }));

    expect(componentPreviews.length).to.eql(1);
    const preview1 = componentPreviews[0];
    expect(preview1.name).to.eql("div");
    expect(preview1.attributes[DEFAULT_NAMESPACE].style).to.eql({ color: 'red', backgroundColor: 'blue' })
    expect(preview1.children.length).to.eql(0);
  });

  it("can evaluate a component that's using another component defined in the same module", async () => {

    const files: TestModuleFiles = {
      "another-module.json": translateXMLToTreeNode(`
        <module>
          
        </module>
      `),
      "entry.json": translateXMLToTreeNode(`
        <module xmlns:mod="./another-module.json">
          <component id="test" style="color: red; background-color: blue;">
            <template>
              <mod:test />
            </template>
          </component>
          <component id="test2" style="color: red; background-color: blue;">
            <template>
            </template>
          </component>
        </module>
      `)
    };
  });

  it("can evaluate a component that's using another component defined in another module", async () => {

    const files: TestModuleFiles = {
      "another-module.json": translateXMLToTreeNode(`
        <module>
          <component id="test2" style="color: red; background-color: blue;">
            <template>
            </template>
          </component>
        </module>
      `),
      "entry.json": translateXMLToTreeNode(`
        <module xmlns:mod="./another-module.json">
          <component id="test" style="color: red; background-color: blue;">
            <template>
              <mod:test />
            </template>
          </component>
        </module>
      `)
    };
  });

  it("can extend a component defined in the same module", async () => {

  });

  it("can extend a component default in another module", async () => {

  });

  // it throws an error if a component defined is not found
  // 
});