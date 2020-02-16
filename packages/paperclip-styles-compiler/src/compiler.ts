import { Node, getStyleElements, stringifyCSSSheet } from "paperclip";
import { createTranslateContext } from "./translate-utils";

type Params = {
  node: Node;
  sheet: any;
};

export const compile = ({ sheet }: Params, filePath: string) => {
  return stringifyCSSSheet(sheet, null);
};
