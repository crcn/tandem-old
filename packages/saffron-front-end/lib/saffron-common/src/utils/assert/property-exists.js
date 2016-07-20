"use strict";
const assert = require('assert');
function default_1(context, property, typeClass = undefined) {
    var value = context[property];
    assert(value, `Property "${property}" must exist on class "${context.constructor.name}".`);
    if (typeClass != void 0 && !(value instanceof typeClass)) {
        throw new Error(`Property "${property}" of "${context.constructor.name}" must be a ${typeClass.name}.`);
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
//# sourceMappingURL=property-exists.js.map