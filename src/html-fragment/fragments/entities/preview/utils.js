
import BoundingRect from 'common/geom/bounding-rect';
import { translateStyleToIntegers } from 'common/utils/css/translate-style';

function getFrameOffset(entity) {
  var left = 0;
  var top  = 0;

  entity = entity.parentNode;

  while (entity) {
    if (entity.displayType === 'htmlFrame') {
      const bounds = entity.preview.getBoundingRect();
      left += bounds.left;
      top  += bounds.top;
    }

    entity = entity.parentNode;
  }

  return { left, top };
}

function getComputedStyle(node) {
  var cs   = window.getComputedStyle(node);
  // normalize computed styles to pixels
  return {
    position: cs.position,
    ...translateStyleToIntegers({
      marginLeft: cs.marginLeft,
      marginTop : cs.marginTop,
      marginRight: cs.marginRight,
      marginBottom: cs.marginBottom,
      paddingLeft: cs.paddingLeft,
      paddingTop: cs.paddingTop,
      paddingRight: cs.paddingRight,
      paddingBottom: cs.paddingBottom,
    }, node),
  };
}

export function getCapabilities(node) {
  var style = window.getComputedStyle(node);

  var movable   = style.position !== 'static';
  var resizable = /fixed|absolute/.test(style.position) || !/^inline$/.test(style.display);

  return {
    movable,
    resizable,
  };
}

export function calculateBoundingRect(node, zoomProperties) {
  var node = node;

  var rect   = node.getBoundingClientRect();
  var cs     = getComputedStyle(node);
  var offset = { left: 0, top: 0 };

  // margins are also considered bounds - add them here. Fixes a few issues
  // when selecting multiple items with different items & dragging them around.
  var left   = rect.left   - cs.marginLeft + offset.left;
  var top    = rect.top    - cs.marginTop + offset.top;
  var right  = rect.right  + cs.marginRight + offset.left;
  var bottom = rect.bottom + cs.marginBottom + offset.top;

  var width = right - left;
  var height = bottom - top;

  if (zoomProperties) {
    // ({ left, top, width, height } = multiplyStyle({ left, top, width, height }, this.getZoom()));
  }

  right = left + width;
  bottom = top + height;

  return BoundingRect.create({
    left   : left,
    top    : top,
    right  : right,
    bottom : bottom,
  });
}
