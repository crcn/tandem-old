import * as path from "path";
import * as sass from "sass.js";
import { MimeTypes } from "../constants";
import { parseCSS, evaluateCSS } from "@tandem/synthetic-browser";
import { BaseModule, ModuleFactoryDependency } from "@tandem/sandbox";
import { MainBusDependency, MimeTypes as CommonMimeTypes } from "@tandem/common";

export class SCSSModule extends BaseModule {
  evaluate() {
    sass.importer(async (request, done) => {
      const filePath = request.path || path.join(
        path.dirname(this.fileName),
        request.current
      );

      done(await this.sandbox.importer.readFile(filePath));
    });

    return new Promise((resolve, reject) => {
      sass.compile(this.content, {}, (result) => {
        resolve(evaluateCSS(parseCSS(String(result.text))));
      });
    });
  }
}

export const scssModuleFactoryDependency = new ModuleFactoryDependency(CommonMimeTypes.CSS, MimeTypes.Sass, SCSSModule);