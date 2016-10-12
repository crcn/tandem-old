import { SyntheticHTMLElement, BaseDOMContainerEntity, SyntheticDocument } from "@tandem/synthetic-browser";
import * as React from "react";
import { pick } from "lodash";

export class TDProjectEntity extends BaseDOMContainerEntity<SyntheticHTMLElement, HTMLElement> {
  render() {
    return <div {...this.renderEntityAttributes()}>{this.renderChildren()}</div>;
  }
}
