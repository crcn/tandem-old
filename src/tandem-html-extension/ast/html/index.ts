import { parse } from "./parser.peg";
export * from "./expressions";

export function parseHTML(content: string) {
  const ast = parse(content);
  ast.source = { content: content };
  return ast;
}