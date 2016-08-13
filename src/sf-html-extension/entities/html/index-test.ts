import { expect } from "chai";
import { Dependencies } from "sf-core/dependencies";
import { EntityEngine } from "sf-core/entities";
import { parse as parseHTML } from "../../parsers/html";
import {
  HTMLElementEntity,
  htmlTextDependency,
  htmlCommentDependency,
  htmlDocumentDependency,
  htmlElementDependencies,
} from "./index";

describe(__filename + "#", () => {
  let dependencies;
  beforeEach(() => {
    dependencies = new Dependencies(
      ...htmlElementDependencies,
      htmlTextDependency,
      htmlDocumentDependency,
      htmlCommentDependency
    );
  });

  async function loadEngine(source) {
    const engine = new EntityEngine(dependencies);
    await engine.load(parseHTML(source));
    return engine;
  }

  async function loadDiv(source) {
    const div = document.createElement("div");
    div.appendChild((<HTMLElementEntity>(await loadEngine(source)).entity).section.toFragment());
    return div;
  }

  it("can render a DIV element", async () => {
    const engine = new EntityEngine(dependencies);
    const entity = await engine.load(parseHTML("<div />"));
    expect((<any>entity).childNodes[0].nodeName).to.equal("DIV");
  });

  it("emits a DOM element", async () => {
    const engine = new EntityEngine(dependencies);
    let source = "<div>hello world!</div>";
    const entity = await engine.load(parseHTML(source)) as HTMLElementEntity;
    const div = document.createElement("div");
    div.appendChild(entity.section.toFragment());
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
      const engine = new EntityEngine(dependencies);
      const entity = await engine.load(parseHTML(source as any)) as HTMLElementEntity;
      const div = document.createElement("div");
      div.appendChild(entity.section.toFragment());
      expect(div.innerHTML).to.equal(source);
      await engine.load(parseHTML(change as any));
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

    let engine: EntityEngine;

    beforeEach(function() {
      engine = new EntityEngine(dependencies);
    });

    it("properly adds new children to the existing entity expressions", async () => {
      const div = document.createElement("div");
      await engine.load(parseHTML(`<div />`));
      div.appendChild((<HTMLElementEntity>engine.entity).section.toFragment());
      expect(div.innerHTML).to.equal("<div></div>");
      await engine.load(parseHTML(`<div>a b</div>`));
      expect(div.innerHTML).to.equal("<div>a b</div>");
      expect(engine.entity.source.toString()).to.equal(`<div>a b</div>`);
    });
  });
});