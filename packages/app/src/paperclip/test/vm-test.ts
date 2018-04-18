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
            <component id="test">
              <template style="color: red; background-color: blue;">
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
            <component id="test">
              <template style="color: red; background-color: blue;">
                <test2 />
              </template>
            </component>
            <component id="test2">
              <template style="color: red; background-color: blue;">
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
          <slot></slot>
        </div>
        <div>
          <div>
            <slot>
              <text value="hello world"></text>
            </slot>
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
        <slot></slot>
        <slot></slot>
        <slot></slot>
        <slot></slot>
      </div>
      <div>
        <div>
          <slot>
            <text slot="slot0" value="c"></text>
          </slot>
          <slot>
            <text slot="slot1" value="b"></text>
            <text slot="slot1" value="d"></text>
          </slot>
          <slot>
            <text slot="slot2" value="a"></text>
            <text slot="slot2" value="e"></text>
          </slot>
          <slot>
            <text value="1"></text>
            <text value="2"></text>
          </slot>
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
          <slot></slot>
        </div>
        <div>
          <slot>
            <text value="hello world"></text>
          </slot>
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
            <slot>
              <text value="2"></text>
              <text value="3"></text>
            </slot>
          </h1>
          <h2>
            <slot>
              <text value="1" slot="slot1"></text>
            </slot>
          </h2>
        </div>
      `
    ],

    [
      `can override with delete-child`,
      {
        "entry.json": `
          <module>
            <component id="test">
              <template>
                <text ref="text1" value="a"></text>
                <text ref="text2" value="a"></text>
              </template>
            </component>
            <component id="test2" extends="test">
              <overrides>
                <delete-child target="text1" />
              </overrides>
            </component>
          </module>
        `
      },
      `
      <div>
        <text ref="text1" value="a"></text>
        <text ref="text2" value="a"></text>
      </div>
      <div>
        <text ref="text2" value="a"></text>
      </div>
      `
    ],
    [
      `can override with insert-child`,
      {
        "entry.json": `
          <module>
            <component id="test">
              <template>
                <text ref="text1" value="a"></text>
              </template>
            </component>
            <component id="test2" extends="test">
              <overrides>
                <insert-child before="text1">
                  <text ref="text2" value="a"></text>
                </insert-child>
              </overrides>
            </component>
          </module>
        `
      },
      `
      <div>
        <text ref="text1" value="a"></text>
      </div>
      <div>
        <text ref="text2" value="a"></text>
        <text ref="text1" value="a"></text>
      </div>
      `
    ],
    [
      `can override with set-attribute`,
      {
        "entry.json": `
          <module>
            <component id="test">
              <template>
                <text ref="text1" value="a"></text>
              </template>
            </component>
            <component id="test2" extends="test">
              <overrides>
                <set-attribute target="text1" name="value" value="b" />
              </overrides>
            </component>
          </module>
        `
      },
      `
      <div>
        <text ref="text1" value="a"></text>
      </div>
      <div>
        <text ref="text1" value="b"></text>
      </div>
      `
    ],
    [
      `can override with set-style`,
      {
        "entry.json": `
          <module>
            <component id="test">
              <template>
                <text ref="text1" value="a"></text>
              </template>
            </component>
            <component id="test2" extends="test">
              <overrides>
                <set-style name="color" value="blue" />
              </overrides>
            </component>
          </module>
        `
      },
      `
      <div>
        <text ref="text1" value="a"></text>
      </div>
      <div style="color:blue;">
        <text ref="text1" value="a"></text>
      </div>
      `
    ],

    // can override with insert-child
    // can override with move-child
    // can override with set-attribute on slot
    // can override a style property
  ].forEach(([name, files, expectedOutput]: any) => {
    it(name, async () => {
      const { documentNodes } = evaluateDependencyEntry(await loadEntry("entry.json", { openFile: createTestFileReader(mapValues(files, (file) => xmlToTreeNode(file))) }));


      const result = documentNodes.map(pv => stringifyTreeNodeToXML(pv)).join("\n");
      expect(result.replace(/[\n\r\s\t]+/g, " ").trim()).to.eql(expectedOutput.replace(/[\n\r\s\t]+/g, " ").trim());
    });
  });
});