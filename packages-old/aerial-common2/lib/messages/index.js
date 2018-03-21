"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RESIZED = "RESIZED";
exports.MOVED = "MOVED";
exports.STOPPED_MOVING = "STOPPED_MOVING";
exports.REMOVED = "REMOVED";
exports.resized = function (itemId, itemType, bounds, targetSelectors) { return ({
    itemId: itemId,
    itemType: itemType,
    bounds: bounds,
    targetSelectors: targetSelectors,
    type: exports.RESIZED
}); };
exports.moved = function (itemId, itemType, point, targetSelectors) { return ({
    itemId: itemId,
    itemType: itemType,
    point: point,
    targetSelectors: targetSelectors,
    type: exports.MOVED
}); };
exports.stoppedMoving = function (itemId, itemType, targetSelectors) { return ({
    itemId: itemId,
    itemType: itemType,
    point: null,
    targetSelectors: targetSelectors,
    type: exports.STOPPED_MOVING
}); };
exports.removed = function (itemId, itemType) { return ({
    itemId: itemId,
    itemType: itemType,
    type: exports.REMOVED
}); };
//# sourceMappingURL=index.js.map