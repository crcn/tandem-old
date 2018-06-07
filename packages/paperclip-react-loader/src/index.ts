import * as fs from "fs";
import * as path from "path";
import { translatePaperclipModuleToReact } from "paperclip-react-compiler";
import * as migrate from "paperclip-migrator";
import { openPCConfig, loadFSDependencyGraphSync } from "paperclip";

// TODO - use options for
module.exports = function(source) {
  this.cacheable && this.cacheable();
  const callback = this.async();
  const uri = this.resource;
  const config = openPCConfig(path.dirname(uri));
  const graph = loadFSDependencyGraphSync(config, process.cwd(), migrate);
  const entry = graph["file://" + uri];

  callback(null, translatePaperclipModuleToReact(entry, graph));
};
