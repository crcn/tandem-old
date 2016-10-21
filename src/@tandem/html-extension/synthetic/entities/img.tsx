import { omit } from "lodash";
import { inject } from "@tandem/common";
import * as path from "path";
import * as React from "react";
import { Bundler, BundlerDependency } from "@tandem/sandbox";
import { BaseDOMNodeEntity, SyntheticDOMElement } from "@tandem/synthetic-browser";

export class HTMLImageEntity extends BaseDOMNodeEntity<SyntheticDOMElement, HTMLImageElement> {

  @inject(BundlerDependency.NS)
  private _bundler: Bundler;

  private _src: string;

  async load() {
    const src = this.source.getAttribute("src");

    // // if src is an http url, ignore it
    if (/^https?:/.test(src)) {
      return this._src = src;
    }

    const bundle = this._bundler.findByFilePath(src);

    if (bundle) {
      // this._src = bundle.sourceFileCache.url;
    } else {
      this._src = src;
    }
  }

  render() {
    return <img {...omit(this.renderAttributes(), ["src"])} src={this._src} />;
  }
}
