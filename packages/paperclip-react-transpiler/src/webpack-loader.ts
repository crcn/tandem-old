import * as fs from "fs";
import { transpileToReactComponents } from "./module";
import { loadModuleDependencyGraph } from "paperclip";

// TODO - use options for 
module.exports = function(source) {
  this.cacheable && this.cacheable();
  const callback = this.async();
  const uri = this.resource;
  loadModuleDependencyGraph(uri, {
    readFile: (suri) => {
      return Promise.resolve(suri === uri ? source : fs.readFileSync(suri, "utf8"))
    }
  }).then((graph) => {
    callback(null, transpileToReactComponents(graph, uri));
  }, callback);
};
