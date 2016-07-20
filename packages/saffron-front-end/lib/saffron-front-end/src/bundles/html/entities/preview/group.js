"use strict";
const index_1 = require('saffron-common/src/utils/geom/index');
const utils_1 = require('./utils');
const index_2 = require('saffron-common/src/object/index');
class GroupPreview extends index_2.default {
    constructor(entity) {
        super({});
        this.entity = entity;
    }
    getBoundingRect(zoomProperties) {
        var rect = index_1.mergeBoundingRects(this.entity.section.childNodes.map((node) => {
            // need to account for DOM elements that are not visible, but can still be calculated for bounding rect.
            // This includes things like style, link, and others.
            // https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetParent
            return node.nodeType === 1 && node.offsetParent !== null ? utils_1.calculateBoundingRect(this.entity, node, zoomProperties) : void 0;
        }));
        return rect;
    }
    getCapabilities() {
        return {
            movable: false,
            resizable: false
        };
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = GroupPreview;
//# sourceMappingURL=group.js.map