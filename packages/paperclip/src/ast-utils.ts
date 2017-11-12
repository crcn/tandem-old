import { ExpressionPosition, Token, ExpressionLocation } from "./ast";
export const createToken = (type: number, pos: number, value?: string) => ({ type, pos, value });

const computePosLines = (source: string): { [identifier: number]: [number, number] } => {
  let cline: number = 1;
  let ccol: number = 0;

  const posLines = {};

  (source + " ").split("").forEach((c, p) => {
    posLines[p] = [ccol, cline];
    if (c === "\n") {
      ccol = 0;
      cline++;
    }
    ccol++;
  });

  return posLines;
};

export const getPosition = (start: Token | number, source: string) => {
  const pos = typeof start === "number" ? start : start.pos;
  const [column, line] = computePosLines(source)[pos];
  return { column, line, pos };
}

export const getLocation = (start:  ExpressionPosition | Token | number, end: ExpressionPosition | Token | number, source: string): ExpressionLocation  => ({ 
  start: (start as ExpressionPosition).line ? start as ExpressionPosition : getPosition(start as any, source), 
  end: end && (end as ExpressionPosition).line ? end as ExpressionPosition : getPosition(source.length, source),
});