import {
  BundleDependency,
  IBundleLoader,
  BaseBundleLoader,
  IBundleLoaderResult,
} from "@tandem/sandbox";

import { CSS_MIME_TYPE } from "@tandem/common";

import {
  parseCSS,
} from "@tandem/synthetic-browser";

export class CSSBundleLoader extends BaseBundleLoader {
  async load(filePath, { type, content, map }): Promise<IBundleLoaderResult> {
    /*const content = this.content.replace(/url\(['"]?(.*?)['"]?\)/g, (match, filePath) => {
      return `url("http://${window.location.host}/asset/` + encodeURIComponent(path.join(path.dirname(this.filePath), filePath.split(/\?|#/).shift())) + '")';
    });*/

    return {
      type: CSS_MIME_TYPE,
      ast: parseCSS(content, map),
      map: map,
      content: content
    };
  }
}