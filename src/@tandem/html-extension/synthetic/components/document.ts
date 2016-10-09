import { BaseSyntheticComponent, SyntheticDocument } from "@tandem/synthetic-browser";

export class SyntheticHTMLDocument extends BaseSyntheticComponent<SyntheticDocument, HTMLDivElement> {
  render() {
    return `<div data-uid="${this.source.uid}">
      <style>
        ${this.source.styleSheets.join("")}
      </style>
      ${this.renderChildren()}
    </div>`;
  }
}
