import {
  CSS_MIME_TYPE,
  HTML_MIME_TYPE
} from "@tandem/common";

import {
  SyntheticHTMLElement,
  SyntheticCSSStyleSheet
} from "@tandem/synthetic-browser";
import * as path from "path";

export class SyntheticHTMLLink extends SyntheticHTMLElement {

  public stylesheet: SyntheticCSSStyleSheet;
  public import: SyntheticHTMLElement;

  createdCallback() {
    this.attachShadow({ mode: "open" });
    const window = this.ownerDocument.defaultView;
    const rel     = this.getAttribute("rel") || "stylesheet";
    const href    = this.getAttribute("href");
    const dependency = this.module.bundle.getDependencyByRelativePath(href);

    this[rel]     = window.browser.sandbox.require(dependency.filePath);

    if (this.stylesheet) {
      this.ownerDocument.styleSheets.push(this.stylesheet);
    } else if (this.import) {
      const shadow = this.attachShadow({ mode: "open" });
      this.import.querySelectorAll("*").forEach((element) => {

        // only include importable elements
        if (/style|link|template/.test(element.tagName)) {
          shadow.appendChild(element);
        }
      });
    }
  }
}