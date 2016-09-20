
import {
  SCSSFile,
  SCSSImportEntity,
  scssExtensionDependency,
} from "tandem-scss-extension";

import {
  File,
  Dependencies,
  FileFactoryDependency,
} from "tandem-common";

import { expect } from "chai";

describe(__filename + "#", () => {

  let dependencies;

  beforeEach(() => {
    dependencies = new Dependencies(
      scssExtensionDependency
    );
  });

  async function loadSCSS(content: string) {
    const file = FileFactoryDependency.find("text/scss", dependencies);
  }

  it("can import a single scss entitiy", () => {

  });
});
