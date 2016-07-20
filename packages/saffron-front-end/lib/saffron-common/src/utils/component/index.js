"use strict";
var start_drag_1 = require('./start-drag');
exports.startDrag = start_drag_1.default;
function getStyle(props, styleName, defaults) {
    if (!props.styles || !props.styles[styleName])
        return defaults;
    return props.styles[styleName];
}
exports.getStyle = getStyle;
// react logs an error without this
function shutUpChange() {
}
exports.shutUpChange = shutUpChange;
//# sourceMappingURL=index.js.map