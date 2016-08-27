import { IHTMLEntity } from "./base";


export function disposeEntity(entity: IHTMLEntity) {
  console.log("dispose", entity, entity.parentNode);
  if (entity.parentNode) {
    const childNodes = (<IHTMLEntity><any>entity.parentNode).source.childNodes;
    childNodes.splice(childNodes.indexOf(<any>entity.source), 1);
    entity.parentNode.removeChild(entity);
  }
}
