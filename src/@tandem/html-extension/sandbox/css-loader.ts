import {
  IBundleLoader,
  IBundleLoaderResult
} from "@tandem/sandbox";

import {CSS_AST_MIME_TYPE } from "@tandem/html-extension/constants";

import {
  parseCSS,
} from "@tandem/synthetic-browser";

export class CSSBundleLoader implements IBundleLoader {
  async load(bundle, { type, value }): Promise<IBundleLoaderResult> {
    return {
      type: CSS_AST_MIME_TYPE,
      value: parseCSS(value)
    };
  }
}