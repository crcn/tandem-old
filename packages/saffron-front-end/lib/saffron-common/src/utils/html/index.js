/**
* calculates the correct zoom of an element
*/
"use strict";
function calculateZoom(element) {
    var current = element;
    var zoom = 1;
    while (current) {
        if (current.style && current.style.zoom !== '') {
            zoom *= Number(current.style.zoom);
        }
        current = current.parentNode || current.host;
    }
    return zoom;
}
exports.calculateZoom = calculateZoom;
function translateAbsoluteToRelativePoint(event, relativeElement) {
    var zoom = calculateZoom(relativeElement);
    var left = event.clientX || event.left;
    var top = event.clientY || event.top;
    var bounds = relativeElement.getBoundingClientRect();
    var rx = (left / zoom) - bounds.left;
    var ry = (top / zoom) - bounds.top;
    return { left: rx, top: ry };
}
exports.translateAbsoluteToRelativePoint = translateAbsoluteToRelativePoint;
// TODO - move this to utils
function multiplyStyle(style, zoom) {
    var zoomed = {};
    for (const key in style) {
        if (style.hasOwnProperty(key)) {
            const value = style[key];
            if (typeof value === 'number') {
                zoomed[key] = value * zoom;
            }
        }
    }
    return zoomed;
}
exports.multiplyStyle = multiplyStyle;
// TODO - move this to utils
function divideStyle(style, zoom) {
    var zoomed = {};
    for (const key in style) {
        if (style.hasOwnProperty(key)) {
            const value = style[key];
            if (typeof value === 'number') {
                zoomed[key] = value / zoom;
            }
        }
    }
    return zoomed;
}
exports.divideStyle = divideStyle;
//# sourceMappingURL=index.js.map