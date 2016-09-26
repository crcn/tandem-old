import { expect } from "chai";
import { Dependencies } from "tandem-common";
import { MockFileSystem } from "./test";
import { ModuleImporter, BaseModule } from "tandem-runtime";

describe(__filename + "#", () => {

  class MockModule extends BaseModule<any> {
    evaluate(context: any) {

    }
  }

  it("can be created", () => {
    // new ModuleImporter(0, new MockFileSystem(), new Dependencies());
  });

  it("can import a module", () => {
    const fs = new MockFileSystem();
    // fs.addMockFile({ path: "test.ts", });
    // const importer new ModuleImporter(
  });
});