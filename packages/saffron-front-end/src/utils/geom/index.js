"use strict";
const bounding_rect_1 = require('../../geom/bounding-rect');
function mergeBoundingRects(allRects) {
    let left = Infinity;
    let bottom = -Infinity;
    let top = Infinity;
    let right = -Infinity;
    for (const rect of allRects) {
        if (!rect)
            continue;
        left = Math.min(left, rect.left);
        right = Math.max(right, rect.right);
        top = Math.min(top, rect.top);
        bottom = Math.max(bottom, rect.bottom);
    }
    return new bounding_rect_1.default(left, top, right, bottom);
}
exports.mergeBoundingRects = mergeBoundingRects;
//# sourceMappingURL=index.js.map