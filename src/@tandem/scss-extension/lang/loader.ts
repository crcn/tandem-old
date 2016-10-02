import { CSSExpressionLoader } from "@tandem/html-extension";
import { parseSCSS } from "./parser";
import { IASTNode } from "@tandem/common";

export class SCSSExpressionLoader extends CSSExpressionLoader {
  parseContent(content: string) {
    return parseSCSS(content);
  }
}