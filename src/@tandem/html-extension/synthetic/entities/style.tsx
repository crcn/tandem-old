import { omit } from "lodash";
import * as React from "react";
import {
  parseCSS,
  evaluateCSS,
  SyntheticDOMElement,
  BaseSyntheticDOMNodeEntity,
} from "@tandem/synthetic-browser";

export class SyntheticHTMLStyleEntity extends BaseSyntheticDOMNodeEntity<SyntheticDOMElement, HTMLImageElement> {

  async evaluate() {
    this.source.ownerDocument.styleSheets.push(evaluateCSS(parseCSS(this.source.textContent)));
    await super.evaluate();
  }

  render() {
    return null;
  }
}
