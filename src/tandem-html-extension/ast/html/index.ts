import { parse } from "./parser.peg";
import { HTMLASTStringFormatter } from "./formatter";
export * from "./expressions";

export { HTMLASTStringFormatter };


export function parseHTML(content: string) {
  const ast = parse(content);

  // note that the formatter will manipulate the ast.source.content property
  // if the AST changes to make sure that these two things stay in sync
  ast.source = { content: content };

  // all parsed content must come with a formatter to ensure that expressions don't
  // become dirty with out of sync positions and sources.
  ast.formatter = new HTMLASTStringFormatter(ast);
  return ast;
}