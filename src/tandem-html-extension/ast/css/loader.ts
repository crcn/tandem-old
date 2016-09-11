import {
  BaseExpressionLoader,
  Action
} from "tandem-common";

import { parseCSS } from "./parser";

export class CSSExpressionLoader extends BaseExpressionLoader {
  parseContent(content: string) {
    return parseCSS(content);
  }
  createFormattedSourceContent(action: Action) {
    return this.expression.toString();
  }
}