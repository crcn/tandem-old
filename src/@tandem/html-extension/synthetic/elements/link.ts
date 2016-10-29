import {
  CSS_MIME_TYPE,
  HTML_MIME_TYPE,
  serialize,
  deserialize
} from "@tandem/common";

import {
  SyntheticHTMLElement,
  SyntheticCSSStyleSheet
} from "@tandem/synthetic-browser";
import * as path from "path";

const _cache = {};

export class SyntheticHTMLLink extends SyntheticHTMLElement {

  public stylesheet: SyntheticCSSStyleSheet;
  public import: SyntheticHTMLElement;

  createdCallback() {
    this.attachShadow({ mode: "open" });
    const window = this.ownerDocument.defaultView;
    const rel     = this.getAttribute("rel") || "stylesheet";
    const href    = this.getAttribute("href");

    // Odd chunk of code.
    // Elements that are evaluated are created in a sandbox, which require pre-loaded
    // bundles for them to execute. Therefore it's okay to fetch a bundle here synchronously
    // because it *must* exist for the createCallback to be called. for deserialized instances,
    // this method is never called anyways because deserialization implies that we're restoring the
    // element to its original state -- another method is called instead.
    const dependencyHash = this.module.bundle.getDependencyHash(href);

    let value: any;

    // TODO - possible serialize content here if there are no side effects
    this[rel] = this.module.sandbox.require(dependencyHash);

    if (this.stylesheet) {
      this.ownerDocument.styleSheets.push(this.stylesheet);
    } else if (this.import) {
      const shadow = this.attachShadow({ mode: "open" });
      this.import.querySelectorAll("*").forEach((element) => {

        // only include importable elements -- this reduces the number of traversable
        // items, which thus speeds up the app
        if (/style|link|template/.test(element.tagName)) {
          shadow.appendChild(element);
        }
      });
    }
  }
}