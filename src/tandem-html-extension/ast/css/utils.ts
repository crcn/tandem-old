import { CSSRootEntity } from "./entities";
import { CSSRuleExpression } from "./expressions";
import { IHTMLNodeEntity }  from "../index";
import { IEntity } from "tandem-common";


export function getCSSSelection(rule: CSSRuleExpression, root: IHTMLNodeEntity): Array<IHTMLNodeEntity> {
  return <Array<IHTMLNodeEntity>>root.flatten().filter((entity: IHTMLNodeEntity) => {
    return entity.section && (<Element>entity.section.targetNode).webkitMatchesSelector && (<Element>entity.section.targetNode).webkitMatchesSelector(rule.selector);
  });
}

export function getCSSRootEntities(entity: IEntity): Array<CSSRootEntity> {
  return entity.root.flatten().filter(entity => entity instanceof CSSRootEntity) as Array<CSSRootEntity>;
}

export function getCSSStyleContent(entity: IEntity) {
  return getCSSRootEntities(entity).map((entity) => entity.content).join("\n");
}