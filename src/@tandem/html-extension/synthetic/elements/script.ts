import * as path from "path";

import {
  SyntheticDOMElement,
  BaseDOMNodeEntity,
} from "@tandem/synthetic-browser";
import { SyntheticHTMLElement } from "@tandem/synthetic-browser";

import { SandboxModuleFactoryDependency } from "@tandem/sandbox";
import { JS_MIME_TYPE } from "@tandem/common";

export class SyntheticHTMLScript extends SyntheticHTMLElement {
  private _fn: Function;
  createdCallback() {
    this.attachShadow({ mode: "open" });
  }
  async $load() {

    const src    = this.getAttribute("src");
    const type   = this.getAttribute("type") || "application/javascript";

    const window = this.ownerDocument.defaultView;
    const importer = window.sandbox.importer;
    const fileName = this.module.fileName;

    let scriptContent = "";

    if (src) {
      const filePath = await importer.resolve(src, path.dirname(this.module.fileName));
      const content = await importer.readFile(filePath);
      await importer.watchFile(filePath);
    } else {
      scriptContent = this.textContent;
    }

    const moduleDependency = SandboxModuleFactoryDependency.find(JS_MIME_TYPE, type, this.browser.dependencies);

    if (!moduleDependency) {
      throw new Error(`Cannot execute script with content type "${type}".`);
    }

    const global = window;

    // dirty fetch of variable declarations. Need to define these on the context
    // so that the with statement works properly
    for (const variableDeclaration of (scriptContent.match(/(var|const)\s*\w+/g) || [])) {
      const variableName = variableDeclaration.match(/(var|const)\s*(\w+)/)[2];
      if (global[variableName] == null) global[variableName] = null;
    }

    const module = moduleDependency.create(this.module.fileName, scriptContent, this.module.sandbox);
    await module.load();
    module.evaluate();
  }
}