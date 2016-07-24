import BoundingRect from '../../geom/bounding-rect';

export function mergeBoundingRects(allRects:Array<BoundingRect>) {

  let left   = Infinity;
  let bottom = -Infinity;
  let top    = Infinity;
  let right  = -Infinity;

  for (const rect of allRects) {
    if (!rect) continue;
    left   = Math.min(left, rect.left);
    right  = Math.max(right, rect.right);
    top    = Math.min(top, rect.top);
    bottom = Math.max(bottom, rect.bottom);
  }

  return new BoundingRect(left, top, right, bottom);
}

