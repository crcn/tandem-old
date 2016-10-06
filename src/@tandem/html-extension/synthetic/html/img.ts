import { SyntheticHTMLElement } from "@tandem/synthetic-browser";

export class SyntheticHTMLImage extends SyntheticHTMLElement {
  private _absolutePath: string;

  async loadLeaf() {
    const src = this.getAttribute("src");

    // set the src attribute to trigger a re-render
    this.setAttribute("src", src + "?" + Date.now());
    const importer = this.ownerDocument.defaultView.sandbox.importer;
    this._absolutePath = await importer.resolve(src, this.ownerDocument.location.toString());
    importer.watchFile(this._absolutePath);
  }
  toString() {
    return `<img src="/asset/${encodeURIComponent(this._absolutePath)}?${Date.now()}">`;
  }
}
