export enum ExpressionType {
  ELEMENT,
  ATTRIBUTE,
};

export type ExpressionLocation = {
  line: number;
  column: number;
  pos: number;
};

export type ExpressionRange = {
  start?: ExpressionLocation;
  end?: ExpressionLocation;
}

export type Expression = {
  source: ExpressionRange;
};

export type ElementAttributeExpression = {
  name: string;
  namespace: string;
  value: string;
} & Expression;

export type ElementExpression = {
  name: string;
  namespace: string;
  attributes: ElementAttributeExpression[];
  children: ElementExpression[];
} & Expression;