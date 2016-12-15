import { BoundingRect, Point, Line } from "@tandem/common";



export const getRectDiagLine = (rect: BoundingRect): Line => {
  return new Line(
    new Point(rect.left, rect.top),
    new Point(rect.right, rect.bottom)
  )
}


export const getShortestLine = (from: Point[], to: Point[]) => {

  const possibilities: Line[] = [];

  for (const a of from) {
    for (const b of to) {
      possibilities.push(new Line(a, b));
    }
  }

  return possibilities.reduce((a, b) => {
    return a.length < b.length ? a : b;
  });
}

export const getRectPoints = (rect: BoundingRect): [Point, Point, Point] => {
  const { top, left, width, height } = rect;
  return [
    // top left
    new Point(left, top),

    // center
    getRectCenterPoint(rect),

    // bottom
    new Point(left + width, top + height)
  ]
}

export const getRectCenterPoint = ({ top, left, width, height }: BoundingRect): Point => {
  return new Point(left + width / 2, top + height / 2);
}

export const getRectCornerPoints = ({ top, left, width, height }: BoundingRect): [Point, Point, Point] => {
  return [
    // top left
    new Point(left, top),

    // top right
    new Point(left + width, top),

    // bottom right
    new Point(left + width, top + height),

    // bottom left
    new Point(left, top + height)
  ]
}

export const getLineBoundingRect = ({ from, to }: Line) => {
  return new BoundingRect(
    Math.min(from.left, to.left),
    Math.min(from.top, to.top),
    Math.max(from.left, to.left),
    Math.max(from.top, to.top)
  );
}

export const getOuterRectCenterPoints = (rect: BoundingRect): Point[] => {

  return [
    ...getHorizontalRectCenterPoints(rect[0]),
    ...getVerticalRectCenterPoints(rect[0])
  ]
}

export const getHorizontalRectCenterPoints = ({ top, left, width, height }: BoundingRect): [Point, Point] => {
  return [
    // left center
    new Point(left, top + height / 2),

    // right center
    new Point(left + width, top + height / 2)
  ]
}

export const getVerticalRectCenterPoints = ({ top, left, width, height }: BoundingRect): [Point, Point] => {
  return [
    // left center
    new Point(left, top + height / 2),

    // right center
    new Point(left + width, top + height / 2)
  ]
}