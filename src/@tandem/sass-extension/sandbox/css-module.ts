import * as path from "path";
import * as sass from "sass.js";
import { parseCSS, evaluateCSS } from "@tandem/synthetic-browser";
import { BaseSandboxModule, SandboxModuleFactoryDependency } from "@tandem/sandbox";

export class SCSSModule extends BaseSandboxModule {
  compile() {
    sass.importer(async (request, done) => {
      const filePath = request.path || await this.sandbox.importer.resolve(request.current, this.fileName);

      const content = await this.sandbox.importer.readFile(filePath);

      done({ path: filePath, content: content });
    });

    return new Promise((resolve, reject) => {
      sass.compile(this.content, {}, (result) => {
        if (!result.text) return reject(result);
        resolve(() => evaluateCSS(parseCSS(String(result.text))));
      });
    });
  }
}