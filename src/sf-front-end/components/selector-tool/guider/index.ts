import { IPoint, Point, BoundingRect } from "sf-core/geom";

export function createBoundingRectPoints(rect: BoundingRect): Array<Point> {
  return [
    new Point(rect.left, rect.top),
    new Point(rect.left + rect.width / 2, rect.top + rect.height / 2),
    new Point(rect.right, rect.bottom)
  ];
}

export class SnapResult {
  constructor(readonly point: IPoint, readonly delta: IPoint, readonly guidePoints: Array<IPoint>) {

  }
}

export class Guider {
  public points: Array<Point>;

  constructor(public padding: number = 10) {
    this.points = [];
  }

  addPoint(...points: Array<Point>): void {
    this.points.push(...points);
  }

  snap(point: IPoint, relativePoints: Array<IPoint> = []): SnapResult {

    if (relativePoints.length === 0) relativePoints = [point];

    const guidePoints = [];

    let deltaLeft = 0;
    let deltaTop  = 0;

    for (const relativePoint of relativePoints) {

      const origLeft = relativePoint.left;
      const origTop  = relativePoint.top;

      let left = origLeft;
      let top  = origTop;

      for (const guidePoint of this.points) {
        if (left === origLeft) {
          left = this._snap(guidePoint.left, left);
          if (left !== origLeft) {
            guidePoints.push(guidePoint);
          }
        }
        if (top  === origTop) {
          top  = this._snap(guidePoint.top, top);
          if (top !== origTop && guidePoints.indexOf(guidePoint) === -1) {
            guidePoints.push(guidePoint);
          }
        }
        if (left !== origLeft && top !== origTop) {
          break;
        }
      }

      if (deltaLeft === 0) deltaLeft = left - origLeft;
      if (deltaTop === 0) deltaTop  = top - origTop;

      if (deltaLeft !== 0 && deltaTop !== 0) {
        break;
      }
    }

    return new SnapResult(new Point(point.left + deltaLeft, point.top + deltaTop), new Point(deltaLeft, deltaTop), guidePoints);
  }

  _snap(a: number, b: number) {
    if (this._overlaps(a, b)) {
      return a;
    }
    return b;
  }

  _overlaps(a: number, b: number) {
    return b >= (a - this.padding) && b <= (a + this.padding);
  }
}