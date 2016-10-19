import * as path from "path";
import * as sass from "sass.js";
import { CSS_AST_MIME_TYPE } from "@tandem/html-extension";
import { inject } from "@tandem/common";
import { parseCSS, evaluateCSS, SyntheticWindow, CSSExpression } from "@tandem/synthetic-browser";
import {
  Bundle,
  FileCache,
  IFileResolver,
  IBundleLoader,
  IBundleLoaderResult,
  FileCacheDependency,
  FileResolverDependency,
} from "@tandem/sandbox";


// TODO - SCSSModuleLoader

export class SCSSLoader implements IBundleLoader {

  @inject(FileCacheDependency.NS)
  private _fileCache: FileCache;

  @inject(FileResolverDependency.NS)
  private _fileResolver: IFileResolver;

  async load(bundle: Bundle, { type, value }): Promise<any> {
    sass.importer(async (request, done) => {
      const filePath = request.path || await this._fileResolver.resolve(request.current, path.dirname(bundle.filePath));
      const content = await (await this._fileCache.item(filePath)).read();
      done({ path: filePath, content: content || " " });
    });

    return new Promise((resolve, reject) => {
      sass.compile(value, {}, (result) => {

        // 3 = empty string exception
        if (result.status !== 0 && result.status !== 3) return reject(result);
        resolve({
          type: CSS_AST_MIME_TYPE,
          value: parseCSS(result.text || "")
        } as IBundleLoaderResult);
      });
    });
  }
}
