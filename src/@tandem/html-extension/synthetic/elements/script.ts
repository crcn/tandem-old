import * as path from "path";
import { JS_MIME_TYPE } from "@tandem/common";
import { SyntheticDOMElement } from "@tandem/synthetic-browser";
import { SyntheticHTMLElement } from "@tandem/synthetic-browser";

export class SyntheticHTMLScript extends SyntheticHTMLElement {
  private _fn: Function;
  createdCallback() {
    this.attachShadow({ mode: "open" });
  }
  async $load() {

    // const src    = this.getAttribute("src");
    // const type   = this.getAttribute("type") || "application/javascript";

    // const window = this.ownerDocument.defaultView;
    // const importer = window.sandbox.importer;
    // const filePath = this.module.filePath;

    // let scriptContent = "";

    // if (src) {

    //   // TODO - nono to this -- this should happen with the bundle
    //   const filePath = await window.sandbox.fileResolver.resolve(src, path.dirname(this.module.filePath));
    //   const content = await importer.readFile(filePath);
    //   await importer.watchFile(filePath);
    // } else {
    //   scriptContent = this.textContent;
    // }

    // const moduleProvider = SandboxModuleFactoryProvider.find(JS_MIME_TYPE, type, this.browser.injector);

    // if (!moduleProvider) {
    //   throw new Error(`Cannot execute script with content type "${type}".`);
    // }

    // const global = window;

    // // dirty fetch of variable declarations. Need to define these on the context
    // // so that the with statement works properly
    // for (const variableDeclaration of (scriptContent.match(/(var|const)\s*\w+/g) || [])) {
    //   const variableName = variableDeclaration.match(/(var|const)\s*(\w+)/)[2];
    //   if (global[variableName] == null) global[variableName] = null;
    // }

    // const module = moduleProvider.create(this.module.filePath, scriptContent, this.module.sandbox);
    // await module.load();
    // module.evaluate();
  }
}