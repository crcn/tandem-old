import { Point, BoundingRect } from "sf-core/geom";

export function createBoundingRectPoints(rect: BoundingRect): Array<Point> {
  return [
    new Point(rect.left, rect.top),
    new Point(rect.left + rect.width / 2, rect.top + rect.height / 2),
    new Point(rect.right, rect.bottom)
  ];
}

export class Guider {
  public points: Array<Point>;

  constructor() {
    this.points = [];
  }

  addPoint(...points:Array<Point>) {
    this.points.push(...points);
  }
}