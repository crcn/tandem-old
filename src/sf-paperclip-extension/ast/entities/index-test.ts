import { expect } from "chai";
import { parsePC } from "../index";
import { MimeTypes } from "sf-paperclip-extension/constants";
import { PCFile, pcFileDependency } from "sf-paperclip-extension/models/pc-file";
import {  bcBlockNodeEntityDependency } from "sf-paperclip-extension/ast";
import { ActiveRecordFactoryDependency } from "sf-core/dependencies";
import { Dependencies, DependenciesDependency } from "sf-core/dependencies";
import { dependency as htmlExtensionDependency } from "sf-html-extension";

describe(__filename + "#", () => {

  let dependencies: Dependencies;

  beforeEach(() => {
    dependencies = new Dependencies(
      htmlExtensionDependency,
      pcFileDependency,
      bcBlockNodeEntityDependency,
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
      expect(entity.toString()).to.equal("hello world");
    });
  });

  describe("blocks", () => {
    it("can be rendered without a context", async () => {
      const entity = await loadEntity(`hello \${message}`);
      expect(entity.toString()).to.equal("hello undefined");
    });
    it("can be rendered with a context", async () => {
      const entity = await loadEntity(`hello \${message}`, { message: "world" });
      expect(entity.toString()).to.equal("hello world");
    });
  });
});