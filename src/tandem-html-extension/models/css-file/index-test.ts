import { expect } from "chai";

import {
  MimeTypes,
  CSSFile
} from "tandem-html-extension";

import {
  Dependencies,
  FileFactoryDependency,
  DependenciesDependency,
} from "tandem-common";

describe(__filename + "#", () => {

  let dependencies: Dependencies;

  beforeEach(() => {
    dependencies = new Dependencies(
      new FileFactoryDependency(MimeTypes.CSS, CSSFile),
      new DependenciesDependency()
    );
  });

  const createCSSFile = (content: string) => {
    const factory = FileFactoryDependency.find(MimeTypes.CSS, dependencies);
    return factory.create({ content: content, path: "file.css" });
  };

  it("can be created", () => {
    createCSSFile(".selector { }");
  });

  it("loads the propert entities", async () => {
    const file = createCSSFile(".selector > test { color: red; }");
    await file.load();
  });
});