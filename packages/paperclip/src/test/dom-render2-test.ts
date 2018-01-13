import { expect } from "chai";
import { runPCFile, loadModuleDependencyGraph, ComponentModule } from "..";
import { FakeAttribute, FakeDocument, FakeDocumentFragment, FakeElement, FakeTextNode, generateRandomStyleSheet, generateRandomComponents } from "./utils";
import { renderDOM2, SlimParentNode, diffNode, patchNode2, patchDOM2, DOMNodeMap, setVMObjectIds, prepDiff, NativeObjectMap } from "slim-dom";

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
      ],

      // busted fuzzy
      [
        `<component id="component0">
          <template>
            <slot name="b0"></slot>
          </template>
          <preview name="main">
            <component0 />
          </preview>
        </component>`,
        `<component id="component0">
          <template>
            <slot name="f0">hgdc</slot>
          </template>
          <preview name="main">
            <component0 />
          </preview>
        </component>`
      ],

      [
        `<component id="component0"><template><slot name="l0">dg<j g="j" f="bk" l="a"><slot name="l0"></slot></j></slot><slot name="l0">aefhg</slot><g j="g" l="fh" c="l">lecd<slot name="l0">fkhae<slot name="l0"><k k="f"></k><slot name="l0"></slot></slot><b g="g" l="k" l="bk" j="gd">fekgi<slot name="l0"></slot></b></slot><slot name="l0"><b j="e">hidgk</b></slot></g><slot name="l0"><slot name="l0"><slot name="l0">aihekbgjdljjghc</slot>bakcl<slot name="l0"><slot name="l0"></slot><j a="i" h="i" c="bh" l="e"></j></slot>cda</slot></slot><i l="fe" c="c" j="l">jfk<slot name="l0"></slot>gcj</i><c a="h" k="g" c="i" h="i">fcghj<j j="i">ijde</j></c><slot name="l0"></slot><slot name="l0">hjfcggie<l b="je" l="b" i="k">edaglfbkgcailehjil</l></slot><slot name="l0"></slot></template><preview name="main"><component0 f="dj" d="b"></component0></preview></component>`,
        `<component id="component0"><template><slot name="l0">gelcafel<k a="k" h="ef">ajkbea<slot name="l0">jld</slot></k><slot name="l0"></slot></slot><f f="bh" i="e" j="e"></f><slot name="l0">ceajbjdgjbi</slot><slot name="l0"><slot name="l0"></slot><e f="d" k="ai" e="ae" b="be">iejdl</e></slot></template><preview name="main"><component0 l="gc" h="a" j="l" a="k"></component0></preview></component> <component id="component1"><template><slot name="i0">cijfbegck</slot><component0 l="he" i="k" b="kd" b="k"></component0><slot name="i0">f</slot><slot name="i0"><slot name="i0"><component0 h="j"></component0>glaecfl</slot><slot name="i0">iglaajbfc<component0 a="a" c="e"></component0></slot><component0 b="i" j="l"></component0></slot><c c="fj" a="hk">cecfi</c><slot name="i0">cfdki</slot><component0 g="la" i="g"></component0><slot name="i0">h</slot><slot name="i0">degialedhb<c g="i" e="h"><i k="ei">gf<component0 g="f"></component0><component0 c="kj" e="j" b="e"></component0>i</i><slot name="i0">hhdl</slot></c></slot><g i="b" j="e"><component0 b="jl" d="c" e="a"></component0><slot name="i0">kdhb</slot></g></template><preview name="main"><component1 i="ej" j="gl" d="b"></component1></preview></component>`
      ]
    ].forEach((variants) => {
      it(`can diff & patch ${variants.join(" -> ")}`, async () => {
        await diffPatchVariants(variants);
      });
    });

    describe("components", () => {
      describe("fuzzy", () => {
        const tests = Array.from({ length: 100 }).map(() => {
          return Array.from({ length: 4 }).map(() => generateRandomComponents(2, 4, 2, 3, 4, 0, 0))
        });
        
        tests.forEach((variants) => {
          it(`can diff & patch ${variants.join(" -> ")}`, async () => {
            await diffPatchVariants(variants);
          });
        });
      });
    });

    describe("CSS", () => {
      [
        [`.a {}`, `.b {}`],
        [`.a {} .b {}`, `.b {} .a {}`],
        [`.a {} .b {}`, `.b {}`],
        [`.a {b: c; d: e;}`, `.b {d:e;b:c;}`],

        // busted fuzzy tests
        [`@keyframes a {}`, `@keyframes b {}`],
        [`@keyframes a { 0% { color: red; }}`, `@media b { .c { color: blue; }}`],
        [`.k { e: a;}`, `i { f: kb; e: k;} .i { a: e;}`],
        [`.i { h: ag;}`, `@media e { .f { h: ea;}}`, `.g { c: el;} @media k { .k { l: h; d: gk;}}`],
        [`.i { g: d; a: fk; g: ca;}`, `.f { g: d;}`],
        [`.d { a: h; i: le; h: j;}`, `.a { g: b; c: k; g: c;}  @keyframes j { 100% { a: kl;}  4% { g: c;}}`],
        [`.l { i: kj; g: dg;}`, `.b { k: c; g: d; i: e;}`]
      ].forEach((variants: any) => {
        it(`can diff & patch ${variants.join(" -> ")}`, async () => {
          await diffPatchVariants(variants.map(variant => {
            return `
            <component id="test">
              <style>
                ${variant}
              </style>
              <template>
                <slot></slot>
              </template>
              <preview name="main">
                <test />
              </preview>
            </component>
            `;
          }));
        });
      });
      describe(`fuzzy tests`, () => {

        const tests = Array.from({ length: 100 }).map(() => {
          return Array.from({ length: 4 }).map(() => generateRandomStyleSheet(5, 5))
        });

        tests.forEach((variants) => {
          it(`can diff & patch ${variants.join(" -> ")}`, async () => {
            await diffPatchVariants(variants.map(variant => {
              return `
              <component id="test">
                <style>
                  ${variant}
                </style>
                <template>
                  <slot></slot>
                </template>
                <preview name="main">
                  <test />
                </preview>
              </component>
              `;
            }));
          });
        });
      });
    });    
  });
});

const diffPatchVariants = async (variants: string[]) => {
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
}

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
  const { graph, diagnostics: graphDiagnostics } = await loadModuleDependencyGraph(entry, {
    readFile: (filePath) => files[filePath]
  });

  if (graphDiagnostics.length) {
    console.error(JSON.stringify(graphDiagnostics, null, 2));
    throw graphDiagnostics[0];
  }

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