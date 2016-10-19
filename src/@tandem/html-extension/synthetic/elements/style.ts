import { omit } from "lodash";
import * as React from "react";
import { CSS_MIME_TYPE } from "@tandem/common";
import { SandboxModuleFactoryDependency } from "@tandem/sandbox";
import {
  parseCSS,
  evaluateCSS,
  BaseDOMNodeEntity,
  SyntheticDOMElement,
  SyntheticCSSStyleSheet,
} from "@tandem/synthetic-browser";

export class SyntheticHTMLStyle extends SyntheticDOMElement {
  async $load() {
    const type = this.getAttribute("type") || "text/css";
    console.log("style type");
    const moduleFactory = SandboxModuleFactoryDependency.find(CSS_MIME_TYPE, type, this.ownerDocument.browser.dependencies);
    if (!moduleFactory) {
      throw new Error(`Cannot find style module for type ${type}.`);
    }
    const module = moduleFactory.create(this.module ? this.module.filePath : undefined, this.textContent, this.ownerDocument.sandbox);
    await module.load();
    const styleSheet = module.evaluate() as SyntheticCSSStyleSheet;
    this.ownerDocument.styleSheets.push(styleSheet);
  }
}
