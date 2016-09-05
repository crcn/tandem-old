import * as postcss from "postcss";
import * as scssSyntax  from "postcss-scss";
import { convertPostCSSAST } from "tandem-html-extension";

export async function parseSCSS(source: string) {
  const root = (await postcss().process(source, { syntax: scssSyntax })).root;
  return convertPostCSSAST(root);
}