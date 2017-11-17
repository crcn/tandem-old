import { transpileToReactComponents } from "./module";

module.exports = function(source) {
  console.log(source);
  return transpileToReactComponents(source);
}