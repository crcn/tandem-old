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

export const stringifyStyleAST = (ast: PCAtRule) => {
  return null;
}