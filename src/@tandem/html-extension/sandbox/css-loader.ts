import {
  Dependency,
  IDependencyLoader,
  BaseDependencyLoader,
  IDependencyLoaderResult,
} from "@tandem/sandbox";

import { CSS_MIME_TYPE } from "@tandem/common";

import {
  parseCSS,
} from "@tandem/synthetic-browser";

export class CSSDependencyLoader extends BaseDependencyLoader {
  async load({ uri }, { type, content, map }): Promise<IDependencyLoaderResult> {
    /*const content = this.content.replace(/url\(['"]?(.*?)['"]?\)/g, (match, uri) => {
      return `url("http://${window.location.host}/asset/` + encodeURIComponent(path.join(path.dirname(this.uri), uri.split(/\?|#/).shift())) + '")';
    });*/

    return {
      type: CSS_MIME_TYPE,
      ast: parseCSS(content, map),
      map: map,
      content: content
    };
  }
}