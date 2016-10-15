import { CSS_MIME_TYPE, HTML_MIME_TYPE } from "@tandem/common";
import { SyntheticHTMLElement } from "@tandem/synthetic-browser";

export class SyntheticHTMLLink extends SyntheticHTMLElement {
  createdCallback() {
    this.attachShadow({ mode: "open" });
  }

  async $load() {
    const window = this.ownerDocument.defaultView;
    const rel     = this.getAttribute("rel") || "stylesheet";
    const href    = this.getAttribute("href");

    const exports =  await window.sandbox.importer.import(rel === "stylesheet" ? CSS_MIME_TYPE : HTML_MIME_TYPE, href, window.location.toString());

    if (rel === "stylesheet") {
      this.ownerDocument.styleSheets.push(exports);
    } else {
      this.attachShadow({ mode: "open" }).appendChild(exports);
    }
  }
}