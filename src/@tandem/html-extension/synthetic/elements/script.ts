import * as path from "path";
import { JS_MIME_TYPE } from "@tandem/common";
import { SyntheticDOMElement } from "@tandem/synthetic-browser";
import { SyntheticHTMLElement } from "@tandem/synthetic-browser";
import {compileGlobalSandboxScript, runGlobalSandboxScript } from "@tandem/sandbox";

export class SyntheticHTMLScript extends SyntheticHTMLElement {
  createdCallback() {
    this.executeScript();
  }

  executeScript() {
    if (!this.$module) return;
    const src = this.getAttribute("src");
    const content = src ? this.$module.source.eagerGetDependency(src).content : this.textContent;
    const script = compileGlobalSandboxScript(this.$source.filePath, this.$source.filePath, content);
    runGlobalSandboxScript(script, this.$module.sandbox);
  }

}