import { expect } from "chai";
import { runPCFile, loadModuleDependencyGraph } from "..";
import { FakeAttribute, FakeDocument, FakeDocumentFragment, FakeElement, FakeTextNode } from "./utils";
import { renderDOM2, SlimParentNode, diffNode } from "slim-dom";

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
    expect(body.toString()).to.eql(`<body><test><span>hello</span></test></body>`);
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
    expect(body.toString()).to.eql(`<body><test><span></span></test></body>`);
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
    expect(body.toString()).to.eql(`<body><test><span>a <b></b> c</span></test></body>`);
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
    expect(body.toString()).to.eql(`<body><test><span>a e<span slot="a">b</span><span slot="b">c</span><span slot="b">d</span></span></test></body>`);
  });

  describe("diff/patch", () => {
    it(`can diff & patch slotted children in a shadow document`, async () => {
      const a = await runPCComponent({
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
      const b = await runPCComponent({
        "entry.pc": `
          <component id="test">
            <template>
              <span><slot></slot><slot name="a"></slot><slot name="b"></slot></span>
            </template>
            <preview name="main">
              <test><span>a</span><span>b</span></test>
            </preview>
          </component>
        `
      });

      const diff = diffNode(a, b);
      console.log(diff);
    });
  });
});

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
      componentId: module.components[0].id,
      previewName: module.components[0].previews[0].name
    },
    graph
  });

  return document as SlimParentNode;
};