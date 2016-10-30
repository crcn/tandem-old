import * as path from "path";
import * as sass from "node-sass";
import { inject, CSS_MIME_TYPE, isMaster, Queue } from "@tandem/common";

import { evaluateCSS, SyntheticWindow } from "@tandem/synthetic-browser";
import {
  Bundle,
  FileCache,
  IFileResolver,
  IBundleLoader,
  IBundleLoaderResult,
  FileCacheProvider,
  FileResolverProvider,
} from "@tandem/sandbox";


export class SCSSLoader implements IBundleLoader {

  @inject(FileCacheProvider.ID)
  private _fileCache: FileCache;

  @inject(FileResolverProvider.ID)
  private _fileResolver: IFileResolver;

  async load(filePath, { type, content }): Promise<any> {

    const importer = (url, prev, done) => {
      new Promise(async (resolve) => {
        const filePath = await this._fileResolver.resolve(url, path.dirname(prev), {

          // TODO: this should be left up to the resolver.
          extensions: [".scss", ".css"],
          directories: []
        });

        const content = await (await this._fileCache.item(filePath)).read();

        resolve(content);
      }).then(done);
    }

    return new Promise((resolve, reject) => {
      sass.render({
        file: filePath,
        data: content,
        importer: importer
      }, (error, result) => {
        if (error) return reject(error);

        resolve({
          type: CSS_MIME_TYPE,
          map: JSON.stringify(result.map) as any,
          content: result.css.toString()
        } as IBundleLoaderResult);
      });
    });

  }
}
