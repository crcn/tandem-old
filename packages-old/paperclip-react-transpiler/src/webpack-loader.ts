import * as fs from "fs";
import { transpileToReactComponents } from "./module";
import { loadModuleDependencyGraph, inferNodeProps, lintDependencyGraph, DiagnosticType, generatePrettyErrorMessage } from "paperclip";

// TODO - use options for 
module.exports = function(source) {
  this.cacheable && this.cacheable();
  const callback = this.async();
  const uri = this.resource;

  const readFile = (suri) => {
    return Promise.resolve(suri === uri ? source : fs.readFileSync(suri, "utf8"))
  };

  loadModuleDependencyGraph(uri, {
    readFile
  }).then(async ({graph, diagnostics}) => {

    const allDiagnostics = [...diagnostics, ...lintDependencyGraph(graph).diagnostics];

    const error = allDiagnostics.find(diag => diag.type === DiagnosticType.ERROR);
    if (error) {
      return callback(new Error(generatePrettyErrorMessage(error, await readFile(error.filePath))));
    }

    callback(null, transpileToReactComponents(graph, uri));
  }, callback)
};
