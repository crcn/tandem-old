import { BaseExpressionLoader } from "tandem-common";
import { parseTypescript } from "./parser";

export class TSExpressionLoader extends BaseExpressionLoader {
  parseContent(content: string) {
    return parseTypescript(content);
  }
}