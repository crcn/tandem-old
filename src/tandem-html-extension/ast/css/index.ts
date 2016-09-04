import { parse } from "./parser.peg";

export { parse as parseCSS };
export * from "./expressions";
export * from "./entities";
export * from "./utils";

import { CSSStyleExpression } from "./expressions";

export function parseCSSStyle(source): CSSStyleExpression {
  return parse(`style {${source}}`).rules[0].style;
}