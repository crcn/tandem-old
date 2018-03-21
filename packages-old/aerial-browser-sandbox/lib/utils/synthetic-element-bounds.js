"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var aerial_common2_1 = require("aerial-common2");
var constants_1 = require("../constants");
exports.convertAbsoluteBoundsToRelative = aerial_common2_1.weakMemo(function (newBounds, element, window) {
    var _a = exports.getElementStartPosition(element, window), left = _a.left, top = _a.top;
    var oldBounds = window.allComputedBounds[element.$id];
    return aerial_common2_1.moveBounds(newBounds, {
        left: newBounds.left - left,
        top: newBounds.top - top
    });
});
exports.getElementStartPosition = aerial_common2_1.weakMemo(function (element, window) {
    // if the element is relative, then we just need to subtract the css style from the computed bounds to figure out where its static position is.
    var _a = exports.convertElementMeasurementsToNumbers(element, window), left = _a.left, top = _a.top, borderLeftWidth = _a.borderLeftWidth, borderTopWidth = _a.borderTopWidth;
    return aerial_common2_1.shiftBounds(window.allComputedBounds[element.$id], {
        left: -left,
        top: -top
    });
});
var PROPERTY_NAME_AXIS_MAP = {
    width: constants_1.Axis.HORIZONTAL,
    left: constants_1.Axis.HORIZONTAL,
    right: constants_1.Axis.HORIZONTAL,
    height: constants_1.Axis.VERTICAL,
    top: constants_1.Axis.VERTICAL,
    bottom: constants_1.Axis.VERTICAL
};
var convertablePropertyNames = [
    "left",
    "right",
    "top",
    "bottom",
    "width",
    "height",
    "marginLeft",
    "marginRight",
    "marginTop",
    "marginBottom",
    "paddingLeft",
    "paddingRight",
    "paddingTop",
    "paddingBottom",
    "borderLeftWidth",
    "borderRightWidth",
    "borderTopWidth",
    "borderBottomWidth"
];
exports.convertElementMeasurements = aerial_common2_1.weakMemo(function (element, unit, window) {
    var computedStyle = window.allComputedStyles[element.$id];
    if (unit === constants_1.CSSMeasurementTypes.PX) {
        return computedStyle;
        // TODO
    }
    else if (unit === constants_1.CSSMeasurementTypes.PERC) {
        for (var _i = 0, convertablePropertyNames_1 = convertablePropertyNames; _i < convertablePropertyNames_1.length; _i++) {
            var convertablePropertyName = convertablePropertyNames_1[_i];
            var px = exports.convertElementMeasurementToNumber(element, computedStyle[convertablePropertyName], PROPERTY_NAME_AXIS_MAP[convertablePropertyName], window);
        }
    }
});
exports.convertElementMeasurementToNumber = aerial_common2_1.weakMemo(function (element, measurement, axis, window) {
    if (measurement.indexOf("px") !== -1) {
        return Number(measurement.replace("px", ""));
    }
    return 0;
});
exports.getElementInnerBounds = aerial_common2_1.weakMemo(function (element, window) {
    var _a = exports.convertElementMeasurementsToNumbers(element, window), paddingLeft = _a.paddingLeft, paddingRight = _a.paddingRight, paddingTop = _a.paddingTop, paddingBottom = _a.paddingBottom;
    return {
        left: paddingLeft,
        right: paddingRight,
        top: paddingTop,
        bottom: paddingBottom
    };
});
exports.convertElementMeasurementsToNumbers = aerial_common2_1.weakMemo(function (element, window) {
    var pxStyle = exports.convertElementMeasurements(element, constants_1.CSSMeasurementTypes.PX, window);
    var result = {};
    for (var propertyName in pxStyle) {
        var propertyValue = pxStyle[propertyName];
        if (propertyValue && /px$/.test(propertyValue)) {
            result[propertyName] = parseFloat(propertyValue.replace("px", ""));
        }
        else if (propertyValue === "auto") {
            result[propertyName] = 0;
        }
    }
    return result;
});
exports.getSyntheticElementStaticPosition = aerial_common2_1.weakMemo(function (element, window) {
    return { left: 0, top: 0 };
});
//# sourceMappingURL=synthetic-element-bounds.js.map