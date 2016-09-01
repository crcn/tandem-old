import { CSSSelectorExpression } from "./expressions";
import { IHTMLEntity }  from "../index";

export function getCSSSelection(selector: CSSSelectorExpression, root: IHTMLEntity) {
  return root.flatten().filter(selector.test.bind(selector));
}