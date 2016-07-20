"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (value) => {
    const match = value.match(/([-\d\.]+)(\D+)?/);
    return [Number(match[1]), match[2] || 'px'];
};
//# sourceMappingURL=parse-units.js.map