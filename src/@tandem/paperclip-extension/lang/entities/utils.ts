import { IEntity } from "@tandem/common/lang";

export function parseBlockScript(value: string) {
  return new Function("context", `with(context) { return (${value}); }`);
}