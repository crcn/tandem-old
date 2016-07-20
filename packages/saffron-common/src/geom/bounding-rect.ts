export default class BoundingRect {

  public left:number;
  public top:number;
  public right:number;
  public bottom:number;

  constructor({ left, right, top, bottom }) {
    this.left   = left;
    this.top    = top;
    this.right  = right;
    this.bottom = bottom;
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
