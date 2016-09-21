import * as ts from "typescript";
import { SymbolTable } from "tandem-common";

function evaluate(node: ts.Node): any {

  const context = <SymbolTable>this;

  switch (node.kind) {
    case ts.SyntaxKind.SourceFile: return evaluateSourceFile();
    case ts.SyntaxKind.Identifier: return evaluateIdentifier();
    case ts.SyntaxKind.NumericLiteral: return evaluateNumericLiteral();
    case ts.SyntaxKind.StringLiteral: return evaluateStringLiteral();
    case ts.SyntaxKind.VariableStatement: return evaluateVariableStatement();
    case ts.SyntaxKind.VariableDeclaration: return evaluateVariableDeclaration();
    default: throw new Error(`Cannot evaluate Typescript node kind ${node.kind}.`);
  }

  function evaluateSourceFile() {
    const sourceFile = <ts.SourceFile>node;
    const exports = {};
    sourceFile.statements.forEach((statement) => {

      const value = evaluate.call(context, statement);

      if (shouldExport(statement)) {
        Object.assign(exports, value);
      }
    });

    return exports;
  }

  function shouldExport(declaration: ts.Node) {
    return !!declaration.modifiers.find(modifier => modifier.kind === ts.SyntaxKind.ExportKeyword);
  }

  function evaluateVariableStatement() {
    const variableStatement = <ts.VariableStatement>node;
    const exports = {};
    variableStatement.declarationList.declarations.forEach((declaration) => {
      Object.assign(exports, evaluate.call(context, declaration));
    });
    return exports;
  }

  function evaluateVariableDeclaration() {
    const variableDeclaration = <ts.VariableDeclaration>node;
    const name = (<ts.Identifier>variableDeclaration.name).text;
    const value = variableDeclaration.initializer ? evaluate.call(context, variableDeclaration.initializer) : undefined;
    context.defineVariable(
      name,
      value
    );
    return { [name]: value };
  }

  function evaluateIdentifier() {
    const identifier = <ts.Identifier>node;
    return context.get(identifier.text);
  }

  function evaluateNumericLiteral() {
    return Number((<ts.LiteralExpression>node).text);
  }

  function evaluateStringLiteral() {
    return String((<ts.LiteralExpression>node).text);
  }
}

window["ts"] = ts;

export const evaluateTypescript = function(node: ts.Node, context?: SymbolTable) {
  return evaluate.call(context || new SymbolTable(), node);
};