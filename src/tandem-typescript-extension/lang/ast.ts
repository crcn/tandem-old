import * as ts from "typescript";

import {
  IRange,
  patchable,
  BaseASTNode,
} from "tandem-common";

export namespace entities {
  export class Literal {
    constructor(readonly value: any, readonly source: BaseTSExpression<any>) {

    }
  }
};

export abstract class BaseTSASTNode<T extends ts.Node> extends BaseASTNode<BaseTSASTNode<any>> {
  @patchable
  public tsNode: T;
  constructor(tsNode: T) {
    super({ start: tsNode.pos, end: tsNode.end });
    this.tsNode = tsNode;
  }
}

export interface IEntity {
  source: BaseASTNode<any>;
}

export abstract class BaseTSExpression<T extends ts.Expression> extends BaseTSASTNode<T> {
  abstract execute(context: any): IEntity;
}

export class TSRoot extends BaseTSASTNode<ts.SourceFile> {
  constructor(node: ts.SourceFile) {
    super(node);
    node.statements.forEach(child => this.appendChild(mapTSASTNode(child)));
  }
}

export class TSFunctionDeclaration extends BaseTSASTNode<ts.FunctionDeclaration> {
  constructor(node: ts.FunctionDeclaration) {
    super(node);
    this.appendChild(mapTSASTNode(node.name));
    node.parameters.forEach(child => this.appendChild(mapTSASTNode(child)));
    this.appendChild(mapTSASTNode(node.body));
  }

  get name(): BaseTSASTNode<any> {
    return this.children[0];
  }
}

export class TSIdentifier extends BaseTSASTNode<ts.Identifier> {
  public value: string;
  constructor(node: ts.Identifier) {
    super(node);
    this.value = node.text;
  }
}

export class TSReturnStatementExpression extends BaseTSASTNode<ts.ReturnStatement> {
  constructor(node: ts.ReturnStatement) {
    super(node);
    this.appendChild(mapTSASTNode(node.expression));
  }
}

export class TSBlockExpression extends BaseTSASTNode<ts.Block> {
  constructor(node: ts.Block) {
    super(node);
    node.statements.forEach(child => this.appendChild(mapTSASTNode(child)));
  }
}

export class TSJSXAttributeExpression extends BaseTSASTNode<ts.JsxAttribute> {
  readonly name: BaseTSASTNode<any>;
  public value: BaseTSASTNode<any>;
  constructor(node: ts.JsxAttribute) {
    super(node);
    this.appendChild(this.name = mapTSASTNode(node.name));
    this.appendChild(this.value = mapTSASTNode(node.initializer));
  }
}

export class TSLiteral extends BaseTSExpression<ts.StringLiteral> {
  public value: any;
  constructor(node: ts.StringLiteral) {
    super(node);
    this.value = node.text;
  }
  execute(context: any): IEntity {
    return new entities.Literal(this.value, this);
  }
}

export class TSJSXElement extends BaseTSASTNode<ts.JsxElement|ts.JsxSelfClosingElement> {
  public name: BaseTSASTNode<any>;
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
  execute(context: any): IEntity {
    // return html.entities.VirtualElement(this.name, )
    return null;
  }
}

export class TSImportExpression extends BaseTSASTNode<ts.ImportDeclaration> {
  constructor(node: ts.ImportDeclaration) {
    super(node);
    this.appendChild(mapTSASTNode(node.moduleSpecifier));
  }

  get moduleSpecifier(): BaseTSASTNode<any> {
    return this.children[0];
  }
}

export class TSStatementExpression extends BaseTSASTNode<ts.ExpressionStatement> {
  constructor(node: ts.ExpressionStatement) {
    super(node);
    this.appendChild(mapTSASTNode(node.expression));
  }

  get targetExpression(): BaseTSASTNode<any> {
    return this.children[0];
  }
}

export class TSCallExpression extends BaseTSASTNode<ts.CallExpression> {
  constructor(node: ts.CallExpression) {
    super(node);
    this.appendChild(mapTSASTNode(node.expression));
    node.arguments.forEach(argument => this.appendChild(mapTSASTNode(argument)));
  }
}

export class TSPropertyAccessExpression extends BaseTSASTNode<ts.PropertyAccessExpression> {
  constructor(node: ts.PropertyAccessExpression) {
    super(node);
    this.appendChild(mapTSASTNode(node.expression));
    this.appendChild(mapTSASTNode(node.name));
  }

  get targetExpression(): BaseTSASTNode<any> {
    return this.children.find(child => child.tsNode === this.tsNode.expression);
  }
}

export class TSPostfixUnaryExpression extends BaseTSASTNode<ts.PostfixUnaryExpression> {

}

export class TSEmptyExpression extends BaseTSASTNode<ts.PostfixUnaryExpression> {

}

export function mapTSASTNode(node: ts.Node): BaseTSASTNode<any> {

  const clazz = {
    [ts.SyntaxKind.Block]                    : TSBlockExpression,
    [ts.SyntaxKind.SourceFile]               : TSRoot,
    [ts.SyntaxKind.JsxElement]               : TSJSXElement,
    [ts.SyntaxKind.Identifier]               : TSIdentifier,
    [ts.SyntaxKind.JsxAttribute]             : TSJSXAttributeExpression,
    [ts.SyntaxKind.StringLiteral]            : TSLiteral,
    [ts.SyntaxKind.CallExpression]           : TSCallExpression,
    [ts.SyntaxKind.EmptyStatement]           : TSEmptyExpression,
    [ts.SyntaxKind.ReturnStatement]          : TSReturnStatementExpression,
    [ts.SyntaxKind.ImportDeclaration]        : TSImportExpression,
    [ts.SyntaxKind.ExpressionStatement]      : TSStatementExpression,
    [ts.SyntaxKind.FunctionDeclaration]      : TSFunctionDeclaration,
    [ts.SyntaxKind.JsxSelfClosingElement]    : TSJSXElement,
    [ts.SyntaxKind.PostfixUnaryExpression]   : TSPostfixUnaryExpression,
    [ts.SyntaxKind.PropertyAccessExpression] : TSPropertyAccessExpression,
  }[node.kind] as { new(node: ts.Node): BaseTSASTNode<any> };

  if (!clazz) {
    throw new Error(`Cannot map TS ast kind ${node.kind} to expression.`);
  }

  return new clazz(node);
}