import { parse } from "./index.peg";

export * from "./index.peg";
export * from "./expressions";

export function parseCSSStyle(source) {
  return parse(`style { ${source} }`).rules[0].style;
}