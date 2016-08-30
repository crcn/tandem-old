import { expect } from "chai";
import { Dependencies, ActiveRecordFactoryDependency, DependenciesDependency } from "sf-core/dependencies";
import { waitForPropertyChange, timeout } from "sf-core/test/utils";
import { parseHTML } from "sf-html-extension/ast";
import {
  HTMLElementEntity,
  htmlTextDependency,
  htmlCommentDependency,
  htmlElementDependencies,
  htmlDocumentFragmentDependency,
} from "sf-html-extension/ast";

import {
  HTMLFile,
  htmlFileModelDependency,
} from "sf-html-extension/models";

describe(__filename + "#", () => {
  let dependencies: Dependencies;
  beforeEach(() => {
    dependencies = new Dependencies();

    dependencies.register(
      new DependenciesDependency(),
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
    await file.load();
    return file;
  }

  async function updateDocumentSource(file: HTMLFile, source: string) {
    file.deserialize({ content: source, path: "a" });
    await file.load();

    return document;
  }

  async function loadDiv(source) {
    const file = await loadDocument(source);
    const div = document.createElement("div");
    div.appendChild(file.entity.section.toFragment());
    return div;
  }

  it("can render a DIV element", async () => {
    const file = await loadDocument("<div />");
    expect(file.entity.children[0].name).to.equal("DIV");
  });

  it("emits a DOM element", async () => {
    const source = "<div>hello world!</div>";
    const file = await loadDocument(source);
    const div = document.createElement("div");
    div.appendChild(<Node><any>file.entity.section.toFragment());
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
      const file = await loadDocument(source);
      const div = document.createElement("div");
      div.appendChild(file.entity.section.toFragment());
      expect(div.innerHTML).to.equal(source);
      await updateDocumentSource(file, change);
      expect(div.innerHTML).to.equal(change);
    });
  });

  describe("template#", () => {
    xit("registers a new component based on the template ID attribute", async () => {
      const div = await loadDiv(`<template id="test">
        hello world
      </artboard><test id="target" />`);

    });
  });

  describe("when updating existing entities", () => {

    let file: HTMLFile;

    beforeEach(async function() {
      file = await loadDocument("");
    });

    it("properly adds new children to the existing entity expressions", async () => {
      const div = document.createElement("div");

      await updateDocumentSource(file, "<div />");
      div.appendChild(file.entity.section.toFragment());
      expect(div.innerHTML).to.equal("<div></div>");
      await updateDocumentSource(file, "<div>a b</div>");
      expect(div.innerHTML).to.equal("<div>a b</div>");
      expect(file.entity.source.toString()).to.equal(`<div>a b</div>`);
    });
  });
});