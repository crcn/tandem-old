import { omit } from "lodash";
import * as React from "react";
import { BaseSyntheticDOMNodeEntity, SyntheticDOMElement } from "@tandem/synthetic-browser";

export class SyntheticHTMLImageEntity extends BaseSyntheticDOMNodeEntity<SyntheticDOMElement, HTMLImageElement> {
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
    return <img {...omit(this.renderAttributes(), ["src"])} src={`${window.location.protocol}${window.location.host}/asset/${encodeURIComponent(this._absolutePath)}?${Date.now()}`} />;
  }
}
