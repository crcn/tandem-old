"use strict";
class Attributes {
    constructor(properties) {
        Object.assign(this, properties);
    }
    static create(properties) {
        return new Attributes(properties);
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Attributes;
//# sourceMappingURL=attributes.js.map