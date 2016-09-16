import * as sift from "sift";
import { expect } from "chai";
import { HTMLFile } from "tandem-html-extension/models/html-file";
import { parseHTML } from "tandem-html-extension/ast";
import { MimeTypes } from "tandem-html-extension/constants";
import { BoundingRect } from "tandem-common/geom";
import { IVisibleEntity } from "tandem-common/ast/entities";
import { FrontEndApplication } from "tandem-front-end/application";
import { waitForPropertyChange } from "tandem-common/test";
import { Dependencies, DependenciesDependency, DEPENDENCIES_NS, ApplicationSingletonDependency, FileFactoryDependency } from "tandem-common/dependencies";
import {
  HTMLElementEntity,
  htmlTextDependency,
  htmlCommentDependency,
  defaultElementFactoyDependency,
  htmlDocumentFragmentDependency,
  defaultAttributeFactoryDependency,
} from "tandem-html-extension/ast";

import {
  htmlFileModelDependency
} from "tandem-html-extension/models";

describe(__filename + "#", () => {
  let dependencies: Dependencies;
  let app: FrontEndApplication;

  beforeEach(() => {
    app = new FrontEndApplication({});

    dependencies = new Dependencies(
      htmlTextDependency,
      htmlCommentDependency,
      htmlFileModelDependency,
      defaultElementFactoyDependency,
      htmlDocumentFragmentDependency,
      defaultAttributeFactoryDependency,
      new ApplicationSingletonDependency(app)
    );

    dependencies.register(new DependenciesDependency());
  });

  async function loadTarget(source) {
    const file: HTMLFile = FileFactoryDependency.find(MimeTypes.HTML, dependencies).create({
      path: "nothing",
      mtime: Date.now(),
      content: source
    });
    await file.load();
    const root = file.entity;
    const div = document.createElement("div");
    document.body.appendChild(div);
    Object.assign(div.style, { position: "fixed", top: "0px", left: "0px" });
    div.appendChild(<Node><any>root.section.toFragment());

    return <IVisibleEntity>(root.flatten().find((entity) => {
      if (entity["attributes"]) {
        return (<HTMLElementEntity>entity).getAttribute("id") === "target";
       }
      return false;
    }) as any);
  }

  function simplifyBounds(bounds) {
    return [bounds.left, bounds.top, bounds.width, bounds.height];
  }

  async function calculateBounds(source) {
    const target = await loadTarget(source);
    return simplifyBounds(target.display.bounds);
  }

  describe("bounds ", () => {

    it("are correct for a simple div", async () => {
      expect(await calculateBounds(`<div id="target" style="width:100px;height:100px;">
        </div>`)).to.eql([0, 0, 100, 100]);
    });

    xit("returns the correct bounds of a DIV if it's isolated within an iframe", async () => {
      expect(await calculateBounds(`<artboard style="position:absolute;top:100px;left:100px;">
        <div id="target" style="width:100px;height:100px;">
        </div>
      </artboard>`)).to.eql([100, 100, 100, 100]);
    });

    xit("returns the correct bounds of a DIV in a doubly nested iframe", async () => {
      expect(await calculateBounds(`<artboard style="position:absolute;top:100px;left:100px;border:0px;">
        <artboard style="position:absolute;top:100px;left:100px;border:0px;">
          <div id="target" style="width:100px;height:100px;">
          </div>
        </artboard>
      </artboard>`)).to.eql([200, 200, 100, 100]);
    });

    xit("returns the correct bounds of an iframe that has a border", async () => {
      expect(await calculateBounds(`<artboard style="position:absolute;top:100px;left:100px;border: 5px solid black;">
        <div id="target" style="width:100px;height:100px;">
        </div>
      </artboard>`)).to.eql([105, 105, 100, 100]);
    });

    it("returns the correct bounds of a DIV in a DIV", async () => {
      expect(await calculateBounds(`<div style="top:100px;left:50px;width:100px;height:100px;position:absolute;">
        <div id="target" style="width:100px;height:100px;position:absolute;top:10px;left:10px;" />
      </div>`)).to.eql([60, 110, 100, 100]);
    });
  });

  describe("capabilities ", function() {

    async function calculateCapabilities(source) {
      const target = await loadTarget(source);
      return target.display.capabilities;
    }

    it("movable=true if style.position!=static", async () => {
      expect((await calculateCapabilities(`
        <div id="target" style="position:static;" />
      `)).movable).to.equal(false);

      expect((await calculateCapabilities(`
        <div id="target" style="position:relative;" />
      `)).movable).to.equal(true);

      expect((await calculateCapabilities(`
        <div id="target" style="position:absolute;" />
      `)).movable).to.equal(true);

      expect((await calculateCapabilities(`
        <div id="target" style="position:fixed;" />
      `)).movable).to.equal(true);
    });

    it("resizale=true if style.position=absolute|fixed || style.displat !== inline", async () => {

      expect((await calculateCapabilities(`
        <div id="target" style="position:absolute;" />
      `)).resizable).to.equal(true);

      expect((await calculateCapabilities(`
        <div id="target" style="position:fixed;" />
      `)).resizable).to.equal(true);

      expect((await calculateCapabilities(`
        <div id="target" style="display: inline-block;" />
      `)).resizable).to.equal(true);

      expect((await calculateCapabilities(`
        <div id="target" style="display: inline;" />
      `)).resizable).to.equal(false);

      expect((await calculateCapabilities(`
        <div id="target" style="display: inline; position: absolute;" />
      `)).resizable).to.equal(true);

      expect((await calculateCapabilities(`
        <div id="target" style="display: block;" />
      `)).resizable).to.equal(true);
    });
  });

  describe("setting bounds", () => {
    it("subtracts padding", async () => {

      const target = await loadTarget(`
        <div id="target" style="position:absolute;width:100px;height:100px;padding:10px;">

        </div>
      `);

      target.display.bounds = new BoundingRect(0, 0, 200, 200);
      expect(simplifyBounds(target.display.bounds)).to.eql([0, 0, 200, 200]);
    });


    it("subtracts bounds", async () => {
      const target = await loadTarget(`<div id="target" style="width:100px;height:100px; border: 2px solid black;">

      </div>`);

      target.display.bounds = new BoundingRect(0, 0, 200, 200);
      expect(simplifyBounds(target.display.bounds)).to.eql([0, 0, 200, 200]);
    });

  });
});