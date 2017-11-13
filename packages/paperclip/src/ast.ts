export enum PCExpressionType {
  STRING,
  BLOCK,
  STRING_BLOCK,
  ELEMENT,
  SELF_CLOSING_ELEMENT,
  TEXT_NODE,
  COMMENT,
  ATTRIBUTE,
  START_TAG,
  BLOCK_STRING,
  FRAGMENT,
  END_TAG
};

export enum BKExpressionType {
  TYPE,
  ECHO,
  IF,
  ELSEIF,
  REFERENCE,
  ELSE,
  REPEAT
};

export type Token = {
  type: number;
  pos: number;
  value?: string;
};

export type ExpressionPosition = {
  line: number;
  column: number;
  pos: number;
};

export type ExpressionLocation = {
  start: ExpressionPosition;
  end: ExpressionPosition;
};

export type PCExpression = {
  type: number;
  location: ExpressionLocation;
};

export type PCTextNode = {
  value: string;
} & PCExpression;

export type PCComment = {
  value: string;
} & PCExpression;

export type PCString = {
  value: string;
} & PCExpression;

export type PCReference = {

} & PCExpression;

export type BKExpression = {
  
  } & PCExpression;

export type PCBlock = {
  value: BKExpression;
} & PCExpression;

export type BKBind = {
  value: BKExpression;
} & PCExpression;

export type BKReference = {
  value: string;
} & BKExpression;

export type BKRepeat = {
  each: PCExpression;
  asKey: PCExpression;
  asValue: PCExpression;
} & BKExpression;

export type BKIf = {
  condition: BKExpression;
} & BKExpression;

export type BKElseIf = BKIf;
export type BKElse = BKExpression;

export type PCStringBlock = {
  values: Array<PCString|PCBlock>;
} & PCExpression;

export type PCAttribute = {
  location: ExpressionLocation;
  name: string;
  value?: PCExpression;
} & PCExpression;

export type PCStartTag = {
  name: string;
  attributes: PCAttribute[];
} & PCExpression;

export type PCEndTag = {
  name: string;
} & PCExpression;

export type PCSelfClosingElement = {

} & PCStartTag;

type ChildNodes = Array<PCElement | PCSelfClosingElement | PCBlock | PCTextNode>;

export type PCParent = {
  childNodes: ChildNodes;
} & PCExpression;

export type PCFragment = {
} & PCParent;

export type PCElement = {
  startTag: PCStartTag;
  endTag: PCEndTag;
} & PCParent;

