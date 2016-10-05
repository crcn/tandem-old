import { CSSExpressionLoader } from "@tandem/html-extension";
import { parseSass } from "./parser";
import { IASTNode } from "@tandem/common";

export class SassExpressionLoader extends CSSExpressionLoader {
  parseContent(content: string) {
    return parseSass(content);
  }
}