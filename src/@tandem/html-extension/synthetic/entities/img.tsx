import { omit } from "lodash";
import * as React from "react";
import { BaseDOMNodeEntity, SyntheticDOMElement } from "@tandem/synthetic-browser";

export class HTMLImageEntity extends BaseDOMNodeEntity<SyntheticDOMElement, HTMLImageElement> {

  private _src: string;

  async load() {
    const src = this.source.getAttribute("src");

    // if src is an http url, ignore it
    if (/^https?:/.test(src)) {
      return this._src = src;
    }

    // set the src attribute to trigger a re-render
    const importer = this.source.ownerDocument.defaultView.sandbox.importer;
    const absolutePath = await importer.resolve(src, this.source.ownerDocument.location.toString());
    importer.watchFile(absolutePath);

    this._src = `${window.location.protocol}${window.location.host}/asset/${encodeURIComponent(absolutePath)}?${Date.now()}`;
  }

  render() {
    return <img {...omit(this.renderAttributes(), ["src"])} src={this._src} />;
  }
}
