import * as ts from "typescript";

import {
  IRange,
  patchable,
  BaseExpression,
} from "tandem-common";

export abstract class BaseTSExpression<T extends ts.Node> extends BaseExpression<BaseTSExpression<any>> {
  @patchable
  public tsNode: T;
  constructor(tsNode: T) {
    super({ start: tsNode.pos, end: tsNode.end });
    this.tsNode = tsNode;
  }
}

export class TSRootExpression extends BaseTSExpression<ts.SourceFile> {
  constructor(node: ts.SourceFile) {
    super(node);
    node.statements.forEach(child => this.appendChild(mapTSASTNode(child)));
  }
}

export class TSFunctionDeclarationExpression extends BaseTSExpression<ts.FunctionDeclaration> {
  constructor(node: ts.FunctionDeclaration) {
    super(node);
    this.appendChild(mapTSASTNode(node.name));
    node.parameters.forEach(child => this.appendChild(mapTSASTNode(child)));
    this.appendChild(mapTSASTNode(node.body));
  }
}

export class TSIdentifierExpression extends BaseTSExpression<ts.Identifier> {
  public value: string;
  constructor(node: ts.Identifier) {
    super(node);
    this.value = node.text;
  }
}

export class TSReturnStatementExpression extends BaseTSExpression<ts.ReturnStatement> {
  constructor(node: ts.ReturnStatement) {
    super(node);
    this.appendChild(mapTSASTNode(node.expression));
  }
}

export class TSBlockExpression extends BaseTSExpression<ts.Block> {
  constructor(node: ts.Block) {
    super(node);
    node.statements.forEach(child => this.appendChild(mapTSASTNode(child)));
  }
}

export class TSJSXAttributeExpression extends BaseTSExpression<ts.JsxAttribute> {
  readonly name: BaseTSExpression<any>;
  public value: BaseTSExpression<any>;
  constructor(node: ts.JsxAttribute) {
    super(node);
    this.appendChild(this.name = mapTSASTNode(node.name));
    this.appendChild(this.value = mapTSASTNode(node.initializer));
  }
}

export class TSLiteralExpression extends BaseTSExpression<ts.StringLiteral> {
  public value: any;
  constructor(node: ts.StringLiteral) {
    super(node);
    this.value = node.text;
  }
}

export class TSJSXElementExpression extends BaseTSExpression<ts.JsxElement|ts.JsxSelfClosingElement> {
  public name: BaseTSExpression<any>;
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

export class TSImportExpression extends BaseTSExpression<ts.ImportDeclaration> {
  constructor(node: ts.ImportDeclaration) {
    super(node);
    this.appendChild(mapTSASTNode(node.moduleSpecifier));
  }

  get moduleSpecifier(): BaseTSExpression<any> {
    return this.children[0];
  }
}

export class TSStatementExpression extends BaseTSExpression<ts.ExpressionStatement> {
  constructor(node: ts.ExpressionStatement) {
    super(node);
    this.appendChild(mapTSASTNode(node.expression));
  }

  get targetExpression(): BaseTSExpression<any> {
    return this.children[0];
  }
}

export class TSCallExpression extends BaseTSExpression<ts.CallExpression> {
  constructor(node: ts.CallExpression) {
    super(node);
    this.appendChild(mapTSASTNode(node.expression));
    node.arguments.forEach(argument => this.appendChild(mapTSASTNode(argument)));
  }
}

export class TSPropertyAccessExpression extends BaseTSExpression<ts.PropertyAccessExpression> {
  constructor(node: ts.PropertyAccessExpression) {
    super(node);
    this.appendChild(mapTSASTNode(node.expression));
    this.appendChild(mapTSASTNode(node.name));
  }

  get targetExpression(): BaseTSExpression<any> {
    return this.children.find(child => child.tsNode === this.tsNode.expression);
  }
}

export class TSPostfixUnaryExpression extends BaseTSExpression<ts.PostfixUnaryExpression> {

}

export class TSEmptyExpression extends BaseTSExpression<ts.PostfixUnaryExpression> {

}

export function mapTSASTNode(node: ts.Node): BaseTSExpression<any> {

  const clazz = {
    [ts.SyntaxKind.Block]                    : TSBlockExpression,
    [ts.SyntaxKind.SourceFile]               : TSRootExpression,
    [ts.SyntaxKind.JsxElement]               : TSJSXElementExpression,
    [ts.SyntaxKind.Identifier]               : TSIdentifierExpression,
    [ts.SyntaxKind.JsxAttribute]             : TSJSXAttributeExpression,
    [ts.SyntaxKind.StringLiteral]            : TSLiteralExpression,
    [ts.SyntaxKind.CallExpression]           : TSCallExpression,
    [ts.SyntaxKind.EmptyStatement]           : TSEmptyExpression,
    [ts.SyntaxKind.ReturnStatement]          : TSReturnStatementExpression,
    [ts.SyntaxKind.ImportDeclaration]        : TSImportExpression,
    [ts.SyntaxKind.ExpressionStatement]      : TSStatementExpression,
    [ts.SyntaxKind.FunctionDeclaration]      : TSFunctionDeclarationExpression,
    [ts.SyntaxKind.JsxSelfClosingElement]    : TSJSXElementExpression,
    [ts.SyntaxKind.PostfixUnaryExpression]   : TSPostfixUnaryExpression,
    [ts.SyntaxKind.PropertyAccessExpression] : TSPropertyAccessExpression,
  }[node.kind] as { new(node: ts.Node): BaseTSExpression<any> };

  if (!clazz) {
    throw new Error(`Cannot map TS ast kind ${node.kind} to expression.`);
  }

  return new clazz(node);
}