import { BoundingRect, IPosition } from "sf-core/geom";

export class Guide {
  constructor(readonly left: number, readonly top: number, readonly guideLeft: number, readonly guideTop: number) {

  }
}

export class Guider {

  constructor(public bounds: Array<BoundingRect> = [], readonly padding: number = 10) {

  }

  getGuides(bounds: BoundingRect): Array<Guide> {

    const orgLeft = bounds.left;
    const orgTop  = bounds.top;
    let left = bounds.left;
    let top = bounds.top;
    let guideLeft;
    let guideTop;
    const guides: Array<Guide> = [];

    for (const bound of this.bounds) {

      if (orgLeft === left) {
        [guideLeft, left] = this._snapBounds(left, bound.left, bounds.width, bound.width);
      }

      if (orgTop === top) {
        [guideTop, top]  = this._snapBounds(top, bound.top, bounds.height, bound.height);
      }

      // when bounds intersect two items
      if (orgLeft !== left && orgTop !== top) {
        break;
      }
    }

    return guides;
  }

  private _snapBounds(fromLeft, toLeft, fromWidth, toWidth) {

      const fromMidWidth = fromWidth / 2;
      const fromMidLeft  = fromLeft + fromMidWidth;
      const toMidLeft    = toLeft + toWidth / 2;
      const toRight      = toLeft + toWidth;
      const fromRight    = fromLeft + fromWidth;

      return this._snapToLines([

        // left matches left
        [fromLeft, toLeft],

        // right matches left
        [fromRight, toLeft, -fromWidth],

        // right matches right
        [fromRight, toRight, -fromWidth],

        // left matches right
        [fromLeft, toRight],

        // left matches mid
        [fromLeft, toMidLeft],

        // left matches mid
        [fromRight, toMidLeft, -fromWidth],

        // mid matches mide
        [fromMidLeft, toMidLeft, -fromMidWidth],

        // mid matches right
        [fromMidLeft, toRight, -fromMidWidth],

        // mid matches left
        [fromMidLeft, toLeft, -fromMidWidth],

        // default
        [fromLeft],
      ]);
    }

  private _snapToLines(lines: Array<Array<number>>) {
      for (const [start, end = -1, offset = 0] of lines) {

        // no guide. Return from.
        if (end === -1) {
          return [-1, start];
        }


        if ((start <= end + this.padding) && (start >= end - this.padding)) {
          return [end, end + offset];
        }
      }
    }
}