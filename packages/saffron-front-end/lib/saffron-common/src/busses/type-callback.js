"use strict";
const property_exists_1 = require('../utils/assert/property-exists');
const mesh_1 = require('mesh');
class TypeCallbackBus {
    constructor(type, callback) {
        this.type = type;
        this.bus = mesh_1.WrapBus.create(callback);
        property_exists_1.default(this, 'type');
    }
    execute(action) {
        if (action.type === this.type) {
            return this.bus.execute(event);
        }
        return mesh_1.EmptyResponse.create();
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TypeCallbackBus;
//# sourceMappingURL=type-callback.js.map