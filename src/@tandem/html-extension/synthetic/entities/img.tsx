import { omit } from "lodash";
import * as React from "react";
import { BaseSyntheticDOMNodeEntity, SyntheticDOMElement } from "@tandem/synthetic-browser";

export class SyntheticHTMLImageEntity extends BaseSyntheticDOMNodeEntity<SyntheticDOMElement, HTMLImageElement> {

  private _newSrc: string;

  async load() {
    const src = this.source.getAttribute("src");

    // if src is an http url, ignore it
    if (/^https?:/.test(src)) {
      this._newSrc = src;
      return;
    }

    // set the src attribute to trigger a re-render
    this.source.setAttribute("src", src + "?" + Date.now());
    const importer = this.source.ownerDocument.defaultView.sandbox.importer;
    const absolutePath = await importer.resolve(src, this.source.ownerDocument.location.toString());
    importer.watchFile(absolutePath);

    this._newSrc = `${window.location.protocol}${window.location.host}/asset/${encodeURIComponent(absolutePath)}?${Date.now()}`;
  }

  render() {
    return <img {...omit(this.renderAttributes(), ["src"])} src={this._newSrc} />;
  }
}
