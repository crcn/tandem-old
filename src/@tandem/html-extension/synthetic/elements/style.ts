import { omit } from "lodash";
import * as React from "react";
import { CSS_MIME_TYPE } from "@tandem/common";
import {
  parseCSS,
  evaluateCSS,
  BaseDOMNodeEntity,
  SyntheticDOMElement,
  SyntheticCSSStyleSheet,
} from "@tandem/synthetic-browser";

export class SyntheticHTMLStyle extends SyntheticDOMElement {
  createdCallback() {

    // only allow text/css for now -- may allow for other types in the future, but this is
    // the only one that native DOM supports. All custom types should be handled in their respective
    // loaders.
    this.ownerDocument.styleSheets.push(evaluateCSS(parseCSS(this.textContent), undefined, this.module));
  }
}
