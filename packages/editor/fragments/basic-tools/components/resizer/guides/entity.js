import BaseGuide from './base';

class EntityGuide extends BaseGuide {

  constructor(entity, margin) {
    super();
    this.entity = entity;
    this.margin = margin;
  }

  snap({ left, top, width, height }) {
    var allEntities = this.entity.root.flatten();

    var margin = this.margin;

    function snapToLines(lines) {
      for (var [from, to = from, add = 0] of lines) {
        if ((from < to + margin) && (from > to - margin)) {
          return to + add;
        }
      }
    }

    for (var entity of allEntities) {
      if (entity === this.entity) continue;
      var style = entity.getComputedStyle();

      left = snapToLines([

        // left matches left
        [left, style.left],

        // right matches right
        [left + width, style.left, -width],

        // left matches right
        [left, style.left + style.width],

        // default
        [left]
      ]);

      top = snapToLines([

        // top matches top
        [top, style.top],

        // bottom matches top
        [top + height, style.top, -height],

        // left matches bottom
        [top, style.top + style.height],

        // default
        [top]
      ]);

      var toMidWidth = style.width / 2;
      var toMidLeft   = style.left + toMidWidth;
      var fromMidWidth = width / 2;
      var fromMidLeft = left + fromMidWidth;

      left = snapToLines([

        // left matches middle
        [left, toMidLeft],

        // right matches mid
        [left + width, toMidLeft, -width],

        // mid matches mid
        [fromMidLeft, toMidLeft, -fromMidWidth],

        // default
        [left]
      ]);

      var toMidHeight   = style.height / 2;
      var toMidTop      = style.top + toMidHeight;
      var fromMidHeight = height / 2;
      var fromMidTop    = top + fromMidHeight;


      top = snapToLines([

        // top matches top
        [top, toMidTop],

        // bottom matches mid
        [top + height, toMidTop, -height],

        // left matches bottom
        [fromMidTop, toMidTop, -fromMidHeight],

        // default
        [top]
      ]);


    }

    return { left, top, width, height };
  }
}

export default EntityGuide;