import { transpileToReactComponents } from "./module";

module.exports = function(source, uri) {
  return transpileToReactComponents(source, uri);
}