import * as postcss from "postcss";

import {
  IExpression,
  IRange
} from "tandem-common";

import {
  MediaExpression,
  CSSRootExpression,
  CSSRuleExpression,
  KeyframesExpression,
  CSSATRuleExpression,
  CSSCommentExpression,
  CSSDeclarationExpression,
} from "./expressions";

const defaultExpressionClasses = {
  // media     : MediaExpression,
  root      : CSSRootExpression,
  rule      : CSSRuleExpression,
  atrule    : CSSATRuleExpression,
  // keyframes : KeyframesExpression,
  comment   : CSSCommentExpression,
  decl      : CSSDeclarationExpression,
};

export function parseCSS(source: string, expressionClasses?: any): CSSRootExpression {
  return convertPostCSSAST(postcss.parse(source));
}

export function convertPostCSSAST(root: postcss.Root, expressionClasses: any = {}) {
  let previousLine = new Line({ start: 0, end: 0 });
  const lines = root.source.input.css.split("\n").map((line) => {
    const start = previousLine.position.end;
    return previousLine = new Line({ start: start, end: start + line.length + 1 });
  });
  const newRoot = _convertPostCSSAST(root, lines, root, Object.assign({}, defaultExpressionClasses, expressionClasses));
  newRoot.source = { content: root.source.input.css };
  return newRoot;
}


// used just for converting lines to positions
class Line {
  constructor(readonly position: IRange) {

  }
}

function _convertPostCSSAST(root: postcss.Container, lines: Array<Line>, currentNode: postcss.Container, expressionClasses: any) {

  const expressionClass = (expressionClasses[(<any>currentNode).name] || expressionClasses[currentNode.type]) as { new(node: postcss.Node, children: Array<IExpression>, position: IRange): IExpression };

  if (!expressionClass) {
    throw new Error(`Cannot find css expression type for ${currentNode.type}`);
  }

  const source    = root.source.input.css;
  const startLine = lines[currentNode.source.start.line - 1];
  const endLine   = currentNode.source.end ? lines[currentNode.source.end.line - 1] : null;

  const position = {
    start: startLine.position.start + currentNode.source.start.column - 1,
    end: endLine ? endLine.position.start + currentNode.source.end.column : source.length
  };

  return new expressionClass(currentNode, (currentNode.nodes || []).map((child) => _convertPostCSSAST(root, lines, <postcss.Container>child, expressionClasses)), position);
}


export function parseCSSStyle(source): CSSRuleExpression {
  return <CSSRuleExpression>parseCSS(`style {${source}}`).children[0];
}