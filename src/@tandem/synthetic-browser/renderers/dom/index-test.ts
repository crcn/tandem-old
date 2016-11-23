import { expect } from "chai";
import { SyntheticHTMLStyle } from "@tandem/html-extension/synthetic";
import { SyntheticDOMRenderer } from "./index";
import { SyntheticWindow, SyntheticDocument } from "@tandem/synthetic-browser";
import { generateRandomSyntheticHTMLElementSource } from "@tandem/synthetic-browser/test/helpers";

describe(__filename + "#", () => {

  const createDocument = (html = "") => {
    const document  = new SyntheticWindow().document;
    document.registerElement("style", SyntheticHTMLStyle);
    document.body.innerHTML = html;
    return document;
  }

  const createRenderer = (sourceDocument: SyntheticDocument) => {

    const factoryDocument = createDocument();

    const renderer = new SyntheticDOMRenderer(factoryDocument as any);
    renderer.start();
    renderer.document = sourceDocument;

    return {
      renderHTML: async () => {
        await renderer.requestRender();
        return renderer.element.innerHTML;
      }
    }
  }

  [

    // basic rendering
    [[``, `<div>hello</div>`]],
    [[``, `<div a="b">hello</div>`]],
    [[``, `<div a="b" c="d">hello</div>`]],
    [[``, `<ul><li>a</li><li>b</li><li>c</li></ul>`]],
    [[``, `<!--comment-->`]],
    [[`.container { color: red; } `, `<div></div>`]],

    // fuzzy
    // [[``, generateRandomSyntheticHTMLElementSource(10, 10, 2)]],

    // // HTML mutations
    [[``, `<div>a</div>`], [``, `<div>b</div>`]],
    [[``, `<div a="b"></div>`], [``, `<div a="c"></div>`]],
    [[``, `<div a="b"></div>`], [``, `<div c="d"></div>`]],
    [[``, `<div>a</div><span>b</span>`], [``, `<span>b</span><div>a</div>`]],

  ].forEach(([[inputCSS, inputHTML], ...mutations]) => {
    it(`Can render ${inputCSS} ${inputHTML} -> ${mutations.join(" ")}`, async () => {

      const createdStyledDocument = (css, html) => createDocument(`<style>${css}</style>${html}`);
      const inputDocument = createdStyledDocument(inputCSS, inputHTML);
      const renderer      = createRenderer(inputDocument);

      const assertHTML = (renderedHTML, inputCSS, inputHTML) => {
        expect(renderedHTML.replace(/[\s\r\n\t]+/g, " ")).to.equal(`<style type="text/css">${inputCSS}</style><div><span><html><head></head><body>${inputHTML}</body></html></span></div>`);
      }

      assertHTML(await renderer.renderHTML(), inputCSS, inputHTML);

      for (const [mutatedCSS, mutatedHTML] of mutations) {
        const outputDocument = createdStyledDocument(mutatedCSS, mutatedHTML);
        inputDocument.createEdit().fromDiff(outputDocument).applyMutationsTo(inputDocument);

        assertHTML(await renderer.renderHTML(), mutatedCSS, mutatedHTML);
      }
    });
  });
});