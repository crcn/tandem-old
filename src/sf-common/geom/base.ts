export interface IRange {
  start: number;
  end: number;
}

export interface IPoint {
  left: number;
  top: number;
}


export class Point implements IPoint {
  constructor(readonly left: number, readonly top: number) {

  }
}