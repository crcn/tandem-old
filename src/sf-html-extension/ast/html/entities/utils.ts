import { IHTMLEntity } from "./base";


export function disposeEntity(entity: IHTMLEntity) {
  if (entity.parent) {
    const childNodes = (<IHTMLEntity><any>entity.parent).source.children;
    console.log(entity.source);
    childNodes.splice(childNodes.indexOf(<any>entity.source), 1);
    entity.parent.removeChild(entity);
  }
}
