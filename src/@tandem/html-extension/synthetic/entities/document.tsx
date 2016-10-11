import { BaseSyntheticDOMContainerEntity, SyntheticDocument } from "@tandem/synthetic-browser";
import * as React from "react";

export class SyntheticHTMLDocumentEntity extends BaseSyntheticDOMContainerEntity<SyntheticDocument, HTMLDivElement> {
  render() {
    return <div {...this.renderAttributes()}>
      <style>
        {this.source.styleSheets.join("")}
      </style>
      {this.renderChildren()}
    </div>;
  }
}
