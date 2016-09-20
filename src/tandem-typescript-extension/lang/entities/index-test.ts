import { expect } from "chai";
import { typescriptExtensionDependency, TSFile, TSRootEntity } from "tandem-typescript-extension";
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

  async function loadEntity(content: string, context: any) {
    const file: TSFile = FileFactoryDependency.find(MimeTypes.TS, deps).create({
      content: content
    });

    file.context = Object.assign(context, {
      document: file,
      dependencies: deps.clone()
    });

    await file.load();

    return file.entity;
  }

  [
    [`function a() { }`, {}, {}],
    [`function a() { i++ }; a();`, { i: 0 }, { i: 1 }]
  ].forEach(([content, context, contextChange]) => {
    it(`can evaluate ${content}`, async () => {
      const entity = await loadEntity(content as string, context);
      // expect(context).to.eql(contextChange);
      // console.log(context);
    });
  });
});