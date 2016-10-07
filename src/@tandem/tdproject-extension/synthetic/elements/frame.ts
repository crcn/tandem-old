import {
  SyntheticMarkupElement,
} from "@tandem/synthetic-browser";
import { MimeTypes } from "@tandem/common";

export class SyntheticTDFrame extends SyntheticMarkupElement {

  async loadLeaf() {
    const src = this.getAttribute("src");
    const window = this.ownerDocument.defaultView;
    const absolutePath = await window.sandbox.importer.resolve(src, window.location.toString());
    const exports = await window.sandbox.importer.import(MimeTypes.HTML, absolutePath);
    this.appendChild(exports);
  }

  toString() {
    return `<div ${this.attributesToString("data-uid", "style", "class")}>${this.childrenToString()}</div>`;
  }
}