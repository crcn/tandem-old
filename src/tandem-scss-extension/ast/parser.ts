import * as postcss from "postcss";
import * as scssSyntax  from "postcss-scss";
import { convertPostCSSAST } from "tandem-html-extension";
import { SCSSRootExpression, SCSSImportExpression } from "./expressions";

const expressionClasses = {
  root   : SCSSRootExpression
};

export function parseSCSS(source: string) {
  const root = postcss().process(source, { syntax: scssSyntax }).root;
  return convertPostCSSAST(root, expressionClasses);
}
