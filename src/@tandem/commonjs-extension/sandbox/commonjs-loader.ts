import { JS_MIME_TYPE } from "@tandem/common";
import detective = require("detective");
import { IDependencyLoader, Dependency, IDependencyLoaderResult } from "@tandem/sandbox";

export class CommonJSandboxLoader implements IDependencyLoader {
  constructor() {

  }

  async load(dependency: Dependency, { type, content }): Promise<IDependencyLoaderResult>  {
    content = String(content);
    const dependencies = detective(content);
    return {
      type: JS_MIME_TYPE,
      content: content,
      importedDependencyUris: dependencies
    };
  }
}