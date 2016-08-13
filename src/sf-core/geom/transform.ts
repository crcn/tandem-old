import { IPosition } from "./base";

export class Transform {

  constructor(public left: number = 0, public top: number = 0, public scale: number = 1) {

  }

  localizePosition(position: IPosition) {
    return {
      left: (position.left - this.left) / this.scale,
      top: (position.top - this.top) / this.scale
    };
  }
}