import * as ts from "typescript";
import * as rs from "./results";
import { flatten } from "lodash";
import { SyntheticFunction, SyntheticClass } from "./synthetic";
import {
  ISynthetic,
  ISyntheticFunction,
  IInstantiableSynthetic,
  SyntheticObject,
  SymbolTable,
  ArrayEntity,
  NativeFunction,
  SyntheticValueObject,
  JSXElement,
  mapEntityAsNative,
  mapNativeAsEntity,
  JSRootSymbolTable,
  JSXAttributeEntity,
} from "tandem-common/lang/synthetic";

function evaluate(node: ts.Node, context: SymbolTable): rs.Result<any> {

  switch (node.kind) {
    case ts.SyntaxKind.Block: return evaluateBlock();
    case ts.SyntaxKind.JsxText: return evaluateJSXText();
    case ts.SyntaxKind.SourceFile: return evaluateSourceFile();
    case ts.SyntaxKind.JsxElement: return evaluateJSXElement();
    case ts.SyntaxKind.PropertyDeclaration: return evaluatePropertyDeclaration();
    case ts.SyntaxKind.MethodDeclaration: return evaluateMethodDeclaration();
    case ts.SyntaxKind.Identifier: return evaluateIdentifier();
    case ts.SyntaxKind.TrueKeyword: return new rs.LiteralResult(new SyntheticValueObject(true));
    case ts.SyntaxKind.ThisKeyword: return new rs.LiteralResult(context.get("this"));
    case ts.SyntaxKind.NullKeyword: return new rs.LiteralResult(new SyntheticValueObject(null));
    case ts.SyntaxKind.JsxAttribute: return evaluateJSXAttribute();
    case ts.SyntaxKind.FalseKeyword: return new rs.LiteralResult(new SyntheticValueObject(false));
    case ts.SyntaxKind.ClassDeclaration: return evaluateClassDeclaration();
    case ts.SyntaxKind.Constructor: return evaluateConstructorDeclaration();
    case ts.SyntaxKind.ExpressionStatement: return evaluateExpressionStatement();
    case ts.SyntaxKind.NewExpression: return evaluateNewExpression();
    case ts.SyntaxKind.FalseKeyword: return new rs.LiteralResult(new SyntheticValueObject(false));
    case ts.SyntaxKind.StringLiteral: return new rs.LiteralResult(new SyntheticValueObject((<ts.LiteralExpression>node).text));
    case ts.SyntaxKind.ArrowFunction: return evaluateArrowFunction();
    case ts.SyntaxKind.JsxExpression: return evaluateJSXExpression();
    case ts.SyntaxKind.EmptyStatement: return new rs.VoidResult();
    case ts.SyntaxKind.VoidExpression: return new rs.LiteralResult(new SyntheticValueObject(void 0));
    case ts.SyntaxKind.NumericLiteral: return new rs.LiteralResult(new SyntheticValueObject(Number((<ts.LiteralExpression>node).text)));
    case ts.SyntaxKind.CallExpression: return evaluateCallExpression();
    case ts.SyntaxKind.ReturnStatement: return evaluateReturnStatement();
    case ts.SyntaxKind.BinaryExpression: return evaluateBinaryExpression();
    case ts.SyntaxKind.ImportDeclaration: return evaluateImportDeclaration();
    case ts.SyntaxKind.VariableStatement: return evaluateVariableStatement();
    case ts.SyntaxKind.PropertyAssignment: return evaluatePropertyAssignment();
    case ts.SyntaxKind.FunctionDeclaration: return evaluateFunctionDeclaration();
    case ts.SyntaxKind.VariableDeclaration: return evaluateVariableDeclaration();
    case ts.SyntaxKind.JsxSelfClosingElement: return evaluateJSXSelfClosingElement();
    case ts.SyntaxKind.ArrayLiteralExpression: return evaluateArrayLiteralExpression();
    case ts.SyntaxKind.ObjectLiteralExpression: return evaluateObjectLiteral();
    case ts.SyntaxKind.PropertyAccessExpression: return evaluatePropertyAccessExpression();
    case ts.SyntaxKind.ShorthandPropertyAssignment: return evaluateShorthandPropertyAssignment();
    default: throw new Error(`Cannot evaluate Typescript node kind ${node.getText()}:${node.kind}.`);
  }

  function evaluateSourceFile() {
    const sourceFile = <ts.SourceFile>node;
    const exports = new SymbolTable();
    sourceFile.statements.forEach((statement) => {

      const result = evaluate(statement, context) as rs.DeclarationResult;

      if (shouldExport(statement)) {
        exportDeclarations(result, exports);
      }
    });

    return new rs.ExportsResult(exports);
  }

  function exportDeclarations(result: rs.Result<any>, exports: ISynthetic) {
    if (result.kind === rs.ResultKind.List) {
      (<rs.ListResult>result).value.forEach((result) => {
        exportDeclarations(result, exports);
      });
    } else if (result.kind === rs.ResultKind.Declaration) {
      const declaration = <rs.DeclarationResult>result;
      exports.set(declaration.name, declaration.value);
    }
  }

  function evaluateJSXText() {
    const jsxText = <ts.JsxText>node;
    return new rs.LiteralResult(new SyntheticValueObject(jsxText.getText()));
  }

  function evaluateJSXExpression() {
    const jsxExpression = <ts.JsxExpression>node;
    return evaluate(jsxExpression.expression, context);
  }

  function evaluateJSXSelfClosingElement() {
    const jsxElement = <ts.JsxSelfClosingElement>node;
    return createJSXElementResult(
      jsxElement.tagName,
      jsxElement.attributes
    );
  }

  function evaluateImportDeclaration() {
    const importDeclaration = <ts.ImportDeclaration>node;
    return new rs.VoidResult();
  }

  function evaluateJSXElement() {
    const jsxElement = <ts.JsxElement>node;
    return createJSXElementResult(
      jsxElement.openingElement.tagName,
      jsxElement.openingElement.attributes,
      jsxElement.children
    );
  }

  function createJSXElementResult(nodeName: ts.Node, attributes: Array<ts.Node>, children: Array<ts.Node> = []) {

    // check for Component
    let evaluated = evaluate(nodeName, context).value;
    if (evaluated.value == null) {
      evaluated = getIdentifierEntity(nodeName);
    }

    return new rs.LiteralResult(new JSXElement(
      evaluated,
      new ArrayEntity(attributes.map((attribute) => evaluate(attribute, context).value)),
      new ArrayEntity(children.map((child) => evaluate(child, context).value))
    ));
  }

  function evaluateMethodDeclaration() {
    const methodDeclaration = <ts.MethodDeclaration>node;
    return evaluateArrowFunction();
  }

  function getIdentifierEntity(node: ts.Node) {
    return node.kind === ts.SyntaxKind.Identifier ? new SyntheticValueObject((<ts.Identifier>node).text) : evaluate(node, context).value;
  }

  function evaluateJSXAttribute() {
    const jsxAttribute = <ts.JsxAttribute>node;
    return new rs.LiteralResult(new JSXAttributeEntity(
      getIdentifierEntity(jsxAttribute.name),
      evaluate(jsxAttribute.initializer, context).value
    ));
  }

  function evaluateBinaryExpression() {
    const binaryExpression = <ts.BinaryExpression>node;

    if (binaryExpression.operatorToken.kind === ts.SyntaxKind.EqualsToken) {
      return evaluateAssignmentExpression();
    }

    const left = evaluate(binaryExpression.left, context).value.value;
    const right = evaluate(binaryExpression.right, context).value.value;
    let value;

    /* tslint:disable */
    switch (binaryExpression.operatorToken.kind) {

      // math
      case ts.SyntaxKind.PlusToken: value = left + right; break;
      case ts.SyntaxKind.MinusToken: value = left - right; break;
      case ts.SyntaxKind.SlashToken: value = left / right; break;
      case ts.SyntaxKind.AsteriskToken: value = left * right; break;
      case ts.SyntaxKind.PercentToken: value = left % right; break;

      // bool
      case ts.SyntaxKind.BarBarToken: value = left || right; break;
      case ts.SyntaxKind.LessThanToken: value = left < right; break;
      case ts.SyntaxKind.GreaterThanToken: value = left > right; break;
      case ts.SyntaxKind.EqualsEqualsToken: value = left == right; break;
      case ts.SyntaxKind.LessThanEqualsToken: value = left <= right; break;
      case ts.SyntaxKind.EqualsGreaterThanToken: value = left > right; break;
      case ts.SyntaxKind.GreaterThanEqualsToken: value = left >= right; break;
      case ts.SyntaxKind.ExclamationEqualsToken: value = left != right; break;
      case ts.SyntaxKind.EqualsEqualsEqualsToken: value = left === right; break;
      case ts.SyntaxKind.AmpersandAmpersandToken: value = left && right; break;
      case ts.SyntaxKind.ExclamationEqualsEqualsToken: value = left !== right; break;

      // bit
      case ts.SyntaxKind.AmpersandToken: value = left & right; break;
      case ts.SyntaxKind.CaretToken: value = left ^ right; break;
      case ts.SyntaxKind.BarToken: value = left | right; break;

      default: throw new Error(`Unknown binary token ${binaryExpression.operatorToken.getText()}:${binaryExpression.operatorToken.kind}.`);
    }
    /* tslint:enable */

    return new rs.LiteralResult(new SyntheticValueObject(value));
  }

  function evaluateAssignmentExpression() {
    const assignmentExpression = <ts.BinaryExpression>node;
    const { ctx, propertyName } = getReference(assignmentExpression.left);
    const value = evaluate(assignmentExpression.right, context).value;
    ctx.set(propertyName, value);
    return new rs.LiteralResult(value);
  }

  function getReference(node: ts.Node) {

    let propertyName: string;
    let ctx: ISynthetic;

    if (node.kind === ts.SyntaxKind.PropertyAccessExpression) {
      ctx = evaluate((<ts.PropertyAccessExpression>node).expression, context).value;
      propertyName = getIdentifierEntity((<ts.PropertyAccessExpression>node).name).value;
    } else if (node.kind === ts.SyntaxKind.Identifier) {
      ctx = context;
      propertyName = (<ts.Identifier>node).text;
    }

    return { ctx, propertyName };
  }

  function evaluateConstructorDeclaration() {
    return evaluateArrowFunction();
  }

  function evaluatePropertyAccessExpression() {
    const propertyAccessExpression = <ts.PropertyAccessExpression>node;
    const reference = <ISynthetic>evaluate(propertyAccessExpression.expression, context).value;
    return new rs.LiteralResult(reference.get(getIdentifierEntity(propertyAccessExpression.name).value));
  }

  function evaluateArrayLiteralExpression() {
    const arrayLiteralExpression = <ts.ArrayLiteralExpression>node;
    const value = arrayLiteralExpression.elements.map((element) => evaluate(element, context).value);
    return new rs.LiteralResult(new ArrayEntity(value));
  }

  function evaluateClassDeclaration() {
    const classDeclaration = <ts.ClassDeclaration>node;
    const name = classDeclaration.name.text;
    const syntheticClass = new SyntheticClass(classDeclaration, context, name);
    context.defineConstant(
      name,
      syntheticClass
    );

    return new rs.LiteralResult(syntheticClass);
  }

  function evaluateBlock() {
    const block = <ts.Block>node;
    for (const statement of block.statements) {
      const result = evaluate(statement, context);
      if (result.kind === rs.ResultKind.Return) {
        return result;
      }
    }
    return new rs.VoidResult();
  }

  function evaluatePropertyDeclaration() {
    const propertyDeclaration = <ts.PropertyDeclaration>node;
    return new rs.VoidResult();
  }

  function evaluateReturnStatement() {
    const returnStatement = <ts.ReturnStatement>node;
    return new rs.ReturnResult(evaluate(returnStatement.expression, context).value);
  }

  function shouldExport(declaration: ts.Node) {
    return !!(declaration.modifiers || []).find(modifier => modifier.kind === ts.SyntaxKind.ExportKeyword);
  }

  function evaluateExpressionStatement() {
    const expressionStatement = <ts.ExpressionStatement>node;
    return evaluate(expressionStatement.expression, context);
  }

  function evaluateVariableStatement() {
    const variableStatement = <ts.VariableStatement>node;
    const results = [];
    variableStatement.declarationList.declarations.forEach((declaration) => {
      results.push(evaluate(declaration, context));
    });
    return new rs.ListResult(results);
  }

  function evaluateVariableDeclaration() {
    const variableDeclaration = <ts.VariableDeclaration>node;
    return defineVariable(
      variableDeclaration.name,
      variableDeclaration.initializer ? evaluate(variableDeclaration.initializer, context).value : undefined
    );
  }

  function evaluateArrowFunction() {
    const arrowFunction = <ts.ArrowFunction>node;
    return new rs.LiteralResult(new SyntheticFunction(arrowFunction, context));
  }

  function defineVariable(name: ts.Node, value: ISynthetic): rs.Result<any> {
    if (name.kind === ts.SyntaxKind.Identifier) {
      const nameText = (<ts.Identifier>name).text;
      context.defineVariable(nameText, value);
      return new rs.DeclarationResult(nameText, value);
    } else if (name.kind === ts.SyntaxKind.ObjectBindingPattern) {
      const elements = (<ts.ObjectBindingPattern>name).elements;
      return new rs.ListResult(elements.map((element) => {
        const propertyName = element.propertyName ? getIdentifierEntity(element.propertyName).value : getIdentifierEntity(element.name).value;
        return defineVariable(element.name, value.get(propertyName));
      }));
    }
    return new rs.VoidResult();
  }

  function evaluateNewExpression() {
    const newExpression = <ts.NewExpression>node;
    const factory = <IInstantiableSynthetic>evaluate(newExpression.expression, context).value;
    return new rs.LiteralResult(factory.createInstance(evaluateCallArguments(newExpression.arguments)));
  }

  function evaluateIdentifier() {
    const identifier = <ts.Identifier>node;
    return new rs.LiteralResult(context.get(identifier.text));
  }

  function evaluateObjectLiteral() {
    const objectLiteral = <ts.ObjectLiteralExpression>node;
    const object = new SymbolTable();
    objectLiteral.properties.forEach((property) => {
      const { name, value } = evaluate(property, context) as rs.DeclarationResult;
      object.set(name, value);
    });
    return new rs.LiteralResult(object);
  }

  function evaluatePropertyAssignment() {
    const propertyAssignment = <ts.PropertyAssignment>node;
    return new rs.DeclarationResult(getIdentifierEntity(propertyAssignment.name).value,  evaluate(propertyAssignment.initializer, context).value);
  }

  function evaluateShorthandPropertyAssignment() {
    const shorthandPropertyAssignment = <ts.ShorthandPropertyAssignment>node;
    return null;
  }

  function evaluateFunctionDeclaration() {
    const functionDeclaration = <ts.FunctionDeclaration>node;

    const name = getIdentifierEntity(functionDeclaration.name).value;
    const value = new SyntheticFunction(functionDeclaration, context, name);

    context.defineConstant(name, value);
    return new rs.DeclarationResult(name, value);
  }

  function evaluateCallExpression() {
    const callExpression = <ts.CallExpression>node;
    const { ctx, propertyName } = getReference(callExpression.expression);
    return new rs.LiteralResult((<ISyntheticFunction>ctx.get(propertyName)).apply(ctx, evaluateCallArguments(callExpression.arguments)));
  }

  function evaluateCallArguments(callArgs: Array<ts.Node>) {
    const args = [];

    callArgs.forEach((argument) => {
      switch (argument.kind) {
        case ts.SyntaxKind.SpreadElementExpression:
          args.push(...evaluate((<ts.SpreadElementExpression>argument).expression, context).value);
        break;
        default:
          args.push(evaluate(argument, context).value);
        break;
      }
    });

    return args;
  }
}

window["ts"] = ts;

export const evaluateTypescript = function(node: ts.Node, context?: SymbolTable) {

  if (!context) {
    context = context || new JSRootSymbolTable();
  }

  return evaluate(node, context);
};