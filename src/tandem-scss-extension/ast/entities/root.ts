import { CSSRootEntity } from "tandem-html-extension";
import { SCSSFile } from "tandem-scss-extension/models";
import { SCSSImportEntity, SCSSRootExpression } from "tandem-scss-extension/ast";
import * as sass from "sass.js";
import * as path from "path";
import { ReadFileAction, File, MainBusDependency } from "tandem-common";

export class SCSSRootEntity extends CSSRootEntity {

  public document: SCSSFile;

  loadCSS(context: any) {

    if (this.document.imported) return Promise.resolve(this.document.content);

    sass.importer(async (request, done) => {
      const filePath = request.path || path.join(
        path.dirname((<File>this.source.source).path),
        request.current
      );

      done(await ReadFileAction.execute({
        path: filePath
      }, MainBusDependency.getInstance(context.dependencies)));
    });

    return new Promise((resolve, reject) => {
      sass.compile(this.document.content, {}, (result) => {
        resolve(String(result.text));
      });
    });
  }
}


