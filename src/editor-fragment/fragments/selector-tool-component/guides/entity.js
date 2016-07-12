import BaseGuide from './base';

export default class EntityGuide extends BaseGuide {

  constructor(allEntities, margin) {
    super();
    this.allEntities = allEntities;
    this.margin = margin;
  }

  snap({ left, top, width, height }) {
    var allEntities = this.allEntities;

    var margin = this.margin;

    function snapToLines(lines) {
      for (const [from, to = -1, offset = 0] of lines) {

        // no guide. Return from.
        if (to === -1) {
          return [-1, from];
        }

        if ((from < to + margin) && (from > to - margin)) {
          return [to, to + offset];
        }
      }
    }

    function snapBounds(fromLeft, toLeft, fromWidth, toWidth) {

      var fromMidWidth = fromWidth / 2;
      var fromMidLeft  = fromLeft + fromMidWidth;
      var toMidLeft    = toLeft + toWidth / 2;
      var toRight      = toLeft + toWidth;
      var fromRight    = fromLeft + fromWidth;

      return snapToLines([

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

    const orgLeft = left;
    const orgTop  = top;

    let guideLeft;
    let guideTop;

    for (const entity of allEntities) {
      const style = entity.preview.getStyle();

      if (orgLeft === left) {
        [guideLeft, left] = snapBounds(left, style.left, width, style.width);
      }

      if (orgTop === top) {
        [guideTop, top]  = snapBounds(top, style.top, height, style.height);
      }

      // when bounds intersect two items
      if (orgLeft !== left && orgTop !== top) {
        break;
      }
    }

    return { left, top, width, height, guideLeft, guideTop, orgLeft, orgTop };
  }
}
