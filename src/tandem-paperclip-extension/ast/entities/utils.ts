import { IEntity } from "tandem-common/ast";

export function parseBlockScript(value: string) {
  return new Function("context", `with(context) { return (${value}); }`);
}