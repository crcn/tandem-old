export default class BoundingRect {

  constructor(public left:number, public top:number, public right:number, public bottom:number) {
  }

  get width() {
    return this.right - this.left;
  }

  set width(value) {
    this.right = this.left + value;
  }

  get height() {
    return this.bottom - this.top;
  }

  set height(value) {
    this.bottom = this.top + value;
  }
}
