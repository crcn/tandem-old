import { BaseDOMContainerEntity, SyntheticDocument } from "@tandem/synthetic-browser";
import * as React from "react";

export class HTMLDocumentEntity extends BaseDOMContainerEntity<SyntheticDocument, HTMLDivElement> {
  private _currentCSS: string;
  render() {
    return <div {...this.renderAttributes()}>
      {this.source.styleSheets.map((styleSheet, i) => {
        return <style key={i}>{styleSheet.cssText}</style>;
      })}
      {this.renderChildren()}
    </div>;
  }
}
