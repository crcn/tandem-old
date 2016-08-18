import { expect } from "chai";
import { Dependencies, ActiveRecordFactoryDependency, DependenciesDependency } from "sf-core/dependencies";
import { waitForPropertyChange, timeout } from "sf-core/test/utils";
import { parse as parseHTML } from "sf-html-extension/parsers/html";
import {
  HTMLFile,
  HTMLElementEntity,
  HTMLDocumentEntity,
  htmlTextDependency,
  htmlCommentDependency,
  htmlFileModelDependency,
  htmlElementDependencies,
  htmlDocumentFragmentDependency,
} from "sf-html-extension/models";

describe(__filename + "#", () => {
  let dependencies: Dependencies;
  beforeEach(() => {
    dependencies = new Dependencies();

    dependencies.register(
      new DependenciesDependency(dependencies),
      htmlTextDependency,
      htmlCommentDependency,
      htmlFileModelDependency,
      ...htmlElementDependencies,
      htmlDocumentFragmentDependency,
    );
  });

  async function loadDocument(content: string) {
    const file: HTMLFile = ActiveRecordFactoryDependency.find("text/html", dependencies).create("files", {
      path: "a",
      content: content
    });
    await timeout(20);
    return file.document;
  }

  async function updateDocumentSource(document: HTMLDocumentEntity, source: string) {
    document.file.deserialize({ content: source });
    await timeout(20);
    return document;
  }

  async function loadDiv(source) {
    const doc = await loadDocument(source);
    const div = document.createElement("div");
    div.appendChild(<Node><any>doc.root.section.toFragment());
    return div;
  }

  it("can render a DIV element", async () => {
    const doc = await loadDocument("<div />");
    expect(doc.root.childNodes[0].nodeName).to.equal("DIV");
  });

  it("emits a DOM element", async () => {
    const source = "<div>hello world!</div>";
    const doc = await loadDocument(source);
    const div = document.createElement("div");
    div.appendChild(<Node><any>doc.root.section.toFragment());
    expect(div.innerHTML).to.equal(source);
  });

  [
    ["<div>hello</div>", "<div>world</div>"],
    ["<div><h1>hello</h1></div>", "<div>world</div>"],
    [`<div id="a"></div>`, `<div></div>`],
    [`<div id="a"></div>`, `<div id="a"></div>`],
    [`<div></div>`, `<div id="a"></div>`],

    // shuffle
    [`<div><h1>1</h1><h2>2</h2><h3>2</h3></div>`, `<div><h3>1</h3><h2>2</h2><h1>3</h1></div>`],
    [`<div>1<h2>2</h2>3<h3>4</h3></div>`, `<div><h2>1</h2>2<h3>3</h3></div>`],
    [`1<h2>2</h2>3<h3>4</h3>`, `<h2>1</h2>2<h3>3</h3>`]
  ].forEach(function([source, change]) {
    it(`can update the source from ${source} to ${change}`, async () => {
      const doc = await loadDocument(source);
      const div = document.createElement("div");
      div.appendChild(<Node><any>doc.root.section.toFragment());
      expect(div.innerHTML).to.equal(source);
      await updateDocumentSource(doc, change);
      expect(div.innerHTML).to.equal(change);
    });
  });

  describe("template#", () => {
    xit("registers a new component based on the template ID attribute", async () => {
      const div = await loadDiv(`<template id="test">
        hello world
      </template><test id="target" />`);

    });
  });

  describe("when updating existing entities", () => {

    let doc: HTMLDocumentEntity;

    beforeEach(async function() {
      doc = await loadDocument("");
    });

    it("properly adds new children to the existing entity expressions", async () => {
      const div = document.createElement("div");

      await updateDocumentSource(doc, "<div />");
      div.appendChild(<Node><any>doc.root.section.toFragment());
      expect(div.innerHTML).to.equal("<div></div>");
      await updateDocumentSource(doc, "<div>a b</div>");
      expect(div.innerHTML).to.equal("<div>a b</div>");
      expect(doc.root.source.toString()).to.equal(`<div>a b</div>`);
    });
  });
});