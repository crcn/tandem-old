import * as postcss from "postcss";
import * as sassSyntax  from "postcss-scss";
import { convertPostCSSAST } from "@tandem/html-extension";
import { SassRootExpression, SassImportExpression } from "./ast";

const expressionClasses = {
  root   : SassRootExpression
};

export function parseSass(source: string) {
  const root = postcss().process(source, { syntax: sassSyntax }).root;
  return convertPostCSSAST(root, expressionClasses);
}
