import {
  serialize,
  deserialize,
  CSS_MIME_TYPE,
  HTML_MIME_TYPE,
} from "@tandem/common";

import {
  SyntheticHTMLElement,
  SyntheticCSSStyleSheet
} from "@tandem/synthetic-browser";
import * as path from "path";

const _cache = {};

// refactor - all this stuff is janky, and hacked together just to get
// something to work.
export class SyntheticHTMLLink extends SyntheticHTMLElement {

  public stylesheet: SyntheticCSSStyleSheet;
  public import: SyntheticHTMLElement;

  private _addedToDocument: boolean;

  get href() {
    return this.getAttribute("href");
  }

  set href(value: string) {
    this.setAttribute("href", value);
    this.reload();
  }

  createdCallback() {
    const rel     = this.getAttribute("rel") || "stylesheet";
    const href    = this.getAttribute("href");
    if (href) this.reload();
  }

  attachedCallback() {
    this.attachStylesheet();
  }

  detachedCallback() {
    this.detachStylesheet();
  }

  private reload() {
    const rel     = (this.getAttribute("rel") || "stylesheet").toLowerCase();
    const href    = this.href;

    const dep = this.module && this.module.source.eagerGetDependency(href);
    let content, type;

    if (dep) {
      content = dep.content;
    } else {
      const result = parseDataURI(href);
      content = result && decodeURIComponent(result.content);
    }

    //  TODO - need to use fetch for this

    if (rel === "stylesheet") {
      this.stylesheet = this.stylesheet || new SyntheticCSSStyleSheet([]);
      this.stylesheet.$ownerNode = this;
      this.stylesheet.cssText = content || "";
      this.attachStylesheet();
    } else if (rel === "import") {
      this.attachShadow({ mode: "open" });

      // IMPLEMENT ME
      // // Elements that are evaluated are created in a sandbox, which require pre-loaded
      // // bundles for them to execute. Therefore it's okay to fetch a bundle here synchronously
      // // because it *must* exist for the createCallback to be called. for deserialized instances,
      // // this method is never called anyways because deserialization implies that we're restoring the
      // // element to its original state -- another method is called instead.
      // this[rel] = this.module.sandbox.evaluate(this.module.source.eagerGetDependency(href));

        // const shadow = this.attachShadow({ mode: "open" });
        // this.import.querySelectorAll("*").forEach((element) => {

        //   // only include importable elements -- this reduces the number of traversable
        //   // items, which thus speeds up the app
        //   if (/style|link|template/.test(element.tagName)) {
        //     shadow.appendChild(element);
        //   }
        // });
      }
  }

  private attachStylesheet() {
    if (this._addedToDocument || !this.ownerDocument || !this._attached || !this.stylesheet) return;
    this._addedToDocument = true;
    this.ownerDocument.styleSheets.push(this.stylesheet);
  }

  private detachStylesheet() {
    if (!this.ownerDocument || !this._attached || !this.stylesheet) return;
    this._addedToDocument = false;
    const index = this.ownerDocument.styleSheets.indexOf(this.stylesheet);
    if (index !== -1) {
      this.ownerDocument.styleSheets.splice(index, 1);
    }
  }
}



function parseDataURI(uri: string): { type: string, content: string } {
  const parts = uri.match(/data:(.*?),(.*)/);
  return parts && { type: parts[1], content: parts[2] };
}