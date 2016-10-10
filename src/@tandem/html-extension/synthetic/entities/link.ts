import { Action } from "@tandem/common/actions";
import { CSS_MIME_TYPE } from "@tandem/common/constants";

import {
  SyntheticDocument,
  SyntheticHTMLElement,
  BaseSyntheticDOMNodeEntity,
  SyntheticCSSStyleSheet,
} from "@tandem/synthetic-browser";

export class SyntheticHTMLLinkEntity extends BaseSyntheticDOMNodeEntity<SyntheticHTMLElement, HTMLElement> {
  private _styleSheet: SyntheticCSSStyleSheet;
  async evaluate() {
    const window = this.source.ownerDocument.defaultView;
    const href    = this.source.getAttribute("href");
    const exports = this._styleSheet = await window.sandbox.importer.import(CSS_MIME_TYPE, href, window.location.toString());
    window.document.styleSheets.push(this._styleSheet);
    await super.evaluate();
  }
  createTargetNode(document: SyntheticDocument) {
    return document.createTextNode("");
  }
  render() {
    return "";
  }
}
