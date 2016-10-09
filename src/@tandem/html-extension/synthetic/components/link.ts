import { Action } from "@tandem/common/actions";
import { MimeTypes } from "@tandem/common/constants";

import {
  BaseSyntheticComponent,
  SyntheticDocument,
  SyntheticHTMLElement,
  SyntheticCSSStyleSheet,
} from "@tandem/synthetic-browser";

export class SyntheticHTMLLink extends BaseSyntheticComponent<SyntheticHTMLElement, HTMLElement> {
  private _styleSheet: SyntheticCSSStyleSheet;
  async load() {
    const window = this.source.ownerDocument.defaultView;
    const href    = this.source.getAttribute("href");
    const exports = await window.sandbox.importer.import(MimeTypes.CSS, href, window.location.toString());
    window.document.styleSheets.push(exports);
  }
  createTargetNode(document: SyntheticDocument) {
    return document.createTextNode("");
  }
  render() {
    return "";
  }
}
