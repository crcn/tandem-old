import * as path from "path";
import { JS_MIME_TYPE } from "@tandem/common";
import { SyntheticDOMElement } from "@tandem/synthetic-browser";
import { SyntheticHTMLElement } from "@tandem/synthetic-browser";
import {compileGlobalSandboxScript, runGlobalSandboxScript } from "@tandem/sandbox";

export class SyntheticHTMLScript extends SyntheticHTMLElement {
  createdCallback() {
    this.executeScript();
  }

  get src() {
    return this.getAttribute("src");
  }

  set src(value: string) {
    this.setAttribute("src", value);
  }

  executeScript() {
    if (!this.$module) return;
    const src = this.getAttribute("src");
    const type = this.getAttribute("type");
    this.ownerDocument.scripts.push(this); 
    

    if (!type || type === "text/javascript" || type === "application/javascript") {
      const content = src ? this.$module.source.eagerGetDependency(src).content : this.textContent;
      const script = compileGlobalSandboxScript(src || this.$source.filePath, this.$source.filePath, content);
      runGlobalSandboxScript(script, this.$module.sandbox);
    }
  }

}