import { expect } from "chai";
import { typescriptExtensionDependency, TSFile } from "tandem-typescript-extension";
import { MimeTypes } from "tandem-typescript-extension/constants";
import {
  Dependencies,
  FileFactoryDependency,
  DependenciesDependency,
} from "tandem-common";

describe(__filename + "#", () => {
  let deps: Dependencies;
  beforeEach(() => {
    deps = new Dependencies(
      new DependenciesDependency(),
      typescriptExtensionDependency,
    );
  });

  async function loadEntity(content: string) {
    const file: TSFile = FileFactoryDependency.find(MimeTypes.TS, deps).create({
      content: content
    });

    await file.load();

    return file.entity;
  }

  [
    [`function test() { }`, {}]
  ].forEach(([content, context]) => {
    it(`can evaluate ${content}`, async () => {
      const entity = await loadEntity(content as string);
      await entity.evaluate(context);
      console.log(entity);
    });
  });
});