import {
  Bundle,
  IBundleLoader,
  IBundleLoaderResult,
} from "@tandem/sandbox";

import { CSS_MIME_TYPE } from "@tandem/common";

import {
  parseCSS,
} from "@tandem/synthetic-browser";

export class CSSBundleLoader implements IBundleLoader {
  async load(bundle: Bundle, { type, value, map }): Promise<IBundleLoaderResult> {
    return {
      type: CSS_MIME_TYPE,
      ast: parseCSS(value, map),
      map: map,
      value: value
    };
  }
}