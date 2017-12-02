import { PCExpression, traversePCAST, ExpressionLocation, PCExpressionType } from "paperclip";
import { Range } from "vscode-languageserver/lib/main";


export const getExpressionAtPosition = (pos: number, ast: PCExpression, filter:(expr: PCExpression) => boolean = () => true) => {
  let found;

  traversePCAST(ast, (child) => {
    if (pos >= child.location.start.pos && pos < child.location.end.pos && filter(child)) {
      found = child;
    }
  });

  return found;
};

export const exprLocationToRange = (location: ExpressionLocation): Range => {
  return {
    start: {
      line: location.start.line - 1,
      character: location.start.column
    },
    end: {
      line: location.end.line - 1,
      character: location.end.column
    },
  }
}