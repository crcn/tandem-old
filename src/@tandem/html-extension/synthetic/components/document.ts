import { BaseSyntheticComponent, SyntheticDocument } from "@tandem/synthetic-browser";

export class SyntheticHTMLDocument extends BaseSyntheticComponent<SyntheticDocument, HTMLDivElement> {
  render() {
    return `<div>
      <style>
        ${this.source.styleSheets.join("")}
      </style>
      ${this.renderChildren()}
    </div>`;
  }
}
