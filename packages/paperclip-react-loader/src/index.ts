import * as fs from "fs";
import * as path from "path";
import { translatePaperclipModuleToReact } from "paperclip-react-compiler";
import * as migrate from "paperclip-migrator";
import { loadFSDependencyGraphSync } from "paperclip";
const loaderUtils = require("loader-utils");

// TODO - use options for
module.exports = function(source) {
  this.cacheable && this.cacheable();
  const callback = this.async();
  const uri = this.resource;
  const options = loaderUtils.getOptions(this) || {};
  const useHMR = options.hmr == null ? true : options.hmr;
  const graph = loadFSDependencyGraphSync(
    options.config,
    process.cwd(),
    migrate
  );
  const entry = graph["file://" + uri];

  let content = translatePaperclipModuleToReact(entry, graph);

  if (useHMR) {
    content +=
      `\n` +
      `if (module.hot) {\n` +
      `  module.hot.accept(function() { window.reload(); });` +
      `}`;
  }

  callback(null, content);
};
