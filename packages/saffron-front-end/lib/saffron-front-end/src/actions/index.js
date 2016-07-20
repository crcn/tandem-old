"use strict";
const index_1 = require('saffron-common/src/actions/index');
const toarray = require('toarray');
exports.STAGE_CANVAS_MOUSE_DOWN = 'stageCanvasMouseDown';
class MouseEvent extends index_1.Action {
    constructor(type, originalEvent) {
        super(type);
        Object.assign(this, {
            clientX: originalEvent.clientX,
            clientY: originalEvent.clientY,
            metaKey: originalEvent.metaKey
        });
    }
}
exports.MouseEvent = MouseEvent;
exports.SELECT = 'select';
class SelectAction extends index_1.Action {
    constructor(items = undefined, keepPreviousSelection = false, toggle = false) {
        super(exports.SELECT);
        this.items = toarray(items);
        this.keepPreviousSelection = !!keepPreviousSelection;
        this.toggle = toggle;
    }
}
exports.SelectAction = SelectAction;
class ToggleSelectAction extends SelectAction {
    constructor(items = undefined, keepPreviousSelection = false) {
        super(items, keepPreviousSelection, true);
    }
}
exports.ToggleSelectAction = ToggleSelectAction;
//# sourceMappingURL=index.js.map