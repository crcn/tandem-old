"use strict";
const property_exists_1 = require('../utils/assert/property-exists');
const mesh_1 = require('mesh');
class TypeBus {
    constructor(type, bus) {
        this.type = type;
        this.bus = bus;
        property_exists_1.default(this, 'type');
        property_exists_1.default(this, 'bus');
    }
    execute(event) {
        if (event.type === this.type) {
            return this.bus.execute(event);
        }
        return mesh_1.EmptyResponse.create();
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TypeBus;
//# sourceMappingURL=type.js.map