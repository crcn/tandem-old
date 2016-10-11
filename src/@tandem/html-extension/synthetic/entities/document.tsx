import { BaseSyntheticDOMContainerEntity, SyntheticDocument } from "@tandem/synthetic-browser";
import * as React from "react";

export class SyntheticHTMLDocumentEntity extends BaseSyntheticDOMContainerEntity<SyntheticDocument, HTMLDivElement> {
  render() {
    return <div>
      <style>
        {this.source.styleSheets.join("")}
      </style>
      {this.renderChildren()}
    </div>;
  }
}
