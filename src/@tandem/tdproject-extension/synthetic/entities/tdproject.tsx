import { SyntheticHTMLElement, BaseSyntheticDOMContainerEntity, SyntheticDocument } from "@tandem/synthetic-browser";
import * as React from "react";
import { pick } from "lodash";

export class SyntheticTDProject extends BaseSyntheticDOMContainerEntity<SyntheticHTMLElement, HTMLElement> {
  render() {
    return <div {...this.renderEntityAttributes()}>{this.renderChildren()}</div>;
  }
}
