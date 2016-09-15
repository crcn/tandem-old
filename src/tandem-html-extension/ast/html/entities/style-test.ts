import { expect } from "chai";
import { MimeTypes } from "tandem-html-extension/constants";
import { DocumentFile } from "tandem-front-end/models";
import { Dependencies, DependenciesDependency, FileFactoryDependency, BaseEntity } from "tandem-common";
import { HTMLStyleEntity, HTMLDocumentRootEntity, dependency as htmlExtensionDependency } from "tandem-html-extension";

describe(__filename + "#", () => {

  let deps: Dependencies;

  beforeEach(() => {
    deps = new Dependencies(htmlExtensionDependency, new DependenciesDependency());
  });

  async function loadEntity(content: string): Promise<BaseEntity<any>> {
    const file: DocumentFile<any> = FileFactoryDependency.find(MimeTypes.HTML, deps).create({
      content: content
    });

    await file.load();
    return file.entity;
  }

  it("can be loaded into a document", async () => {
    const entity = await loadEntity(`<style></style>`);
    const styleEntity = entity.children[0];
    expect(styleEntity).to.be.an.instanceOf(HTMLStyleEntity);
  });

  it("loads css in by default", async () => {
    const entity = await loadEntity(`<div><style>.item { color: red; } </style></div>`) as HTMLDocumentRootEntity;
    expect(entity.section.innerHTML).to.equal("<style>.item { color: red; } </style><div></div>");
  });
});
