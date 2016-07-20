"use strict";
var _id = 1;
class CoreObject {
    constructor(properties) {
        this.id = _id++;
        if (properties != void 0) {
            Object.assign(this, properties);
        }
    }
    setProperties(properties) {
        Object.assign(this, properties);
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CoreObject;
//# sourceMappingURL=index.js.map