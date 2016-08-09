export default class BoundingRect {

  constructor(
    public left: number,
    public top: number,
    public right: number,
    public bottom: number
  ) { }

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

  zoom(delta: number) {
    return new BoundingRect(
      this.left * delta,
      this.top * delta,
      this.right * delta,
      this.bottom * delta
    );
  }

  intersects(...rects: Array<BoundingRect>): boolean {
    return !!rects.find((rect) => (
      Math.max(this.left, rect.left) <= Math.min(this.right, rect.right) &&
      Math.max(this.top , rect.top) <= Math.min(this.bottom, rect.bottom)
    ));
  }

  merge(...rects: Array<BoundingRect>): BoundingRect {
    return BoundingRect.merge(this, ...rects);
  }

  move(left: number, top: number): BoundingRect {
    return new BoundingRect(
      this.left + left,
      this.top   + top,
      this.right + left,
      this.bottom + top
    );
  }

  static merge(...rects: Array<BoundingRect>): BoundingRect {
    let left   = Infinity;
    let bottom = -Infinity;
    let top    = Infinity;
    let right  = -Infinity;

    for (const rect of rects) {
      left   = Math.min(left, rect.left);
      right  = Math.max(right, rect.right);
      top    = Math.min(top, rect.top);
      bottom = Math.max(bottom, rect.bottom);
    }

    return new BoundingRect(left, top, right, bottom);
  }
}
