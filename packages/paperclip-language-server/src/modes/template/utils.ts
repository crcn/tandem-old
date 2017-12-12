import { PCParent, PCExpression, traversePCAST, ExpressionLocation, PCExpressionType, PCElement } from "paperclip";
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

export const getAncestors = (ast: PCExpression, root: PCExpression): PCElement[] => {
  const pcm = setChildParentMap(root, new Map());
  let p = pcm.get(ast);
  let ancestors = [];
  while(p) {
    ancestors.push(p);
    p = pcm.get(p);
  }
  return ancestors;
}

const setChildParentMap = (parent: PCExpression, map: Map<PCExpression, PCExpression>) => {
  if (parent.type === PCExpressionType.FRAGMENT || parent.type === PCExpressionType.ELEMENT) {
    const parent2 = parent as PCParent;
    for (let i = 0, {length} = parent2.childNodes; i < length; i++) {
      const child = parent2.childNodes[i];
      map.set(child, parent2);
      setChildParentMap(child, map);
    }
  }
  return map;
}

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