import * as marked from "marked";
import { HTML_MIME_TYPE } from "@tandem/common";
import { evaluateMarkupAsync, parseMarkup } from "@tandem/synthetic-browser";
import { IBundleTransformer, IBundleTransformResult } from "@tandem/sandbox";

export class MarkdownBundleTransformer implements IBundleTransformer {
  async transform(content: string): Promise<IBundleTransformResult> {
    return {
      mimeType: HTML_MIME_TYPE,
      content: marked(content)
    };
  }
}