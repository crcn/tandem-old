import * as marked from "marked";
import { HTML_MIME_TYPE } from "@tandem/common";
import { IBundleLoader, IBundleLoaderResult } from "@tandem/sandbox";

export class MarkdownBundleLoader implements IBundleLoader {
  async load(bundle, { type, value }): Promise<IBundleLoaderResult> {
    return {
      type: HTML_MIME_TYPE,
      value: marked(value)
    };
  }
}