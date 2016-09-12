import { CSSExpressionLoader } from "tandem-html-extension";
import { parseSCSS } from "./parser";
import { IExpression } from "tandem-common";

export class SCSSExpressionLoader extends CSSExpressionLoader {
  async parseContent(content: string): Promise<IExpression> {
    return parseSCSS(content);
  }
}