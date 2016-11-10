import { expect } from "chai";
import { createSandboxTestInjector } from "@tandem/sandbox/test/helpers";
import {
  FileCache,
  IFileSystem,
  FileCacheProvider,
  FileSystemProvider,
} from "@tandem/sandbox";

import { PropertyChangeAction } from "@tandem/common";

describe(__filename + "#", () => {

  const createSandboxSingletons = (mockFiles) => {
    const injector = createSandboxTestInjector({ mockFiles });
    return {
      fileCache: FileCacheProvider.getInstance(injector),
      fileSystem: FileSystemProvider.getInstance(injector),
    }
  }

  it("loads a file from the file system on request", async () => {
    const { fileCache } = createSandboxSingletons({
      "entry.js": "hello world"
    });

    const item = await fileCache.item("entry.js");
    expect(await item.read()).to.equal("hello world");
  });

  it("caches loaded items", async () => {
    const { fileCache } = createSandboxSingletons({
      "entry.js": "a"
    });
    const item = await fileCache.item("entry.js");
    expect(item).to.eql(await fileCache.item("entry.js"));
  });

  describe("file cache item#", () => {
    it("reloads the source file changes", async () => {
      const { fileSystem, fileCache } = createSandboxSingletons({
        "entry.js": "a"
      });

      const item = await fileCache.item("entry.js");
      expect(await item.read()).to.eql("a");
      await fileSystem.writeFile("entry.js", "b");
      expect(await item.read()).to.eql("b");
    });

    it("emits a change when changing the data url", async () => {
      const { fileCache } = createSandboxSingletons({
        "entry.js": "a"
      });
      const item = await fileCache.item("entry.js");

      return new Promise((resolve) => {
        item.observe({
          execute(action: PropertyChangeAction) {
            if (action.type === PropertyChangeAction.PROPERTY_CHANGE) {
              expect(item.url).to.equal("data:text/plain,aGVsbG8=");
              resolve();
            }
          }
        });

        item.setDataUrlContent("hello");
        item.save();
      });
    });

    it("emits a changes when the source file changes", async () => {
      const { fileSystem, fileCache } = createSandboxSingletons({
        "entry.js": "a"
      });
      const item = await fileCache.item("entry.js");
      const mtime = item.sourceFileModifiedAt;

      return new Promise((resolve) => {
        item.observe({
          execute(action: PropertyChangeAction) {
            if (action.type === PropertyChangeAction.PROPERTY_CHANGE) {
              expect(item.url).to.equal("file://entry.js");
              expect(item.sourceFileModifiedAt).to.not.equal(mtime);
              resolve();
            }
          }
        });

        fileSystem.writeFile("entry.js", "b");
      });
    });
  });
});