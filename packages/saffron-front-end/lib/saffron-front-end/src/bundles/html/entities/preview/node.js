"use strict";
const utils_1 = require('./utils');
const index_1 = require('saffron-common/src/object/index');
class NodePreview extends index_1.default {
    constructor(entity) {
        super({});
        this.entity = entity;
    }
    getBoundingRect(zoomProperties) {
        return utils_1.calculateBoundingRect(this.entity, this.entity.section.targetNode, zoomProperties);
    }
    setPositionFromAbsolutePoint(point) {
        utils_1.setPositionFromAbsolutePoint(point, this.entity, this.entity.section.targetNode);
    }
    setBoundingRect(rect) {
        utils_1.setBoundingRect(rect, this.entity, this.entity.section.targetNode);
    }
    getCapabilities() {
        return utils_1.getCapabilities(this.entity.section.targetNode);
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = NodePreview;
//# sourceMappingURL=node.js.map