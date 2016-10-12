import { omit } from "lodash";
import * as React from "react";
import {
  parseCSS,
  evaluateCSS,
  SyntheticDOMElement,
  BaseDOMNodeEntity,
} from "@tandem/synthetic-browser";

export class HTMLStyleEntity extends BaseDOMNodeEntity<SyntheticDOMElement, HTMLImageElement> {

  async evaluate() {
    this.source.ownerDocument.styleSheets.push(evaluateCSS(parseCSS(this.source.textContent)));
    await super.evaluate();
  }

  render() {
    return null;
  }
}
