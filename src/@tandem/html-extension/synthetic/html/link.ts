import { Action } from "@tandem/common/actions";
import { MimeTypes } from "@tandem/common/constants";

import {
  SyntheticHTMLElement,
  SyntheticCSSStyleSheet,
} from "@tandem/synthetic-browser";

export class SyntheticHTMLLink extends SyntheticHTMLElement {
  private _styleSheet: SyntheticCSSStyleSheet;
  async loadLeaf() {
    const window = this.ownerDocument.defaultView;
    const href    = this.getAttribute("href");
    const exports = await window.sandbox.importer.import(MimeTypes.CSS, href, window.location.toString());
    window.document.styleSheets.push(exports);
    this.notify(new Action("loaded"));
  }
  toString() {
    return "";
  }
}
