import { IContextualEntity, IEntity } from "sf-core/ast";



export function parseBlockScript(value: string) {
  return new Function("context", `with(context) { return (${value}); }`);
}