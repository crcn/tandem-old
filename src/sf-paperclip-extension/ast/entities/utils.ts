import { IContextualEntity, IEntity } from "sf-core/ast";

export function getContext(entity: IEntity) {
  let p = <IContextualEntity>entity.parent;
  while (p && !p.context) p = <IContextualEntity>p.parent;
  return p ? p.context || {} : {};
}

export function parseBlockScript(value: string) {
  return new Function("context", `with(context) { return (${value}); }`);
}