import { omit } from "lodash";
import * as React from "react";
import { CSS_MIME_TYPE } from "@tandem/common";
import {
  parseCSS,
  evaluateCSS,
  SyntheticDOMElement,
  SyntheticCSSStyleSheet,
} from "@tandem/synthetic-browser";

export class SyntheticHTMLStyle extends SyntheticDOMElement {

  private _styleSheet: SyntheticCSSStyleSheet;

  createdCallback() {
    this._styleSheet = new SyntheticCSSStyleSheet([]);
    this._styleSheet.$ownerNode = this;
    this._styleSheet.cssText = this.textContent;
  }

  attachedCallback() {
    super.attachedCallback();
    this.ownerDocument.styleSheets.push(this._styleSheet);
  }

  detachedCallback() {
    this.ownerDocument.styleSheets.splice(this.ownerDocument.styleSheets.indexOf(this._styleSheet), 1);
  }

  onChildAdded(child, index) {
    super.onChildAdded(child, index);
    if (this._styleSheet) {
      this._styleSheet.cssText = this.textContent;
    }
  }

  get styleSheet() {
    return this._styleSheet;
  }
}
