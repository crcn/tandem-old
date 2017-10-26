import { PCExpression, PCParent } from "./ast";

export enum PCStyleExpressionType {
  STYLE_SHEET,
  STYLE_RULE,
  RULE
};

export type PCSheet = {

} & PCParent;

export type PCAtRule = {

} & PCParent;

export type PCStyleDeclaration = {
  properties: {
    [identifier: string]: PCExpression
  }
}

export type PCStyleRule = {
  style: PCStyleDeclaration;
} & PCParent;