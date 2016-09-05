import { CSSRuleExpression } from "./expressions";
import { IHTMLNodeEntity }  from "../index";


export function getCSSSelection(rule: CSSRuleExpression, root: IHTMLNodeEntity): Array<IHTMLNodeEntity> {
  return <Array<IHTMLNodeEntity>>root.flatten().filter((entity: IHTMLNodeEntity) => {
    return entity.section && (<Element>entity.section.targetNode).webkitMatchesSelector && (<Element>entity.section.targetNode).webkitMatchesSelector(rule.selector);
  });
}