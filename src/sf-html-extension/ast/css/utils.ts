import { CSSSelectorExpression } from "./expressions";
import { IHTMLNodeEntity }  from "../index";

export function getCSSSelection(selector: CSSSelectorExpression, root: IHTMLNodeEntity) {
  return root.flatten().filter(selector.test.bind(selector));
}