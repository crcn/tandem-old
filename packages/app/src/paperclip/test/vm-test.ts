import { expect } from "chai";
import { mapValues } from "lodash";
import {  TreeNode, xmlToTreeNode, DEFAULT_NAMESPACE, stringifyTreeNodeToXML } from "../../common";
import { loadEntry, evaluateDependencyEntry } from "..";

type TestModuleFiles = {
  [identifier: string]: TreeNode
};

const createTestFileReader = (files: TestModuleFiles) => (uri) => JSON.stringify(files[uri]);

describe(__filename + "#", () => {

  [
    [
      `can evaluate a module with a component`,
      {
        "entry.json": `
        <module>
          <component id="test">
            <template>
            </template>
          </component>
          <component id="test2">
            <template>
            </template>
          </component>
        </module>`
      },
      `<div></div>
      <div></div>`
    ],
    [
      "can evaluate a component with a simple template",
      {
        "entry.json": `
        <module>
          <component id="test">
            <template>
              <text></text>
            </template>
          </component>
        </module>
        `
      },
      `<div>
        <text></text>
      </div>`
    ],
    [
      "can evaluate a component with a style",
      {
        "entry.json": `
          <module>
            <component id="test" style="color: red; background-color: blue;">
              <template>
              </template>
            </component>
          </module>
        `
      },
      `<div style="color:red;backgroundColor:blue;"></div>`
    ],
    [
      `can evaluate a component that's using another component defined in the same module`,
      {
        "entry.json": `
          <module>
            <component id="test" style="color: red; background-color: blue;">
              <template>
                <test2 />
              </template>
            </component>
            <component id="test2" style="color: red; background-color: blue;">
              <template>
                <text value="hello world" />
              </template>
            </component>
          </module>
        `
      },
      `
      <div style="color:red;backgroundColor:blue;">
        <div style="color:red;backgroundColor:blue;">
          <text value="hello world"></text> 
        </div>
      </div> 
      <div style="color:red;backgroundColor:blue;">
        <text value="hello world"></text>
      </div>`
    ],
    [
      `can evaluate a component that's using another component defined in another module`,
      {
        "another-module.json": `
          <module>
            <component id="test">
              <template>
                <text value="hello world" />
              </template>
            </component>
          </module>
        `,
        "entry.json": `
          <module xmlns:mod="./another-module.json">
            <component id="test">
              <template>
                <mod:test />
              </template>
            </component>
          </module>
        `
      },
      `
      <div>
        <div>
          <text value="hello world"></text>
        </div>
      </div>
      `
    ],
    [
      `can evaluate a component with a default slot`,
      {
        "entry.json": `
          <module>
            <component id="test">
              <template>
                <slot></slot>
              </template>
            </component>
            <component id="test2">
              <template>
                <test>
                  <text value="hello world" />
                </test>
              </template>
            </component>
          </module>
        `
      },
      `
        <div>
          <span></span>
        </div>
        <div>
          <div>
            <span>
              <text value="hello world"></text>
            </span>
          </div>
        </div>
      `
    ],

    [
      `can evaluate a component with a named & default slot`,
      {
        "entry.json": `
          <module>
            <component id="test">
              <template>
                <slot name="slot0"></slot>
                <slot name="slot1"></slot>
                <slot name="slot2"></slot>
                <slot></slot>
              </template>
            </component>
            <component id="test2">
              <template>
                <test>
                  <text value="1"></text>
                  <text slot="slot2" value="a"></text>
                  <text slot="slot1" value="b"></text>
                  <text slot="slot0" value="c"></text>
                  <text slot="slot1" value="d"></text>
                  <text slot="slot2" value="e"></text>
                  <text value="2"></text>
                </test>
              </template>
            </component>

          </module>
        `,
      },
      `
      <div>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div>
        <div>
          <span>
            <text slot="slot0" value="c"></text>
          </span>
          <span>
            <text slot="slot1" value="b"></text>
            <text slot="slot1" value="d"></text>
          </span>
          <span>
            <text slot="slot2" value="a"></text>
            <text slot="slot2" value="e"></text>
          </span>
          <span>
            <text value="1"></text>
            <text value="2"></text>
          </span>
        </div>
      </div>
      `
    ],
    [
      `A component can extend an existing one`,
      {
        "entry.json": `
          <module>
            <component id="test">
              <template>
                <text value="hello world"></text>
              </template>
            </component>
            <component id="test2" extends="test">
              <template>
              </template>
            </component>
          </module>
        `
      },
      `
        <div>
          <text value="hello world"></text>
        </div>
        <div>
          <text value="hello world"></text>
        </div>
      `
    ],
    [
      `A component extend another compoent and provide slotted children`,
      {
        "entry.json": `
          <module>
            <component id="test">
              <template>
                <slot></slot>
              </template>
            </component>
            <component id="test2" extends="test">
              <template>
                <text value="hello world"></text>
              </template>
            </component>
          </module>
        `
      },
      `
        <div>
          <span></span>
        </div>
        <div>
          <span>
            <text value="hello world"></text>
          </span>
        </div>
      `
    ],
    [
      `A component extend another compoent defined in another module`,
      {
        "entry.json": `
          <module xmlns:mod="./module.json">
            <component id="test" extends:mod="test">
              <template>
                <text value="1" slot="slot1"></text>
                <text value="2"></text>
                <text value="3"></text>
              </template>
            </component>
          </module>
        `,
        "module.json": `
          <module>
            <component id="test">
              <template>
                <h1>
                  <slot></slot>
                </h1>
                <h2>
                  <slot name="slot1"></slot>
                </h2>
              </template>
            </component>
          </module>
        `,
      },
      
      `
        <div>
          <h1>
            <span>
              <text value="2"></text>
              <text value="3"></text>
            </span>
          </h1>
          <h2>
            <span>
              <text value="1" slot="slot1"></text>
            </span>
          </h2>
        </div>
      `
    ],

    // can extend a component default in another module
    // overrides
    // errors if a component does not exist
    // variants
  ].forEach(([name, files, expectedOutput]: any) => {
    it(name, async () => {
      const { componentPreviews } = evaluateDependencyEntry(await loadEntry("entry.json", { openFile: createTestFileReader(mapValues(files, (file) => xmlToTreeNode(file))) }));
      
      const result = componentPreviews.map(pv => stringifyTreeNodeToXML(pv)).join("\n");
      expect(result.replace(/[\n\r\s\t]+/g, " ").trim()).to.eql(expectedOutput.replace(/[\n\r\s\t]+/g, " ").trim());
    });
  });
});