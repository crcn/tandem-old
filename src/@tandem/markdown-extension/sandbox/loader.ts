import * as marked from "marked";
import { HTML_MIME_TYPE } from "@tandem/common";
import { IBundleLoader, IBundleLoaderResult } from "@tandem/sandbox";

export class MarkdownBundleLoader implements IBundleLoader {
  async load(bundle, { type, content }): Promise<IBundleLoaderResult> {
    return {
      type: HTML_MIME_TYPE,
      content: marked(content)
    };
  }
}