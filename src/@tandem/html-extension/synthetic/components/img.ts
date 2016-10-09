import { BaseSyntheticComponent, SyntheticDOMElement } from "@tandem/synthetic-browser";

export class SyntheticHTMLImage extends BaseSyntheticComponent<SyntheticDOMElement, HTMLImageElement> {
  private _absolutePath: string;

  async load() {
    const src = this.source.getAttribute("src");

    // set the src attribute to trigger a re-render
    this.source.setAttribute("src", src + "?" + Date.now());
    const importer = this.source.ownerDocument.defaultView.sandbox.importer;
    this._absolutePath = await importer.resolve(src, this.source.ownerDocument.location.toString());
    importer.watchFile(this._absolutePath);
  }

  render() {
    return `<img ${this.source.attributesToString("class", "style")} src="/asset/${encodeURIComponent(this._absolutePath)}?${Date.now()}">`;
  }
}
