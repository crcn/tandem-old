import { BaseDOMContainerEntity, SyntheticDocument } from "@tandem/synthetic-browser";
import * as React from "react";

export class HTMLDocumentEntity extends BaseDOMContainerEntity<SyntheticDocument, HTMLDivElement> {
  private _currentCSS: string;
  render() {
    return <div {...this.renderAttributes()}>
      <style>
        {this.source.styleSheets.join("")}
      </style>
      {this.renderChildren()}
    </div>;
  }
}
