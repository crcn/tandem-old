export interface IRange {
  start: number;
  end: number;
}

export interface IPosition {
  left: number;
  top: number;
}


export class Position implements IPosition {
  constructor(readonly left: number, readonly top: number) {

  }
}