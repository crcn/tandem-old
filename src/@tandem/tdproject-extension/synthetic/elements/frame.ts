import { SyntheticMarkupElement } from "@tandem/synthetic-browser";
import { MimeTypes } from "@tandem/common";

export class SyntheticTDFrame extends SyntheticMarkupElement {
  async loadLeaf() {
    const src = this.getAttribute("src");
    const window = this.ownerDocument.defaultView;
    const exports = await window.sandbox.importer.import(MimeTypes.HTML, src, window.location.toString());
    // console.log(exports);
    this.appendChild(exports);
  }

  // toString() {
  //   return `<div>Hello World</div>`;
  // }
}