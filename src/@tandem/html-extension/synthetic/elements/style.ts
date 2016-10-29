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

    // only allow text/css for now -- may allow for other types in the future, but this is
    // the only one that native DOM supports. All custom types should be handled in their respective
    // loaders.
    this.ownerDocument.styleSheets.push(this._styleSheet = evaluateCSS(parseCSS(this.textContent), undefined, this.module));
  }

  get styleSheet() {
    return this._styleSheet;
  }
}
