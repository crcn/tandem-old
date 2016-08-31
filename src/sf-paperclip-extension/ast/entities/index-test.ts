import { expect } from "chai";
import { parsePC } from "../index";
import { MimeTypes } from "sf-paperclip-extension/constants";
import { PCFile, pcFileDependency } from "sf-paperclip-extension/models/pc-file";
import { ActiveRecordFactoryDependency } from "sf-core/dependencies";
import { Dependencies, DependenciesDependency } from "sf-core/dependencies";
import { dependency as htmlExtensionDependency } from "sf-html-extension";
import { pcBlockNodeEntityDependency, pcBlockAttributeValueEntityDependency } from "sf-paperclip-extension/ast";

describe(__filename + "#", () => {

  let dependencies: Dependencies;

  beforeEach(() => {
    dependencies = new Dependencies(
      pcFileDependency,
      htmlExtensionDependency,
      pcBlockNodeEntityDependency,
      pcBlockAttributeValueEntityDependency,
      new DependenciesDependency()
    );
  });

  async function loadEntity(content: string, context?: any) {
    const fileFactory = ActiveRecordFactoryDependency.find(MimeTypes.PC_MIME_TYPE, dependencies);
    const file: PCFile = fileFactory.create("files", { content: content, context: context });
    await file.load();
    return file.entity;
  }

  describe("basic template", () => {
    it("can be rendered", async () => {
      const entity = await loadEntity(`hello world`);
      expect(entity.section.innerHTML).to.equal("hello world");
    });
  });

  describe("block nodes", () => {
    it("can be rendered without a context", async () => {
      const entity = await loadEntity(`hello \${message}`);
      expect(entity.section.innerHTML).to.equal("hello ${ message }");
    });
    it("can be rendered with a context", async () => {
      const entity = await loadEntity(`hello \${message}`, { message: "world" });
      expect(entity.section.innerHTML).to.equal("hello world");
    });
  });

   describe("block attributes", () => {
    it("can be rendered without a context", async () => {
      const entity = await loadEntity("<div style=${style}></div>");
      expect(entity.section.innerHTML).to.equal("<div style=\"\"></div>");
    });
    it("can be rendered with a context", async () => {
      const entity = await loadEntity("<div style=${style}></div>", { style: "color:red;"});
      expect(entity.section.innerHTML).to.equal(`<div style="color:red;"></div>`);
    });
  });
});