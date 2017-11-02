import { PCExpression, PCParent } from "./ast";

export enum PCStyleExpressionType {
  STYLE_SHEET,
  STYLE_RULE,
  RULE,
  AT_RULE,
  DECLARATION
};

export type PCGroupingRule = {
  children: Array<PCGroupingRule|PCStyleRule>;
} & PCExpression;

export type PCSheet = {

} & PCGroupingRule;

export type PCAtRule = {
  name: string;
  params: string[];
} & PCGroupingRule;

export type PCStyleDeclarationProperty = {
  name: string;
  value: string;
} & PCExpression;

export type PCStyleRule = {
  selectorText: string;
  declarationProperties: PCStyleDeclarationProperty[];
} & PCGroupingRule;

export const stringifyStyleAST = (ast: PCExpression, map: (PCExpression, stringify: (ast: PCExpression) => string) => void|string) => {
  const buffer = map(ast, (expr) => stringifyStyleAST(expr, map));
  if (buffer) return buffer;
  const mapChildren = () => (ast as PCParent).children.map(child => stringifyStyleAST(child, map)).join("\n");
  if (ast.type === PCStyleExpressionType.AT_RULE) {
    const atRule = ast as PCAtRule;
    return `@${atRule.name} ${atRule.params} {
      ${ mapChildren() }
    }\n`;
  } else if (ast.type === PCStyleExpressionType.STYLE_RULE) {
    const styleRule = ast as PCStyleRule;
    return `${styleRule.selectorText.trim()} {
      ${ styleRule.declarationProperties.map(child => stringifyStyleAST(child, map)).join("\n") }
    }\n`;
  } else if (ast.type === PCStyleExpressionType.DECLARATION) {
    const decl = ast as PCStyleDeclarationProperty;
    return `${decl.name}: ${decl.value};\n`;
  } else if (ast.type === PCStyleExpressionType.STYLE_SHEET) {
    const ss = ast as PCSheet;
    return mapChildren();
  } else {
    throw new Error(`Unable to stringify CSS PC AST type ${ast.type}`);
  }
};