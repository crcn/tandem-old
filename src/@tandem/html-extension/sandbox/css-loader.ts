import {
  IBundleLoader,
  IBundleLoaderResult
} from "@tandem/sandbox";

import {CSS_AST_MIME_TYPE } from "@tandem/html-extension/constants";

import {
  parseCSS,
} from "@tandem/synthetic-browser";

export class CSSBundleLoader implements IBundleLoader {
  async load(bundle, { type, value, map }): Promise<IBundleLoaderResult> {
    console.log(arguments[0], bundle.filePath);
    return {
      type: CSS_AST_MIME_TYPE,
      value: parseCSS(value, map)
    };
  }
}