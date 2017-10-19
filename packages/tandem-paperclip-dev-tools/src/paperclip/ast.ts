export enum PCExpressionType {
  STRING,
  BLOCK,
  ELEMENT,
  SELF_CLOSING_ELEMENT,
  TEXT_NODE,
  COMMENT,
  ATTRIBUTE,
  START_TAG,
  FRAGMENT,
  END_TAG
};

export type ExpressionLocation = {
  start: number;
  end: number;
};

export type PCExpression = {
  type: PCExpressionType;
  location: ExpressionLocation;
};

export type PCString = {
  value: string;
} & PCExpression;

export type PCComment = {
  value: string;
} & PCExpression;

export type PCBlock = {
  value: string;
} & PCExpression;

export type VSAttributeValue = {
  
} & PCExpression;

export type PCAttribute = {
  location: ExpressionLocation;
  name: string;
  value: PCExpression;
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

type Children = Array<PCElement | PCSelfClosingElement | PCBlock | PCString>;

export type PCFragment = {
  children: Children;
} & PCExpression;

export type PCElement = {
  startTag: PCStartTag;
  endTag: PCEndTag;
  children: Children;
} & PCExpression;


export const getPCStartTagAttribute = (startTag: PCStartTag, name: string) => {
  const attr = startTag.attributes.find((attr) => attr.name === name);
  return attr && (attr.value as PCString).value;
}

export const hasPCStartTagAttribute = (startTag: PCStartTag, name: string) => {
  return Boolean(startTag.attributes.find((attr) => attr.name === name));
}