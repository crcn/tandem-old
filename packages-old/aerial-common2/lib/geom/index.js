"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
// import { getV } from "../struct";
var memo_1 = require("../memo");
exports.createBounds = function (left, right, top, bottom) { return ({
    left: left,
    right: right,
    top: top,
    bottom: bottom
}); };
exports.moveBounds = function (bounds, _a) {
    var left = _a.left, top = _a.top;
    return (__assign({}, bounds, { left: left, top: top, right: left + bounds.right - bounds.left, bottom: top + bounds.bottom - bounds.top }));
};
exports.mapBounds = function (bounds, map) { return (__assign({}, bounds, { left: map(bounds.left, "left"), right: map(bounds.right, "right"), top: map(bounds.top, "top"), bottom: map(bounds.bottom, "bottom") })); };
exports.roundBounds = function (bounds) { return exports.mapBounds(bounds, function (v) { return Math.round(v); }); };
exports.createZeroBounds = function () { return exports.createBounds(0, 0, 0, 0); };
exports.shiftPoint = function (point, delta) { return ({
    left: point.left + delta.left,
    top: point.top + delta.top
}); };
exports.shiftBounds = function (bounds, _a) {
    var left = _a.left, top = _a.top;
    return (__assign({}, bounds, { left: bounds.left + left, top: bounds.top + top, right: bounds.right + left, bottom: bounds.bottom + top }));
};
exports.pointToBounds = function (point) { return ({
    left: point.left,
    top: point.top,
    right: point.left,
    bottom: point.top
}); };
exports.keepBoundsAspectRatio = function (newBounds, oldBounds, anchor, centerPoint) {
    if (centerPoint === void 0) { centerPoint = anchor; }
    var newBoundsSize = exports.getBoundsSize(newBounds);
    var oldBoundsSize = exports.getBoundsSize(oldBounds);
    var left = newBounds.left;
    var top = newBounds.top;
    var width = newBoundsSize.width;
    var height = newBoundsSize.height;
    if (anchor.top === 0 || anchor.top === 1) {
        var perc = height / oldBoundsSize.height;
        width = oldBoundsSize.width * perc;
        left = oldBounds.left + (oldBoundsSize.width - width) * (1 - centerPoint.left);
    }
    else if (anchor.top === 0.5) {
        var perc = width / oldBoundsSize.width;
        height = oldBoundsSize.height * perc;
        top = oldBounds.top + (oldBoundsSize.height - height) * (1 - centerPoint.top);
    }
    return {
        left: left,
        top: top,
        right: left + width,
        bottom: top + height
    };
};
exports.keepBoundsCenter = function (newBounds, oldBounds, anchor) {
    var newBoundsSize = exports.getBoundsSize(newBounds);
    var oldBoundsSize = exports.getBoundsSize(oldBounds);
    var left = oldBounds.left;
    var top = oldBounds.top;
    var width = oldBoundsSize.width;
    var height = oldBoundsSize.height;
    var delta = { left: newBounds.left - oldBounds.left, top: newBounds.top - oldBounds.top };
    if (anchor.top === 0) {
        top += delta.top;
        height += delta.top;
        height = oldBounds.top - newBounds.top;
    }
    if (anchor.top === 1) {
        var hdiff = oldBoundsSize.height - newBoundsSize.height;
        top += hdiff;
        height -= hdiff;
    }
    if (anchor.left === 0) {
        left += delta.left;
        top += delta.top;
        width += oldBounds.left - newBounds.left;
    }
    if (anchor.left === 1) {
        width += delta.left;
        var wdiff = oldBoundsSize.width - newBoundsSize.width;
        left += wdiff;
        width -= wdiff;
    }
    return {
        left: left,
        top: top,
        right: left + width,
        bottom: top + height
    };
};
exports.zoomBounds = function (bounds, zoom) { return (__assign({}, bounds, { left: bounds.left * zoom, top: bounds.top * zoom, right: bounds.right * zoom, bottom: bounds.bottom * zoom })); };
exports.boundsFromRect = function (_a) {
    var width = _a.width, height = _a.height;
    return ({
        left: 0,
        top: 0,
        right: width,
        bottom: height
    });
};
exports.getBoundsWidth = function (bounds) { return bounds.right - bounds.left; };
exports.getBoundsHeight = function (bounds) { return bounds.bottom - bounds.top; };
exports.getBoundsSize = memo_1.weakMemo(function (bounds) { return ({
    width: exports.getBoundsWidth(bounds),
    height: exports.getBoundsHeight(bounds)
}); });
exports.scaleInnerBounds = function (inner, oldBounds, newBounds) {
    var oldBoundsSize = exports.getBoundsSize(oldBounds);
    var newBoundsSize = exports.getBoundsSize(newBounds);
    var innerBoundsSize = exports.getBoundsSize(inner);
    var percLeft = (inner.left - oldBounds.left) / oldBoundsSize.width;
    var percTop = (inner.top - oldBounds.top) / oldBoundsSize.height;
    var percWidth = innerBoundsSize.width / oldBoundsSize.width;
    var percHeight = innerBoundsSize.height / oldBoundsSize.height;
    var left = newBounds.left + newBoundsSize.width * percLeft;
    var top = newBounds.top + newBoundsSize.height * percTop;
    var right = left + newBoundsSize.width * percWidth;
    var bottom = top + newBoundsSize.height * percHeight;
    return {
        left: left,
        top: top,
        right: right,
        bottom: bottom
    };
};
exports.isBounds = function (bounds) { return bounds && bounds.left != null && bounds.top != null && bounds.right != null && bounds.bottom != null; };
exports.filterBounded = function (values) { return values.filter(function (value) { return exports.isBounds(value.bounds); }); };
exports.mergeBounds = function () {
    var allBounds = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        allBounds[_i] = arguments[_i];
    }
    var left = Infinity;
    var bottom = -Infinity;
    var top = Infinity;
    var right = -Infinity;
    for (var _a = 0, allBounds_1 = allBounds; _a < allBounds_1.length; _a++) {
        var bounds = allBounds_1[_a];
        left = Math.min(left, bounds.left);
        right = Math.max(right, bounds.right);
        top = Math.min(top, bounds.top);
        bottom = Math.max(bottom, bounds.bottom);
    }
    return exports.createBounds(left, right, top, bottom);
};
exports.centerTransformZoom = function (translate, bounds, nz, point) {
    var oz = translate.zoom;
    var zd = (nz / oz);
    var v1w = bounds.right - bounds.left;
    var v1h = bounds.bottom - bounds.top;
    // center is based on the mouse position
    var v1px = point ? point.left / v1w : 0.5;
    var v1py = point ? point.top / v1h : 0.5;
    // calculate v1 center x & y
    var v1cx = v1w * v1px;
    var v1cy = v1h * v1py;
    // old screen width & height
    var v2ow = v1w * oz;
    var v2oh = v1h * oz;
    // old offset pane left
    var v2ox = translate.left;
    var v2oy = translate.top;
    // new width of view 2
    var v2nw = v1w * nz;
    var v2nh = v1h * nz;
    // get the offset px & py of view 2
    var v2px = (v1cx - v2ox) / v2ow;
    var v2py = (v1cy - v2oy) / v2oh;
    var left = v1w * v1px - v2nw * v2px;
    var top = v1h * v1py - v2nh * v2py;
    return {
        left: left,
        top: top,
        zoom: nz
    };
};
exports.boundsIntersect = function (a, b) { return !(a.left > b.right || a.right < b.left || a.top > b.bottom || a.bottom < a.top); };
exports.pointIntersectsBounds = function (point, bounds) { return !(point.left < bounds.left || point.left > bounds.right || point.top < bounds.top || point.top > bounds.bottom); };
exports.getSmallestBounds = function () {
    var bounds = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        bounds[_i] = arguments[_i];
    }
    return bounds.reduce(function (a, b) {
        var asize = exports.getBoundsSize(a);
        var bsize = exports.getBoundsSize(b);
        return asize.width * asize.height < bsize.width * bsize.height ? a : b;
    }, { left: Infinity, right: Infinity, top: Infinity, bottom: Infinity });
};
//# sourceMappingURL=index.js.map