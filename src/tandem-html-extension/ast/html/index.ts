import { parse } from "./parser.peg";
import { HTMLASTStringFormatter } from "./formatter";

export * from "./expressions";
export { HTMLASTStringFormatter };
import { bindProperty } from "tandem-common/observable";

export function parseHTML(content: string) {
  const ast = parse(content);
  ast.source = { content: content };
  return ast;
}