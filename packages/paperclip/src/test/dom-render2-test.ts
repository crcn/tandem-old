import { expect } from "chai";
import { runPCFile, loadModuleDependencyGraph, ComponentModule } from "..";
import { FakeAttribute, FakeDocument, FakeDocumentFragment, FakeElement, FakeTextNode } from "./utils";
import { renderDOM2, SlimParentNode, diffNode, patchNode2, patchNode, patchDOM2, DOMNodeMap, setVMObjectIds, prepDiff, NativeObjectMap } from "slim-dom";

describe(__filename + "#", () => {
  it(`can render a component with a template`, async () => {
    const document = new FakeDocument();
    const body = document.createElement("body");
    const slimDoc = await runPCComponent({
      "entry.pc": `
        <component id="test">
          <template>
            <span>hello</span>
          </template>
          <preview name="main">
            <test />
          </preview>
        </component>
      `
    });
    renderDOM2(slimDoc, body as any);
    expect(body.toString()).to.eql(`<body><test class="__test_scope_host"><span class="__test_scope">hello</span></test></body>`);
  });


  it(`can render a component that has a slot and no child nodes`, async () => {
    const document = new FakeDocument();
    const body = document.createElement("body");
    const slimDoc = await runPCComponent({
      "entry.pc": `
        <component id="test">
          <template>
            <span><slot></slot></span>
          </template>
          <preview name="main">
            <test /><slot />
          </preview>
        </component>
      `
    });
    renderDOM2(slimDoc, body as any);
    expect(body.toString()).to.eql(`<body><test class="__test_scope_host"><span class="__test_scope"></span></test></body>`);
  });

  it(`can render a component with default slot children`, async () => {
    const document = new FakeDocument();
    const body = document.createElement("body");
    const slimDoc = await runPCComponent({
      "entry.pc": `
        <component id="test">
          <template>
            <span><slot></slot></span>
          </template>
          <preview name="main">
            <test>a <b /> c</test>
          </preview>
        </component>
      `
    });
    renderDOM2(slimDoc, body as any);
    expect(body.toString()).to.eql(`<body><test class="__test_scope_host"><span class="__test_scope">a <b></b> c</span></test></body>`);
  });

  it(`can render a component with named slots`, async () => {
    const document = new FakeDocument();
    const body = document.createElement("body");
    const slimDoc = await runPCComponent({
      "entry.pc": `
        <component id="test">
          <template>
            <span><slot></slot><slot name="a"></slot><slot name="b"></slot></span>
          </template>
          <preview name="main">
            <test>a <span slot="a">b</span><span slot="b">c</span><span slot="b">d</span>e</test>
          </preview>
        </component>
      `
    });
    renderDOM2(slimDoc, body as any);
    expect(body.toString()).to.eql(`<body><test class="__test_scope_host"><span class="__test_scope">a e<span slot="a">b</span><span slot="b">c</span><span slot="b">d</span></span></test></body>`);
  });

  describe("diff/patch", () => {
    [
      [
        // slot testing
        // add slotted child
        `
          <component id="test">
            <template>
              <slot></slot>
            </template>
            <preview name="main">
              <test>
                <a /><b />
              </test>
            </preview>
          </component>
        `,
        `
          <component id="test">
            <template>
              <slot></slot>
            </template>
            <preview name="main">
              <test>
                <a /><b /><c />
              </test>
            </preview>
          </component>
        `
      ],

      [
        `
          <component id="test">
            <template>
              <slot name="test"></slot>
            </template>
            <preview name="main">
              <test>
                <a slot="test"></a>
              </test>
            </preview>
          </component>
        `,
        `
          <component id="test">
            <template>
              <slot name="test"></slot>
            </template>
            <preview name="main">
              <test>
                <a slot="test"></a>
                <a slot="test"></a>
              </test>
            </preview>
          </component>
        `
      ],

      [
        `
          <component id="test">
            <template>
              <slot name="test"></slot>
            </template>
            <preview name="main">
              <test>
                <b slot="test"></b>
                <c slot="test2"></c>
              </test>
            </preview>
          </component>
        `,
        `
          <component id="test">
            <template>
              <slot name="test2"></slot>
            </template>
            <preview name="main">
              <test>
                <b slot="test"></b>
                <c slot="test2"></c>
              </test>
            </preview>
          </component>
        `
      ],

      [
        `
          <component id="test">
            <template>
              <div>
                <slot></slot>
              </div>
            </template>
            <preview name="main">
              <test>a</test>
            </preview>
          </component>
        `,
        `
          <component id="test">
            <template>
              <span>
                <slot></slot>
              </span>
            </template>
            <preview name="main">
              <test>a</test>
            </preview>
          </component>
        `
      ],
      
      [
        `
          <component id="test">
            <template>
              <slot></slot>
            </template>
            <preview name="main">
              <test>
                a
                <span slot="test2">b</span>
                c
              </test>
            </preview>
          </component>
        `,
        `
          <component id="test">
            <template>
              <slot name="slot2"></slot>
              <slot></slot>
            </template>
            <preview name="main">
              <test>
                a
                <span slot="test2">b</span>
                c
              </test>
            </preview>
          </component>
        `
      ],

      // add named slotted child
      [
        `
          <component id="test">
            <template>
              <a />
            </template>
            <preview name="main">
              <test />
            </preview>
          </component>
        `,
        `
          <component id="test">
            <template>
              <b />
            </template>
            <preview name="main">
              <test />
            </preview>
          </component>
        `
      ],
      [
        `
          <component id="test">
            <template>
              <slot></slot>
            </template>
            <preview name="main">
              <test>
                a b
              </test>
            </preview>
          </component>
        `,
        `
          <component id="test">
            <template>
              <slot></slot>
            </template>
            <preview name="main">
              <test>
                b c
              </test>
            </preview>
          </component>
        `
      ]
    ].forEach((variants) => {
      it(`can diff & patch ${variants.join("->")}`, async () => {
        const fakeDocument = new FakeDocument();
        const body = fakeDocument.createElement("body");
        let map: any;
        let currentDocument: SlimParentNode;
        for (const variant of variants) {
          const newDocument = await runPCComponent({
            "entry.pc": variant
          });
          if (!currentDocument) {
            currentDocument = setVMObjectIds(newDocument, "item");
            map = renderDOM2(currentDocument, body as any);
          } else {
            const result = patchNodeAndDOM(currentDocument, newDocument, body as any, map);
            currentDocument = result.node;
            map = result.map;

            const expBody = fakeDocument.createElement("body");
            renderDOM2(newDocument, expBody as any);
            expect(body.toString()).to.eql(expBody.toString());
          }
        }
      });
    });
  });
});

const patchNodeAndDOM = (oldNode: SlimParentNode, newNode: SlimParentNode, mount: HTMLElement, map: NativeObjectMap) => {
  const diffs = prepDiff(oldNode, diffNode(oldNode, newNode));
  for (const mutation of diffs) {
    map = patchDOM2(mutation, oldNode, mount, map);
    oldNode = patchNode2(mutation, oldNode);
  }

  return { node: oldNode, map };
};

const runPCTemplate = async (source) => await runPCComponent({
  "entry.pc": `<component id="comp"><template>${source}</template><preview name="main"><comp /></preview></component>`
});

const runPCComponent = async (files, entry = Object.keys(files)[0]) => {
  const { graph } = await loadModuleDependencyGraph(entry, {
    readFile: (filePath) => files[filePath]
  });

  const { module } = graph[entry];
  
  const { document, diagnostics } = runPCFile({ 
    entry: {
      filePath: entry,
      componentId: (module as ComponentModule).components[0].id,
      previewName: (module as ComponentModule).components[0].previews[0].name
    },
    graph
  });

  return document as SlimParentNode;
};