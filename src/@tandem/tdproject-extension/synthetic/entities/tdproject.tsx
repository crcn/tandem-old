import { SyntheticHTMLElement, BaseSyntheticDOMContainerEntity, SyntheticDocument } from "@tandem/synthetic-browser";
import * as React from "react";

export class SyntheticTDProject extends BaseSyntheticDOMContainerEntity<SyntheticHTMLElement, HTMLElement> {
  render() {
    return <div>{this.renderChildren()}</div>;
  }
}
