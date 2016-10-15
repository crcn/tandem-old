import { omit } from "lodash";
import * as React from "react";
import {
  parseCSS,
  evaluateCSS,
  SyntheticDOMElement,
  BaseDOMNodeEntity,
} from "@tandem/synthetic-browser";

export class SyntheticHTMLStyle extends SyntheticDOMElement {
  createdCallback() {
    this.ownerDocument.styleSheets.push(evaluateCSS(parseCSS(this.textContent)));
  }
}
