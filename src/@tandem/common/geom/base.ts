export interface IRange {
  start: number;
  end: number;
}

export function cloneRange(range: IRange) {
  return { start: range.start, end: range.end };
}

export interface IPoint {
  left: number;
  top: number;
}


export class Point implements IPoint {
  constructor(readonly left: number, readonly top: number) {

  }
}