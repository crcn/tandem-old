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
  }

  async $load() {
    const window = this.ownerDocument.defaultView;
    const rel     = this.getAttribute("rel") || "stylesheet";
    const href    = this.getAttribute("href");
    this[rel]     = window.browser.sandbox2.require(this.module.bundle.getAbsoluteDependencyPath(href));

    if (this.stylesheet) {
      this.ownerDocument.styleSheets.push(this.stylesheet);
    } else if (this.import) {
      this.attachShadow({ mode: "open" }).appendChild(this.import);
    }
  }
}