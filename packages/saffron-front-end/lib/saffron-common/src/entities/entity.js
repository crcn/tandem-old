"use strict";
const element_1 = require('../nodes/element');
const property_exists_1 = require('../utils/assert/property-exists');
class Entity extends element_1.default {
    constructor(properties) {
        super(properties);
        property_exists_1.default(this, 'expression');
    }
    update(options) {
    }
    load(options) {
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Entity;
//# sourceMappingURL=entity.js.map