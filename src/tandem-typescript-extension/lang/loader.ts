import { BaseASTNodeLoader } from "tandem-common";
import { parseTypescript } from "./parser";

export class TSExpressionLoader extends BaseASTNodeLoader {
  parseContent(content: string) {
    return parseTypescript(content);
  }
}