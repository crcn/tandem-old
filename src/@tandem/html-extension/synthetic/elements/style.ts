import { omit } from "lodash";
import * as React from "react";
import { Action, CSS_MIME_TYPE } from "@tandem/common";
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
    this._styleSheet.cssText = this.textContent;
  }

  attachedCallback() {
    super.attachedCallback();
    const edit = this.ownerDocument.createEdit();
    edit.addStyleSheet(this._styleSheet);
    edit.applyMutationsTo(this.ownerDocument);
  }

  detachedCallback() {
    const edit = this.ownerDocument.createEdit();
    edit.removeStyleSheet(this._styleSheet);
    edit.applyMutationsTo(this.ownerDocument);
  }

  onChildAdded(child) {
    super.onChildAdded(child);
    if (this._styleSheet) {
      this._styleSheet.cssText = this.textContent;
    }
  }

  get styleSheet() {
    return this._styleSheet;
  }
}
