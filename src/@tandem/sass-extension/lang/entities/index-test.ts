
import {
  SassFile,
  SassImportEntity,
  sassExtensionDependency,
} from "@tandem/sass-extension";

import {
  File,
  Dependencies,
  FileFactoryDependency,
} from "@tandem/common";

import { expect } from "chai";

describe(__filename + "#", () => {

  let dependencies;

  beforeEach(() => {
    dependencies = new Dependencies(
      sassExtensionDependency
    );
  });

  async function loadSass(content: string) {
    const file = FileFactoryDependency.find("text/sass", dependencies);
  }

  it("can import a single sass entitiy", () => {

  });
});
