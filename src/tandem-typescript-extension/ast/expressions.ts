import * as ts from "typescript";

import {
  IRange,
  BaseExpression,
} from "tandem-common";

export abstract class BaseTSExpression extends BaseExpression<BaseTSExpression> {
  constructor(readonly tsNode: ts.Node) {
    super({ start: tsNode.pos, end: tsNode.end });
  }
}

export class TSRootExpression extends BaseTSExpression {
  constructor(node: ts.SourceFile) {
    super(node);
    node.statements.forEach(child => this.appendChild(mapTSASTNode(child)));
  }
}

export class TSFunctionDeclarationExpression extends BaseTSExpression {
  constructor(node: ts.FunctionDeclaration) {
    super(node);
    this.appendChild(mapTSASTNode(node.name));
    node.parameters.forEach(child => this.appendChild(mapTSASTNode(child)));
    this.appendChild(mapTSASTNode(node.body));
  }
}

export class TSIdentifierExpression extends BaseTSExpression {
  public value: string;
  constructor(node: ts.Identifier) {
    super(node);
    this.value = node.text;
  }
}

export class TSReturnStatementExpression extends BaseTSExpression {
  constructor(node: ts.ReturnStatement) {
    super(node);
    this.appendChild(mapTSASTNode(node.expression));
  }
}

export class TSBlockExpression extends BaseTSExpression {
  constructor(node: ts.Block) {
    super(node);
    node.statements.forEach(child => this.appendChild(mapTSASTNode(child)));
  }
}

export class TSJSXAttributeExpression extends BaseTSExpression {
  readonly name: BaseTSExpression;
  public value: BaseTSExpression;
  constructor(node: ts.JsxAttribute) {
    super(node);
    this.appendChild(this.name = mapTSASTNode(node.name));
    this.appendChild(this.value = mapTSASTNode(node.initializer));
  }
}

export class TSLiteralExpression extends BaseTSExpression {
  public value: any;
  constructor(node: ts.StringLiteral) {
    super(node);
    this.value = node.text;
  }
}

export class TSJSXElementExpression extends BaseTSExpression {
  public name: BaseTSExpression;
  constructor(node: any) {
    super(node);
    if (node.kind === ts.SyntaxKind.JsxSelfClosingElement) {
      const target: ts.JsxSelfClosingElement = node;
      this.appendChild(this.name = mapTSASTNode(target.tagName));
      target.attributes.forEach(child => this.appendChild(mapTSASTNode(child)));
    } else if (node.kind === ts.SyntaxKind.JsxOpeningElement) {
      const target: ts.JsxElement = node;
      this.appendChild(this.name = mapTSASTNode(target.openingElement.tagName));
      target.openingElement.attributes.forEach(child => this.appendChild(mapTSASTNode(child)));
      target.children.forEach(child => this.appendChild(mapTSASTNode(child)));
    }
  }
}

export class TSImportExpression extends BaseTSExpression {
  constructor(node: ts.ImportDeclaration) {
    super(node);
    this.appendChild(mapTSASTNode(node.moduleSpecifier));
  }

  get moduleSpecifier(): BaseTSExpression {
    return this.children[0];
  }
}

export class TSStatementExpression extends BaseTSExpression {
  constructor(node: ts.ExpressionStatement) {
    super(node);
    this.appendChild(mapTSASTNode(node.expression));
  }

  get targetExpression(): BaseTSExpression {
    return this.children[0];
  }
}

export class TSCallExpression extends BaseTSExpression {
  constructor(node: ts.CallExpression) {
    super(node);
    this.appendChild(mapTSASTNode(node.expression));
    node.arguments.forEach(argument => this.appendChild(mapTSASTNode(argument)));
  }
}

export class TSPropertyAccessExpression extends BaseTSExpression {
  constructor(node: ts.PropertyAccessExpression) {
    super(node);
    this.appendChild(mapTSASTNode(node.expression));
    this.appendChild(mapTSASTNode(node.name));
  }
}

export function mapTSASTNode(node: ts.Node): BaseTSExpression {

  const clazz = {
    [ts.SyntaxKind.Block]                    : TSBlockExpression,
    [ts.SyntaxKind.SourceFile]               : TSRootExpression,
    [ts.SyntaxKind.JsxElement]               : TSJSXElementExpression,
    [ts.SyntaxKind.Identifier]               : TSIdentifierExpression,
    [ts.SyntaxKind.JsxAttribute]             : TSJSXAttributeExpression,
    [ts.SyntaxKind.StringLiteral]            : TSLiteralExpression,
    [ts.SyntaxKind.CallExpression]           : TSCallExpression,
    [ts.SyntaxKind.ReturnStatement]          : TSReturnStatementExpression,
    [ts.SyntaxKind.ImportDeclaration]        : TSImportExpression,
    [ts.SyntaxKind.ExpressionStatement]      : TSStatementExpression,
    [ts.SyntaxKind.FunctionDeclaration]      : TSFunctionDeclarationExpression,
    [ts.SyntaxKind.JsxSelfClosingElement]    : TSJSXElementExpression,
    [ts.SyntaxKind.PropertyAccessExpression] : TSPropertyAccessExpression,
  }[node.kind] as { new(node: ts.Node): BaseTSExpression };

  if (!clazz) {
    throw new Error(`Cannot map TS ast kind ${node.kind} to expression.`);
  }

  return new clazz(node);
}