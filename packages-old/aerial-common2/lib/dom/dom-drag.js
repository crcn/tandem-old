"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
exports.startDOMDrag = function (startEvent, onStart, update, stop) {
    if (stop === void 0) { stop = undefined; }
    var sx = startEvent.clientX;
    var sy = startEvent.clientY;
    var doc = startEvent.target.ownerDocument;
    var _animating;
    var _started;
    // slight delay to prevent accidental drag from firing 
    // if the user does some other mouse interaction such as a double click.
    var drag = lodash_1.throttle(function (event) {
        if (!_started) {
            _started = true;
            onStart(event);
        }
        event.preventDefault();
        update(event, {
            delta: {
                x: event.clientX - sx,
                y: event.clientY - sy,
            },
        });
    }, 10);
    function cleanup() {
        doc.removeEventListener("mousemove", drag);
        doc.removeEventListener("mouseup", cleanup);
        if (stop && _started)
            stop();
    }
    doc.addEventListener("mousemove", drag);
    doc.addEventListener("mouseup", cleanup);
    return {
        dispose: cleanup,
    };
};
//# sourceMappingURL=dom-drag.js.map