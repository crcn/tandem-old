import { expect } from "chai";
import { MimeTypes } from "tandem-html-extension/constants";
import { DocumentFile } from "tandem-front-end/models";
import { timeout } from "tandem-common/test";
import { HTMLImportEntity, HTMLDocumentRootEntity, htmlExtensionDependency } from "tandem-html-extension";
import { Dependencies, DependenciesDependency, FileFactoryDependency, BaseEntity } from "tandem-common";

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

  async function reloadContent(entity: BaseEntity<any>, content: string) {
    const document = entity.document as DocumentFile<any>;
    document.content = content;
    await timeout(10);
    return entity;
  }

  it("can be loaded into a document", async () => {
    const entity = await loadEntity(`<style></style>`);
    const styleEntity = entity.children[0];
    expect(styleEntity).to.be.an.instanceOf(HTMLImportEntity);
  });

  it("loads css in by default", async () => {
    const entity = await loadEntity(`<div><style>.item { color: red; } </style></div>`) as HTMLDocumentRootEntity;
    expect(entity.section.innerHTML).to.equal("<style>.item { color: red; } </style><div></div>");
  });

  it("is patched when new content is loaded in", async () => {
    const entity = await loadEntity(`<style>.item { color: blue; }</style>`) as HTMLDocumentRootEntity;
    const styleEntity = <HTMLImportEntity>entity.childNodes[0];
    expect(entity.section.innerHTML).to.equal(`<style>.item { color: blue; }</style>`);
    await reloadContent(entity, `<style>.item { color: green; }</style>`);
    expect(entity.section.innerHTML).to.equal(`<style>.item { color: green; }</style>`);
    const patchedStyleEntity = <HTMLImportEntity>entity.childNodes[0];
    expect(styleEntity).to.equal(patchedStyleEntity);
    expect(styleEntity.children[0]).to.equal(patchedStyleEntity.children[0]);
  });
});
