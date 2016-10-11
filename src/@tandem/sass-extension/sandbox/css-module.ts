import * as path from "path";
import * as sass from "sass.js";
import { parseCSS, evaluateCSS } from "@tandem/synthetic-browser";
import { BaseSandboxModule, SandboxModuleFactoryDependency } from "@tandem/sandbox";

export class SCSSModule extends BaseSandboxModule {
  compile() {
    sass.importer(async (request, done) => {
      const filePath = request.path || path.join(
        path.dirname(this.fileName),
        request.current
      );

      done(await this.sandbox.importer.readFile(filePath));
    });

    return new Promise((resolve, reject) => {
      sass.compile(this.content, {}, (result) => {
        resolve(() => evaluateCSS(parseCSS(String(result.text))));
      });
    });
  }
}