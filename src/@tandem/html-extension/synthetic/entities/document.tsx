import { BaseDOMContainerEntity, SyntheticDocument } from "@tandem/synthetic-browser";
import * as React from "react";

export class HTMLDocumentEntity extends BaseDOMContainerEntity<SyntheticDocument, HTMLDivElement> {
  render() {
    return <div {...this.renderAttributes()}>
      {this.renderChildren()}
    </div>;
  }
}
