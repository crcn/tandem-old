import { weakMemo } from "aerial-common2";

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

type Children = Array<PCElement | PCSelfClosingElement | PCBlock | PCString>;

export type PCParent = {
  children: Children;
} & PCExpression;

export type PCFragment = {
} & PCParent;

export type PCElement = {
  startTag: PCStartTag;
  endTag: PCEndTag;
} & PCParent;


const computePosLines = weakMemo((source: string): { [identifier: number]: [number, number] } => {
  let cline: number = 1;
  let ccol: number = 0;

  const posLines = {};

  source.split("").forEach((c, p) => {
    posLines[p] = [ccol, cline];
    if (c === "\n") {
      ccol = 0;
      cline++;
    }
    ccol++;
  });

  return posLines;
});

export const getPosition = (start: Token | number, source: string) => {
  const pos = typeof start === "number" ? start : start.pos;
  const [column, line] = computePosLines(source)[pos];
  return { column, line, pos };
}

export const getLocation = (start:  ExpressionPosition | Token | number, end: ExpressionPosition | Token | number, source: string): ExpressionLocation  => ({ 
  start: (start as ExpressionPosition).line ? start as ExpressionPosition : getPosition(start as any, source), 
  end: (end as ExpressionPosition).line ? end as ExpressionPosition : getPosition(end as any, source),
});
