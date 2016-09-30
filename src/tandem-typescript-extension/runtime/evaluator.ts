import * as ts from "typescript";
import * as rs from "./results";
import { flatten } from "lodash";
import { SyntheticFunction, SyntheticClass } from "./synthetic";
import {
  ISynthetic,
  SymbolTable,
  NativeFunction,
  SyntheticArray,
  EnvironmentKind,
  SyntheticObject,
  SyntheticString,
  SyntheticNumber,
  SyntheticRegExp,
  JSRootSymbolTable,
  ISyntheticFunction,
  SyntheticJSXElement,
  mapNativeAsSynthetic,
  SyntheticValueObject,
  SyntheticJSXAttribute,
  IInstantiableSynthetic,
} from "tandem-runtime";

function evaluate(node: ts.Node, context: SymbolTable): any {

  switch (node.kind) {
    case ts.SyntaxKind.Block: return evaluateBlock(<ts.Block>node);
    case ts.SyntaxKind.JsxText: return evaluateJSXText();
    case ts.SyntaxKind.SourceFile: return evaluateSourceFile();
    case ts.SyntaxKind.JsxElement: return evaluateSyntheticJSXElement();
    case ts.SyntaxKind.BreakStatement: return evaluateBreakStatement();
    case ts.SyntaxKind.ThrowStatement: return evaluateThrowStatement();
    case ts.SyntaxKind.PropertyDeclaration: return evaluatePropertyDeclaration();
    case ts.SyntaxKind.ConditionalExpression: return evaluateConditionalExpression();
    case ts.SyntaxKind.MethodDeclaration: return evaluateMethodDeclaration();
    case ts.SyntaxKind.ForStatement: return evaluateForStatement();
    case ts.SyntaxKind.ParenthesizedExpression: return evaluateParenthizedExpression();
    case ts.SyntaxKind.ElementAccessExpression: return evaluateElementAccessExpression();
    case ts.SyntaxKind.IfStatement: return evaluateIfStatement();
    case ts.SyntaxKind.Identifier: return evaluateIdentifier();
    case ts.SyntaxKind.ExportAssignment: return evaluateExportAssignment();
    case ts.SyntaxKind.ForInStatement: return evaluateForInStatement();
    case ts.SyntaxKind.FunctionExpression: return evaluateArrowFunction();
    case ts.SyntaxKind.InstanceOfKeyword: return evaluateInstanceOfKeyword();
    case ts.SyntaxKind.TrueKeyword: return new rs.LiteralResult(new SyntheticValueObject(true));
    case ts.SyntaxKind.ThisKeyword: return new rs.LiteralResult(context.get("this"));
    case ts.SyntaxKind.NullKeyword: return new rs.LiteralResult(new SyntheticValueObject(null));
    case ts.SyntaxKind.JsxAttribute: return evaluateJSXAttribute();
    case ts.SyntaxKind.FalseKeyword: return new rs.LiteralResult(new SyntheticValueObject(false));
    case ts.SyntaxKind.ClassDeclaration: return evaluateClassDeclaration();
    case ts.SyntaxKind.Constructor: return evaluateConstructorDeclaration();
    case ts.SyntaxKind.ExpressionStatement: return evaluateExpressionStatement();
    case ts.SyntaxKind.VariableDeclarationList: return evaluateVariableDeclarationList();
    case ts.SyntaxKind.TypeOfExpression: return evaluateTypeOfExpression();
    case ts.SyntaxKind.NewExpression: return evaluateNewExpression();
    case ts.SyntaxKind.FalseKeyword: return new rs.LiteralResult(new SyntheticValueObject(false));
    case ts.SyntaxKind.StringLiteral: return new rs.LiteralResult(new SyntheticValueObject((<ts.LiteralExpression>node).text));
    case ts.SyntaxKind.ArrowFunction: return evaluateArrowFunction();
    case ts.SyntaxKind.JsxExpression: return evaluateJSXExpression();
    case ts.SyntaxKind.EmptyStatement: return new rs.VoidResult();
    case ts.SyntaxKind.TryStatement: return evaluateTryStatement();
    case ts.SyntaxKind.VoidExpression: return new rs.LiteralResult(new SyntheticValueObject(void 0));
    case ts.SyntaxKind.NumericLiteral: return new rs.LiteralResult(new SyntheticValueObject(Number((<ts.LiteralExpression>node).text)));
    case ts.SyntaxKind.CallExpression: return evaluateCallExpression();
    case ts.SyntaxKind.ReturnStatement: return evaluateReturnStatement();
    case ts.SyntaxKind.BinaryExpression: return evaluateBinaryExpression();
    case ts.SyntaxKind.ImportDeclaration: return evaluateImportDeclaration();
    case ts.SyntaxKind.PrefixUnaryExpression: return evaluatePrefixUnaryExpression();
    case ts.SyntaxKind.PostfixUnaryExpression: return evaluatePostfixUnaryExpression();
    case ts.SyntaxKind.RegularExpressionLiteral: return evaluateRegularExpressionLiteral();
    case ts.SyntaxKind.VariableStatement: return evaluateVariableStatement();
    case ts.SyntaxKind.PropertyAssignment: return evaluatePropertyAssignment();
    case ts.SyntaxKind.FunctionDeclaration: return evaluateFunctionDeclaration();
    case ts.SyntaxKind.VariableDeclaration: return evaluateVariableDeclaration();
    case ts.SyntaxKind.JsxSelfClosingElement: return evaluateJSXSelfClosingElement();
    case ts.SyntaxKind.ArrayLiteralExpression: return evaluateArrayLiteralExpression();
    case ts.SyntaxKind.ObjectLiteralExpression: return evaluateObjectLiteral();
    case ts.SyntaxKind.PropertyAccessExpression: return evaluatePropertyAccessExpression();
    // case ts.SyntaxKind.ShorthandPropertyAssignment: return evaluateShorthandPropertyAssignment();
    default: throw new Error(`Cannot evaluate Typescript node kind ${node.getText()}:${node.kind}.`);
  }

  async function evaluateSourceFile() {
    const sourceFile = <ts.SourceFile>node;
    const exports = context.get("module").toNative() ? context.get("module").get("exports") : new SyntheticObject();

    for (const statement of sortStatements(sourceFile.statements)) {
      const result = await evaluate(statement, context);
      if (shouldExport(statement)) {
        exportDeclarations(result, exports);
      }
    }

    return new rs.ExportsResult(exports);
  }

  function sortStatements(statements: ts.Node[]): ts.Node[] {
    const functionStatements: ts.Node[] = [];
    const otherStatements: ts.Node[] = [];

    for (const statement of statements) {
      if (statement.kind === ts.SyntaxKind.FunctionDeclaration) {
        functionStatements.push(statement);
      } else {
        otherStatements.push(statement);
      }
    }

    return [...functionStatements, ...otherStatements];
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

  function evaluateInstanceOfKeyword() {
    console.log(node);
  }

  function evaluateJSXText() {
    const jsxText = <ts.JsxText>node;
    return new rs.LiteralResult(new SyntheticValueObject(jsxText.getText()));
  }

  function evaluateJSXExpression() {
    const jsxExpression = <ts.JsxExpression>node;
    return jsxExpression.expression ? evaluate(jsxExpression.expression, context) : new rs.LiteralResult(new SyntheticValueObject(undefined));
  }

  function evaluateJSXSelfClosingElement() {
    const jsxElement = <ts.JsxSelfClosingElement>node;
    return createSyntheticJSXElementResult(
      jsxElement.tagName,
      jsxElement.attributes
    );
  }

  function evaluateRegularExpressionLiteral() {
    const [source, flags] = (<ts.LiteralExpression>node).text.split("/").slice(1);
    return new rs.LiteralResult(new SyntheticRegExp(new RegExp(source, flags)));
  }

  function evaluatePrefixUnaryExpression() {
    const prefixUnaryExpression = <ts.PrefixUnaryExpression>node;
    const { ctx, propertyName } = getReference(prefixUnaryExpression.operand);
    let value = evaluate(prefixUnaryExpression.operand, context).value as SyntheticValueObject<any>;
    let setValue: boolean = false;
    switch (prefixUnaryExpression.operator) {
      case ts.SyntaxKind.PlusPlusToken:
        value = new SyntheticValueObject(value.toNative() + 1);
        setValue = true;
      break;
      case ts.SyntaxKind.MinusMinusToken:
        value = new SyntheticValueObject(value.toNative() - 1);
        setValue = true;
      break;
      case ts.SyntaxKind.ExclamationToken:
        value = new SyntheticValueObject(!value.toNative());
      break;
      case ts.SyntaxKind.MinusToken:
        value = new SyntheticValueObject(-value.toNative());
      break;
    }

    if (setValue) {
      ctx.set(propertyName, value);
    }

    return new rs.LiteralResult(value);
  }

  function evaluatePostfixUnaryExpression() {
    const prefixUnaryExpression = <ts.PrefixUnaryExpression>node;
    const { ctx, propertyName } = getReference(prefixUnaryExpression.operand);
    const value = evaluate(prefixUnaryExpression.operand, context).value as SyntheticValueObject<any>;

    let newValue;
    switch (prefixUnaryExpression.operator) {
      case ts.SyntaxKind.MinusMinusToken:
        newValue = new SyntheticValueObject(value.toNative() - 1);
      break;
      case ts.SyntaxKind.PlusPlusToken:
        newValue = new SyntheticValueObject(value.toNative() + 1);
      break;
    }
    ctx.set(propertyName, newValue);
    return new rs.LiteralResult(value);
  }

  function evaluateParenthizedExpression() {
    const parenthizedExpression = <ts.ParenthesizedExpression>node;
    return evaluate(parenthizedExpression.expression, context);
  }

  function evaluateConditionalExpression() {
    const conditionalExpression = <ts.ConditionalExpression>node;
    return evaluate(conditionalExpression.condition, context).value.toNative() ? evaluate(conditionalExpression.whenTrue, context) : evaluate(conditionalExpression.whenFalse, context);
  }

  function evaluateBreakStatement() {
    return new rs.BreakResult();
  }

  function evaluateForInStatement() {
    const forInStatement = <ts.ForInStatement>node;
    const target = evaluate(forInStatement.expression, context).value;
    const keys = SyntheticObject.keys(target);
    for (const key of keys) {
      defineVariable(forInStatement.initializer, new SyntheticString(key));
      const result = evaluate(forInStatement.statement, context);
      if (result.breaks) return result;
    }
    return new rs.VoidResult();
  }

  function evaluateIfStatement() {
    const ifStatement = <ts.IfStatement>node;

    if (evaluate(ifStatement.expression, context).value.toNative()) {
      return evaluate(ifStatement.thenStatement, context);
    } else if (ifStatement.elseStatement) {
      return evaluate(ifStatement.elseStatement, context);
    }
    return new rs.VoidResult();
  }

  function evaluateExportAssignment() {
    const exportAssignment = <ts.ExportAssignment>node;
    return new rs.DeclarationResult(exportAssignment.name ? exportAssignment.name.text : "default", evaluate(exportAssignment.expression, context).value);
  }

  function evaluateElementAccessExpression() {
    const elementAccessExpression = <ts.ElementAccessExpression>node;
    return new rs.LiteralResult(evaluate(elementAccessExpression.expression, context).value.get(evaluate(elementAccessExpression.argumentExpression, context).value));
  }

  async function evaluateImportDeclaration() {
    const importDeclaration = <ts.ImportDeclaration>node;
    const require = <ISyntheticFunction>context.get("import");
    const imports = await require.apply(context, [new SyntheticNumber(EnvironmentKind.JavaScript), evaluate(importDeclaration.moduleSpecifier, context).value]);

    if (importDeclaration.importClause) {

      const nameBindings = importDeclaration.importClause.namedBindings;
      const name         = importDeclaration.importClause.name;

      // import a from "./source"
      if (name) {
          context.defineConstant(name.text, imports.get("default"));

      // import { b, c } from "./source";
      } else if (nameBindings) {
        if (nameBindings.kind === ts.SyntaxKind.NamedImports) {
          for (const nameBinding of (<ts.NamedImports>nameBindings).elements) {
            const propertyName = nameBinding.name.text;
            context.defineConstant(propertyName, imports.get(propertyName));
          }

        // import * as s from "./source""
        } else if (nameBindings.kind === ts.SyntaxKind.NamespaceImport) {
          context.defineConstant((<ts.NamespaceImport>nameBindings).name.text, imports);
        }
      }
    }

    return new rs.VoidResult();
  }

  function evaluateTypeOfExpression() {
    const typeofExpression = <ts.TypeOfExpression>node;
    return new rs.LiteralResult(new SyntheticValueObject(typeof evaluate(typeofExpression.expression, context).value.toNative()));
  }

  function evaluateSyntheticJSXElement() {
    const jsxElement = <ts.JsxElement>node;
    return createSyntheticJSXElementResult(
      jsxElement.openingElement.tagName,
      jsxElement.openingElement.attributes,
      jsxElement.children
    );
  }

  function evaluateForStatement() {
    let i = 0;
    const forStatement = <ts.ForStatement>node;
    for (tryEvaluating(forStatement.initializer); tryEvaluating(forStatement.condition).value.toNative(); tryEvaluating(forStatement.incrementor)) {
      const result = evaluate(forStatement.statement, context);
      if (result.breaks) return result;
    }
    return new rs.VoidResult();
  }

  function tryEvaluating(node: ts.Node) {
    return node ? evaluate(node, context) : new rs.LiteralResult(new SyntheticValueObject(true));
  }

  function evaluateThrowStatement() {
    const throwStatement = <ts.ThrowStatement>node;
    throw evaluate(throwStatement.expression, context).value.toNative();
  }

  function createSyntheticJSXElementResult(nodeName: ts.Node, attributes: Array<ts.Node>, children: Array<ts.Node> = []) {

    // check for Component
    let evaluated = evaluate(nodeName, context).value;
    if (evaluated.value == null) {
      evaluated = getIdentifierSynthetic(nodeName);
    }

    return new rs.LiteralResult(new SyntheticJSXElement(
      evaluated,
      new SyntheticArray(...attributes.map((attribute) => evaluate(attribute, context).value)),
      new SyntheticArray(...children.map((child) => evaluate(child, context).value))
    ));
  }

  function evaluateMethodDeclaration() {
    const methodDeclaration = <ts.MethodDeclaration>node;
    return evaluateArrowFunction();
  }

  function getIdentifierSynthetic(node: ts.Node) {
    return node.kind === ts.SyntaxKind.Identifier ? new SyntheticValueObject((<ts.Identifier>node).text) : evaluate(node, context).value;
  }

  function evaluateJSXAttribute() {
    const jsxAttribute = <ts.JsxAttribute>node;
    return new rs.LiteralResult(new SyntheticJSXAttribute(
      getIdentifierSynthetic(jsxAttribute.name),
      jsxAttribute.initializer ? evaluate(jsxAttribute.initializer, context).value : new SyntheticValueObject(true)
    ));
  }

  function evaluateBinaryExpression() {
    const binaryExpression = <ts.BinaryExpression>node;

    if (binaryExpression.operatorToken.kind === ts.SyntaxKind.EqualsToken) {
      return evaluateAssignmentExpression();
    }

    let _left: ISynthetic;
    let _right: ISynthetic;

    function eleft() {
      return _left || (_left = evaluate(binaryExpression.left, context).value);
    }

    function eright() {
      return _right || (_right = evaluate(binaryExpression.right, context).value);
    }

    let value;
    let assignLeft = false;

    /* tslint:disable */
    switch (binaryExpression.operatorToken.kind) {

      // math
      case ts.SyntaxKind.PlusToken: value = eleft().value + eright().value; break;
      case ts.SyntaxKind.MinusToken: value = eleft().value - eright().value; break;
      case ts.SyntaxKind.SlashToken: value = eleft().value / eright().value; break;
      case ts.SyntaxKind.AsteriskToken: value = eleft().value * eright().value; break;
      case ts.SyntaxKind.PercentToken: value = eleft().value % eright().value; break;

      // bool
      case ts.SyntaxKind.BarBarToken: value = eleft().isTrueLike() ? eleft() : eright(); break;
      case ts.SyntaxKind.LessThanToken: value = eleft().value < eright().value; break;
      case ts.SyntaxKind.GreaterThanToken: value = eleft().value > eright().value; break;
      case ts.SyntaxKind.EqualsEqualsToken: value = eleft().equalsEquals(eright()); break;
      case ts.SyntaxKind.LessThanEqualsToken: value = eleft().value <= eright().value; break;
      case ts.SyntaxKind.EqualsGreaterThanToken: value = eleft().value > eright().value; break;
      case ts.SyntaxKind.GreaterThanEqualsToken: value = eleft().value >= eright().value; break;
      case ts.SyntaxKind.ExclamationEqualsToken: value = !eleft().equalsEquals(eright()); break;
      case ts.SyntaxKind.EqualsEqualsEqualsToken: value = eleft().equalsEqualsEquals(eright()); break;
      case ts.SyntaxKind.AmpersandAmpersandToken: value = eleft().isTrueLike() ? eright() : eleft(); break;
      case ts.SyntaxKind.ExclamationEqualsEqualsToken: value = !eleft().equalsEqualsEquals(eright()); break;

      // bit
      case ts.SyntaxKind.AmpersandToken: value = eleft().value & eright().value; break;
      case ts.SyntaxKind.CaretToken: value = eleft().value ^ eright().value; break;
      case ts.SyntaxKind.BarToken: value = eleft().value | eright().value; break;

      // assignment
      case ts.SyntaxKind.PlusEqualsToken: value = eleft().value + eright().value; assignLeft = true; break;
      case ts.SyntaxKind.MinusEqualsToken: value = eleft().value - eright().value; assignLeft = true; break;
      case ts.SyntaxKind.AsteriskEqualsToken: value = eleft().value * eright().value; assignLeft = true; break;
      case ts.SyntaxKind.SlashEqualsToken: value = eleft().value / eright().value; assignLeft = true; break;

      // op
      case ts.SyntaxKind.InstanceOfKeyword: value = eleft().toNative() instanceof eright().toNative(); break;
      case ts.SyntaxKind.InKeyword: value = eleft().toNative() in eright().toNative(); break;

      default: throw new Error(`Unknown binary token ${binaryExpression.operatorToken.getText()}:${binaryExpression.operatorToken.kind}.`);
    }
    /* tslint:enable */

    const vo = mapNativeAsSynthetic(value);

    if (assignLeft) {
      const { ctx, propertyName } = getReference(binaryExpression.left);
      ctx.set(propertyName, vo);
    }

    return new rs.LiteralResult(vo);
  }

  function evaluateTryStatement() {
    const tryStatement = <ts.TryStatement>node;
    const result = evaluateBlock(tryStatement.tryBlock);
    return result.kind === rs.ResultKind.Exception ? evaluate(tryStatement.catchClause, context) : result;
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

    if (node.kind === ts.SyntaxKind.ElementAccessExpression) {
      ctx = evaluate((<ts.ElementAccessExpression>node).expression, context).value;
      propertyName = evaluate((<ts.ElementAccessExpression>node).argumentExpression, context).value;
    } else if (node.kind === ts.SyntaxKind.PropertyAccessExpression) {
      ctx = evaluate((<ts.PropertyAccessExpression>node).expression, context).value;
      propertyName = getIdentifierSynthetic((<ts.PropertyAccessExpression>node).name).value;
    } else if (node.kind === ts.SyntaxKind.Identifier) {
      ctx = context;
      propertyName = (<ts.Identifier>node).text;
    } else {
      ctx = context;
    }

    return { ctx, propertyName };
  }

  function evaluateConstructorDeclaration() {
    return evaluateArrowFunction();
  }

  function evaluatePropertyAccessExpression() {
    const propertyAccessExpression = <ts.PropertyAccessExpression>node;
    const reference = <ISynthetic>evaluate(propertyAccessExpression.expression, context).value;
    return new rs.LiteralResult(reference.get(getIdentifierSynthetic(propertyAccessExpression.name).value));
  }

  function evaluateArrayLiteralExpression() {
    const arrayLiteralExpression = <ts.ArrayLiteralExpression>node;
    const value = arrayLiteralExpression.elements.map((element) => evaluate(element, context).value);
    return new rs.LiteralResult(new SyntheticArray(...value));
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



  function evaluateBlock(block: ts.Block): rs.Result<any> {
    for (const statement of sortStatements(block.statements)) {
      const result = evaluate(statement, context);
      if (result.breaks) return result;
    }
    return new rs.VoidResult();
  }

  function evaluatePropertyDeclaration() {
    const propertyDeclaration = <ts.PropertyDeclaration>node;
    return new rs.VoidResult();
  }

  function evaluateReturnStatement() {
    const returnStatement = <ts.ReturnStatement>node;
    return new rs.ReturnResult(returnStatement.expression ? evaluate(returnStatement.expression, context).value : new SyntheticValueObject(undefined));
  }

  function shouldExport(declaration: ts.Node) {
    return !!(declaration.modifiers || []).find(modifier => modifier.kind === ts.SyntaxKind.ExportKeyword) || [
      ts.SyntaxKind.ExportAssignment
    ].indexOf(declaration.kind) !== -1;
  }

  function evaluateExpressionStatement() {
    const expressionStatement = <ts.ExpressionStatement>node;
    return evaluate(expressionStatement.expression, context);
  }

  function evaluateVariableStatement() {
    const variableStatement = <ts.VariableStatement>node;
    return evaluate(variableStatement.declarationList, context);
  }

  function evaluateVariableDeclarationList() {
    const variableStatement = <ts.VariableDeclarationList>node;
    const results = [];
    variableStatement.declarations.forEach((declaration) => {
      results.push(evaluate(declaration, context));
    });
    return new rs.ListResult(results);
  }

  function evaluateVariableDeclaration() {
    const variableDeclaration = <ts.VariableDeclaration>node;
    return defineVariable(
      variableDeclaration.name,
      variableDeclaration.initializer ? evaluate(variableDeclaration.initializer, context).value : new SyntheticValueObject(undefined)
    );
  }

  function evaluateArrowFunction() {
    const arrowFunction = <ts.ArrowFunction>node;
    return new rs.LiteralResult(new SyntheticFunction(arrowFunction, context));
  }

  function defineVariable(name: ts.Node, value: ISynthetic): rs.Result<any> {
    if (name.kind === ts.SyntaxKind.VariableDeclarationList) {
      return defineVariable((<ts.VariableDeclarationList>name).declarations[0].name, value);
    } else if (name.kind === ts.SyntaxKind.Identifier) {
      const nameText = (<ts.Identifier>name).text;
      context.defineVariable(nameText, value);
      return new rs.DeclarationResult(nameText, value);
    } else if (name.kind === ts.SyntaxKind.ObjectBindingPattern) {
      const elements = (<ts.ObjectBindingPattern>name).elements;
      return new rs.ListResult(elements.map((element) => {
        const propertyName = element.propertyName ? getIdentifierSynthetic(element.propertyName).value : getIdentifierSynthetic(element.name).value;
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
    const object = new SyntheticObject();
    objectLiteral.properties.forEach((property) => {
      const { name, value } = evaluate(property, context) as rs.DeclarationResult;
      object.set(name, value);
    });
    return new rs.LiteralResult(object);
  }

  function evaluatePropertyAssignment() {
    const propertyAssignment = <ts.PropertyAssignment>node;
    return new rs.DeclarationResult(getIdentifierSynthetic(propertyAssignment.name).value,  evaluate(propertyAssignment.initializer, context).value);
  }

  function evaluateShorthandPropertyAssignment() {
    const shorthandPropertyAssignment = <ts.ShorthandPropertyAssignment>node;
    return new rs.VoidResult();
  }

  function evaluateFunctionDeclaration() {
    const functionDeclaration = <ts.FunctionDeclaration>node;

    const name = getIdentifierSynthetic(functionDeclaration.name).value;
    const value = new SyntheticFunction(functionDeclaration, context, name);

    context.defineConstant(name, value);
    return new rs.DeclarationResult(name, value);
  }

  function evaluateCallExpression() {

    const callExpression = <ts.CallExpression>node;
    const { ctx } = getReference(callExpression.expression);
    const fn = evaluate(callExpression.expression, context).value;

    try {
      return new rs.LiteralResult(fn.apply(ctx, evaluateCallArguments(callExpression.arguments)));
    } catch (e) {
      console.error(`cannot call function ${node.getText()}: ${e.message}`);

      // TODO - return exception result
      return new rs.BreakResult();
    }
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

export const evaluateTypescript = function(node: ts.Node, context?: SymbolTable): any {

  if (!context) {
    context = new JSRootSymbolTable();
  }

  return evaluate(node, context);
};