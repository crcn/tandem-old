import { CSSSelectorExpression, CSSStyleExpression } from "./expressions";
import { IHTMLNodeEntity }  from "../index";


export function getCSSSelection(selector: CSSSelectorExpression, root: IHTMLNodeEntity): Array<IHTMLNodeEntity> {
  return <Array<IHTMLNodeEntity>>root.flatten().filter(selector.test.bind(selector));
}